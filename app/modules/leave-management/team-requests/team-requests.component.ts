import { ActionButtonsComponent } from './../action-buttons/action-buttons.component';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { LeaveManagement } from '../leave-management.component';
import { LeaveManagementService } from '../leave-management.service';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid/main';
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import * as moment from 'moment';
import { LoaderService } from './../../../shared/services/loader.service';
import { CommonService } from './../../../shared/services/common.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-team-requests',
    templateUrl: './team-requests.component.html',
    styleUrls: ['./team-requests.component.scss']
})
export class TeamRequestsComponent implements OnInit {
    public gridOptions: GridOptions;
    public getRowHeight;
    public paginationPageSize: any;
    public rowData: any[];
    public columnDefs: any[];
    public column: any[];
    public columnDefsRm: any[];
    public selectedData: any;
    public selectedArray: any;
    public gridData: any;
    public gridApi;
    public isCheckBoxDisabled: Boolean;
    public rowCount;
    public gridColumnApi;
    public rowSelection;
    public modalData: any;
    public leaveBalanceSummaryData = {};
    public leavesSummary: any;
    public leavesSummaryManager: any;
    public user;
    public statusRquest;
    public gridParamsPm;
    public gridParamsRm;
    public isRowSelectable;
    totalPagesRm;
    public selectBox;
    public context;
    pageNum: number = 0;
    pageSize: number = 10;
    totalPages: number;
    SelectedAction: any = 'Action';
    headerHeight: any;
    currentUrl;
    public selectall: boolean = false;
    public selectDropDown: Boolean = true;
    constructor(
        public appService: LeaveManagementService,
        public commonService: CommonService,
        public loaderService: LoaderService,
        public errorHandleService: ErrorHandleService,
        public leaveManagement: LeaveManagement,
        private dialogService: DialogService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = 'Team Leave Requests';
        this.gridOptions = <GridOptions>{};
        this.getUser();
        this.columnDefs = [
            { headerName: 'Name', field: 'empName', minWidth: 155, width: 155, checkboxSelection: true, tooltipField: 'empName' },
            { headerName: 'AppliedOn', field: 'appliedOn', minWidth: 130, width: 130, },
            { headerName: 'Type', field: 'leaveType', minWidth: 110, width: 110, },
            { headerName: 'Days', field: 'days', minWidth: 110, width: 110, },
            { headerName: 'From', field: 'from', minWidth: 110, width: 110, },
            { headerName: 'To', field: 'to', minWidth: 110, width: 110, },
            { headerName: 'Status', field: 'status', minWidth: 150, width: 150 },
            { headerName: 'Action', field: 'status', minWidth: 140, cellRendererFramework: ActionButtonsComponent },
            { headerName: 'EmpID', field: 'empid', minWidth: 120, hide: true },
            { headerName: 'ModelType', field: 'TR', minWidth: 120, hide: true },
            { headerName: 'AppliedTo', field: 'appliedTo', minWidth: 120, hide: true },
            { headerName: 'belongsTo', field: 'belongsTo', minWidth: 120, hide: true },
            { headerName: 'Description', field: 'description', minWidth: 120, hide: true },
        ];
        this.columnDefsRm = [
            { headerName: 'Name', field: 'empName', minWidth: 110, width: 110, tooltipField: 'empName' },
            { headerName: 'AppliedOn', field: 'appliedOn', minWidth: 100, width: 100 },
            { headerName: 'Type', field: 'leaveType', minWidth: 100, width: 100 },
            { headerName: 'Days', field: 'days', minWidth: 100, width: 100 },
            { headerName: 'From', field: 'from', minWidth: 100, width: 100 },
            { headerName: 'To', field: 'to', minWidth: 100, width: 100 },
            { headerName: 'Status', field: 'status', minWidth: 150, width: 150 }
        ];
        if (this.user && this.user.role.toLowerCase() === 'manager') {
            this.column = this.columnDefsRm;
        }
        if (this.user && (this.user.role === 'hr' || this.user.role.toLowerCase() === 'hremployee')) {
            this.column = this.columnDefs;
        }
        this.context = { componentParent: this };
        this.paginationPageSize = 10;
        this.getRowHeight = function (params) {
            return 33;
        };
        this.rowSelection = 'multiple';
        this.isRowSelectable = function (rowNode) {
            return rowNode.data ? (rowNode.data.status === 'Pending' || rowNode.data.status === 'Cancel Pending') : false;
        };
    }

    public teamLeaveRequests: any;



