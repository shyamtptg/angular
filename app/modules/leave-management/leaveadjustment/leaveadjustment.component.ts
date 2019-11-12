import { Component, OnInit } from '@angular/core';
import { LeaveManagement } from '../leave-management.component';
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { LeaveManagementService } from '../leave-management.service';
import { GridOptions } from 'ag-grid/main';
import * as moment from 'moment';
import { CommonService } from './../../../shared/services/common.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { UtilService } from '../../../util.service';
const FileSaver = require('filesaver.js-npm');

@Component({
    selector: 'app-leaveadjustment',
    templateUrl: './leaveadjustment.component.html',
    styleUrls: ['./leaveadjustment.component.scss']
})
export class LeaveadjustmentComponent implements OnInit {
    public columnDefs;
    gridOptions: GridOptions;
    public paginationPageSize;
    public getRowHeight;
    public balance;
    public actionSelect;
    public required: Boolean = true;
    public days: any = [];
    constructor(
        private appService: LeaveManagementService,
        public commonService: CommonService,
        public loaderService: LoaderService,
        private errorHandleService: ErrorHandleService,
        private leaveManagement: LeaveManagement,
        private dialogService: DialogService,
        private utilService: UtilService
    ) {
        this.gridOptions = <GridOptions>{};
        leaveManagement.URLtitle = "Leave Balance Adjustment";
        this.columnDefs = [
            { headerName: "Leave Type", field: "leaveType", minWidth: 120 },
            { headerName: "Adjusted Days", field: "adjustedDays", cellRenderer: this.adjustedDays, minWidth: 125 },
            { headerName: "Comments", field: "comments", minWidth: 170, tooltipField: "comments" },
            { headerName: "Updated Date", field: "updatedDate", minWidth: 130 },
            { headerName: "Updated To", field: "updatedBy", minWidth: 110 },
            { headerName: "Comp Off Date", field: "compOffDate", minWidth: 130 }

        ],
            this.gridOptions = {
                columnDefs: this.columnDefs,
            };
        this.paginationPageSize = 10;
    }
    public gridData;
    fromMinDate: Date;
    maxDate: Date;
    public empData: Boolean = true;
    public employeeCode;
    ifHoliday: any[]
    noHoliday: any[]
    public serverDate;
    public reportData;
    public export: Boolean = true;
    public leavedata;
    public leaveTypes;
    public SelectType: boolean = true;
    public gridColumnApi;
    public gridApi;
    public holidays: any[];
    public holidaysList: any[];
    public holidaysByMonth: any;
    public selectedleavetype;
    public adjustleaveData: any = { compOffDates: [] };
    filteredCountriesMultiple: any[];
    public leaveBalanceSummaryData = {};
    public typeDisable: Boolean;
    public user: any;
    public adjust = { id: '', dateOfJoining: '', employeeCode: '', leaveType: '', action: '', numberofdays: '', comments: '' };
    pageNum: number = 0;
    pageSize: number = 10;
    totalPages: number;
    isSelected: Boolean;
    currentUrl;
    public allHolidaysList: any[]
    ngOnInit() {
        this.user = { 'role': '' };
        this.leaveTypes = [];
        this.typeDisable = true;
        this.isSelected = false;
        this.balance = '';
        this.ifHoliday = [];
        this.selectedleavetype = "";
        this.noHoliday = [];
        this.leaveBalanceSummaryData = { "CO": {}, "CL": {}, "EL": {}, "OL": {} };
        this.getavaliableLeaves();
        this.holidaysList = [];
        this.allHolidaysList = [];
        this.appService.getServerDate().subscribe(data => {
            this.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
            this.getHolidays();
        }, error => {
            this.serverDate = new Date();
            this.errorHandleService.handleErrors(error);
        });

    }
    adjustedDays(adjsutdata) {
        if (adjsutdata.data.action == 'decrease' && adjsutdata.data.adjustedDays > 0) {
            return ('-' + adjsutdata.data.adjustedDays);
        } else {
            return (adjsutdata.data.adjustedDays);
        }
    }
    setcolor(e) {
        switch (e) {
            case "Pending":
                return 'Pending';
            case "Approved":
                return 'Approved';
            case "Cancelled":
                return 'Cancelled';
            case "Rejected":
                return 'Rejected';
            default: return '';
        }
    }

    resizeColumns(params) {
        var gridApi: any = params.api;
        gridApi && gridApi.sizeColumnsToFit();
    }
    
