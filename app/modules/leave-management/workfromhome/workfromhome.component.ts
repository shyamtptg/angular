import { CancelrequestComponent } from './../cancelrequest/cancelrequest.component';
import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { LeaveManagement } from '../leave-management.component';
import * as moment from 'moment';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-workfromhome',
    templateUrl: './workfromhome.component.html',
    styleUrls: ['./workfromhome.component.scss']
})
export class WorkfromhomeComponent implements OnInit {
    public columnDefs;
    public paginationPageSize;
    public getRowHeight;
    constructor(
        private appService: LeaveManagementService,
        public loaderService: LoaderService,
        private errorHandleService: ErrorHandleService,
        private leaveManagement: LeaveManagement,
        private dialogService: DialogService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = 'Apply for Work From Home';
        this.columnDefs = [
            { headerName: 'Date', field: 'date', minWidth: 130 },
            { headerName: 'Applied On', field: 'requestedDate', minWidth: 130 },
            { headerName: 'Status', field: 'status', minWidth: 170 },
            { headerName: 'Action', field: 'status', minWidth: 90, cellRendererFramework: CancelrequestComponent },
            { headerName: 'serverDate', field: 'serverdate', minWidth: 120, hide: true },
        ];
        this.paginationPageSize = 10;
    }
    public workfromrequest: any;
    public availableLeaves: any[];
    public workFromHomeData: any;
    public wfhData: any;
    public managerInfo: any;
    public minDate: Date;
    public maxDate: Date;
    public serverDate;
    public holidays: any;
    public holidaysList: any[];
    public holidayDates: any = [];
    public holidaysByMonth: any;
    public gridData;
    public gridColumnApi;
    public gridApi;
    filteredCountriesMultiple: any[];
    public modalData: any;
    public leaveBalanceSummaryData = {};
    public leavesSummaryManager: any;
    public leavesSummary: any;
    public user: any;
    day: any;
    pageNum: number = 0;
    pageSize: number = 10;
    totalPages: number;
    currentUrl;
    ngOnInit() {
        this.user = { 'role': '' };
        this.modalData = {};
        this.leavesSummary = {
            'leaveBalanceSummary': [
                { 'description': null, 'leaveTypeCode': null, 'balance': null },
                { 'description': null, 'leaveTypeCode': null, 'balance': null },
                { 'description': null, 'leaveTypeCode': null, 'balance': null },
                { 'description': null, 'leaveTypeCode': null, 'balance': null }
            ],
            'leaveRequestSummaryDto': {
                'employeeLeaveRequestSummary': { 'content': [] }
            },
            'pendingLeaves': { 'content': [] },
            'leaveRequestStatusSummary': { 'content': [] }
        };

        this.leavesSummaryManager = {
            'leaveBalanceSummary': [
                { 'description': null, 'leaveTypeCode': null, 'balance': null },
                { 'description': null, 'leaveTypeCode': null, 'balance': null },
                { 'description': null, 'leaveTypeCode': null, 'balance': null },
                { 'description': null, 'leaveTypeCode': null, 'balance': null }
            ],
            'leaveRequestSummary': {
                'content': []
            },
            'pendingLeaves': { 'content': [] },
            'leaveRequestStatusSummary': { 'content': []}
        };
        this.getavaliableLeaves();
        this.holidaysList = [];
        this.holidaysByMonth = {
            '01': [], '02': [], '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': []
        };
        this.getmanagerDetails();
        this.wfhData = { 'date': '', 'tasksPlanned': '', 'comments': '' };
        this.managerInfo = { 'deliveryManagerDto': [], 'reportingManagerDto': {} };
        this.workfromrequest = { 'content': [] };
        this.leaveBalanceSummaryData = { 'CO': {}, 'CL': {}, 'EL': {}, 'OL': {} };
        this.appService.getServerDate().subscribe(data => {
          this.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
          this.loadDetails();
        }, error => {
            this.serverDate = new Date();
            this.loadDetails();
            this.errorHandleService.handleErrors(error);
        });
    }
    loadDetails() {
      this.minDate = new Date(this.serverDate);
      this.maxDate = new Date(this.serverDate);
      this.day = new Date(this.minDate);
      if (this.day.getDay() === 5) {
        this.maxDate.setDate(this.maxDate.getDate() + 3);
      } else {
        this.maxDate.setDate(this.maxDate.getDate() + 1);
      }
      this.getHolidays();
      this.wfhData = { 'date': new Date(this.minDate), 'tasksPlanned': '', 'comments': '' };
    }
    validateCurrentDay() {
        if (this.serverDate && this.holidayDates) {
            const day: any = moment(this.serverDate).day(),
            serverDate: any = this.utilService.epochToDate(this.serverDate);
            if ((serverDate && this.holidayDates.indexOf(serverDate) > -1) || (day === 0 || day === 6)) {
                this.wfhData.date = '';
            }
        }
    }
    onGridReady(params) {
        this.loaderService.showLoading();
        this.currentUrl = 'api/me/lms/requests/workfromhomehistory';
        this.appService.paginationRequest(this.pageNum, this.pageSize, this.currentUrl).subscribe(res => {
            this.loaderService.hideLoading();
            this.gridData = res;
            this.totalPages = (res.totalPages) * 10;
            this.gridData.content.forEach(element => {
                element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                element.date = this.utilService.epochToDate(element.date);
                element.serverdate = this.serverDate;
            });
            params.api.setRowData(this.gridData.content);
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    getHolidays() {
        this.appService.getService('api/core/holidays').subscribe(res => {
            this.holidays = res;
            this.holidays.forEach(holiday => {
                this.holidaysList.push(new Date(holiday.holidayDate));
                const holidayDate = this.utilService.epochToDate(holiday.holidayDate);
                if (holidayDate) {
                    this.holidayDates.push(holidayDate);
                }
                const month = (holidayDate.substring(3, 5));
                const date = holidayDate.substring(0, 2);
                this.holidaysByMonth[month].push(date);
            });
            this.validateCurrentDay();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    updategrid() {
        this.loaderService.showLoading();
        this.currentUrl = 'api/me/lms/requests/workfromhomehistory';
        this.appService.paginationRequest(this.pageNum, this.pageSize, this.currentUrl).subscribe(res => {
            this.loaderService.hideLoading();
            this.gridData = res;
            this.totalPages = (res.totalPages) * 10;
            this.gridData.content.forEach(element => {
                element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                element.date = this.utilService.epochToDate(element.date);
                element.serverdate = this.serverDate;
            });
            this.gridApi.setRowData(this.gridData.content);
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    setcolor(e) {
        switch (e) {
            case 'Pending':
                return 'Pending';
            case 'Approved':
                return 'Approved';
            case 'Cancelled':
                return 'Cancelled';
            case 'Rejected':
                return 'Rejected';
            default: return '';
        }
    }
    getmanagerDetails() {
        this.appService.getService('api/core/employee/reportingProjectManager').subscribe(res => {
            this.managerInfo = res;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });

    }
    // To create or to aply work from home this method is used
    createWorkFromHome(data) {
        this.loaderService.showLoading();
        const sendData = Object.assign({}, data);
        sendData.copyTo = [];
        sendData.applyTo = [];
        sendData.date = this.dateToEpoch(sendData.date);
        if (this.managerInfo.reportingManagerDto != null) {
            sendData.copyTo.push(this.managerInfo.reportingManagerDto.managerId);
        }

        for (let i = 0; i < this.managerInfo.projectManagerDto.length; i++) {
            sendData.applyTo.push(this.managerInfo.projectManagerDto[i].managerId);
        }
        sendData.notifyTo = [];
        if (sendData.hasOwnProperty('addPeople')) {
            for (let i = 0; i < sendData.addPeople.length; i++) {
                sendData.notifyTo.push(sendData.addPeople[i].id);
            }
        }

        if (sendData.hasOwnProperty('babyBornDate')) {
            sendData.babyBornDate = new Date(sendData.babyBornDate.toDateString()).getTime();
        }
        delete sendData['addPeople'];
        this.appService.postService('api/c/me/lms/requests/workFromHome', sendData).subscribe(res => {
            this.loaderService.hideLoading();
            this.dialogService.render(
                [{
                    title: 'Success',
                    message: 'WFH has been applied successfully.',
                    yesLabel: 'OK'
                }],
                '300px'
            );

            this.updategrid();
            this.resetWfh();
        },
            error => {
                this.errorHandleService.handleErrors(error);
            }

        );
    }
    // to reset the whole WFH application accept the date
    resetWfh() {
        this.wfhData = {
            'date': new Date(this.minDate),
            'tasksPlanned': '',
            'comments': ''
        };
    }

    resizeColumns(params) {
        const gridApi: any = params.api;
        if (gridApi) {
            gridApi.sizeColumnsToFit();
        }
    }

    dateToEpoch(date) {
        const y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();
        const dateStr = [y, (m > 9 ? '' : '0') + m, (d > 9 ? '' : '0') + d].join('-');
        const epochDate = new Date(dateStr).getTime();
        return epochDate;
    }

    filterCountryMultiple(event) {
        this.appService.filterCountryMultiple(event.query).subscribe(
            res => {
                this.filteredCountriesMultiple = res.json();
            },
            error => {
                this.dialogService.render(
                    [{
                        title: 'Error!',
                        message: JSON.stringify(error.json().error),
                        yesLabel: 'OK'
                    }],
                    '400px'
                );
            }
        );
    }
    getavaliableLeaves() {
        this.appService.getService('api/me/lms/dashboard/availableLeaves').subscribe(res => {
            for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;
            this.workFromHomeData = res.leaveTypeDescription[0].detailedDescription.split('*');
        }, error => {
            this.errorHandleService.handleErrors(error);
        }
        );
    }

    loadGrid() {
        this.appService.paginationRequest(this.pageNum, this.pageSize, this.currentUrl).subscribe(res => {
            this.gridData = res;
            this.totalPages = (res.totalPages) * 10;
            this.gridData.content.forEach(element => {
                element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                element.date = this.utilService.epochToDate(element.date);
            });
            this.gridApi.setRowData(this.gridData.content);

        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    paginate(e) {
        this.pageNum = e.page;
        this.loadGrid();
    }

}
