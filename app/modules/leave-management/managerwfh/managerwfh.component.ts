import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { LeaveManagement } from '../leave-management.component';
import { ActionButtonsComponent } from './../action-buttons/action-buttons.component';
import { LoaderService } from './../../../shared/services/loader.service';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-managerwfh',
    templateUrl: './managerwfh.component.html'
})
export class ManagerwfhComponent implements OnInit {
    public columnDefs: any[];
    public columnDefsRm: any[];
    public context;
    constructor(
        private appService: LeaveManagementService,
        public loaderService: LoaderService,
        private leaveManagement: LeaveManagement,
        private errorHandleService: ErrorHandleService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = "Work From Home Requests";
        this.columnDefs = [
            { headerName: "Employee Name", field: "empName", minWidth: 150, tooltipField: "empName" },
            { headerName: "Date", field: "date", minWidth: 120 },
            { headerName: "Applied On", field: "requestedDate", minWidth: 120 },
            { headerName: "Status", field: "status", minWidth: 110 },
            { headerName: "Total Hours", field: "timeSheetData", minWidth: 120 },
            { headerName: "Action", field: "status", minWidth: 110, cellRendererFramework: ActionButtonsComponent },
            { headerName: "ModelType", field: "WR", minWidth: 120, hide: true }
        ],
            this.columnDefsRm = [
                { headerName: "Employee Name", field: "empName", minWidth: 180, tooltipField: "empName" },
                { headerName: "Date", field: "date", minWidth: 138 },
                { headerName: "Applied On", field: "requestedDate", minWidth: 130 },
                { headerName: "Status", field: "status", minWidth: 190 }
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
    public gridData;
    public leaveDetails;
    public teamwfh: any;
    public getRowHeight;
    public gridApi;
    public gridParamsPm;
    public gridParamsRm;
    pageNum: number = 0;
    pageSize: number = 10;
    totalPages: number;
    totalPagesRm: number
    currentUrl;
    public gridColumnApi;
    public paginationPageSize: any;
    isWFH: any;

    
    shortDateToEpoch(shortDate) {
        if (shortDate) {
            var datArr = shortDate.split('/');
            //  '"'  -->>  to add double quotes arround dynamic value
            let longDate = new Date('"' + datArr[1] + '/' + datArr[0] + '/' + datArr[2] + '"')
            return longDate.getTime();
        }
    }
    getRequests(status) {
        this.pageNum = 0;
        this.statusRquest = status;
        if (status === 'ALL') {
            this.currentUrl = 'api/me/lms/workfromhome/ALL';
        } else if (status === 'PENDING') {
            this.currentUrl = 'api/me/lms/workfromhome/PENDING';
        } else {
            this.currentUrl = 'api/me/lms/workfromhome/CANCEL';
        }
        this.apiData().then(resolve => {
            this.dataRm();
            this.dataPm();
        });
    }

    resizeColumns(params) {
        var gridApi: any = params.api
        gridApi && gridApi.sizeColumnsToFit();
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
                    }
                );
        })
    }
    onGridReady(params) {
        this.gridParamsPm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    onGridReadyRm(params) {
        this.gridParamsRm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    methodFromParent(data) {
        if (this.statusRquest === 'ALL') {
            this.currentUrl = 'api/me/lms/workfromhome/ALL';
        } else if (this.statusRquest === 'CANCEL') {
            this.currentUrl = 'api/me/lms/workfromhome/CANCEL';
        } else {
            this.currentUrl = 'api/me/lms/workfromhome/PENDING';
        }
        this.apiData().then(resolve => {
            this.dataPm();
        });
    }
    ngOnInit() {
        this.modalData = {};
        this.gridData = { "content": [] }
        this.user = { 'role': '' }
        this.statusRquest = "PENDING"
        this.leaveDetails = [
            { "leaveType": null, "detailedDescription": '' },
            { "leaveType": null, "detailedDescription": '' }
        ];
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
        this.currentUrl = 'api/me/lms/workfromhome/PENDING';
        this.getavaliableLeaves();
        this.apiData().then(resolve => {
            this.dataRm();
            this.dataPm();
        })
    }
    dataRm() {
        if (this.gridData && this.gridData.rmWorkFromHomeSummary) {
            this.totalPagesRm = this.gridData.rmWorkFromHomeSummary.totalPages * 10;
            if (this.gridData.rmWorkFromHomeSummary.content) {
                this.gridData.rmWorkFromHomeSummary.content.forEach(element => {
                    element.ModelType = "WR";
                    element.date = this.utilService.epochToDate(element.date);
                    element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                });
                this.gridParamsRm.api.setRowData(this.gridData.rmWorkFromHomeSummary.content);
            }
        }
    }
    dataPm() {
        if (this.gridData && this.gridData.pmWorkFromHomeSummary) {
            this.totalPages = this.gridData.pmWorkFromHomeSummary.totalPages * 10;
            if (this.gridData.pmWorkFromHomeSummary.content) {
                this.gridData.pmWorkFromHomeSummary.content.forEach(element => {
                    element.ModelType = "WR";
                    element.date = this.utilService.epochToDate(element.date);
                    element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                });
                this.gridParamsPm.api.setRowData(this.gridData.pmWorkFromHomeSummary.content);
            }
        }
    }
    paginate(e) {
        this.pageNum = e.page;
        this.apiData().then(resolve => { this.dataPm() })
    }
    paginateRm(e) {
        this.pageNum = e.page;
        this.apiData().then(resolve => { this.dataRm() })
    }
    getavaliableLeaves() {
        this.appService.getService('api/me/lms/dashboard/availableLeaves').subscribe(res => {
            for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;
            this.leaveDetails = res.leaveTypeDescription;
        }, error => {
            this.errorHandleService.handleErrors(error);
        }
        )

    }
}
