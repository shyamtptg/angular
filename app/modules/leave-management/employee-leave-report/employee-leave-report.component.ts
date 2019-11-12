import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { CommonService } from '../../../shared/services/common.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LeaveManagementService } from '../leave-management.service';
import { LeaveManagement } from '../leave-management.component';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { UtilService } from '../../../util.service';
const FileSaver = require('filesaver.js-npm');

@Component({
    selector: 'app-employee-leave-report',
    templateUrl: './employee-leave-report.component.html',
    styleUrls: ['./employee-leave-report.component.scss']
})
export class EmployeeLeaveReportComponent implements OnInit {
    public requestedData;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private appService: LeaveManagementService,
        public leaveManagement: LeaveManagement,
        public commonService: CommonService,
        private errorHandleService: ErrorHandleService,
        private dialogService: DialogService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = 'Team Report / Employee Leave Report';
    }
    public overAllEmployee: any;
    id: number;
    public serverDate;
    public role;
    public employeeLeave;
    public errorMessage;
    public filterByType;
    public data: any[];
    public leaveTypes: any = [];
    public type: any;
    public leaveTypeID = 0;
    public reportData: any;
    public export: Boolean;
    public getFrom;
    public getTo;
    public default;
    public leave;
    public yearRange;
    public defaultRange;
    public gender;
    public isData = true;
    ngOnInit() {
        this.leaveTypeID = 0;
        this.export = true;
        this.data = [{
            'leaveBalanceSummary':
                [{ 'description': null, 'leaveTypeCode': null, 'balance': null }]
        }];
        this.defaultRange = 2000 + ':' + (new Date().getFullYear());
        this.appService.getServerDate().subscribe(data => {
            this.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
            this.yearRange = 2000 + ':' + (new Date(this.serverDate).getFullYear());
            this.defaultRange = '';
        }, error => {
            this.serverDate = new Date();
            this.errorHandleService.handleErrors(error);
        });
        this.employeeLeave = { 'content': [] };
        this.reportData = { 'gender': '' };
        this.reportData = this.commonService.getItem('tmRptData');
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url !== '/leave-management/employee-leave-report') {
                    localStorage.removeItem('tmRptData');
                }
            }
        });
        if (this.reportData) {
            this.id = this.reportData.employeeId;
            this.leave = this.reportData.yearFrom;
            this.default = this.reportData.yearTo;
            this.getFrom = this.leave;
            this.gender = this.reportData.gender;
            this.getTo = this.default;
            this.role = this.reportData.gridType;
            this.type = this.reportData.leaveTypeId;
            this.requestedData = this.id;
            this.getSelectedDateFrom(new Date(this.leave));
            this.getSelectedDateTO(new Date(this.default));
        }
        this.filter();
    }
    dateToEpoch(date) {
        const y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();
        const dateStr = [y, (m > 9 ? '' : '0') + m, (d > 9 ? '' : '0') + d].join('-');
        const epochDate = new Date(dateStr).getTime();
        return epochDate;
    }
    exportData() {
        const url = 'api/me/lms/lmsReport/employeeLeavesInfoCsv/all?fromDate=' + this.getFrom +
            '&toDate=' + this.getTo + '&employeeId=' + this.id + '&leaveTypeId=' + this.leaveTypeID +
            '&role=' + this.role;
        this.appService.exportService(url).subscribe(res => {
            this.reportData = res['_body'];
            const blob = new Blob([this.reportData], { type: 'application/octet-stream' });
            FileSaver.saveAs(blob, 'Reports.csv');
            this.export = true;
        });
        this.export = false;
    }
    // Based on the leaveType selected the data has been binded to the table
    filterAll(event) {
        this.leaveTypeID = event;
        this.appService.getService('api/me/lms/leaves/leavesSummary?fromDate=' +
            this.getFrom + '&toDate=' + this.getTo + '&employeeId=' + this.id +
            '&leaveTypeId=' + event).subscribe(res => {
                for (let i = 0; i < res.content.length; i++) {
                    res.content[i].fromDate = this.utilService.epochToDate(res.content[i].fromDate);
                    res.content[i].toDate = this.utilService.epochToDate(res.content[i].toDate);
                }
                this.employeeLeave = res;
                this.isData = (this.employeeLeave.content.length === 0) ? false : true;
            }, error => {
                if (error['_body'] !== undefined) {
                    this.errorHandleService.handleErrors(error);
                }
            });
    }
    // To get the data(leave types) in the dropdown field
    filter() {
        this.appService.getService('api/me/lms/all/leaveTypes').subscribe(res => {
            if (this.gender === 'M') {
                const datas: any = res;
                this.data = [];
                res.forEach(element => {
                    if (element.leaveTypeCode.indexOf('ML') === -1) {
                        this.data.push(element);
                    }
                });
            } else if (this.gender === 'F') {
                var datas = res;
                this.data = [];
                res.forEach(element => {
                    if (element.leaveTypeCode.indexOf('PL') === -1) {
                        this.data.push(element);
                    }
                });
            }
        }, error => {
            if (error['_body'] !== undefined) {
                this.errorHandleService.handleErrors(error);
            }
        });
    }
    getEmployeeInfo() {
        this.overAllEmployee = { 'totalLeaves': null, 'usedLleaves': null, 'availableLeaves': null };
        this.appService.getService('api/me/lms/leaves/leavesInfo?fromDate=' +
            this.getFrom + '&toDate=' + this.getTo + '&employeeId=' + this.id).subscribe(res => {
                this.overAllEmployee = res;
            },
                error => {
                    if (error['_body'] !== undefined) {
                        this.errorHandleService.handleErrors(error);
                    }
                });
        this.appService.getService('api/me/lms/leaves/leavesSummary?fromDate=' +
            this.getFrom + '&toDate=' + this.getTo + '&employeeId=' + this.id +
            '&leaveTypeId=' + this.leaveTypeID).subscribe(res => {
                for (let i = 0; i < res.content.length; i++) {
                    res.content[i].fromDate = this.utilService.epochToDate(res.content[i].fromDate);
                    res.content[i].toDate = this.utilService.epochToDate(res.content[i].toDate);
                }
                this.employeeLeave = res;
            },
                error => {
                    if (error['_body'] !== undefined) {
                        this.errorHandleService.handleErrors(error);
                    }
                });
    }
    getSelectedDateFrom(e) {
        this.leave = new Date(this.dateToEpoch(e));
        this.getFrom = this.dateToEpoch(e);
        this.filterDateCompare();
    }
    getSelectedDateTO(e) {
        this.default = new Date(this.dateToEpoch(e));
        this.getTo = this.dateToEpoch(e);
        this.filterDateCompare();
    }
    filterDateCompare() {
        if (this.getTo >= this.getFrom) {
            this.getEmployeeInfo();
        } else {
            this.dialogService.render(
                [{
                    title: 'Warning',
                    message: 'To date must be greater than From date',
                    yesLabel: 'OK'
                }],
                '400px'
            ).subscribe(result => {
                if (result) {
                    this.leave = new Date(this.serverDate);
                    this.leave.setMonth(this.leave.getMonth() - 1);
                    this.default = new Date(this.serverDate);
                }
            });
        }
    }
}
