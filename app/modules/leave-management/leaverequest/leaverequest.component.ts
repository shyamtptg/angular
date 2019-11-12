import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { LeaveManagementService } from '../leave-management.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { LoaderService } from './../../../shared/services/loader.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';

@Component({
    selector: 'app-leaverequest',
    templateUrl: './leaverequest.component.html',
    styleUrls: ['./leaverequest.component.scss']
})
export class LeaverequestComponent implements OnInit {

    @Input('data') requestedData: any;
    public errorMessage;
    constructor(
        private router: Router,
        private AppService: LeaveManagementService,
        private errorHandleService: ErrorHandleService,
        private route: ActivatedRoute,
        private loaderService: LoaderService,
        private dialogService: DialogService
    ) {}
    ngOnInit() {
        if (this.requestedData) {
          this.requestedData.from = this.shortDateToEpoch(this.requestedData.from);
          this.requestedData.to = this.shortDateToEpoch(this.requestedData.to);
        }
    }
    approveLeave(request, type) {
        let data = [
            {
                "id": request.id,
                "leaveTypeCode": request.leaveType,
                "from": request.from,
                "to": request.to,
                "employeeId": request.employeeId,
                "status": request.status,
                "days": parseFloat(request.days),
                "approverComments": ""
            }];
        if (type === 'APPROVED') {
            this.loaderService.showLoading();
            this.AppService.putService('api/c/me/lms/leaves/requests/' + type, data)
            .subscribe(res => {
                this.loaderService.hideLoading();
                this.dialogService.render(
                    [{
                        title: 'Success',
                        message: 'Leave request has been approved successfully.',
                        yesLabel: 'OK'
                    }],
                    '350px'
                );
                setTimeout(() => {

                }, 2000);
                this.router.navigate(['leave-management/team-requests']);
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
                    this.AppService.putService('api/c/me/lms/leaves/requests/' + type, data).subscribe(res => {
                        this.loaderService.hideLoading();
                        this.router.navigate(['leave-management/team-requests']);
                        this.dialogService.render(
                            [{
                                title: 'Success',
                                message: 'Leave has been rejected successfully.',
                                yesLabel: 'OK'
                            }]
                        );
                    }, error => {
                        this.errorHandleService.handleErrors(error);
                    });
                }
            });
        }
    }
    shortDateToEpoch(shortDate) {
        if (shortDate) {
            var datArr = moment(shortDate, 'DD MM YYYY')
            return datArr['_d'].getTime();
        }
    }
}
