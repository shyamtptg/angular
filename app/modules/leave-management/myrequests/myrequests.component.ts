import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { LeaveManagement } from '../leave-management.component';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid/main';
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { ActionButtonsComponent } from './../action-buttons/action-buttons.component';

import { ModalContentComponent } from '../dashboard/modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs/Subscription';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-myrequests',
    templateUrl: './myrequests.component.html',
    styleUrls: ['./myrequests.component.scss']
})
export class MyrequestsComponent implements OnInit {
    bsModalRef: BsModalRef;
    private subscription: Subscription;
    gridOptions: GridOptions;
    gridMLOptions: GridOptions;
    gridPLOptions: GridOptions;
    constructor(
        private appService: LeaveManagementService,
        public loaderService: LoaderService,
        private errorHandleService: ErrorHandleService,
        private leaveManagement: LeaveManagement,
        private modalService: BsModalService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = 'My Leave Requests';
        this.gridOptions = <GridOptions>{};
        this.gridMLOptions = <GridOptions>{};
        this.gridPLOptions = <GridOptions>{};
        this.columnDefs = [
            { headerName: 'Type', field: 'leaveType', minWidth: 100 },
            { headerName: 'Days', field: 'days', minWidth: 100 },
            { headerName: 'Applied On', field: 'appliedOn', minWidth: 150 },
            { headerName: 'From', field: 'from', minWidth: 140 },
            { headerName: 'To', field: 'to', minWidth: 165 },
            { headerName: 'Status', field: 'status', minWidth: 165 },
            { headerName: 'Action', field: 'status', minWidth: 130, cellRendererFramework: ActionButtonsComponent },
            { headerName: 'ModelType', field: 'MR', minWidth: 120, hide: true },
            { headerName: 'serverDate', field: 'serverDate', minWidth: 120, hide: true }
        ],
            this.columnDefsML = [
                { headerName: 'Type', field: 'leaveType', minWidth: 75, width: 75 },
                { headerName: 'Days', field: 'days', minWidth: 80, width: 80 },
                { headerName: 'Applied On', field: 'appliedOn', minWidth: 150 },
                { headerName: 'ExpectedDate', field: 'mlExpectedDate', minWidth: 130, width: 130 },
                { headerName: 'From', field: 'from', minWidth: 110, width: 110 },
                { headerName: 'To', field: 'to', minWidth: 110, width: 110 },
                { headerName: 'Status', field: 'status', minWidth: 138, width: 138 },
                { headerName: 'Action', field: 'status', minWidth: 95, width: 95, cellRendererFramework: ActionButtonsComponent },
                { headerName: 'ModelType', field: 'MR', minWidth: 120, hide: true },
                { headerName: 'serverDate', field: 'serverDate', minWidth: 120, hide: true }
            ],
            this.columnDefsPL = [
                { headerName: 'Type', field: 'leaveType', minWidth: 75, width: 75 },
                { headerName: 'Days', field: 'days', minWidth: 80, width: 80 },
                { headerName: 'Applied On', field: 'appliedOn', minWidth: 110, width: 110 },
                { headerName: 'BabyBornDate', field: 'babyBornDate', minWidth: 130, width: 130 },
                { headerName: 'BabyGender', field: 'babyGender', minWidth: 120, width: 120 },
                { headerName: 'From', field: 'from', minWidth: 110, width: 110 },
                { headerName: 'To', field: 'to', minWidth: 110, width: 110 },
                { headerName: 'Status', field: 'status', minWidth: 138, width: 138 },
                { headerName: 'Action', field: 'status', minWidth: 95, width: 95, cellRendererFramework: ActionButtonsComponent },
                { headerName: 'ModelType', field: 'MR', minWidth: 120, hide: true },
                { headerName: 'serverDate', field: 'serverDate', minWidth: 120, hide: true }
            ],
            this.context = { componentParent: this };
        this.paginationPageSize = 10;
    }
    public gridDateLeave: any[];
    public gridApi;
    public context;
    public gridparams;
    public isPetarnity: Boolean;
    public isData: Boolean = true;
    public serverDate: Date;
    public gridData;
    public gridparamsLeave;
    public gridColumnApi;
    public columnDefs: any[];
    public columnDefsML: any[];
    public columnDefsPL: any[];
    public myRequests: any;
    public modalData: any;
    public leaveBalanceSummaryData = {};
    public leavesSummary: any;
    public leavesSummaryManager: any;
    public user;
    public statusRquest;
    currentUrl;
    pageNum: number = 0;
    pageSize: number = 10;
    totalPages: number;
    public paginationPageSize;

