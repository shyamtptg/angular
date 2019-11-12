/* This is a component which we pass in modal*/
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { CommonService } from '../../../shared/services/common.service';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs/Subject';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'modal-content',
    templateUrl: 'dashboard.modal.html'
})

export class ModalContentComponent implements OnInit {
    closeBtnName: string;
    title: string;
    message: string;
    data: any;
    editData: {
        'leaveType': {},
        'days': any,
        'from': any,
        'to': any,
        'startdayhalfday': boolean,
        'mlExpectedDate': any,
        'enddayhalfday': boolean,
        'babyGender': any,
        'babyBornDate': any,
        'employeeId': undefined,
        'id': undefined,
        'appliedTo': undefined,
        'comments': '',
        'contactInfo': '',
        'notifyDto': undefined,
        'serverDate': any
    };
    leaveCount: number = 1;
    from: Date;
    to: Date;
    fromHalfDay: Boolean;
    toHalfDay: Boolean;
    minDate: Date;
    maxDate: Date;
    fromMinDate: Date;
    fromMaxDate: Date;
    compoffHalfDay: Boolean = true;
    toMinDate: Date;
    toMaxDate: Date;
    public halfDay: Boolean;
    public isDisable: Boolean;
    isMore: Boolean;
    public holidays: any;
    public errorMessage;
    public holidaysList: any[];
    public holidayDates: any = [];
    public holidaysByMonth: any;
    public apply: Boolean;
    public mlExDate: any;
    public babyBornDate: any;
    public leaveAppyStatus;
    public fromDate;
    public toDate;
    public serverDate;
    public checkType: any;
    public leaveData: any;
    public selectedLeaveType: any;
    public testData = { 'createdLeaveId': undefined };
    public successMsg;
    public managerInfo: any;
    public managerInfos: any;
    public additionDays: number = 15;
    public availableLeaves: any;
    public day: any;
    public user: any;
    public yearRange;
    filteredCountriesMultiple: any[];
    private notify = new Subject<any>();
    notifyObservable$ = this.notify.asObservable();

    constructor(
        public bsModalRef: BsModalRef,
        public loaderService: LoaderService,
        public appService: LeaveManagementService,
        public commonService: CommonService,
        public errorHandleService: ErrorHandleService,
        private dialogService: DialogService,
        private utilService: UtilService
    ) { }

