import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { LeaveManagement } from '../leave-management.component';
import { ActionButtonsComponent } from './../action-buttons/action-buttons.component';
import { LoaderService } from '../../../shared/services/loader.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-compoffmanager',
    templateUrl: './compoffmanager.component.html'
})
export class CompoffmanagerComponent implements OnInit {
    public columnDefs: any[];
    public columnDefsRm: any[];
    constructor(
        private appService: LeaveManagementService,
        public commonService: CommonService,
        public loaderService: LoaderService,
        private leaveManagement: LeaveManagement,
        private errorHandleService: ErrorHandleService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = "Compensatory Off Requests";
        this.columnDefs = [
            { headerName: "Employee Name", field: "empName", minWidth: 160, headerTooltip: "Employee Name", tooltipField: "empName" },
            { headerName: "Date", field: "compOffDate", minWidth: 95, headerTooltip: "Date" },
            { headerName: "Applied On", field: "requestedDate", minWidth: 115, headerTooltip: "Applied On" },
            { headerName: "Expiry Date", field: "expiryDate", minWidth: 115, headerTooltip: "Expiry Date" },
            { headerName: "Status", field: "status", minWidth: 90, headerTooltip: "Status", tooltipField: "status" },
            { headerName: "Login", field: "checkIn", minWidth: 115, headerTooltip: "Login" },
            { headerName: "Logout", field: "checkOut", minWidth: 115, headerTooltip: "Logout" },
            { headerName: "Total Hours", field: "hours", minWidth: 90, headerTooltip: "Total Hours", tooltipField: "Total Hours" },
            { headerName: "Action", field: "status", cellRendererFramework: ActionButtonsComponent, minWidth: 90, headerTooltip: "Action" },
            { headerName: "ModelType", field: "CR", minWidth: 120, hide: true }
        ],
            this.columnDefsRm = [
                { headerName: "Employee Name", field: "empName", minWidth: 180, headerTooltip: "Employee Name", tooltipField: "empName" },
                { headerName: "Date", field: "compOffDate", minWidth: 138, headerTooltip: "Date" },
                { headerName: "Applied On", field: "requestedDate", minWidth: 130, headerTooltip: "Applied On" },
                { headerName: "Expiry Date", field: "expiryDate", minWidth: 130, headerTooltip: "Expiry Date" },
                { headerName: "Status", field: "status", minWidth: 120, headerTooltip: "Status", tooltipField: "status" }
            ],
            this.context = { componentParent: this };
        this.paginationPageSize = 10;
        this.getRowHeight = function (params) {
            return 33;
        };
    }
    public statusRquest;
    public modalData: any;
    public leaveBalanceSummaryData = {};
    public leavesSummary: any;
    public leavesSummaryManager: any;
    public user;
    public cmpoffrequests: any;
    public gridData;
    public getRowHeight;
    public gridApi;
    public leaveDetails;
    public compOffData;
    public gridColumnApi;
    public paginationPageSize: any;
    pageSize: number = 10;
    totalPages: number;
    totalPagesRm: number;
    private gridParamsPm;
    private gridParamsRm;
    public context;
    currentUrl;
    pageNum: number = 0;

    display: boolean = false;

    showDialog() {
        this.display = true;
    }

    ngOnInit() {
        this.modalData = {};
        this.leaveDetails = [
            { "leaveType": null, "detailedDescription": '' },
            { "leaveType": null, "detailedDescription": '' },
            { "leaveType": null, "detailedDescription": '' },
            { "leaveType": null, "detailedDescription": '' }
        ];
        this.compOffData = {
            "leaveBalanceSummaryDto": [
                { "description": null, "leaveTypeCode": null, "balance": null, "detailedDescription": "" },
                { "description": null, "leaveTypeCode": null, "balance": null, "detailedDescription": "" },
                { "description": null, "leaveTypeCode": null, "balance": null, "detailedDescription": "" },
                { "description": null, "leaveTypeCode": null, "balance": null, "detailedDescription": "" }

            ]
        };
        this.getUser()
        this.statusRquest = "PENDING"
        this.leavesSummary = {
            "leaveBalanceSummary":
                [
                    { "description": null, "leaveTypeCode": null, "balance": null },
                    { "description": null, "leaveTypeCode": null, "balance": null },
                    { "description": null, "leaveTypeCode": null, "balance": null },
                    { "description": null, "leaveTypeCode": null, "balance": null }
                ],
            "leaveRequestSummaryDto": { "employeeLeaveRequestSummary": { "content": [] } }, "pendingLeaves": { "content": [] }, "leaveRequestStatusSummary": { "content": [] }
        };
        this.leavesSummaryManager = {
            "leaveBalanceSummary":
                [{ "description": null, "leaveTypeCode": null, "balance": null },
                { "description": null, "leaveTypeCode": null, "balance": null },
                { "description": null, "leaveTypeCode": null, "balance": null },
                { "description": null, "leaveTypeCode": null, "balance": null }],
            "leaveRequestSummary": { "content": [] }, "pendingLeaves": { "content": [] }, "leaveRequestStatusSummary": { "content": [] }
        };

        this.leaveBalanceSummaryData = { "CO": {}, "CL": {}, "EL": {}, "OL": {} };

        this.cmpoffrequests = { "pmCompOffLeaveRequestSummary": { "content": [] } };
        this.currentUrl = 'api/me/lms/compOff/PENDING';
        this.getavaliableLeaves();
        this.apiData().then(res => {
            this.dataPm();
            this.dataRm();
        });
    }

