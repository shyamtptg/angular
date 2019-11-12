import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { Component, OnInit } from '@angular/core';
import { LeaveManagement } from '../leave-management.component';
import { LeaveManagementService } from '../leave-management.service';
import * as moment from 'moment';
import { LoaderService } from '../../../shared/services/loader.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-myleavecredits',
    templateUrl: './myleavecredits.component.html',
    styleUrls: ['./myleavecredits.component.scss']
})
export class MyleavecreditsComponent implements OnInit {

    constructor(
        private leaveManagement: LeaveManagement,
        public commonService: CommonService,
        public loaderService: LoaderService,
        private errorHandleService: ErrorHandleService,
        private appService: LeaveManagementService
    ) {
        leaveManagement.URLtitle = 'My Leave Credits History';
    }
    public modalData: any;
    public leaveBalanceSummaryData = {};
    public leavesSummary: any;
    public leavesSummaryManager: any;
    public user;
    public credits: any[];
    public creditedMonth;
    public dateOfJoining;
    public currentYear;
    public endYear;
    public years: number[] = [];
    public yy: number;
    public selectedYear;
    public isData: Boolean = true;
    public serverDate;
    ngOnInit() {
        this.appService.getServerDate().subscribe(data => {
            this.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
            this.currentYear = new Date(this.serverDate).getFullYear();
            this.selectedYear = this.currentYear;
            this.getYear();
            this.CreditHistory();
        }, error => {
            this.serverDate = new Date();
            this.errorHandleService.handleErrors(error);
        });
        this.modalData = {};

        this.leavesSummary = {
            'leaveBalanceSummary': [
                { 'description': null, 'leaveTypeCode': null, 'balance': null },
                { 'description': null, 'leaveTypeCode': null, 'balance': null },
                { 'description': null, 'leaveTypeCode': null, 'balance': null },
                { 'description': null, 'leaveTypeCode': null, 'balance': null }
            ],
            'leaveRequestSummaryDto': { 'employeeLeaveRequestSummary': { 'content': [] } },
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
            'leaveRequestSummary': { 'content': [] },
            'pendingLeaves': { 'content': [] },
            'leaveRequestStatusSummary': { 'content': [] }
        };

        this.leaveBalanceSummaryData = { 'CO': {}, 'CL': {}, 'EL': {}, 'OL': {} };
        this.user = { 'role': null, 'name': null };
        this.getavaliableLeaves();
        this.getUser();
    }
    getUser() {
        const userInfo: any = this.commonService.getItem('currentUserInfo');
        this.dateOfJoining = userInfo && userInfo.dateOfJoining;
    }
    // To get the credited history it will be called when the page has been loaded
    CreditHistory() {
        this.loaderService.showLoading();
        this.appService.getService('api/me/lms/employee/leaveCreditedHistory/' + this.selectedYear).subscribe(res => {
            this.loaderService.hideLoading();
            this.credits = res;
            if (this.credits.length !== 0) {
                this.isData = true;
                for (let i = 0; i < res.length; i++) {
                    res[i].creditedMonth = this.epochToMonth(res[i].creditedMonth);
                }
            } else if (this.credits.length === 0) {
                this.isData = false;
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    // To get the year in the drop down
    getYear() {
        const yearOfJoining = new Date(this.dateOfJoining).getFullYear();
        const today = (yearOfJoining > 2012) ? yearOfJoining : 2014;
        this.endYear = new Date(this.serverDate);
        this.yy = this.endYear.getFullYear();
        for (let i = today; i <= this.yy; i++) {
            this.years.push(i);
        }
    }
    epochToMonth(date) {
        return moment(date).format('MMMM');
    }
    yearChange(e) {
        this.selectedYear = e;
        this.CreditHistory();
    }
    getavaliableLeaves() {
        this.appService.getService('api/me/lms/dashboard/availableLeaves').subscribe(res => {
            for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;

        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
}
