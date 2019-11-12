import { Params } from '@angular/router';
import { element } from 'protractor';
import { LeaveManagementService } from '../leave-management.service';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { CommonService } from './../../../shared/services/common.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { LeaveManagement } from '../leave-management.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalContentComponent } from '../dashboard/modal.component';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { DialogService } from './../../../shared/dialogs/dialog.service';

@Component({
    selector: 'app-action-buttons',
    templateUrl: './action-buttons.component.html',
    styleUrls: ['./action-buttons.component.scss']
})
export class ActionButtonsComponent {
    bsModalRef: BsModalRef;
    public params: any;
    public status;
    public ModelType;
    public errorMessage;
    public employeId;
    public modalData;
    public leaveBalanceSummaryData = {};
    public leavesSummary: any;
    public leavesSummaryManager: any;
    public toDate: any;
    public requestDetails;
    public approverComments: any;
    public user: any;
    private subscription: Subscription;
    constructor(
        private Appservice: LeaveManagementService,
        private modalService: BsModalService,
        private leaveManagement: LeaveManagement,
        public loaderService: LoaderService,
        public commonService: CommonService,
        private errorHandleService: ErrorHandleService,
        private dialogService: DialogService
    ) { }

    agInit(params: any): void {
        this.params = params;
        this.status = params.data.status;
        this.requestDetails = params.data;
        this.employeId = params.data.employeeId;
        this.approverComments = params.data.approverComments;
        this.ModelType = params.data.ModelType;
        let currentDate = moment(params.data.serverDate).format('DD/MM/YYYY');
        this.toDate = this.shortDateToEpoch(params.data.to) >= this.shortDateToEpoch(currentDate);
    }
    requestData() {
        this.leaveManagement.leave = "";
        this.commonService.setItem('empRptData', this.requestDetails);
    }
    shortDateToEpoch(shortDate) {
        if (shortDate) {
            var datArr = shortDate.split('/');
            //  '"'  -->>  to add double quotes arround dynamic value
            let longDate = new Date('"' + datArr[1] + '/' + datArr[0] + '/' + datArr[2] + '"')
            return longDate.getTime();
        }
    }

