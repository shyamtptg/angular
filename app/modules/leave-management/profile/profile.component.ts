import { element } from 'protractor';
import { LeaveManagementService } from '../leave-management.service';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { LoaderService } from './../../../shared/services/loader.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    @Input('data') requestedData: any;
    public EmpInfo;
    public emID;
    public clBalance;
    public olBalance;
    public elBalance;
    public errorMessage;
    public coBalance;
    constructor(
        public appService: LeaveManagementService,
        public loaderService: LoaderService,
        public errorHandleService: ErrorHandleService
    ) {

    }

    ngOnInit() {
        this.EmpInfo = { 'employeeName': '' };
        if (this.requestedData) {
            this.emID = (typeof this.requestedData) === 'number' ? this.requestedData : this.requestedData.employeeId;
            this.appService.getService('api/core/employeeInfo/' + this.emID).subscribe(res => {
                this.EmpInfo = res;
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
            this.getData();
        }
    }
    getData() {
        this.loaderService.showLoading();
        this.appService.getService('api/me/lms/employee/availableLeaves/' + this.emID).subscribe(res => {
            let leaves = res.leaveBalanceSummaryDto;
            this.clBalance = _.filter(leaves, { 'leaveTypeCode': 'CL' })[0].balance;
            this.olBalance = _.filter(leaves, { 'leaveTypeCode': 'OL' })[0].balance;
            this.elBalance = _.filter(leaves, { 'leaveTypeCode': 'EL' })[0].balance;
            this.coBalance = _.filter(leaves, { 'leaveTypeCode': 'CO' })[0].balance;
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
}