    // To Get the request which are required when the radio button selected
    getRequests(status) {
        this.statusRquest = status;
        this.pageNum = 0;
        if (this.statusRquest.toUpperCase() === 'ALL') {
            this.currentUrl = 'api/me/lms/myrequests/ALL';
        } else {
            this.currentUrl = 'api/me/lms/myrequests/PENDING';
        }
        this.apiData().then(res => {
            this.dataLeave();
            this.dataPm();
        });
    }
    // To set the colour to the status
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
    resizeColumns(params) {
        const gridApi = params.api;
        if (gridApi) {
            gridApi.sizeColumnsToFit();
        }
    }
    apiData() {
        return new Promise(resolve => {
            this.loaderService.showLoading();
            this.appService
                .paginationRequest(this.pageNum, this.pageSize, this.currentUrl)
                .subscribe(
                    res => {
                        this.loaderService.hideLoading();
                        this.gridData = res;
                        resolve(this.gridData);
                    }, error => {
                        this.errorHandleService.handleErrors(error);
                    });
        });
    }
    dataPm() {
        if (this.gridData) {
            this.totalPages = this.gridData.totalPages * 10;
            this.gridDateLeave = [];
            if (this.gridData.content) {
                this.gridData.content.forEach(element => {
                    if (element.leaveType.indexOf('PL') < 0 && element.leaveType.indexOf('ML') === -1) {
                        element.from = this.utilService.epochToDate(element.from);
                        element.to = this.utilService.epochToDate(element.to);
                        element.appliedOn = this.utilService.epochToDate(element.appliedOn);
                        element.ModelType = 'MR';
                        element.serverDate = this.serverDate;
                        this.gridDateLeave.push(element);
                    } else if (
                            (element.leaveType.indexOf('CL') > -1 ||
                            element.leaveType.indexOf('OL') > -1 ||
                            element.leaveType.indexOf('LOP') > -1 ||
                            element.leaveType.indexOf('EL') > -1)
                        ) {
                        element.from = this.utilService.epochToDate(element.from);
                        element.to = this.utilService.epochToDate(element.to);
                        element.appliedOn = this.utilService.epochToDate(element.appliedOn);
                        element.ModelType = 'MR';
                        element.serverDate = this.serverDate;
                        this.gridDateLeave.push(element);
                    }
                });
            }
            this.gridOptions.api.setRowData(this.gridDateLeave);
        }
    }
    dataLeave() {
        if (this.gridData) {
            this.totalPages = this.gridData.totalPages * 10;
            this.gridDateLeave = [];
            if (this.gridData.content) {
                this.gridData.content.forEach(element => {
                    if (element.leaveType.indexOf('ML') !== -1) {
                        this.isPetarnity = false;
                        element.from = this.utilService.epochToDate(element.from);
                        element.to = this.utilService.epochToDate(element.to);
                        element.appliedOn = this.utilService.epochToDate(element.appliedOn);
                        element.mlExpectedDate = this.utilService.epochToDate(element.mlExpectedDate);
                        element.ModelType = 'MR';
                        element.serverDate = this.serverDate;
                        this.gridDateLeave.push(element);
                    }
                    if (element.leaveType.indexOf('PL') !== -1) {
                        this.isPetarnity = true;
                        element.from = this.utilService.epochToDate(element.from);
                        element.to = this.utilService.epochToDate(element.to);
                        element.appliedOn = this.utilService.epochToDate(element.appliedOn);
                        element.babyBornDate = this.utilService.epochToDate(element.babyBornDate);
                        element.ModelType = 'MR';
                        element.serverDate = this.serverDate;
                        this.gridDateLeave.push(element);
                    }
                });
            }
            if (this.gridDateLeave.length === 0) {
                this.isData = true;
            } else {
                this.isData = false;
            }
            this.gridPLOptions.api.setRowData(this.gridDateLeave);
            this.gridMLOptions.api.setRowData(this.gridDateLeave);
        }
    }
    ngOnInit() {
        this.modalData = {};
        this.statusRquest = 'Pending';
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
        this.appService.getServerDate().subscribe(data => {
            this.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
        }, error => {
            this.serverDate = new Date();
            this.errorHandleService.handleErrors(error);
        });
        this.gridDateLeave = [];
        this.leaveBalanceSummaryData = { 'CO': {}, 'CL': {}, 'EL': {}, 'OL': {} };
        this.getavaliableLeaves();
        this.getLeaveTypes();
        this.currentUrl = 'api/me/lms/myrequests/PENDING';
        this.apiData().then(res => {
            this.dataPm();
            this.dataLeave();
        });
    }
    getLeaveTypes() {
        this.appService.getService('api/me/lms/leaves/types').subscribe(res => {
            this.modalData.leaveTypes = res;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    getavaliableLeaves() {
        this.appService.getService('api/me/lms/dashboard/availableLeaves').subscribe(res => {
            for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;
            this.modalData.leaveBalance = this.leaveBalanceSummaryData;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    // This method to change/to manupulate the date as required formate
    modifyData(res) {
        for (let i = 0; i < res.content.length; i++) {
            res.content[i].appliedOn = this.utilService.epochToDate(res.content[i].appliedOn);
            res.content[i].from = this.utilService.epochToDate(res.content[i].from);
            res.content[i].to = this.utilService.epochToDate(res.content[i].to);
        }
        return res;
    }
    methodFromParent(data) {
        if (this.statusRquest.toUpperCase() === 'ALL') {
            this.currentUrl = 'api/me/lms/myrequests/ALL';
        } else {
            this.currentUrl = 'api/me/lms/myrequests/PENDING';
        }
        this.apiData().then(res => {
            this.dataPm();
            this.dataLeave();
        });
    }

    shortDateToEpoch(shortDate) {
        if (shortDate) {
            const datArr = shortDate.split('/');
            const longDate = new Date('"' + datArr[1] + '/' + datArr[0] + '/' + datArr[2] + '"');
            return longDate.getTime();
        }
    }
    // To get the data in the particular page
    paginate(e) {
        this.pageNum = e.page;
        this.apiData().then(res => {
            this.dataPm();
        });
    }
    applyLeave() {
        const initialState = {
            title: 'Apply Leave',
            message: 'Confirm message',
            data: this.modalData,
            editData: {}
        };
        this.bsModalRef = this.modalService.show(ModalContentComponent, { class: 'leave-modal', initialState });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.subscription = this.bsModalRef.content.notifyObservable$.subscribe((isConfirmed) => {
            if (isConfirmed) {
                this.apiData().then(res => {
                    this.dataLeave();
                    this.dataPm();
                });
                this.getavaliableLeaves();
            }
        });
    }
}