    approveLeave(request, type) {
        if (this.ModelType === 'TR') {
            let data = [
                {
                    "id": request.id,
                    "leaveTypeCode": request.leaveType,
                    "from": this.shortDateToEpoch(request.from),
                    "to": this.shortDateToEpoch(request.to),
                    "employeeId": request.employeeId,
                    "status": request.status,
                    "days": parseFloat(request.days),
                    "approverComments": ""
                }]
            if (type == "APPROVED") {
                this.loaderService.showLoading();
                this.Appservice.putService('api/c/me/lms/leaves/requests/' + type, data).subscribe(res => {
                    this.loaderService.hideLoading();
                    this.status = 'Approved';
                    this.dialogService.render(
                        [{
                            title: 'Approved',
                            message: 'Request has been approved successfully.',
                            yesLabel: 'OK'
                        }]
                    ).subscribe(response => {
                        this.invokeParentMethod(data);
                    });
                }, error => {
                    this.errorHandleService.handleErrors(error);
                });
            } else {
                this.dialogService.render(
                    [{
                        title: 'Reason for Rejection',
                        message: '',
                        yesLabel: 'OK',
                        noLabel: 'CANCEL',
                        hasRequiredInput: true
                    }],
                    '400px'
                ).subscribe(comment => {
                    if (comment) {
                        data.forEach(element => {
                            element.approverComments = comment;
                        });
                        this.loaderService.showLoading();
                        this.Appservice.putService('api/c/me/lms/leaves/requests/' + type, data).subscribe(res => {
                            this.loaderService.hideLoading();
                            this.status = 'Rejected';
                            this.dialogService.render(
                                [{
                                    title: 'Success',
                                    message: 'Requested has been rejected successfully.',
                                    yesLabel: 'OK'
                                }]
                            ).subscribe(result => {
                                this.invokeParentMethod(data);
                            });
                        }, error => {
                            this.errorHandleService.handleErrors(error);
                        });
                    }
                });
            }
        } else if (this.ModelType == "ER") {
            const data = {
                'id': request.id,
                'leaveTypeCode': request.leaveType,
                'from': this.shortDateToEpoch(request.from),
                'to': this.shortDateToEpoch(request.to),
                'employeeId': request.employeeId,
                'status': request.status,
                'days': parseFloat(request.days),
                'approverComments': ''
            };
            if (type.toUpperCase() === 'APPROVED') {
                this.loaderService.showLoading();
                this.Appservice.putService('api/c/me/lms/requests/encash/' + request.id + '/' + type, data)
                .subscribe(res => {
                    this.loaderService.hideLoading();
                    this.status = 'Approved';
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: 'Leave Encashment request has been approved.',
                            yesLabel: 'OK'
                        }]
                    ).subscribe(response => {
                        this.invokeParentMethod(data);
                    });
                }, error => {
                    this.errorHandleService.handleErrors(error);
                });
            } else {
                this.dialogService.render(
                    [{
                        title: 'Reason for Rejection',
                        message: '',
                        yesLabel: 'OK',
                        noLabel: 'CANCEL',
                        hasRequiredInput: true
                    }],
                    '400px'
                ).subscribe(comment => {
                    if (comment) {
                        data.approverComments = comment;
                        this.loaderService.showLoading();
                        this.Appservice.putService('api/c/me/lms/requests/encash/' + request.id + '/' + type, data).subscribe(res => {
                            this.loaderService.hideLoading();
                            this.status = 'Rejected';
                            this.dialogService.render(
                                [{
                                    title: 'Success',
                                    message: 'Requested has been rejected successfully.',
                                    yesLabel: 'OK'
                                }]
                            ).subscribe(result => {
                                this.invokeParentMethod(data);
                            });
                        }, error => {
                            this.errorHandleService.handleErrors(error);
                        });
                    }
                });
            }
        } else if (this.ModelType === 'WR') {
            const data = [{
                "id": request.id,
                "leaveTypeCode": request.leaveType,
                "from": this.shortDateToEpoch(request.from),
                "to": this.shortDateToEpoch(request.to),
                "employeeId": request.employeeId,
                "status": request.status,
                "approverComments": ""
            }];
            if (type === 'APPROVED') {
                this.loaderService.showLoading();
                this.Appservice.putService('api/c/me/lms/requests/workFromHome/requests/' + type, data).subscribe(res => {
                    this.loaderService.hideLoading();
                    data.forEach(element => {
                        element.id = request.id;
                    });
                    this.status = 'Approved';
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: 'WFH request has been approved.',
                            yesLabel: 'OK'
                        }]
                    ).subscribe(response => {
                        this.invokeParentMethod(data);
                    });
                }, error => {
                    this.errorHandleService.handleErrors(error);
                });
            } else {
                this.dialogService.render(
                    [{
                        title: 'Reason for Rejection',
                        message: '',
                        yesLabel: 'OK',
                        noLabel: 'CANCEL',
                        hasRequiredInput: true
                    }],
                    '400px'
                ).subscribe(comment => {
                    if (comment) {
                        data.forEach(element => {
                            element.approverComments = comment;
                        });
                        this.loaderService.showLoading();
                        this.Appservice.putService('api/c/me/lms/requests/workFromHome/requests/' + type, data).subscribe(res => {
                            this.loaderService.hideLoading();
                            data.forEach(element => {
                                element.id = request.id;
                            });
                            this.status = 'Rejected';
                            this.dialogService.render(
                                [{
                                    title: 'Success',
                                    message: 'Requested has been rejected successfully.',
                                    yesLabel: 'OK'
                                }]
                            ).subscribe(result => {
                                this.invokeParentMethod(data);
                            });
                        }, error => {
                            this.errorHandleService.handleErrors(error);
                        });
                    }
                });
            }
        } else if (this.ModelType === 'CR') {
            let data =
                {
                    "leaveTypeCode": request.leaveType,
                    "from": this.shortDateToEpoch(request.from),
                    "to": this.shortDateToEpoch(request.to),
                    "employeeId": 1219,
                    "approverComments": "",
                    "description": request.description,
                    "status": request.status
                }
            if (type === 'APPROVED') {
                this.loaderService.showLoading();
                this.Appservice.putService('api/c/me/lms/requests/compOff/' + request.id + '/' + type, data).subscribe(res => {
                    this.status = 'Approved';
                    this.loaderService.hideLoading();
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: 'Compensatory Off has been approved.',
                            yesLabel: 'OK'
                        }]
                    ).subscribe( response => {
                        this.invokeParentMethod(data);
                    });
                }, error => {
                    this.errorHandleService.handleErrors(error);
                });
            } else {
                this.dialogService.render(
                    [{
                        title: 'Reason for Rejection',
                        message: '',
                        yesLabel: 'OK',
                        noLabel: 'CANCEL',
                        hasRequiredInput: true
                    }],
                    '400px'
                ).subscribe(comment => {
                    if (comment) {
                        data.approverComments = comment;
                        this.loaderService.showLoading();
                        this.Appservice.putService('api/c/me/lms/requests/compOff/' + request.id + '/' + type, data).subscribe(res => {
                            this.loaderService.hideLoading();
                            this.status = 'Rejected';
                            this.dialogService.render(
                                [{
                                    title: 'Success',
                                    message: 'Requested has been rejected successfully.',
                                    yesLabel: 'OK'
                                }]
                            ).subscribe(result => {
                                this.invokeParentMethod(data);
                            });
                        }, error => {
                            this.errorHandleService.handleErrors(error);
                        });
                    }
                });
            }
        }
    }
    public invokeParentMethod(data) {
        this.params.context.componentParent.methodFromParent(data);
    }
    editLeave(leaveData) {
        this.modalData = {};
        this.user = this.commonService.getItem('currentUserInfo');
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

        this.Appservice.getService('api/me/lms/dashboard/availableLeaves').subscribe(res => {
            for (let i = 0; i < res.leaveBalanceSummaryDto.length; i++) {
                this.leaveBalanceSummaryData[res.leaveBalanceSummaryDto[i].leaveTypeCode] = res.leaveBalanceSummaryDto[i];
            }
            this.leaveManagement.leave = this.leaveBalanceSummaryData;
            this.modalData.leaveBalance = this.leaveBalanceSummaryData;

            this.loaderService.showLoading();
            this.Appservice.getService('api/me/lms/leaves/types').subscribe(res => {
                this.modalData.leaveTypes = res;
                leaveData.notifyDto.forEach(element => {
                    element.id = element.employeeId;
                    element.fullName = element.employeeName;
                });
                setTimeout(() => {
                    this.loaderService.hideLoading();
                }, 0);
                this.Appservice.getServerDate().subscribe(data => {
                    leaveData.serverDate = (data.currentTime) ? new Date(data.currentTime) : new Date();
                    this.openModal(leaveData);
                }, error => {
                    leaveData.serverDate = new Date();
                    this.openModal(leaveData);
                    this.errorHandleService.handleErrors(error);
                });
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    openModal(data) {
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
                this.invokeParentMethod(data);
            }
        });
    }
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
                this.Appservice.putService('api/c/me/lms/leaves/cancel/' + data.id, dataComments).subscribe(res => {
                    this.loaderService.hideLoading();
                    this.invokeParentMethod(data);
                }, error => {
                    this.errorMessage = this.errorHandleService.handleErrors(error);
                });
            }
        });
    }
}
