import { Injectable } from '@angular/core';
import { AppConstants } from '../../config/app.constants';
import { HttpService } from './../../shared/services/http.service';
import { CommonService } from './../../shared/services/common.service';

@Injectable()
export class HeaderService {
    public myspacenxApiUrl: string;
    private tokenDetails: any;
    private authorizationToken: string;
    public prospectDetails: any = {};

    constructor(
        private httpService: HttpService,
        public commonService: CommonService,
        private appConstants: AppConstants
    ) {}

    setToken() {
        this.myspacenxApiUrl = this.appConstants.getConstants().myspacenxApiUrl;
        this.tokenDetails = this.commonService.getItem('tokenDetails');
        this.authorizationToken = 'Bearer ' + (this.tokenDetails && this.tokenDetails['access_token']);
    }

    submitIssue = (issueData: any, fileData: any) => {
        this.setToken();
        const formData: FormData = new FormData();
        formData.append('issueMetadata', new Blob([JSON.stringify(issueData)], {
            type: 'application/json'
        }));
        fileData && formData.append('screenshot', fileData, fileData.name);
        const header = { 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + '/api/core/support/issues', 'post', formData, header).map(response => response);
    }
}
