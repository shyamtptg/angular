import { Injectable } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { environment } from '../../../environments/environment';
import { HttpService } from './../../shared/services/http.service';
import { ErrorHandleService } from './../../shared/services/errorhandle.service';
import { LoaderService } from './../../shared/services/loader.service';

@Injectable()
export class AssetService {
    header: object = {};
    host = environment.serviceUrl + '/';
    data: any = { 'success': '', error: '' };
    public token: {};
    public user: {};
    public requestData;

    constructor(
        public commonService: CommonService,
        private httpService: HttpService,
        private errorHandleService: ErrorHandleService,
        private loaderService: LoaderService) {
    }
    private getToken() {
        this.loaderService.showLoading();
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

    getService(url: string) {
        this.setHeader();

        return this.httpService.send(
            this.host + url,
            'get',
            null,
            this.header
        )
        .map(res => {
            this.loaderService.hideLoading();
            return res.json();
        },
        error =>  {
            this.errorHandleService.handleErrors(error);
        });
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
        .map(res => res.json(),
        error =>  {
            this.errorHandleService.handleErrors(error);
        });
    }

    deleteService(url: string, data) {
        this.setHeader();

        return this.httpService.send(
            this.host + url,
            'delete',
            data,
            this.header
        )
        .map(res => res.json(),
        error =>  {
            this.errorHandleService.handleErrors(error);
        });
    }
}