    actionSelected(e) {
        this.actionSelect = e.target.value;
        this.adjust.numberofdays = '';
        this.updateCalenderCount()
    }
    checkLeaveType(e) {
        this.isSelected = true;
        this.selectedleavetype = e.leaveTypeCode;
        if (this.selectedleavetype != "CO")
            this.SelectType = true;
        this.adjust.numberofdays = null;
        this.balance = e.balance;
    }
    dateToEpoch(date) {
        let y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();
        let dateStr = [y, (m > 9 ? '' : '0') + m, (d > 9 ? '' : '0') + d].join('-')
        let epochDate = new Date(dateStr).getTime();
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

    onSelectEmployee(data) {
        this.employeeCode = data.employeeCode;
        this.loadGrid();
        this.empData = false;
        this.leaveTypes = [];
        this.typeDisable = false;
        this.adjust = data;
        this.adjust.leaveType = "";
        this.loaderService.showLoading();
        this.adjust.dateOfJoining = this.utilService.epochToDate(data.dateOfJoining);
        this.appService.getService('api/me/lms/employee/availableLeaves/' + this.adjust.id).subscribe(res => {
            this.loaderService.hideLoading();
            res.leaveBalanceSummaryDto.forEach(element => {
                if (element.balance != "-") {
                    this.leaveTypes.push(element);
                }
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        })
    }

    shortToFullDateConvertor(shortDate) {
        if (shortDate) {
            var datArr = moment(shortDate, 'DD MM YYYY');
            return datArr['_d'];
        }
    }
    adjustleave(data) {
        let doj = this.shortToFullDateConvertor(data.dateOfJoining)
        this.loaderService.showLoading();
        this.adjustleaveData.employeeCode = data.employeeCode;
        this.adjustleaveData.employeeName = data.fullName;
        this.adjustleaveData.employeeId = data.id;
        this.adjustleaveData.dateOfJoining = this.dateToEpoch(doj);
        this.adjustleaveData.leaveType = data.leaveType.leaveTypeCode;
        this.adjustleaveData.action = data.action;
        this.adjustleaveData.noOfDays = data.numberofdays;
        this.adjustleaveData.comments = data.comments;
        this.adjustleaveData.compOffDates = [];
        this.days.forEach(element => {
            if (element.value != '') {
                this.adjustleaveData['compOffDates'].push(this.dateToEpoch(element.value));
            } else {
                this.adjustleaveData.compOffDates = [];
            }
        });
        this.validate();
    }
    validate() {
        if ((this.balance < this.adjustleaveData.noOfDays) && (this.adjustleaveData.action == "decrease")) {
            this.loaderService.hideLoading();
            this.dialogService.render(
                [{
                    title: 'Warning',
                    message: this.adjustleaveData.employeeName + ' does not have sufficient balance for ' + this.adjustleaveData.action + '. Available balance is ' + this.balance + '.',
                    yesLabel: 'OK'
                }],
                '400px'
            ).subscribe(result => {
                if ((this.balance > this.adjustleaveData.noOfDays) && (this.adjustleaveData.action == "decrease")) {
                    this.dataSet();
                }
            });
        } else if (this.selectedleavetype == 'CO' && this.adjustleaveData['compOffDates'].length != +(this.adjust.numberofdays) && this.actionSelect != 'decrease') {
            this.dialogService.render(
                [{
                    title: 'Warning',
                    message: 'Please select Comp Off leave balance adjustment dates.',
                    yesLabel: 'OK'
                }],
                '400px'
            ).subscribe(result => {
                if (this.adjustleaveData['compOffDates'].length == +(this.adjust.numberofdays)) {
                    this.dataSet();
                }
            });
        } else {
            this.dataSet();
        }
    }
    dataSet() {
        this.loaderService.showLoading();
        this.appService.postService('api/c/me/lms/leaves/balance/adjustment', this.adjustleaveData).subscribe(res => {
            this.loaderService.hideLoading();
            this.dialogService.render(
                [{
                    title: 'Success',
                    message: 'Leave balance adjusted successfully!',
                    yesLabel: 'OK'
                }],
                '350px'
            );
            this.reset();
        }, error => {
            this.errorHandleService.handleErrors(error);
        })
    }
    reset() {
        this.required = false;
        this.leavedata = "";
        this.SelectType = true;
        this.typeDisable = true;
        this.isSelected = false;
        this.empData = true;
        this.adjust = {
            'id': null,
            'employeeCode': '',
            'dateOfJoining': '',
            'leaveType': '',
            'action': '',
            'numberofdays': '',
            'comments': '',
        };

        this.adjustleaveData.leaveType = "";
        this.adjustleaveData.compOffDates = [];
    }
    getavaliableLeaves() {
        this.appService.getService('api/me/lms/dashboard/availableLeaves').subscribe(res => {
            for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;
        });
    }
    paginate(e) {
        this.pageNum = e.page;
        this.loadGrid();
    }
    loadGrid() {
        this.loaderService.showLoading();
        this.currentUrl = '/api/me/lms/employees/leaveBalanceAdjustment/' + this.employeeCode;
        this.appService
            .paginationRequest(this.pageNum, this.pageSize, this.currentUrl)
            .subscribe(
                res => {
                    this.loaderService.hideLoading();
                    this.gridData = res;
                    this.totalPages = res.totalPages * 10;
                    this.gridData.content.forEach(element => {
                        element.updatedDate = this.utilService.epochToDate(element.updatedDate);
                        if (element.compOffDate == null || element.compOffDate == 0) {
                            element.compOffDate = '-'
                        } else {
                            element.compOffDate = this.utilService.epochToDate(element.compOffDate);
                        }
                    });
                    this.gridOptions.api.setRowData(this.gridData.content);
                }, error => {
                    this.errorHandleService.handleErrors(error);
                });
    }
    getDateArray(start, end) {
        var arr = [];
        var dt = new Date(start);
        while (dt <= end) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }
    getCompOffDates() {
        var index;
        this.maxDate = new Date(this.serverDate);
        this.fromMinDate = new Date(this.serverDate)
        this.fromMinDate.setMonth(this.maxDate.getMonth() - 3)
        var dateArr = this.getDateArray(this.fromMinDate, this.maxDate);
        dateArr.forEach(element => {
            if (this.allHolidaysList.length != 0) {
                this.allHolidaysList.forEach(elements => {
                    if ((this.dateToEpoch(element) == this.dateToEpoch(elements))) {
                        index = dateArr.indexOf(element)
                        if (index > -1) {
                            dateArr.splice(index, 1);
                            dateArr.forEach(element1 => {
                                if (element1.getDay() > 0 && element1.getDay() < 6) {
                                    this.ifHoliday.push(element1);
                                }
                            });
                            this.holidaysList = this.ifHoliday
                        } else if (index == -1) {
                            dateArr.forEach(element1 => {
                                if (element1.getDay() > 0 && element1.getDay() < 6) {
                                    this.noHoliday.push(element1);
                                }
                            });
                            this.holidaysList = this.noHoliday
                        }
                    } else {
                        dateArr.forEach(element1 => {
                            if (element1.getDay() > 0 && element1.getDay() < 6) {
                                this.holidaysList.push(element1);
                            }
                        });
                    }
                })
            } else {
                dateArr.forEach(element1 => {
                    if (element1.getDay() > 0 && element1.getDay() < 6) {
                        this.holidaysList.push(element1);
                    }
                });
            }
        })

    }
    getHolidays() {
        this.appService.getService('api/core/holidays').subscribe(
            res => {
                this.holidays = res;
                this.holidays.forEach(holiday => {
                    if (holiday && (new Date(holiday.holidayDate).getFullYear() == this.serverDate.getFullYear()))
                        this.allHolidaysList.push(new Date(holiday.holidayDate));
                });
                this.getCompOffDates()
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
    }

    exportData() {
        this.loaderService.showLoading();
        const url = '/api/me/lms/employees/leaveBalanceAdjustment/export/' + this.employeeCode;
        this.appService.exportService(url).subscribe(res => {
            this.loaderService.hideLoading();
            this.reportData = res['_body'];
            var blob = new Blob([this.reportData], { type: "application/octet-stream" });
            FileSaver.saveAs(blob, "Leave_adjustment_Report.csv");
            this.export = true;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
        this.export = false;
    }
    restrictFloatnumber(event: any) {
        return this.commonService.restrictFloatnumber(event);
    }
    restrictMobilenumber(event: any) {
        return this.commonService.restrictMobilenumber(event);
    }
    updateCalenderCount() {
        var noOfDays: any = this.adjust.numberofdays;
        noOfDays = noOfDays * 1;
        if (this.selectedleavetype == 'CO' && noOfDays != '' && this.actionSelect != 'decrease') {
            this.SelectType = false;
            this.maxDate = new Date(this.serverDate);
            this.fromMinDate = new Date(this.serverDate)
            this.fromMinDate.setMonth(this.maxDate.getMonth() - 3)
        } else {
            this.SelectType = true;
        }
        this.days = [];
        if (noOfDays && noOfDays <= 5) {
            for (var i = 1; i <= noOfDays; i++) {
                this.days.push({
                    'value': ''
                });
            }
        } else
            this.SelectType = true;
    }
}
