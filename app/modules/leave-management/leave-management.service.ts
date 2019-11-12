import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';
import { HttpService } from './../../shared/services/http.service';
import { ErrorHandleService } from './../../shared/services/errorhandle.service';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LeaveManagementService {
    header: object = {};
    host = environment.serviceUrl + '/';
    data: any = { 'success': '', error: '' };
    public token: {};
    public user: {};
    public requestData;
    private updateCal = new Subject<any>();
    updateCalObservable$ = this.updateCal.asObservable();
    constructor(
        public commonService: CommonService,
        private httpService: HttpService,
        private errorHandleService: ErrorHandleService
    ) { }

    private getToken() {
        const tokenDetails: any = this.commonService.getItem('tokenDetails');
        this.token = tokenDetails && tokenDetails['access_token'];
        return this.token;
    }

    private setHeader() {
        this.getToken();
        this.header = {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + this.token
        };
    }

    getRequestData() {
        return this.requestData;
    }
    setRequestData(data) {
        this.requestData = data;
    }

    setUser(user) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    paginationRequest(pageNum: number, pageSize: number, url) {
        return this.getService(url + '?page=' + pageNum + '&size=' + pageSize);
    }

    paginationRequestforTeamReport(pageNum: number, pageSize: number, url) {
        return this.getService(url + '&page=' + pageNum + '&size=' + pageSize);
    }

    getService(url: string) {
        this.setHeader();

        return this.httpService.send(
            this.host + url,
            'get',
            null,
            this.header
        )
        .map(res => res.json());
    }

    postService(url: string, data) {
        this.setHeader();

        return this.httpService.send(
            this.host + url,
            'post',
            data,
            this.header
        )
        .map(res => res.json(),
        error =>  {
            this.errorHandleService.handleErrors(error);
        });
    }

    putService(url: string, data: any) {
        this.setHeader();

        return this.httpService.send(
            this.host + url,
            'put',
            data,
            this.header
        )
        .map(res => res.json());
    }

    exportService(url: string) {
        this.setHeader();

        return this.httpService.send(
            this.host + url,
            'get',
            null,
            this.header
        )
        .map(res => res);
    }

    getServerDate() {
        return this.getService('api/core/applicationInfo');
    }

    filterCountryMultiple(eventQuery: any) {
        return this.getService('api/core/employee/' + eventQuery);
    }

    updateCalendar = () => {
        this.updateCal.next('updateCalendar');
    }
}
