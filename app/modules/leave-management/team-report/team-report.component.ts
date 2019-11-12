import { Params, Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LeaveManagement } from '../leave-management.component';
import { LeaveManagementService } from '../leave-management.service';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid/main';
import { LoaderService } from './../../../shared/services/loader.service';
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { CommonService } from './../../../shared/services/common.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
const FileSaver = require('filesaver.js-npm');

@Component({
    selector: 'app-team-report',
    templateUrl: './team-report.component.html',
    styleUrls: ['./team-report.component.scss']
})
export class TeamReportComponent implements OnInit {
    public gridData;
    public exportDropdown = 0;
    public gridOptions: GridOptions;
    public getRowHeight;
    public paginationPageSize: any;
    public rowData: any[];
    public leaveTypeId = 0;
    public columnDefs: any[];
    public columnDefsWfh: any[];
    public columnDefsCompOff: any[];
    public gridApi;
    public gridColumnApi;
    public gridParamsPm;
    public gridParamsRm;
    public gridParamsWfhPm;
    public gridParamsWfhRm;
    public gridParamsCompOffPm;
    public gridParamsCompOffRm;
    public modalData: any;
    public leaveBalanceSummaryData = {};
    public leavesSummary: any;
    public leavesSummaryManager: any;
    public managerDetails: any;
    public user;
    public requestDetails;
    public departmentDetails: any[];
    public isDepartment: Boolean = true;
    public isPractice: Boolean = true;
    public isManager: Boolean = true;
    public isProjects: Boolean = true;
    public practiceDetails: any[];
    public departments = 0;
    public projectDetails: any[];
    public managers = 0;
    public practices = 0;
    public project = 0;
    public getFrom = 0;
    public getTo = 0;
    public default;
    public leave;
    public export;
    public yearRange;
    public data: any[];
    public defaultRange;
    public reportData: any;
    public pageNum: number = 0;
    public pageSize: number = 10;
    public totalPages: number;
    public totalPagesWfhrm: number;
    public totalPages1: number;
    public totalPagesWfhpm: number;
    public totalPagesCompOffrm: number;
    public totalPagesCompOffpm: number;
    public currentUrl;
    public serverDate;
    public dataLoad: Boolean = false;
    isDisable: any;
    rowSelection: any;
    headerHeight: any;
    activeTab: Number = 0;
    constructor(
        public appService: LeaveManagementService,
        public commonService: CommonService,
        public loaderService: LoaderService,
        public errorHandleService: ErrorHandleService,
        public leaveManagement: LeaveManagement,
        public router: Router,
        private dialogService: DialogService
    ) {
        leaveManagement.URLtitle = 'Team Report';
        this.gridOptions = <GridOptions>{};
        this.leave = new Date();
        this.leave.setMonth(this.leave.getMonth() - 1);
        this.columnDefs = [
            { headerName: 'Name', field: 'fullName', minWidth: 180, cellStyle: { cursor: 'pointer', color: '#337ab7' }, tooltipField: 'fullName' },
            { headerName: 'Manager', field: 'manager', minWidth: 160, tooltipField: 'manager' },
            { headerName: 'Practice', field: 'practice', minWidth: 160, tooltipField: 'practice' },
            { headerName: 'Employee Code', field: 'employeeCode', minWidth: 135 },
            { headerName: 'Casual Used ', field: 'appliedCasualLeaves', minWidth: 120 },
            { headerName: 'Casual Available', field: 'availedCasualLeaves', minWidth: 130, headerTooltip: 'Casual Available' },
            { headerName: 'Optional Used', field: 'appliedOptionalLeaves', minWidth: 130 },
            { headerName: 'Optional Available', field: 'availedOptionalLeaves', minWidth: 130, headerTooltip: 'Optional Available' },
            { headerName: 'Comp Off Used', field: 'appliedCompOffs', minWidth: 130, headerTooltip: 'Comp Off Used' },
            { headerName: 'Comp Off Available', field: 'availedCompoffs', minWidth: 130, headerTooltip: 'Comp Off Available' },
            { headerName: 'Earned Used', field: 'appliedEarnedLeaves', minWidth: 130 },
            { headerName: 'Earned Available', field: 'availedEarnedLeaves', minWidth: 130, headerTooltip: 'Earned Available' },
            { headerName: 'Encashed Used', field: 'appliedEncashedLeaves', minWidth: 130 },
            { headerName: 'Encashed Available', field: 'availedEncashedLeaves', minWidth: 130, headerTooltip: 'Encashed Available' },
            { headerName: 'Total', field: 'availableLeaves', minWidth: 100 },
            { headerName: 'M/P', field: 'm/p', cellRenderer: this.leaveCount, minWidth: 80 },
            { headerName: 'GridType', field: 'gridType', minWidth: 80, hide: true },
        ];
        this.paginationPageSize = 10;

        this.columnDefsWfh = [
            { headerName: 'Name', field: 'fullName', minWidth: 180 },
            { headerName: 'Manager', field: 'manager', minWidth: 170 },
            { headerName: 'Practice', field: 'practice', minWidth: 160 },
            { headerName: 'Employee Code', field: 'employeeCode', minWidth: 160 },
            { headerName: 'Applied Work From Home', field: 'appliedWorkFromHomeCount', minWidth: 200 },
        ];
        this.columnDefsCompOff = [
            { headerName: 'Name', field: 'fullName', minWidth: 180 },
            { headerName: 'Manager', field: 'manager', minWidth: 170 },
            { headerName: 'Practice', field: 'practice', minWidth: 160 },
            { headerName: 'Employee Code', field: 'employeeCode', minWidth: 160 },
            { headerName: 'Applied Compensatory Off', field: 'appliedCompOffs', minWidth: 200 },
        ];
    }
    // In grid to get the maternity peternity applied or not
    leaveCount(Params) {
        if (Params.data.metarnityLeave === '-' && Params.data.petarnityLeave === '-') {
            return '-';
        } else if (Params.data.metarnityLeave === 'M') {
            return 'M';
        } else {
            return 'P';
        }

    }
    resizeColumns(params) {
        const gridApis: any = params.api;
        if (gridApis) {
            gridApis.sizeColumnsToFit();
        }
    }
    ngOnInit() {
        this.defaultRange = 2000 + ':' + (new Date().getFullYear());
        this.appService.getServerDate().subscribe(data => {
            this.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
            this.yearRange = 2000 + ':' + (new Date(this.serverDate).getFullYear());
            this.defaultRange = '';
            this.default = new Date(this.serverDate);
            this.getTo = this.dateToEpoch(this.default);
            this.currentUrl = 'api/me/lms/leaves/teamReports?fromDate=' + this.getFrom + '&toDate=' + this.getTo + '&department=' + this.departments + '&practice=' + this.practices + '&managerId=' + this.managers + '&project=' + this.project;
            this.loadGrid();
        }, error => {
            this.serverDate = new Date();
            this.errorHandleService.handleErrors(error);
        });
        this.pageNum = 0;
        this.filter();
        this.export = true;
        this.getFrom = this.dateToEpoch(this.leave);
        this.modalData = {};
        this.getUser();
        this.gridData = {
            'pmTeamReportSummary': {
                'content': [],
                'totalPages': null
            }, 'rmTeamReportSummary': {
                'content': [],
                'totalPages': 0
            }, 'pmWFHReportSummary': {
                'content': [],
                'totalPages': 0
            }, 'rmWFHReportSummary': {
                'content': [],
                'totalPages': 0
            }, 'rmCompOffReportSummary': {
                'content': [],
                'totalPages': 0
            }, 'pmCompOffReportSummary': {
                'content': [],
                'totalPages': 0
            },
        };

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

        this.data = [{
            'leaveBalanceSummary':
                [{ 'description': null, 'leaveTypeCode': null, 'balance': null }]
        }];
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
        this.appService.getService('api/me/lms/requests/PENDING/calendar/1513036800000').subscribe(res => {

            for (let i = 0; i < res.leaveBalanceSummary.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummary[i].leaveTypeCode] = res.leaveBalanceSummary[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;
            this.modalData.leaveBalance = this.leaveBalanceSummaryData;
            if (this.user.role === 'employee') {
                this.leavesSummary = res;
            } else {
                this.leavesSummaryManager = res;
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });

        this.leaveBalanceSummaryData = { 'CO': {}, 'CL': {}, 'EL': {}, 'OL': {} };
        this.Departments();
    }
    loadGrid() {
        return new Promise(resolve => {
            this.appService.paginationRequestforTeamReport(this.pageNum, this.pageSize, this.currentUrl).subscribe(res => {
                this.loaderService.hideLoading();
                this.gridData = res;
                resolve(this.gridData);
                this.dataLoad = true;
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        });
    }
    // To get the departments dropdown initially
    Departments() {
        this.appService.getService('api/core/departments/all').subscribe(res => {
            this.departmentDetails = res;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });

    }

    // this to get practice drop down based on department selected
    Department(department) {
        this.loaderService.showLoading();
        this.departments = department;
        this.practices = 0;
        this.managers = 0;
        this.project = 0;
        if (this.departments === 0) {
            this.isPractice = true;
            this.isManager = true;
            this.isDepartment = true;
        } else {
            this.isPractice = true;
            this.isManager = true;
            this.isDepartment = false;
            this.appService.getService('api/core/departments/' + department + '/practices').subscribe(res => {
                this.loaderService.hideLoading();
                this.practiceDetails = res;
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
        this.allSearch();
    }

    // this is to get the managers list based on the practice selected
    Practices(practice) {
        this.practices = practice;
        this.managers = 0;
        this.project = 0;
        this.pageNum = 0;
        if (this.practices === 0) {
            this.isPractice = true;
            this.isManager = true;
        } else {
            this.isPractice = false;
            this.isManager = true;
        }
        this.allSearch();
        this.appService.getService('api/core/practice/managers?practiceId=' + practice).subscribe(res => {
            this.managerDetails = res;

        }, error => {
            this.errorHandleService.handleErrors(error);
        });

    }
    dateToEpoch(date) {
        const y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();
        const dateStr = [y, (m > 9 ? '' : '0') + m, (d > 9 ? '' : '0') + d].join('-');
        const epochDate = new Date(dateStr).getTime();
        return epochDate;
    }

    // this is for the project drop down based on practice selected
    Manager(manager) {
        this.managers = manager;
        this.project = 0;
        this.pageNum = 0;
        this.isManager = manager === 0;
        this.loaderService.showLoading();
        this.appService.getService('api/core/projects/manager/projects?managerId=' + manager).subscribe(res => {
            this.loaderService.hideLoading();
            this.projectDetails = res;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
        this.allSearch();
    }
    filter() {
        this.appService.getService('api/me/lms/all/leaveTypes').subscribe(res => {
            const datas = res;
            this.data = [];
            datas.forEach(element => {
                if (element.leaveTypeCode !== 'CO') {
                    this.data.push(element);
                }
            });
        }, error => {
            if (error['_body'] !== undefined) {
                this.errorHandleService.handleErrors(error);
            }
        });
    }
    filterAll(leaveType) {
        this.leaveTypeId = leaveType;
        this.pageNum = 0;
        this.allSearch();
    }
    projects(project) {
        this.pageNum = 0;
        this.project = project;
        this.allSearch();
    }
    getDateFrom(e) {
        this.pageNum = 0;
        this.getFrom = this.dateToEpoch(e);
        this.filterDateCompare();
    }
    getDateTO(e) {
        this.pageNum = 0;
        this.getTo = this.dateToEpoch(e);
        this.filterDateCompare();
    }
    filterDateCompare() {
        if (this.getTo >= this.getFrom) {
            this.allSearch();
        } else {
            this.dialogService.render(
                [{
                    title: 'Warning',
                    message: 'To date must be greater than From date. Setting dates to default.',
                    yesLabel: 'OK'
                }],
                '350px'
            ).subscribe(result => {
                if (result) {
                    this.leave = new Date(this.serverDate);
                    this.leave.setMonth(this.leave.getMonth() - 1);
                    this.default = new Date(this.serverDate);
                }
            });
        }
    }
    getUser() {
        this.user = { 'role': '', 'userId': '', 'roleFlag': false };
        const userInfo: any = this.commonService.getItem('currentUserInfo');
        const roles = userInfo && userInfo.roles;
        let checkingArrayOrNot = true;
        if (roles && roles == null) {
            checkingArrayOrNot = false;
        }
        if (checkingArrayOrNot && (roles.indexOf('HR Manager') >= 0 || (roles.indexOf('HR Employee') >= 0))) {
            this.user.role = 'hr';
            this.user.roleFlag = true;
        } else if (checkingArrayOrNot && roles.indexOf('Manager') >= 0) {
            this.user.role = 'manager';
            this.user.roleFlag = true;
        } else {
            this.user.role = 'employee';
        }
        this.user.userId = userInfo && userInfo.userName;
    }
    // When searching this method will be called
    allSearch() {
        this.loaderService.showLoading();
        this.export = true;
        this.currentUrl = 'api/me/lms/leaves/teamReports?fromDate=' + this.getFrom + '&toDate=' + this.getTo + '&department=' + this.departments + '&practice=' + this.practices + '&managerId=' + this.managers + '&project=' + this.project + '&leaveTypeId=' + this.leaveTypeId;
        this.appService.paginationRequestforTeamReport(this.pageNum, this.pageSize, this.currentUrl).subscribe(res => {
            this.loaderService.hideLoading();
            this.gridData = res;
            if (this.user && this.user.role === 'manager') {
                this.onGridReady(this.gridParamsPm);
                this.onGridReadyrmManager(this.gridParamsRm);
                this.onGridWorkFromHomeReady(this.gridParamsWfhPm);
                this.onGridReadyrmManagerWfh(this.gridParamsWfhRm);
                this.onGridCompOffReady(this.gridParamsCompOffPm);
                this.onGridReadyrmManagerCompOff(this.gridParamsCompOffRm);
            } else {
                this.onGridReady(this.gridParamsPm);
                this.onGridWorkFromHomeReady(this.gridParamsWfhPm);
                this.onGridCompOffReady(this.gridParamsCompOffPm);
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    /**
     *Export the leave report or WFH or CompOff using their id or values this method works
     */
    exportData(dropdownselected) {
        this.loaderService.showLoading();
        if (dropdownselected === '1') {
            const url = 'api/me/lms/lmsReport/teamReportCsv/all?fromDate=' + this.getFrom + '&toDate=' + this.getTo + '&department=' + this.departments + '&practice=' + this.practices + '&managerId=' + this.managers + '&project=' + this.project + '&leaveTypeId=' + this.leaveTypeId;
            this.appService.exportService(url).subscribe(res => {
                this.loaderService.hideLoading();
                this.reportData = res['_body'];
                const blob = new Blob([this.reportData], { type: 'application/octet-stream' });
                FileSaver.saveAs(blob, 'LeaveReports.csv');
                this.export = true;
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        } else if (dropdownselected === '2') {
            const url = 'api/me/lms/lmsReport/teamWFHReportCsv/all?fromDate=' + this.getFrom + '&toDate=' + this.getTo + '&department=' + this.departments + '&practice=' + this.practices + '&managerId=' + this.managers + '&project=' + this.project + '&leaveTypeId=' + this.leaveTypeId;
            this.appService.exportService(url).subscribe(res => {
                this.loaderService.hideLoading();
                this.reportData = res['_body'];
                const blob = new Blob([this.reportData], { type: 'application/octet-stream' });
                FileSaver.saveAs(blob, 'WFHReports.csv');
                this.export = true;
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        } else if (dropdownselected === '3') {
            const url = 'api/me/lms/lmsReport/teamCompOffReportCsv/all?fromDate=' + this.getFrom + '&toDate=' + this.getTo + '&department=' + this.departments + '&practice=' + this.practices + '&managerId=' + this.managers + '&project=' + this.project + '&leaveTypeId=' + this.leaveTypeId;
            this.appService.exportService(url).subscribe(res => {
                this.loaderService.hideLoading();
                this.reportData = res['_body'];
                const blob = new Blob([this.reportData], { type: 'application/octet-stream' });
                FileSaver.saveAs(blob, 'CompOffReports.csv');
                this.export = true;
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
        this.export = false;
    }
    // Grid for the leave report as delivery manager ,reporting manager and hr
    onGridReady(params) {
        if (this.user && this.user.role === 'manager') {
            if (this.gridData && this.gridData.pmTeamReportSummary) {
                this.totalPages = (this.gridData.pmTeamReportSummary.totalPages) * 10;
                if (this.gridData.pmTeamReportSummary.content) {
                    this.gridData.pmTeamReportSummary.content.forEach(element => {
                        element.gridType = 'pm';
                    });
                    params.api.setRowData(this.gridData.pmTeamReportSummary.content);
                }
            } else {
                this.totalPages = 0;
                params.api.setRowData([]);
            }
        } else {
            if (this.gridData && this.gridData.hrTeamReportSummary) {
                this.totalPages = (this.gridData.hrTeamReportSummary.totalPages) * 10;
                if (this.gridData.hrTeamReportSummary.content) {
                    this.gridData.hrTeamReportSummary.content.forEach(element => {
                        element.gridType = 'hr';
                    });
                    params.api.setRowData(this.gridData.hrTeamReportSummary.content);
                }
            } else {
                this.totalPages = 0;
                params.api.setRowData([]);
            }
        }
        this.gridParamsPm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    onGridReadyrmManager(params) {
        if (this.gridData && this.gridData.rmTeamReportSummary) {
            this.totalPages1 = (this.gridData.rmTeamReportSummary.totalPages) * 10;
            if (this.gridData.rmTeamReportSummary.content) {
                this.gridData.rmTeamReportSummary.content.forEach(element => {
                    element.gridType = 'rm';
                });
                params.api.setRowData(this.gridData.rmTeamReportSummary.content);
            }
        } else {
            this.totalPages1 = 0;
            params.api.setRowData([]);
        }
        this.gridParamsRm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    onGridReadyrmManagerWfh(params) {
        if (this.gridData && this.gridData.rmWFHReportSummary) {
            this.totalPagesWfhrm = (this.gridData.rmWFHReportSummary.totalPages) * 10;
            if (this.gridData.rmWFHReportSummary.content) {
                params.api.setRowData(this.gridData.rmWFHReportSummary.content);
            }
        } else {
            this.totalPagesWfhrm = 0;
            params.api.setRowData([]);
        }
        this.gridParamsWfhRm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    onGridReadyrmManagerCompOff(params) {
        if (this.gridData && this.gridData.rmCompOffReportSummary) {
            this.totalPagesCompOffrm = (this.gridData.rmCompOffReportSummary.totalPages) * 10;
            if (this.gridData.rmCompOffReportSummary.content) {
                params.api.setRowData(this.gridData.rmCompOffReportSummary.content);
            }
        } else {
            this.totalPagesCompOffrm = 0;
            params.api.setRowData([]);
        }
        this.gridParamsCompOffRm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    onGridWorkFromHomeReady(params) {
        if (this.user && this.user.role === 'manager') {
            if (this.gridData && this.gridData.pmWFHReportSummary) {
                this.totalPagesWfhpm = (this.gridData.pmWFHReportSummary.totalPages) * 10;
                if (this.gridData.pmWFHReportSummary.content) {
                    params.api.setRowData(this.gridData.pmWFHReportSummary.content);
                }
            } else {
                this.totalPagesWfhpm = 0;
                params.api.setRowData([]);
            }
        } else {
            if (this.gridData && this.gridData.hrWFHReportSummary) {
                this.totalPagesWfhpm = (this.gridData.hrWFHReportSummary.totalPages) * 10;
                if (this.gridData.hrWFHReportSummary.content) {
                    params.api.setRowData(this.gridData.hrWFHReportSummary.content);
                }
            } else {
                this.totalPagesWfhpm = 0;
                params.api.setRowData([]);
            }
        }
        this.gridParamsWfhPm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    // Grid for the CompOff report as delivery manager ,reporting manager and hr
    onGridCompOffReady(params) {
        if (this.user && this.user.role === 'hr') {
            if (this.gridData && this.gridData.hrCompOffReportSummary) {
                this.totalPagesCompOffpm = (this.gridData.hrCompOffReportSummary.totalPages) * 10;
                if (this.gridData.hrCompOffReportSummary.content) {
                    params.api.setRowData(this.gridData.hrCompOffReportSummary.content);
                }
            } else {
                this.totalPagesCompOffpm = 0;
                params.api.setRowData([]);
            }
        } else if (this.user && this.user.role === 'manager') {
            if (this.gridData && this.gridData.pmCompOffReportSummary) {
                this.totalPagesCompOffpm = (this.gridData.pmCompOffReportSummary.totalPages) * 10;
                if (this.gridData.pmCompOffReportSummary.content) {
                    params.api.setRowData(this.gridData.pmCompOffReportSummary.content);
                }
            } else {
                this.totalPagesCompOffpm = 0;
                params.api.setRowData([]);
            }
        }
        this.gridParamsCompOffPm = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    onCellClicked(e) {
      if (e.colDef.headerName === 'Name') {
        this.leaveManagement.leave = '';
        e.data.yearFrom = this.getFrom;
        e.data.yearTo = this.getTo;
        e.data.leaveTypeId = this.leaveTypeId;
        this.commonService.setItem('tmRptData', e.data);
        this.router.navigate(['/leave-management/employee-leave-report']);
      }
    }
    /** All these are onpage change methods will be called when the page is changed */
    paginatePm(e) {
        this.pageNum = e.page;
        this.loadGrid().then(value => {
            this.onGridReady(this.gridParamsPm);
        });

    }
    paginateRm(e) {
        this.pageNum = e.page;
        this.loadGrid().then(value => {
            this.onGridReadyrmManager(this.gridParamsRm);
        });
    }
    paginateWfhPm(e) {
        this.pageNum = e.page;
        this.loadGrid().then(value => {
            this.onGridWorkFromHomeReady(this.gridParamsWfhPm);
        });
    }
    paginateWfhRm(e) {
        this.pageNum = e.page;
        this.loadGrid().then(value => {
            this.onGridReadyrmManagerWfh(this.gridParamsWfhRm);
        });
    }
    paginateCompOffPm(e) {
        this.pageNum = e.page;
        this.loadGrid().then(value => {
            this.onGridCompOffReady(this.gridParamsCompOffPm);
        });
    }
    paginateCompOffRm(e) {
        this.pageNum = e.page;
        this.loadGrid().then(value => {
            this.onGridReadyrmManagerCompOff(this.gridParamsCompOffRm);
        });
    }
}
