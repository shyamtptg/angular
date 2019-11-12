import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../../config/app.constants';
import { HttpService } from '../../../../../shared/services/http.service';
import { CommonService } from '../../../../../shared/services/common.service';

@Injectable()
export class SearchService {
    public myspacenxApiUrl: string;
    private tokenDetails: any;
    private authorizationToken: string;
    private hiringQueryBasePath: string;
    private hiringCommandBasePath: string;
    private prospectQueryBasePath: string;
    private prospectCommandBasePath: string;
    public prospectId: string;
    constructor(private httpService: HttpService, public commonService: CommonService, private appConstants: AppConstants) {
    }
    setToken() {
        this.myspacenxApiUrl = this.appConstants.getConstants().myspacenxApiUrl;
        this.tokenDetails = this.commonService.getItem('tokenDetails');
        this.authorizationToken = 'Bearer ' + (this.tokenDetails && this.tokenDetails['access_token']);
        this.prospectQueryBasePath = this.appConstants.getConstants().prospectQueryBasePath;
    }
    searchProfileData = (pageNum: number, pageSize: number, searchData: any) => {
        this.setToken();
        var header = { 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/search?page=' + pageNum + '&size=' + pageSize, 'post', searchData, header).map(response => response.json());
    }
    downloadResume = (prospectId: string, documentId: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken }, responseType = "ArrayBuffer";
        return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/' + prospectId + '/documents/' + documentId, 'get', null, header, responseType).map(response => response);
    }
    getProspectTimeline = (prospectId: string, pageNum: number, pageSize: number) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/' + prospectId + '/prospectTimeline?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
    }
}
