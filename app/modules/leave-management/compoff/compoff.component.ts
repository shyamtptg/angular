import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { LeaveManagement } from '../leave-management.component';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CommonService } from '../../../shared/services/common.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import * as moment from 'moment';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-compoff',
    templateUrl: './compoff.component.html',
    styleUrls: ['./compoff.component.scss']
})
export class CompoffComponent implements OnInit {
    public columnDefs;
    public paginationPageSize;
    public getRowHeight;
    constructor(
        private appService: LeaveManagementService,
        public commonService: CommonService,
        public loaderService: LoaderService,
        private errorHandleService: ErrorHandleService,
        private leaveManagement: LeaveManagement,
        private dialogService: DialogService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = "Apply For Compensatory Off";
        this.columnDefs = [
            { headerName: "Date", field: "compOffDate", minWidth: 110 },
            { headerName: "Applied On", field: "requestedDate", minWidth: 121 },
            { headerName: "Expiry Date", field: "expiryDate", minWidth: 121 },
            { headerName: "Manager Status", field: "status", minWidth: 130, headerTooltip: "Manager Status" },
            { headerName: "HR Status", field: "hrStatus", minWidth: 130 }
        ],

            this.paginationPageSize = 10;
    }
    public modalData: any;
    public leaveBalance: any;
    public leaveBalanceSummaryData = {};
    public leavesSummaryManager: any;
    public leavesSummary: any;
    public compoffrequst: any;
    public managerInfo: any;
    public cmpData: any;
    public gridApi;
    public gridColumnApi;
    public holidayDate: any;
    public availableLeaves: any[];
    public compOffData;
    public holidays: any[];
    public user: any;
    public holidaysList: any;
    public holidaysByMonth: any;
    public serverDate;
    pageNum: number = 0;
    pageSize: number = 10;
    totalPages: number;
    currentUrl;
    filteredCountriesMultiple: any[];