    shortDateToEpoch(shortDate) {
        if (shortDate) {
            const datArr = moment(shortDate, 'DD MM YYYY');
            return datArr['_d'].getTime();
        }
    }
    // To per form the selected action in select all drop down based on the action type
    accept(SelectedAction) {
        this.apiData().then(resolve => { this.dataRm(); });
        this.selectedData.forEach(element => {
            element.leaveTypeCode = element.leaveType;
            element.from = this.shortDateToEpoch(element.from);
            element.to = this.shortDateToEpoch(element.to);
            element.appliedOn = this.shortDateToEpoch(element.appliedOn);
        });
        const data = this.selectedData;
        this.loaderService.showLoading();
        this.appService.putService('api/c/me/lms/leaves/requests/' + SelectedAction, data).subscribe(res => {
            if (SelectedAction.toUpperCase() === 'APPROVED') {
                this.selectBox = true;
                this.loaderService.hideLoading();
                this.dialogService.render(
                    [{
                        title: 'Approved',
                        message: 'Leave has been approved successfully.',
                        yesLabel: 'OK'
                    }]
                );
                this.selectedData.forEach(element => {
                    element.status = 'Approved';
                    element.from = this.utilService.epochToDate(element.from);
                    element.to = this.utilService.epochToDate(element.to);
                    element.appliedOn = this.utilService.epochToDate(element.appliedOn);
                });
                this.gridApi.setRowData(this.selectedData);
                this.apiData().then(resolve => { this.dataPm(); });
                this.selectall = false;
                this.selectDropDown = true;
            } else {
                this.loaderService.hideLoading();
                this.selectBox = true;
                this.dialogService.render(
                    [{
                        title: 'Rejected',
                        message: 'Leave has been rejected successfully.',
                        yesLabel: 'OK'
                    }]
                );
                this.selectedData.forEach(element => {
                    element.status = 'Rejected';
                    element.from = this.utilService.epochToDate(element.from);
                    element.to = this.utilService.epochToDate(element.to);
                    element.appliedOn = this.utilService.epochToDate(element.appliedOn);
                });
                this.gridApi.setRowData(this.selectedData);
                this.selectall = false;
                this.selectDropDown = true;
                this.apiData().then(resolve => { this.dataPm(); });
            }
        }, error => {
            this.selectBox = true;
            this.errorHandleService.handleErrors(error);
        });
        this.selectBox = false;
    }
    // To select all the data in the grid
    select(e) {
        this.gridApi = this.gridParamsPm.api;
        if (this.selectall) {
            this.gridApi.forEachNode(function (node) {
                if ((node.data.status === 'Pending') || (node.data.status === 'Cancel Pending')) {
                    node.setSelected(true);
                } else {
                    node.setSelected(false);
                }
            });
        } else {
            this.selectedData.length = 0;
            this.gridApi.forEachNode(function (node) {
                node.setSelected(false);
            });
        }
        this.selectedData = [];
    }
    // This one will trigger when a row is selected
    onRowSelected(event) {
        this.rowCount = event.api.getSelectedNodes().length;
        this.selectedData = event.api.getSelectedRows();
        if (this.statusRquest.toUpperCase() === 'ALL') {
            let flag = 0;
            this.selectedData.forEach(element => {
                if ((element.status !== 'Pending') && (element.status !== 'Cancel Pending')) {
                    flag = 1;
                }
            });
            if (flag === 0 && this.selectedData.length > 0) {
                this.selectDropDown = false;
            } else {
                this.selectDropDown = true;
            }
        } else {
            if (this.rowCount >= 1) {
                this.selectDropDown = false;
            } else if (this.rowCount < 1) {
                this.selectDropDown = true;
            }
        }
    }
    // To get the request based on the radio button selected
    getRequests(status) {
        this.statusRquest = status;
        this.selectall = false;
        this.selectDropDown = true;
        this.pageNum = 0;
        if (status.toUpperCase() === 'ALL') {
            this.currentUrl = 'api/me/lms/requests';
        } else if (status.toUpperCase() === 'CANCEL') {
            this.currentUrl = 'api/me/lms/requests/CANCEL';
        } else {
            this.currentUrl = 'api/me/lms/requests/PENDING';
        }
        this.apiData().then(resolve => {
            this.dataPm();
            this.dataRm();
        });
    }
    resizeColumnsParams(params) {
        const gridApi = params.api;
        if (gridApi) {
            gridApi.sizeColumnsToFit();
        }
    }
    apiData() {
        return new Promise(resolve => {
            this.loaderService.showLoading();
            this.appService.paginationRequest(this.pageNum, this.pageSize, this.currentUrl).subscribe(res => {
                this.loaderService.hideLoading();
                this.gridData = res;
                resolve(this.gridData);
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        });
    }
    dataPm() {
        if (this.user && this.user.role !== 'hremployee') {
            if (this.gridData && this.gridData.pmLeaveRequestSummary) {
                if (this.gridData.pmLeaveRequestSummary.content.length === 0) {
                    this.isCheckBoxDisabled = true;
                }
                this.totalPages = (this.gridData.pmLeaveRequestSummary.totalPages) * 10;
                if (this.gridData.pmLeaveRequestSummary.content) {
                    this.gridData.pmLeaveRequestSummary.content.forEach(element => {
                        element.from = this.utilService.epochToDate(element.from);
                        element.to = this.utilService.epochToDate(element.to);
                        element.appliedOn = this.utilService.epochToDate(element.appliedOn);
                        element.ModelType = 'TR';
                    });
                    this.gridParamsPm.api.setRowData(this.gridData.pmLeaveRequestSummary.content);
                }
            }
        }
    }
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridParamsPm = params;
        this.gridColumnApi = params.columnApi;
    }
    dataRm() {
        if (this.user && this.user.role === 'manager') {
            if (this.gridData && this.gridData.rmLeaveRequestSummary) {
                this.totalPagesRm = this.gridData.rmLeaveRequestSummary.totalPages * 10;
                if (this.gridData.rmLeaveRequestSummary.content) {
                    this.gridData.rmLeaveRequestSummary.content.forEach(element => {
                        element.from = this.utilService.epochToDate(element.from);
                        element.to = this.utilService.epochToDate(element.to);
                        element.appliedOn = this.utilService.epochToDate(element.appliedOn);
                        element.ModelType = 'TR';
                    });
                    this.gridParamsRm.api.setRowData(this.gridData.rmLeaveRequestSummary.content);
                }
            }
        }
        if (this.user && (this.user.role === 'hr' || this.user.role === 'hremployee') && this.statusRquest != 'CANCEL') {
            if (this.gridData && this.gridData.hrLeaveRequestSummary) {
                this.totalPagesRm = this.gridData.hrLeaveRequestSummary.totalPages * 10;
                if (this.gridData.hrLeaveRequestSummary.content) {
                    this.gridData.hrLeaveRequestSummary.content.forEach(element => {
                        element.from = this.utilService.epochToDate(element.from);
                        element.to = this.utilService.epochToDate(element.to);
                        element.appliedOn = this.utilService.epochToDate(element.appliedOn);
                        element.ModelType = 'TR';
                    });
                    this.gridParamsRm.api.setRowData(this.gridData.hrLeaveRequestSummary.content);
                    this.column = this.columnDefs;
                }
            }
        }
    }
    onGridReadyRm(params) {
        this.gridParamsRm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    // To set the grid based on which status they are in. The grid will get updated.
    methodFromParent(data) {
        if (this.statusRquest.toUpperCase() === 'PENDING') {
            this.currentUrl = 'api/me/lms/requests/PENDING';
        } else if (this.statusRquest.toUpperCase() === 'CANCEL') {
            this.currentUrl = 'api/me/lms/requests/CANCEL';
        } else {
            this.currentUrl = 'api/me/lms/requests';
        }
        this.apiData().then(resolve => {
            this.dataPm();
            this.dataRm();
        });
    }
    paginate(e) {
        this.selectall = false;
        this.pageNum = e.page;
        this.apiData().then(resolve => { this.dataPm(); });
    }
    paginateRm(e) {
        this.pageNum = e.page;
        this.apiData().then(resolve => { this.dataRm(); });
    }
    getUser() {
        this.user = { 'role': '', 'userId': '', 'roleFlag': false };
        const userInfo: any = this.commonService.getItem('currentUserInfo');
        const roles = userInfo && userInfo.roles;
        if (roles.length !== 0 && roles.indexOf('HR Manager') >= 0) {
            this.user.role = 'hr';
            this.user.roleFlag = true;
        } else if (roles.length !== 0 && roles.indexOf('Manager') >= 0) {
            this.user.role = 'manager';
            this.user.roleFlag = true;
        } else if (roles.length !== 0 && roles.indexOf('HR Employee') >= 0) {
            this.user.role = 'hremployee';
            this.user.roleFlag = true;
        } else {
            this.user.role = 'employee';
        }
    }
    ngOnInit() {
        this.selectBox = true;
        this.selectDropDown = true;
        this.modalData = {};
        this.statusRquest = 'PENDING';
        this.leavesSummary = {
            'leaveBalanceSummary': [
                    { 'description': null, 'leaveTypeCode': null, 'balance': null },
                    { 'description': null, 'leaveTypeCode': null, 'balance': null },
                    { 'description': null, 'leaveTypeCode': null, 'balance': null },
                    { 'description': null, 'leaveTypeCode': null, 'balance': null }
            ],
            'leaveRequestSummaryDto': { 'employeeLeaveRequestSummary': { 'content': [] } },
            'pendingLeaves': { 'content': [] },
            'leaveRequestStatusSummary': {
                'content': [],
                'pendingLeaves': { content: [] },
                'leaveRequestStatusSummary': { content: [] }
            }
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

        this.gridData = { 'content': [] };
        this.selectedData = [];
        this.getavaliableLeaves();
        this.currentUrl = 'api/me/lms/requests/PENDING';
        this.apiData().then(resolve => {
            this.dataPm();
            this.dataRm();
        });
    }
    getavaliableLeaves() {
        this.appService.getService('api/me/lms/dashboard/availableLeaves').subscribe(res => {
            for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;

        }, error => {
            this.errorHandleService.handleErrors(error);
        }
        );
    }
}

