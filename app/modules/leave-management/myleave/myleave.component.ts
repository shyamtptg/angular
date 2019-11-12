import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { LeaveManagement } from '../leave-management.component';
import { LeaveManagementService } from '../leave-management.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-myleave',
    templateUrl: './myleave.component.html',
    styleUrls: ['./myleave.component.scss']
})
export class MyleaveComponent implements OnInit {
    public columnDefs: any[];
    constructor(
        private appService: LeaveManagementService,
        public loaderService: LoaderService,
        private errorHandleService: ErrorHandleService,
        private leaveManagement: LeaveManagement,
        private dialogService: DialogService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = 'My Leave Encashment';
        this.columnDefs = [
            { headerName: 'Applied On', field: 'requestedDate', minWidth: 180 },
            { headerName: 'No Of Days', field: 'days', minWidth: 160 },
            { headerName: 'Status', field: 'status', minWidth: 188 },
        ],
            this.paginationPageSize = 10;
    }
    public modalData: any;
    public disableApply: boolean;
    public leaveBalanceSummaryData = {};
    public leavesSummary: any;
    public leavesSummaryManager: any;
    public encashmentHistory;
    public encash: any;
    public encashedData: any;
    public detailsDescription;
    public paginationPageSize: any;
    public gridData: any;
    public days: any;
    public leaveDetails;
    public availableLeaves: any[];
    public encashData: any;
    public encashmentDays: any[];
    public encashmentDay: any[];
    public gridApi;
    public gridColumnApi;
    public user;
    pageSize: number = 10;
    totalPages: number;
    currentUrl;
    pageNum: number = 0;
    ngOnInit() {
        this.user = { 'role': '' };
        this.modalData = {};
        this.disableApply = true;
        this.leaveDetails = [
            { 'leaveType': null, 'detailedDescription': '' },
            { 'leaveType': null, 'detailedDescription': '' }
        ];
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
            'leaveRequestSummary': { 'employeeLeaveRequestSummary': { 'content': [] } },
            'pendingLeaves': { 'content': [] },
            'leaveRequestStatusSummary': { 'content': [] }
        };

        this.encashmentHistory = { 'content': [] };
        this.encashmentDays = [];
        this.encashData = { 'balance': null, 'detailedDescription': null };
        this.getavaliableLeaves();
        this.leaveBalanceSummaryData = { 'CO': {}, 'CL': {}, 'EL': {}, 'OL': {} };
        this.days = [1, 2, 3, 4, 5];
        this.encash = { encashmentEls: '' };
        this.encash.encashmentEls = 0;
    }

    loadGrid() {
        this.loaderService.showLoading();
        this.currentUrl = 'api/me/lms/requests/encashhistory';
        this.appService.paginationRequest(this.pageNum, this.pageSize, this.currentUrl).subscribe(res => {
            this.loaderService.hideLoading();
            this.gridData = res;
            this.totalPages = (res.totalPages) * 10;
            this.gridData.content.forEach(element => {
                element.date = this.utilService.epochToDate(element.date);
                element.requestedDate = this.utilService.epochToDate(element.requestedDate);
            });
            this.gridApi.setRowData(this.gridData.content);
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
        this.encash.encashmentEls = 0;
    }
    getavaliableLeaves() {
        this.loaderService.showLoading();
        this.encashmentDay = [];
        this.appService.getService('api/me/lms/dashboard/availableLeaves').subscribe(res => {
            this.loaderService.hideLoading();
            for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;
            this.leaveDetails = res.leaveTypeDescription;
            this.availableLeaves = res.leaveBalanceSummaryDto;
            this.availableLeaves.forEach(element => {
                if (element.leaveTypeCode === 'EL' && element.balance > 10) {
                    element.availableEl = Math.floor(element.balance - 10);
                    this.encashData = element;
                    for (let i = 1; i < element.availableEl + 1; i++) {
                        this.encashmentDays.push(i);
                    }
                    this.encashmentDay = this.encashmentDays;
                    this.encashmentDays = [];
                } else if (element.leaveTypeCode === 'EL') {
                    this.encashData.availableEl = 0;
                }
            });
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    resizeColumns() {
        if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
        }
    }
    onGridReady(params) {
        this.currentUrl = 'api/me/lms/requests/encashhistory';
        this.loadGrid();
        this.gridApi = params.api;
        this.resizeColumns();
        this.gridColumnApi = params.columnApi;

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
    selectLeave(value: string) {
        this.disableApply = (value === '0') ? true : false;
    }
    applyEncash(encashData) {
        this.loaderService.showLoading();
        this.appService.postService('api/c/me/lms/requests/encash', encashData).subscribe(res => {
            this.loaderService.hideLoading();
            this.encashmentHistory = res;
            this.getavaliableLeaves();
            this.loadGrid();
            this.dialogService.render(
                [{
                    title: 'Success',
                    message: 'Leave Encashment request has been created.',
                    yesLabel: 'OK'
                }],
                '350px'
            );
            this.disableApply = true;
        }, error => {
            this.errorHandleService.handleErrors(error);
            this.encash.encashmentEls = 0;
        });
        this.getavaliableLeaves();
    }
    paginate(e) {
        this.pageNum = e.page;
        this.loadGrid();
    }
}