    minDate: Date;
    maxDate: Date;
    today: Date;
    day: Date;
    setdate: any;
    ngOnInit() {
        this.user = { 'role': '' }
        this.modalData = { "leaveBalance": '' }
        this.compOffData = {
            "leaveTypeDescription": [
                { "leaveType": null, "detailedDescription": "" },
                { "leaveType": null, "detailedDescription": "" },
                { "leaveType": null, "detailedDescription": "" },
                { "leaveType": null, "detailedDescription": "" }
            ]
        };
        this.cmpData = { 'date': '', 'alternativeContactInfo': "", 'comments': "" };
        this.leaveBalanceSummaryData = { "CO": {}, "CL": {}, "EL": {}, "OL": {} };
        this.managerInfo = { 'projectManagerDto': "", 'reportingManagerDto': "" };
        this.compoffrequst = { 'content': [] }
        this.holidaysList = [];
        this.holidaysByMonth = { '01': [], '02': [], '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': [] };

        this.getmanagerDetails();
        this.getavaliableLeaves();

        this.appService.getServerDate().subscribe(data => {
            this.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
            this.getHolidays();
        }, error => {
            this.serverDate = new Date();
            this.getHolidays();
            this.errorHandleService.handleErrors(error);
        });
    }
    loadDetails() {
        this.day = new Date(this.serverDate);
        this.today = new Date(this.serverDate);
        this.maxDate = new Date(this.serverDate);
        this.minDate = new Date(this.serverDate);
        this.minDate.setDate(this.minDate.getDate() - 7);
        this.today.setDate(this.today.getDate() - (this.today.getDay() + 6) % 7);
        if (this.day.getDay() == 0 && 6) {
            this.setdate = new Date(this.serverDate);
        } else {
            this.setdate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1);
        }
        this.cmpData = { 'date': new Date(this.setdate), 'alternativeContactInfo': "", 'comments': "" };
    }
    // To load the grid when there is a change occured
    loadGrid() {
        this.loaderService.showLoading();
        this.appService.paginationRequest(this.pageNum, this.pageSize, this.currentUrl).subscribe(res => {
            this.loaderService.hideLoading();
            this.compoffrequst = res;
            this.totalPages = (res.totalPages) * 10;
            this.compoffrequst.content.forEach(element => {
                element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                element.compOffDate = this.utilService.epochToDate(element.compOffDate);
                element.expiryDate = this.utilService.epochToDate(element.expiryDate)
            });
            this.gridApi.setRowData(this.compoffrequst.content);
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    resizeColumns(params) {
        var gridApis: any = params.api;
        gridApis && gridApis.sizeColumnsToFit();
    }
    onGridReady(params) {
        this.currentUrl = "api/me/lms/requests/compOffhistory";
        this.loadGrid();
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.resizeColumns(params);
    }
    getHolidays() {
        this.appService.getService('api/core/holidays').subscribe(
            res => {
                this.holidays = res;
                var minimumDate = new Date(this.serverDate);
                minimumDate.setDate(minimumDate.getDate() - 7);
                if (this.holidays.length != 0) {
                    this.holidays.forEach(holiday => {
                        if (holiday) {
                            if (moment(minimumDate).format('YYYY-MM-DD') <= moment(holiday.holidayDate).format('YYYY-MM-DD')
                                && (moment(holiday.holidayDate).format('YYYY-MM-DD') < moment(this.serverDate).format('YYYY-MM-DD'))) {
                                this.holidayDate = this.utilService.epochToDate(holiday.holidayDate);
                                let month = this.holidayDate.substring(3, 5);
                                let date = this.holidayDate.substring(0, 2);
                                this.holidaysByMonth[month].push(date);
                                var arr1: any = []
                                var index;
                                //Here we are using 62 to check for two months dates
                                for (let i = 1; i <= 62; i++) {
                                    arr1.push(i)
                                }
                                for (let i = 0; i < +(this.holidaysByMonth[month]).length; i++) {
                                    index = arr1.indexOf(+(this.holidaysByMonth[month])[i]);
                                    if (index > -1) {
                                        arr1.splice(index, 1);
                                    }
                                }
                            } else {
                                //Here we are using 62 to check for two months dates
                                for (let i = 0; i <= 62; i++) {
                                    var x: any = new Date(minimumDate)
                                    x.setDate(i)
                                    if (x.getDay() < 6 && x.getDay() > 0) {
                                        this.holidaysList.push(x);
                                    }
                                }
                            }
                        }
                    });
                } else {
                    //Here we are using 62 to check for two months dates
                    for (let i = 1; i <= 62; i++) {
                        var x: any = new Date(this.serverDate)
                        x.setDate(i)
                        if (x.getDay() < 6 && x.getDay() > 0) {
                            this.holidaysList.push(x);
                        }
                    }
                }
                this.loadDetails();
            }, error => {
                this.errorHandleService.handleErrors(error);
                this.loadDetails();
            });
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
    getmanagerDetails() {
        this.appService.getService('api/core/employee/reportingProjectManager').subscribe(res => {
            this.managerInfo = res;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }

    restrictMobilenumber(event: any) {
        return this.commonService.restrictMobilenumber(event);
    }
    // To apply the CompOff this method has been called the data send to back end
    createcompoff(data) {
        this.loaderService.showLoading();
        let sendData = Object.assign({}, data);
        sendData.copyTo = [];
        sendData.applyTo = [];
        let utcDate = sendData.date;
        let y = utcDate.getFullYear(),
            m = utcDate.getUTCMonth() + 1,
            d = utcDate.getUTCDate() + 1;
        let dateStr = parseInt(y) + '-' + parseInt(m) + '-' + parseInt(d);
        let s = new Date(+"'" + parseInt(y) + '-' + parseInt(m) + '-' + parseInt(d) + "'");
        sendData.compOffDate = this.dateToEpoch(sendData.date);

        if (this.managerInfo.reportingManagerDto != null)
            sendData.copyTo.push(this.managerInfo.reportingManagerDto.managerId);
        sendData.applyTo = [];
        for (let i = 0; i < this.managerInfo.projectManagerDto.length; i++) {
            sendData.applyTo.push(this.managerInfo.projectManagerDto[i].managerId);
        }
        sendData.notifyTo = [];
        if (sendData.hasOwnProperty('addPeople')) {
            if (sendData.addPeople != null) {
                for (let i = 0; i < sendData.addPeople.length; i++) {
                    sendData.notifyTo.push(sendData.addPeople[i].id);
                }
            } else {
                delete sendData['addPeople'];
            }

        }
        if (sendData.hasOwnProperty('babyBornDate')) {
            sendData.babyBornDate = new Date(sendData.babyBornDate.toDateString()).getTime();
        }

        delete sendData['addPeople'];
        this.appService.postService('api/c/me/lms/requests/compOff', sendData).subscribe(res => {
            this.loaderService.hideLoading();
            this.dialogService.render(
                [{
                    title: 'Success',
                    message: 'Compensatory Off has been applied successfully.',
                    yesLabel: 'OK'
                }],
                '400px'
            ).subscribe(result => {
                if (result.value) {
                    setTimeout(() => {}, 2000);
                    this.loadGrid();
                }
            });
            this.resetCompOff();
        },
            error => {
                this.errorHandleService.handleErrors(error);
            }
        );

    }
    //To reset the data in the CompOff apllication when the form is submitted
    resetCompOff() {
        this.cmpData = {
            date: new Date(this.setdate),
            alternativeContactInfo: "",
            comments: ""
        };
    }


    shortDateToEpoch(shortDate) {
        if (shortDate) {
            var datArr = shortDate.split('/');
            //  '"'  -->>  to add double quotes arround dynamic value
            let longDate = new Date('"' + datArr[1] + '/' + datArr[0] + '/' + datArr[2] + '"')
            let utcLongDate = new Date(longDate.getFullYear(), longDate.getUTCMonth(), longDate.getDate());
            return utcLongDate.getTime();
        }
    }

    dateToEpoch(date) {
        let y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();
        let dateStr = [y, (m > 9 ? '' : '0') + m, (d > 9 ? '' : '0') + d].join('-')
        let epochDate = new Date(dateStr).getTime();
        return epochDate;
    }

    // This method for the auto complete search
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
        this.appService.getService('api/me/lms/dashboard/availableLeaves').subscribe(
            res => {
                for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                    this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
                }
                this.leaveManagement.leave = this.leaveBalanceSummaryData;
                this.compOffData = res;
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
    paginate(e) {
        this.pageNum = e.page;
        this.loadGrid();
    }
}