    getRequests(status) {
        this.pageNum = 0;
        this.statusRquest = status;
        this.currentUrl = status === 'ALL' ? 'api/me/lms/compOff/ALL' : 'api/me/lms/compOff/PENDING';
        this.apiData().then(res => {
            this.dataPm();
            this.dataRm();
        });
    }
    resizeColumns(params) {
        var gridApi = params.api;
        gridApi && gridApi.sizeColumnsToFit();
    }
    apiData() {
        return new Promise(resolve => {
            this.loaderService.showLoading();
            this.appService.paginationRequest(this.pageNum, this.pageSize, this.currentUrl)
            .subscribe(res => {
                this.loaderService.hideLoading();
                this.gridData = res;
                resolve(this.gridData);
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        })
    }
    dataPm() {
        if (this.gridData && this.gridData.pmCompOffLeaveRequestSummary) {
            this.totalPages = this.gridData && (this.gridData.pmCompOffLeaveRequestSummary.totalPages) * 10;
            if (this.gridData.pmCompOffLeaveRequestSummary.content) {
                this.gridData.pmCompOffLeaveRequestSummary.content.forEach(element => {
                    element.ModelType = "CR";
                    element.compOffDate = this.utilService.epochToDate(element.compOffDate);
                    element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                    element.expiryDate = this.utilService.epochToDate(element.expiryDate);
                });
                this.gridParamsPm.api.setRowData(this.gridData.pmCompOffLeaveRequestSummary.content);
            }
        }
    }
    onGridReady(params) {
        this.gridParamsPm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    dataRm() {
        if (this.user && this.user.role == 'manager') {
            if (this.gridData && this.gridData.rmCompOffLeaveRequestSummary) {
                this.totalPagesRm = (this.gridData.rmCompOffLeaveRequestSummary.totalPages) * 10;
                if (this.gridData.rmCompOffLeaveRequestSummary.content) {
                    this.gridData.rmCompOffLeaveRequestSummary.content.forEach(element => {
                        element.ModelType = "CR";
                        element.compOffDate = this.utilService.epochToDate(element.compOffDate);
                        element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                        element.expiryDate = this.utilService.epochToDate(element.expiryDate);
                    });
                    this.gridParamsRm.api.setRowData(this.gridData.rmCompOffLeaveRequestSummary.content);
                }
            }
        }
    }
    onGridReadyRm(params) {
        this.gridParamsRm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    getUser() {
        this.user = { "role": '', "userId": '', "roleFlag": false };
        var userInfo: any = this.commonService.getItem('currentUserInfo');
        let roles = userInfo && userInfo.roles;
        let checkingArrayOrNot = true
        if (roles && roles == null)
            checkingArrayOrNot = false
        if (checkingArrayOrNot && roles.indexOf('HR Manager') >= 0) {
            this.user.role = "hr";
            this.user.roleFlag = true;
        } else if (checkingArrayOrNot && roles.indexOf('Manager') >= 0) {
            this.user.role = "manager";
            this.user.roleFlag = true;
        } else {
            this.user.role = 'employee';
        }
        this.user.userId = userInfo && userInfo.userName;
    }
    methodFromParent(data) {
        this.currentUrl = this.statusRquest === 'ALL' ? 'api/me/lms/compOff/ALL' : 'api/me/lms/compOff/PENDING';
        this.apiData().then(res => {
            this.dataPm();
        });
    }
    getavaliableLeaves() {
        this.appService.getService('api/me/lms/dashboard/availableLeaves').subscribe(res => {
            for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;
            this.compOffData = res;
            this.leaveDetails = res.leaveTypeDescription;
        });
    }

    

    shortDateToEpoch(shortDate) {
        if (shortDate) {
            var datArr = shortDate.split('/');
            //  '"'  -->>  to add double quotes arround dynamic value
            let longDate = new Date('"' + datArr[1] + '/' + datArr[0] + '/' + datArr[2] + '"')
            return longDate.getTime();
        }
    }
    paginate(e) {
        this.pageNum = e.page;
        this.apiData().then(res => {
            this.dataPm();
        })
    }
    paginateRm(e) {
        this.pageNum = e.page;
        this.apiData().then(res => {
            this.dataRm();
        })
    }

}
