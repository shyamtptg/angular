import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import * as moment from 'moment';
import { LoaderService } from '../../../shared/services/loader.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-cancelrequest',
    templateUrl: './cancelrequest.component.html',
    styleUrls: []
})
export class CancelrequestComponent implements OnInit {
    public params: any;
    public errorMessage;
    public status;
    public canceldateCheck;
    public requestDetails;
    public currentDate: any;
    pageNum: number = 0;
    pageSize: number = 10;
    totalPages: number;
    currentUrl;
    constructor(
        private Appservice: LeaveManagementService,
        private errorHandleService: ErrorHandleService,
        public loaderService: LoaderService,
        private dialogService: DialogService,
        private utilService: UtilService
    ) { }
    agInit(params: any): void {
        this.params = params;
        this.status = params.data.status;
        this.canceldateCheck = params.data.date;
        this.requestDetails = params.data;
        this.currentDate = params.data.serverdate;
    }
    public gridData;
    public gridColumnApi;
    public gridApi;
    ngOnInit() {
        var time = moment(this.currentDate).toDate(); // This will return a copy of the Date that the moment uses
        time.setHours(0);
        time.setMinutes(0);
        time.setSeconds(0);
        time.setMilliseconds(0);
        this.currentDate = time.getTime();
        this.canceldateCheck = (this.shortDateToEpoch(this.canceldateCheck)).getTime();
    }
    requestData() {
        this.Appservice.setRequestData(this.requestDetails);
    }
    shortDateToEpoch(shortDate) {
        if (shortDate) {
            const datArr = moment(shortDate, 'DD MM YYYY');
            return datArr['_d'];
        }
    }
    cancel(params) {
        this.dialogService.render(
            [{
                title: 'Reason for the Cancellation',
                message: '',
                yesLabel: 'OK',
                noLabel: 'CANCEL',
                hasRequiredInput: true
            }],
            '350px'
        ).subscribe(comment => {
            if (comment) {
                this.loaderService.showLoading();
                const data = { 'comments': '' };
                data.comments = comment;
                this.Appservice.putService('api/c/me/lms/requests/workFromHome/cancel/' + params.data.id, data).subscribe(res => {
                    this.loaderService.hideLoading();
                    this.updategrid(params);
                }, error => {
                    this.errorHandleService.handleErrors(error);
                });
            }
        });
    }
    updategrid(params) {
        this.loaderService.showLoading();
        this.currentUrl = 'api/me/lms/requests/workfromhomehistory';
        this.Appservice.paginationRequest(this.pageNum, this.pageSize, this.currentUrl).subscribe(res => {
            this.loaderService.hideLoading();
            this.gridData = res;
            this.gridData.content.forEach(element => {
                element.requestedDate = this.utilService.epochToDate(element.requestedDate);
                element.date = this.utilService.epochToDate(element.date);
            });
            params.api.setRowData(this.gridData.content);
        }, error => {
            this.errorHandleService.handleErrors(error);
        });

        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
}
