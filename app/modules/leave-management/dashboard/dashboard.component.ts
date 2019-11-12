import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { element } from 'protractor';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LeaveManagement } from '../leave-management.component';
import { ModalContentComponent } from './modal.component';
import { LeaveManagementService } from '../leave-management.service';
import { CommonService } from '../../../shared/services/common.service';
import { CalenderComponent } from '../calender/calender.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-home',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild("CalenderComponent")
    bsModalRef: BsModalRef;
    constructor(
        private loaderService: LoaderService,
        public errorHandleService: ErrorHandleService,
        public Route: Router,
        public appService: LeaveManagementService,
        public commonService: CommonService,
        public calenderComponent: CalenderComponent,
        public ref: ChangeDetectorRef,
        public leaveManagement: LeaveManagement,
        private modalService: BsModalService,
        private dialogService: DialogService,
        private utilService: UtilService
    ) {
        leaveManagement.URLtitle = "Dashboard";
    }
    private stopwatchComponent: CalenderComponent;
    public leavesSummary: any;
    public leavesSummaryManager: any;
    public sample: any;
    public errorMessage;
    public leave = [];
    public serverDate;
    public leaveRequestData: any;
    public showAll: any;
    public pendingLeaves: any;
    public dataLoaded: Boolean;
    public selectedDate;
    public dateLoaded: Boolean = false;
    public isLeaveApplied: any;
    public isWFHApplied: Boolean;
    public user: any;
    private currentDate: any;
    public leaveTypes: any;
    public testData: { 'createdLeaveId': any };
    public changedRole: any;
    public modalData: any;
    public leaveBalanceSummaryData = {};
    private subscription: Subscription;

    ngOnInit() {
        this.appService.getServerDate().subscribe(data => {
            this.dateLoaded = true;
            this.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
            let currentDate = new Date(this.serverDate);
            this.selectedDate = currentDate.toDateString();
            var time = moment(this.serverDate).toDate(); // This will return a copy of the Date that the moment uses
            time.setHours(0);
            time.setMinutes(0);
            time.setSeconds(0);
            time.setMilliseconds(0);
            this.currentDate = time.getTime();
        }, error => {
            this.serverDate = new Date();
            this.errorHandleService.handleErrors(error);
        });

        this.modalData = {};
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
        this.user = { "role": '', "userId": '', "roleFlag": false };
        var userInfo: any = this.commonService.getItem('currentUserInfo');
        let roles = userInfo && userInfo.roles;
        if (roles.indexOf('HR Manager') >= 0) {
            this.user.role = "hr";
            this.user.roleFlag = true;
        } else if (roles.indexOf('Manager') >= 0) {
            this.user.role = "manager";
            this.user.roleFlag = true;
        } else if (roles.indexOf('HR Employee') >= 0) {
            this.user.role = "hrEmployee";
            this.user.roleFlag = true;
        } else {
            this.user.role = "employee";
        }
        this.user.userId = userInfo && userInfo.userName;
        this.appService.setUser(this.user);
        this.loaderService.showLoading();
        this.appService.getService('api/me/lms/requests/PENDING/calendar/1513036800000').subscribe(res => {
            this.loaderService.hideLoading();
            for (let i = 0; i < res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content.length; i++) {
                res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].cancelDateCheck = res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to;
                res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].appliedOn = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].appliedOn);
                res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].from = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].from);
                res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to);
            }
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
            this.errorMessage = this.errorHandleService.handleErrors(error);
        });
        this.appService.getService('api/me/lms/leaves/types').subscribe(res => {
            this.modalData.leaveTypes = res;
        }, error => {
            this.errorMessage = this.errorHandleService.handleErrors(error);
        });
    }
    openModalWithComponent() {
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
                this.appService.getService('api/me/lms/requests/PENDING/calendar/' + new Date(this.serverDate).getTime()).subscribe(res => {
                    for (let i = 0; i < res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content.length; i++) {
                        res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].cancelDateCheck = res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to;
                        res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].appliedOn = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].appliedOn);
                        res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].from = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].from);
                        res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to);
                    }
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
                    this.errorMessage = this.errorHandleService.handleErrors(error);

                });
                this.appService.updateCalendar();
            }
        });
    }

    getLeaveDetailsByDate(data) {
        this.leave = data;
        this.leave.forEach(ele => {
            if (ele.today) {
                this.selectedDate = ele.today;
                this.isLeaveApplied = false;
            } else {
                this.isLeaveApplied = true;
                var date = new Date(ele.date);
                this.selectedDate = date.toDateString();
            }
            this.ref.detectChanges();

        })
    }
    editLeave(data) {
        data.notifyDto.forEach(element => {
            element.id = element.employeeId;
            element.fullName = element.employeeName;
        });
        data.serverDate = this.serverDate;
        const initialState = {
            title: 'Edit Leave',
            message: 'Confirm message',
            data: this.modalData,
            editData: data
        };
        // Modal starts
        this.bsModalRef = this.modalService.show(ModalContentComponent, { class: 'leave-modal', initialState });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.subscription = this.bsModalRef.content.notifyObservable$.subscribe((isConfirmed) => {
            if (isConfirmed) {
                this.appService.getService('api/me/lms/requests/PENDING/calendar/' + new Date(this.serverDate).getTime()).subscribe(res => {
                    for (let i = 0; i < res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content.length; i++) {
                        res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].cancelDateCheck = res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to;
                        res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].appliedOn = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].appliedOn);
                        res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].from = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].from);
                        res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to);
                    }
                    for (let i = 0; i < res.leaveBalanceSummary.length; i++) {
                        this.leaveBalanceSummaryData[res.leaveBalanceSummary[i].leaveTypeCode] = res.leaveBalanceSummary[i];
                    }
                    this.leaveManagement.leave = this.leaveBalanceSummaryData;
                    this.modalData.leaveBalance = this.leaveBalanceSummaryData;

                    if (this.user.role == "employee") {
                        this.modalData.leavesSummary = res
                        this.leavesSummary = res;
                    } else if ((this.user.role == "manager") || (this.user.role == "hr")) {
                        this.modalData.leavesSummaryManager = res
                        this.leavesSummaryManager = res;
                    }
                }, error => {
                    this.errorHandleService.handleErrors(error);
                });
                this.appService.updateCalendar();
            }
        });
    }

    // This method is for the cancelation of the leave if it is approved or in pending status
    deleteLeave(data) {
        this.dialogService.render(
            [{
                title: 'Reason for Cancellation',
                message: '',
                yesLabel: 'OK',
                noLabel: 'CANCEL',
                hasRequiredInput: true
            }],
            '400px'
        ).subscribe(comment => {
            if (comment) {
                const dataComments = { 'comments': '' };
                dataComments.comments = comment;
                this.loaderService.showLoading();
                this.appService.putService('api/c/me/lms/leaves/cancel/' + data.id, dataComments).subscribe(res => {
                    this.appService.getService('api/me/lms/requests/PENDING/calendar/1513036800000').subscribe(res => {
                        this.loaderService.hideLoading();
                        for (let i = 0; i < res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content.length; i++) {
                            res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].cancelDateCheck = res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to;
                            res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].appliedOn = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].appliedOn);
                            res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].from = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].from);
                            res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to = this.utilService.epochToDate(res.leaveRequestSummaryDto.employeeLeaveRequestSummary.content[i].to);
                        }

                        for (let i = 0; i < res.leaveBalanceSummary.length; i++) {
                            this.leaveBalanceSummaryData[res.leaveBalanceSummary[i].leaveTypeCode] = res.leaveBalanceSummary[i];
                        }
                        this.leaveManagement.leave = this.leaveBalanceSummaryData;
                        this.modalData.leaveBalance = this.leaveBalanceSummaryData;
                        if (this.user.role.toLowerCase() === 'employee') {
                            this.leavesSummary = res;
                        } else if ((this.user.role.toLowerCase() === 'manager') || (this.user.role.toLowerCase() === 'hr')) {
                            this.leavesSummaryManager = res;
                        }
                    }, error => {
                        this.errorMessage = this.errorHandleService.handleErrors(error);
                    });
                    this.appService.updateCalendar();
                    const summ = this.leavesSummary.leaveRequestSummaryDto.employeeLeaveRequestSummary.content;
                    for (let i = 0; i < summ.length; i++) {
                        if (data.id === summ[i].id) {
                            summ.splice(i, 1);
                        }
                    }
                    if ((this.user.role.toLowerCase() === 'manager') || (this.user.role.toLowerCase() === 'hr')) {
                        const numm = this.leavesSummaryManager.leaveRequestSummaryDto.employeeLeaveRequestSummary.content
                        for (let i = 0; i < numm.length; i++) {
                            if (data.id === numm[i].id) {
                                summ.splice(i, 1);
                            }
                        }
                    }
                }, error => {
                    this.errorMessage = this.errorHandleService.handleErrors(error);
                });
            }
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
            case "Cancellation Rejected":
                return 'CancellationRejected';
            case "Cancel Pending":
                return 'CancelPending';
            case "Rejected":
                return 'Rejected';
            case "PH Pending":
                return 'PHPending';
            case "HR Pending":
                return 'HRPending';
            default: return '';
        }
    }

    shortDateToEpoch(shortDate) {
        if (shortDate) {
            var datArr = moment(shortDate, 'DD MM YYYY')
            return datArr['_d'];
        }
    }
}