    ngOnInit() {
        this.apply = true;
        this.isDisable = true;
        this.user = this.commonService.getItem('currentUserInfo');
        this.holidays = [];
        this.holidaysList = [];
        this.holidaysByMonth = {
            '01': [],
            '02': [],
            '03': [],
            '04': [],
            '05': [],
            '06': [],
            '07': [],
            '08': [],
            '09': [],
            '10': [],
            '11': [],
            '12': []
        };
        this.getmanagerDetails();
        this.managerInfo = {
            'projectManagerDto': [],
            'reportingManagerDto': { 'reportingManagerName': '' }
        };
        this.managerInfos = [{
            'projectManagerDto': [],
            'reportingManagerDto': { 'reportingManagerName': '' }
        }];
        this.availableLeaves = {
            'balance': null,
            'detailedDescription': ''
        };
        this.leaveData = {
            'selectedLeaveType': {},
            'from': '',
            'to': '',
            'addPeople': [],
            'employeeId': undefined, 'alternativeContactNo': '', 'comments': ''
        };
        if (Object.keys(this.editData).length === 0) {
            this.loaderService.showLoading();
            this.appService.getServerDate().subscribe(data => {
                this.loaderService.hideLoading();
                this.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
                this.getHolidays();
            }, error => {
                this.serverDate = new Date();
                this.getHolidays();
                this.errorHandleService.handleErrors(error);
            });
        } else {
            this.serverDate = (this.editData.serverDate) ? this.editData.serverDate : new Date();
            this.getHolidays();
        }
    }
    loadDetails() {
        this.yearRange = (new Date(this.serverDate).getFullYear()) + ':' + (new Date(this.serverDate).getFullYear() + 1);
        this.fromMinDate = this.getMinDate();
        this.toMinDate = this.getMinDate();
        if (Object.keys(this.editData).length === 0) {
            this.leaveData = {
                'selectedLeaveType': {},
                'from': this.serverDate,
                'to': this.serverDate,
                'employeeId': undefined,
                'alternativeContactNo': '',
                'comments': ''
            };
            this.leaveData.selectedLeaveType = '';
            this.validateCurrentDay();
        } else {
            this.leaveData = {
                'selectedLeaveType': {},
                'from': this.serverDate,
                'to': this.serverDate,
                'employeeId': undefined,
                'alternativeContactNo': '',
                'comments': ''
            };
            this.leaveData.selectedLeaveType = '';
            this.apply = false;
            this.leaveCount = +(this.editData.days);
            this.leaveCount > 5 ? this.isMore = true : this.isMore = false;
            this.leaveData = {
                'selectedLeaveType': this.getLeaveTypeObject(),
                'from': this.shortToFullDateConvertor(this.editData.from),
                'to': this.shortToFullDateConvertor(this.editData.to),
                'employeeId': undefined,
                'addPeople': this.editData.notifyDto,
                'id': this.editData.id,
                'alternativeContactNo': (this.editData.contactInfo),
                'comments': this.editData.comments,
                'babyGender': this.editData.babyGender,
            };
            if (typeof ((this.editData.mlExpectedDate)) == "string")
                this.leaveData.mlExpectedDate = (this.editData.mlExpectedDate)
            else
                this.leaveData.mlExpectedDate = this.shortToFullDateConvertor(this.utilService.epochToDate(this.editData.mlExpectedDate))
            if (typeof ((this.editData.babyBornDate)) == "string")
                this.leaveData.babyBornDate = (this.editData.babyBornDate)
            else
                this.leaveData.babyBornDate = new Date(this.editData.babyBornDate)
            this.change();
            this.editLeaveDates();
            if (this.leaveData.selectedLeaveType.leaveTypeCode === 'ML') {
                if (typeof ((this.editData.mlExpectedDate)) == "string")
                    this.leaveData.mlExpectedDate = this.shortToFullDateConvertor(this.editData.mlExpectedDate)
                else
                    this.leaveData.mlExpectedDate = this.shortToFullDateConvertor(this.utilService.epochToDate(this.editData.mlExpectedDate))
                this.maxDate = this.formatDate(new Date(this.mlExDate));
                this.fromMinDate = this.formatDate(new Date(this.mlExDate));
                this.toMinDate = this.formatDate(new Date(this.mlExDate));
                this.fromMinDate.setDate(this.fromMinDate.getDate() - 56);
                this.maxDate.setDate(this.maxDate.getDate() + 126);
            }
            if (this.leaveData.selectedLeaveType.leaveTypeCode == "PL") {
                if (typeof ((this.editData.babyBornDate)) == "string") {
                    this.leaveData.babyBornDate = this.shortToFullDateConvertor(this.editData.babyBornDate)
                } else {
                    this.leaveData.babyBornDate = new Date(this.editData.babyBornDate)
                }
                this.fromMinDate = this.formatDate(this.leaveData.babyBornDate);
                this.toMinDate = this.formatDate(this.leaveData.babyBornDate);
                this.maxDate = this.formatDate(this.leaveData.babyBornDate);
                this.day = new Date(this.fromMinDate)
                if (this.day.getDay() == 1) {
                    this.maxDate.setDate(this.fromMinDate.getDate() + 4);
                    this.fromMinDate.setDate(this.fromMinDate.getDate());
                    this.toMinDate = this.leaveData.to;
                } else {
                    this.maxDate.setDate(this.fromMinDate.getDate() + 6);
                    this.fromMinDate.setDate(this.fromMinDate.getDate());
                    this.toMinDate = this.leaveData.to;
                }
            }
        }
        this.leaveData.fromHalfDay = this.editData.startdayhalfday;
        this.leaveData.toHalfDay = this.editData.enddayhalfday;
    }
    restrictMobilenumber(event: any) {
        return this.commonService.restrictMobilenumber(event);
    }
    getHolidays() {
        this.appService.getService('api/core/holidays').subscribe(res => {
            this.holidays = res;
            this.holidays.forEach(holiday => {
                this.holidaysList.push(new Date(holiday.holidayDate));
                const holidayDate = this.utilService.epochToDate(holiday.holidayDate);
                holidayDate && this.holidayDates.push(holidayDate);
                const month = (holidayDate.substring(3, 5));
                const date = holidayDate.substring(0, 2);
                this.holidaysByMonth[month].push(date);
            });
            this.loadDetails();
        }, error => {
            if (error.message === 'invalid_token') {
                this.close();
            }
            this.errorMessage = this.errorHandleService.handleErrors(error);
        });
    }
    validateCurrentDay() {
        if (this.serverDate && this.holidayDates) {
            const day: any = moment(this.serverDate).day(),
                serverDate: any = this.utilService.epochToDate(this.serverDate);
            if ((serverDate && this.holidayDates.indexOf(serverDate) > -1) || (day == 0 || day == 6)) {
                this.leaveData.from = '';
                this.leaveData.to = '';
            }
        }
    }
    dateToEpoch(date) {
        const y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();
        const dateStr = [y, (m > 9 ? '' : '0') + m, (d > 9 ? '' : '0') + d].join('-')
        const epochDate = new Date(dateStr).getTime();
        return epochDate;
    }
    dateToEpochSlash(date) {
        if (typeof (date) == "string") {
            date = parseInt(date)
        }
        let y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();
        let dateStr = [y, (m > 9 ? '' : '0') + m, (d > 9 ? '' : '0') + d].join('/')
        let epochDate = new Date(dateStr).getTime();
        return epochDate;
    }

    


