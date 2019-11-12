import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { LeaveManagement } from '../leave-management.component';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid/main';
import { ActionButtonsComponent } from './../action-buttons/action-buttons.component';
import { LoaderService } from '../../../shared/services/loader.service';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-encashment-request',
    templateUrl: './encashment-request.component.html'
})
export class EncashmentRequestComponent implements OnInit {
    public columnDefs: any[];
    public context;
    constructor(
        private appService: LeaveManagementService,
        public loaderService: LoaderService,
        private leaveManagement: LeaveManagement,
        private errorHandleService: ErrorHandleService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = "Team Encashment Requests";
        this.columnDefs = [
            { headerName: "Name", field: "empName", minWidth: 180 },
            { headerName: "Applied On", field: "requestedDate", minWidth: 160 },
            { headerName: "Days", field: "days", minWidth: 140 },
            { headerName: "Status", field: "status", minWidth: 150, cellRendererFramework: ActionButtonsComponent },
            { headerName: "ModelType", field: "ER", minWidth: 120, hide: true },
        ],
            this.context = { componentParent: this };
        this.paginationPageSize = 10;
        this.getRowHeight = function (params) {
            return 33;
        };
    }
    statusRequest: any;
    public getRowHeight;
    public gridApi;
    public gridColumnApi;
    public encashmentHistory: any;
    public user: any;
    public gridData: any;
    public id: any;
    public paginationPageSize: any;
    public modalData: any;
    public leaveBalanceSummaryData = {};
    public leavesSummary: any;
    public leavesSummaryManager: any;
    pageNum: number = 0;
    pageSize: number = 10;
    totalPages: number;
    currentUrl;

    // The grid will be loaded when there is any change required or has been occered
    loadGrid() {
        this.loaderService.showLoading();
        this.appService.paginationRequest(this.pageNum, this.pageSize, this.currentUrl)
        .subscribe(res => {
            this.loaderService.hideLoading();
            this.gridData = res;
            this.totalPages = (res.totalPages) * 10;

            this.gridData.content.forEach(element => {
                element.ModelType = "ER"
                element.requestedDate = this.utilService.epochToDate(element.requestedDate);
            });
            this.gridApi.setRowData(this.gridData.content);
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    // To stay manage the url that need to be maintained when the status of the data has been changed like rejection it will splice after that need to show the same data(in pending/cancel)
    methodFromParent(data) {
        this.currentUrl = this.statusRequest === 'ALL' ? 'api/me/lms/employees/encash/ALL' : 'api/me/lms/employees/encash/PENDING';
        this.loadGrid();
    }

    getRequests(status) {
        this.pageNum = 0;
        this.statusRequest = status;
        this.currentUrl = this.statusRequest === 'ALL' ? 'api/me/lms/employees/encash/ALL' : 'api/me/lms/employees/encash/PENDING';
        this.loadGrid();

    }
    ngOnInit() {

        this.modalData = {};
        this.statusRequest = "PENDING"
        this.leavesSummary = {
            "leaveBalanceSummary":
                [
                    { "description": null, "leaveTypeCode": null, "balance": null },
                    { "description": null, "leaveTypeCode": null, "balance": null },
                    { "description": null, "leaveTypeCode": null, "balance": null },
                    { "description": null, "leaveTypeCode": null, "balance": null }
                ],
            "leaveRequestSummaryDto": { "employeeLeaveRequestSummary": { "content": [] } }, "pendingLeaves": { "content": [] }, "leaveRequestStatusSummary": { "content": [] }
        }; this.leavesSummaryManager = {
            "leaveBalanceSummary":
                [{ "description": null, "leaveTypeCode": null, "balance": null },
                { "description": null, "leaveTypeCode": null, "balance": null },
                { "description": null, "leaveTypeCode": null, "balance": null },
                { "description": null, "leaveTypeCode": null, "balance": null }],
            "leaveRequestSummary": { "content": [] }, "pendingLeaves": { "content": [] }, "leaveRequestStatusSummary": { "content": [] }
        };

        this.leaveBalanceSummaryData = { "CO": {}, "CL": {}, "EL": {}, "OL": {} };


        this.id = {}
        this.user = { 'username': '', 'role': '' };
        this.user = this.appService.getUser();
        this.encashmentHistory = { "content": [] };
        this.appService.getService('api/me/lms/employees/encash/PENDING').subscribe(res => {
            this.encashmentHistory = res;
        });
        this.appService.getService('api/me/lms/requests/PENDING/calendar/1513036800000').subscribe(res => {


            for (let i = 0; i < res.leaveBalanceSummary.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummary[i].leaveTypeCode] = res.leaveBalanceSummary[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;
            this.modalData.leaveBalance = this.leaveBalanceSummaryData;
            if (this.user.role == "employee") {
                this.leavesSummary = res;
            } else {
                this.leavesSummaryManager = res;
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    resizeColumns() {
        this.gridApi && this.gridApi.sizeColumnsToFit();
    }
    onGridReady(params) {
        this.loaderService.showLoading();
        this.currentUrl = 'api/me/lms/employees/encash/PENDING';
        this.appService
            .paginationRequest(this.pageNum, this.pageSize, this.currentUrl)
            .subscribe(
                res => {
                    this.loaderService.hideLoading();
                    this.gridData = res;
                    this.totalPages = res.totalPages * 10;
                    this.gridData.content.forEach(element => {
                        element.ModelType = "ER";
                        element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                    });
                    params.api.setRowData(this.gridData.content);
                }, error => {
                    this.errorHandleService.handleErrors(error);
                });
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    //To display the data based on the page number seleced
    paginate(e) {
        this.pageNum = e.page;
        this.loadGrid();
    }
}
