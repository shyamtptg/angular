import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './http.service';
import { CommonService } from './common.service';
import { AppConstants } from '../../config/app.constants';
import { Router } from '@angular/router';
@Injectable()
export class AuthService {
    public url = 'api/login';
    private userDetails: any;
    private tokenDetails: any;
    private currentUserInfo: any;
    private myspacenxApiUrl: string;
    private header: any;

    constructor(
        private httpService: HttpService,
        public commonService: CommonService,
        private appConstants: AppConstants,
        private router: Router
    ) {
      this.myspacenxApiUrl = this.appConstants.getConstants().myspacenxApiUrl;
    }

    redirectUrl: string;
    isLoggedIn(): boolean {
        this.userDetails = this.commonService.getItem('currentUser');
        this.tokenDetails = this.commonService.getItem('tokenDetails');
        this.currentUserInfo = this.commonService.getItem('currentUserInfo');
        return (this.userDetails && this.currentUserInfo && this.userDetails.isLogged && this.tokenDetails) ? true : false;
    }

    login = (username: string, password: string) => {
        const data = new URLSearchParams();
        data.append('username', (username ? username : ''));
        data.append('password', (password ? password : ''));
        data.append('grant_type', 'password');
        const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
        return this.httpService.send(
            this.myspacenxApiUrl + '/api/oauth/token',
            'post',
            data,
            header
        ).map(response => response.json());
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    private setHeader() {
        const tokenDetails = this.commonService.getItem('tokenDetails');
        const token = 'Bearer ' + (tokenDetails && tokenDetails['access_token']);
        this.header = { 'Content-Type': 'application/json', 'Authorization': token };
    }

    getUserDetails() {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + '/api/core/user/me',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getAppInfo() {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + '/api/core/applicationInfo',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
}
