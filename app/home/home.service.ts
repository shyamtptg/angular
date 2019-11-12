import { Injectable } from '@angular/core';
import { HttpService } from './../shared/services/http.service';
import { CommonService } from './../shared/services/common.service';
import { AppConstants } from './../config/app.constants';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { ErrorHandleService } from './../shared/services/errorhandle.service';

@Injectable()

export class HomeService {
    constructor(
        private httpService: HttpService,
        private commonService: CommonService,
        private appConstants: AppConstants,
        private errorHandleService: ErrorHandleService
    ) {}
    public token: {};
    header: object = {};
    host = environment.serviceUrl + '/';
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
    executeService(url: string, method: string, payLoad: any) {
        this.setHeader();

        return this.httpService.send(
                this.host + url,
                method,
                payLoad,
                this.header
        )
        .map(res => {
            return res.json();
        },
        error =>  {
            this.errorHandleService.handleErrors(error);
        });
    }
    getDashboardStats() {
        return this.httpService.getMockData('dashboard-stats.json').map(response => response);
    }
    getTimelineMockdata() {
        return this.httpService.getMockData('timeLine-data.json').map(response => response);
    }
}