    shortToFullDateConvertor(shortDate) {
        if (shortDate) {
            var datArr = moment(shortDate, 'DD MM YYYY')
            return datArr['_d'];
        }
    }

    getLeaveTypeObject() {
        for (var i = 0; i <= this.data.leaveTypes.length; i++) {
            if (this.editData.leaveType == this.data.leaveTypes[i].leaveTypeCode) {
                return this.data.leaveTypes[i];
            }
        }
        this.change();
    }

    confirm(data) {
        this.loaderService.showLoading();
        // we set dialog result as true on click on confirm button,
        // then we can get dialog result from caller code
        let sendData = Object.assign({}, data);
        sendData.leaveCount = this.leaveCount;
        sendData.applyTo = [];
        sendData.copyTo = [];
        sendData.employeeId = this.user && this.user.id;
        sendData.comments = sendData.comments;
        sendData.alternativeContactNo = sendData.alternativeContactNo;
        let utcDate = sendData.from;
        let y = utcDate.getFullYear(),
            m = utcDate.getMonth() + 1,
            d = utcDate.getDate();
        let dateStr = parseInt(y) + '-' + parseInt(m) + '-' + parseInt(d);
        let s = new Date(+"'" + parseInt(y) + '-' + parseInt(m) + '-' + parseInt(d) + "'");
        sendData.from = this.dateToEpoch(sendData.from);
        sendData.to = this.dateToEpoch(sendData.to);
        if (!sendData.hasOwnProperty('fromHalfDay')) {
            sendData.fromHalfDay = false;
        }
        if (!sendData.hasOwnProperty('toHalfDay')) {
            sendData.toHalfDay = false;
        }
        sendData.leaveTypeCode = sendData.selectedLeaveType.leaveTypeCode;
        if (this.managerInfo.reportingManagerDto != null)
            sendData.copyTo.push(this.managerInfo.reportingManagerDto.managerId);
        sendData.applyTo = [];
        const count = this.getBusinessDatesCount(data.from, data.to);
        for (let i = 0; i < this.managerInfo.projectManagerDto.length; i++) {
            sendData.applyTo.push(this.managerInfo.projectManagerDto[i].managerId);
        }
        if (this.leaveData.selectedLeaveType.leaveTypeCode == 'EL' && count > 5) {
            for (let i = 0; i < this.managerInfos.length; i++) {
                sendData.applyTo.push(this.managerInfos[i].managerId);
            }
        }
        sendData.notifyTo = [];
        if (sendData.hasOwnProperty('addPeople')) {
            for (let i = 0; i < sendData.addPeople.length; i++) {
                sendData.notifyTo.push(sendData.addPeople[i].id);
            }
        }
        if (sendData.hasOwnProperty('babyBornDate') && sendData.babyBornDate != "") {
            sendData.babyBornDate = this.dateToEpoch(sendData.babyBornDate);
        }
        if (sendData.hasOwnProperty('mlExpectedDate') && sendData.mlExpectedDate != "") {
            sendData.mlExpectedDate = this.dateToEpoch(sendData.mlExpectedDate);
        }

        if (sendData.id) {
            this.leaveCount = sendData.leaveCount;
            this.appService.putService('api/c/me/lms/leaves/' + sendData.id, sendData).subscribe(res => {
                this.successMsg = true;
                this.loaderService.hideLoading();
                this.dialogService.render(
                    [{
                        title: 'Success',
                        message: 'Leave has been updated successfully.',
                        yesLabel: 'OK'
                    }]
                ).subscribe(result => {
                    setTimeout(() => {
                        this.close();
                        this.successMsg = false;
                    }, 500);
                    if (result.value) {
                        setTimeout(() => {
                            this.close();
                            this.successMsg = false;
                        }, 500);
                    }
                });

                this.notify.next(this.leaveData);
            },
                error => {
                    if (error.message === 'invalid_token') {
                        this.close();
                    }
                    this.errorMessage = this.errorHandleService.handleErrors(error);
                });
        } else {
            this.leaveCount = sendData.leaveCount;
            this.appService.postService('api/c/me/lms/leaves', sendData).subscribe(res => {
                this.testData.createdLeaveId = res.result;
                this.loaderService.hideLoading();
                this.successMsg = true;

                this.dialogService.render(
                    [{
                        title: 'Success',
                        message: 'Leave has been applied successfully.',
                        yesLabel: 'OK'
                    }]
                ).subscribe(result => {
                    if (result.value) {
                        setTimeout(() => {
                            this.close();
                            this.successMsg = false;
                        }, 500);
                    }
                    setTimeout(() => {
                        this.close();
                        this.successMsg = false;
                    }, 500);
                });
                this.notify.next(this.leaveData);
            }, error => {
                if (error.message === 'invalid_token') {
                    this.close();
                }
                this.errorMessage = this.errorHandleService.handleErrors(error);
            });
        }
    }
    mlDate(e) {
        this.isDisable = false;
        this.mlExDate = this.dateToEpoch(e);
        if (this.availableLeaves.leaveTypeCode == "ML") {
            this.maxDate = this.formatDate(new Date(this.mlExDate));
            this.fromMinDate = this.formatDate(new Date(this.mlExDate));
            this.fromMinDate.setDate(this.fromMinDate.getDate() - 56);
            this.maxDate.setDate(this.maxDate.getDate() + 126);
        }
        this.leaveData.from = new Date(this.fromMinDate);
        this.leaveData.to = new Date(this.maxDate);
        this.checkLeaveCount();
    }
    babyBorn(e) {
        let d = this.data.leaveTypes;
        this.checkType = d.find(function (obj) { return obj.leaveTypeCode === 'PL'; });
        this.isDisable = false;
        this.babyBornDate = this.dateToEpoch(e);
        if (this.checkType.leaveTypeCode == "PL") {
            this.fromMinDate = this.formatDate(new Date(this.babyBornDate))
            this.toMinDate = this.formatDate(new Date(this.babyBornDate))
            this.maxDate = this.formatDate(new Date(this.babyBornDate));
            this.day = new Date(this.fromMinDate)
            if (this.day.getDay() == 1) {
                this.maxDate.setDate(this.fromMinDate.getDate() + 4)
                this.fromMinDate.setDate(this.fromMinDate.getDate())
            } else {
                this.maxDate.setDate(this.fromMinDate.getDate() + 6)
                this.fromMinDate.setDate(this.fromMinDate.getDate())
            }
            if (this.day.getDay() == 0) {
                var datePl = new Date(this.fromMinDate)
                datePl.setDate(e.getDate() + 1)
                this.leaveData.from = datePl;
                this.leaveData.to = datePl;
            } else if (this.day.getDay() == 6) {
                var datePlSaturday = new Date(this.fromMinDate)
                datePlSaturday.setDate(e.getDate() + 2)
                this.leaveData.from = datePlSaturday;
                this.leaveData.to = datePlSaturday;
            } else {
                this.leaveData.from = this.fromMinDate;
                this.leaveData.to = this.fromMinDate
            }
        }
    }
    checkLeaveType(e) {
        this.checkLeaveCount()
        this.compoffHalfDay = false;
        this.apply = false;
        this.leaveData.fromHalfDay = false;
        this.leaveData.toHalfDay = false;
        this.fromMinDate = new Date(this.serverDate);
        this.fromMinDate.setDate(this.fromMinDate.getDate());
        if (e.leaveTypeCode == "PL") {
            this.isDisable = true;
            this.compoffHalfDay = true;
            if (this.serverDate.getDate() > 24) {
                var dateFrom: any = moment(this.serverDate).startOf('month')
                this.fromDate = new Date(dateFrom);
                this.fromDate.setDate(this.fromDate.getDate() + 25);
                var dateTo: any = moment(this.serverDate).add(1, 'months').startOf('month')
                this.toDate = new Date(dateTo);
                this.toDate.setDate(this.toDate.getDate() + 24)
            } else {
                this.leaveData.mlExpectedDate = '';
                var dateFrom: any = moment(this.serverDate).subtract(1, 'months').startOf('month')
                this.fromDate = new Date(dateFrom);
                this.fromDate.setDate(this.fromDate.getDate() + 25);
                var dateTo: any = moment(this.serverDate).startOf('month')
                this.toDate = new Date(dateTo);
                this.toDate.setDate(this.toDate.getDate() + 24)
            }
        } else if (e.leaveTypeCode == "CO") {
            this.isDisable = false;
            this.leaveData.babyBornDate = '';
            this.leaveData.mlExpectedDate = '';
            this.compoffHalfDay = true;
            this.fromMinDate = this.getMinDate();
            this.maxDate = moment(this.serverDate).startOf('isoWeek').toDate();
            this.maxDate.setDate(this.maxDate.getDate() + 90);
        } else if (e.leaveTypeCode == "CL" || e.leaveTypeCode == "OL" || e.leaveTypeCode == "EL" || e.leaveTypeCode == "LOP") {
            this.isDisable = false;
            this.maxDate = null;
            this.leaveData.mlExpectedDate = '';
            this.leaveData.babyBornDate = '';
            this.fromMinDate = this.getMinDate();
            this.maxDate = moment(this.serverDate).startOf('isoWeek').toDate();
            this.maxDate.setDate(this.maxDate.getDate() + 90);
        } else if (e.leaveTypeCode == "ML") {
            this.isDisable = true;
            this.compoffHalfDay = true;
            this.leaveData.babyBornDate = '';
            this.toDate = new Date(this.serverDate);
            this.fromDate = moment(this.serverDate).startOf('isoWeek').toDate();
            this.toDate.setMonth(this.fromDate.getMonth() + 12);
        }
    }
    getMinDate() {
        this.serverDate = (this.serverDate) ? this.serverDate : new Date();
        var startOfWeek: any = moment(this.serverDate).startOf('isoWeek').toDate();
        if (this.serverDate.getDate() == 26) {
            return this.serverDate;
        } else if (this.serverDate.getDate() > 26) {
            return (startOfWeek.getDate() > 26) ? startOfWeek : (moment(this.serverDate).set('date', 26).toDate());
        } else {
            return startOfWeek;
        }
    }
    editLeaveDates() {
        this.leaveCount = +(this.editData.days);
        this.isDisable = false;
        this.selectedLeaveType = this.leaveData.selectedLeaveType;
        if (this.selectedLeaveType && this.selectedLeaveType.leaveTypeCode == "PL") {
            if (this.serverDate.getDate() > 24) {
                var dateFrom: any = moment(this.serverDate).startOf('month')
                this.fromDate = new Date(dateFrom);
                this.fromDate.setDate(this.fromDate.getDate() + 25);
                var dateTo: any = moment(this.serverDate).add(1, 'months').startOf('month')
                this.toDate = new Date(dateTo);
                this.toDate.setDate(this.toDate.getDate() + 24)
            } else {
                this.leaveData.mlExpectedDate = '';
                var dateFrom: any = moment(this.serverDate).subtract(1, 'months').startOf('month')
                this.fromDate = new Date(dateFrom);
                this.fromDate.setDate(this.fromDate.getDate() + 25);
                var dateTo: any = moment(this.serverDate).startOf('month')
                this.toDate = new Date(dateTo);
                this.toDate.setDate(this.toDate.getDate() + 24)
            }
        } else if (this.selectedLeaveType && this.selectedLeaveType.leaveTypeCode == "CO") {
            this.maxDate = new Date(this.serverDate);
            this.maxDate.setDate(this.maxDate.getDate() + 90);
        } else if (this.selectedLeaveType && (this.selectedLeaveType.leaveTypeCode == "CL" || this.selectedLeaveType.leaveTypeCode == "OL" || this.selectedLeaveType.leaveTypeCode == "EL")) {
            this.fromMinDate = moment(this.serverDate).startOf('isoWeek').toDate();
            this.maxDate = new Date(this.serverDate);
            this.maxDate.setDate(this.maxDate.getDate() + 90);
            this.toMinDate = this.leaveData.from;

        } else if (this.selectedLeaveType && this.selectedLeaveType.leaveTypeCode == "ML") {
            this.isDisable = true;
            this.fromDate = moment(this.serverDate).startOf('isoWeek').toDate();
            this.toDate.setMonth(this.fromDate.getMonth() + 12);
        }
    }
    change() {
        this.availableLeaves = this.data.leaveBalance[this.leaveData.selectedLeaveType.leaveTypeCode];
        this.checkLeaveType(this.availableLeaves);
    }
    getmanagerDetails() {
        this.appService.getService('api/core/employee/reportingProjectManager').subscribe(res => {
            this.managerInfo = res;
        }, error => {
            if (error.message === 'invalid_token') {
                this.close();
            }
            this.errorMessage = this.errorHandleService.handleErrors(error);
        });
    }
    onSelectFromDate(date) {
        if (this.availableLeaves && this.availableLeaves.leaveTypeCode == "ML") {
            if (this.dateToEpoch(date) <= this.mlExDate) {
                this.maxDate = this.formatDate(date)
                this.maxDate.setDate(this.maxDate.getDate() + 182)
                this.leaveData.to = new Date(this.maxDate);
            } else {
                this.dialogService.render(
                    [{
                        title: 'Warning',
                        message: 'From date should always be less than or equal to Expected date.',
                        yesLabel: 'OK'
                    }],
                    '400px'
                ).subscribe(result => {
                    if (result) {
                        this.leaveData.from = new Date(this.fromMinDate);
                        this.leaveData.to = new Date(this.maxDate);
                        this.checkLeaveCount();
                    } else {
                        this.checkLeaveCount();
                    }
                });
            }
        } else if (this.availableLeaves && this.availableLeaves.leaveTypeCode == "PL") {
            this.toMinDate = date;
            this.leaveData.to = date;
            if (this.dateToEpoch(date) == this.dateToEpoch(this.maxDate)) {

                this.dialogService.render(
                    [{
                        title: 'Warning',
                        message: 'Please try any other From date (within the Week) to apply for 2 days or else you can apply for single day.',
                        yesLabel: 'OK'
                    }],
                    '400px'
                );
            }
        } else {
            this.toMinDate = date;
            this.leaveData.to = date;
        }
        this.checkLeaveCount();
        this.leaveData.fromHalfDay = false;
        this.leaveData.toHalfDay = false;
    }
    onSelectToDate(date) {
        this.checkLeaveCount();
        this.leaveData.fromHalfDay = false;
        this.leaveData.toHalfDay = false;
        this.apply = false;
    }
    checkLeaveCount() {
        this.apply = false;
        let data = { from: null, to: null };
        data = Object.assign({}, this.leaveData);
        if (data.from) {
            data.from.setHours('00');
            data.from.setMinutes('00');
            data.from.setSeconds('00');
        }
        data.to && data.to.setHours('01');
        let count = data.from && data.to && this.getBusinessDatesCount(data.from, data.to);
        if (this.leaveCount == 1)
            this.halfDay = false;
        else
            this.halfDay = true;
        if (this.availableLeaves.leaveTypeCode == 'ML' && data.from && data.to) {
            if (count == 1) { this.leaveCount = this.getDaysDiff(data.to, data.from); }
            else
                this.leaveCount = this.getDaysDiff(data.to, data.from);
        }
        if (count > 2) {
            if (this.availableLeaves.leaveTypeCode == 'LOP' && data.from && data.to) {
                return this.leaveCount = this.getDaysDiff(data.to, data.from) + 1;
            }
        }
        if (count <= 5) {
            this.isMore = false;
            this.managerInfo.projectManagerDto = this.managerInfo.projectManagerDto
        } else if (count > 5) {
            this.isMore = true;
            this.managerInfos = this.managerInfo.practiceHeadDto;
        }
    }
    getBusinessDatesCount(startDate, endDate) {
        var count = 0;
        var curDate = new Date(startDate);
        while (curDate <= endDate) {
            var dayOfWeek = curDate.getDay();
            if (!((dayOfWeek == 6) || (dayOfWeek == 0)))
                count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        count = this.getBusinessDaysExcludingExcludingHolidays(startDate, endDate, count)
        this.leaveCount = count;
        return count;
    }

    getBusinessDaysExcludingExcludingHolidays(from, to, count) {
        for (let i = 0; i < this.holidays.length; i++) {
            var date = this.holidays[i].holidayDate;
            var isBetween = this.checkDateInBetweenDate(from, to, date);
            if (isBetween) {
                count--;
            }
        }
        return count;
    }

    checkDateInBetweenDate(fromDate, toDate, checkDate) {
        var dateFrom = this.utilService.epochToDate(fromDate);
        var dateTo = this.utilService.epochToDate(toDate);
        var dateCheck = this.utilService.epochToDate(checkDate);

        var d1 = dateFrom.split("/");
        var d2 = dateTo.split("/");
        var c = dateCheck.split("/");

        var from = new Date(parseInt(d1[2]), parseInt(d1[1]) - 1, parseInt(d1[0]));  // -1 because months are from 0 to 11
        var to = new Date(parseInt(d2[2]), parseInt(d2[1]) - 1, parseInt(d2[0]));
        var check = new Date(parseInt(c[2]), parseInt(c[1]) - 1, parseInt(c[0]));
        return (check > from && check < to);
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

    formatDate(dateObj) {
        let dateString = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate() + ' ' + new Date().getHours() + ':' + new Date(this.serverDate).getMinutes() + ':' + new Date(this.serverDate).getSeconds();
        dateObj = new Date(dateString);
        return dateObj;
    }

    getDaysDiff(endDate, startDate) {
        return moment(endDate).diff(startDate, 'days');
    }
    getCurrentWeekDays(date) {
        var first = moment(date).startOf('isoWeek').toDate();
        var last = moment(date).endOf('isoWeek').toDate();
        return { start: first, end: last }
    }

    toggleFromHalfday(e) {
        if (e.target.checked && this.leaveData.fromHalfDay) {
            this.leaveCount = this.leaveCount - 0.5;
        } else if (!e.target.checked && !this.leaveData.fromHalfDay) {
            this.leaveCount = this.leaveCount + 0.5;
        }
    }
    toggleToHalfday(e) {
        if (e.target.checked && this.leaveData.toHalfDay) {
            this.leaveCount = this.leaveCount - 0.5;

        } else if (!e.target.checked && !this.leaveData.toHalfDay) {
            this.leaveCount = this.leaveCount + 0.5;

        }
    }
    close() {
        this.bsModalRef.hide();
    }
}