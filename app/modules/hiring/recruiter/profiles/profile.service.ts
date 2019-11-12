import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../config/app.constants';
import { HttpService } from '../../../../shared/services/http.service';
import { CommonService } from '../../../../shared/services/common.service';

@Injectable()
export class ProfilesDataService {
    public myspacenxApiUrl: string;
    private tokenDetails: any;
    private authorizationToken: string;
    private hiringQueryBasePath: string;
    private hiringCommandBasePath: string;
    private prospectQueryBasePath: string;
    private prospectCommandBasePath: string;
    public prospectDetails: any = {};
    constructor(private httpService: HttpService, public commonService: CommonService, private appConstants: AppConstants) {}
    setToken() {
        this.myspacenxApiUrl = this.appConstants.getConstants().myspacenxApiUrl;
        this.tokenDetails = this.commonService.getItem('tokenDetails');
        this.authorizationToken = 'Bearer ' + (this.tokenDetails && this.tokenDetails['access_token']);
        this.hiringQueryBasePath = this.appConstants.getConstants().hiringQueryBasePath;
        this.hiringCommandBasePath = this.appConstants.getConstants().hiringCommandBasePath;
        this.prospectQueryBasePath = this.appConstants.getConstants().prospectQueryBasePath;
        this.prospectCommandBasePath = this.appConstants.getConstants().prospectCommandBasePath;
    }
    getAllProfiles = (pageNum: number, pageSize: number) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.prospectQueryBasePath + '/prospects/all?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
    }
    getAllProfilesByFilters = (pageNum: number, pageSize: number, noticePeriod: string, status: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        if (status !== "ALL" && noticePeriod !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&statusCodes=' + status + '&noticePeriods=' + noticePeriod, 'get', null, header).map(response => response.json());
        }
        else if (status !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&statusCodes=' + status, 'get', null, header).map(response => response.json());
        }
        else if (noticePeriod !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&noticePeriods=' + noticePeriod, 'get', null, header).map(response => response.json());
        }
        else {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/all?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
        }
    }
    exportAllProfilesByFilters = (noticePeriod: string, status: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        if (status !== "ALL" && noticePeriod !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/exportCsv?statusCodes=' + status + '&noticePeriods=' + noticePeriod, 'get', null, header).map(response => response);
        }
        else if (status !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/exportCsv?statusCodes=' + status, 'get', null, header).map(response => response);
        }
        else if (noticePeriod !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/exportCsv?noticePeriods=' + noticePeriod, 'get', null, header).map(response => response);
        }
        else {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/exportCsv', 'get', null, header).map(response => response);
        }
    }
    exportProfileData = (noticePeriod: string, status: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        if (status !== "ALL" && noticePeriod !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/exportCsv?statusCodes=' + status + '&noticePeriods=' + noticePeriod, 'get', null, header).map(response => response);
        }
        else if (status !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/exportCsv?statusCodes=' + status, 'get', null, header).map(response => response);
        }
        else if (noticePeriod !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/exportCsv?noticePeriods=' + noticePeriod, 'get', null, header).map(response => response);
        }
        else {
            return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/exportCsv', 'get', null, header).map(response => response);
        }
    }
    attachProfiletoNeed = (hiringId: string, needId: string, prospectId: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.prospectCommandBasePath + '/prospects/' + prospectId + '/requests/' + hiringId + '/needs/' + needId + '/attach', 'post', null, header).map(response => response);
    }
    getPanels = (hiringId: string, needId: string, levelId: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/interviewLevels/' + levelId + '/panels', 'get', null, header).map(response => response.json());
    }
    getInterviewLevels = (hiringId: string, needId: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/interviewLevels', 'get', null, header).map(response => response.json());
    }
    getInterviewersByPanelId = (hiringId: string, needId: string, levelId: string, panelId: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/interviewLevels/' + levelId + '/panels/' + panelId + '/panelMembers', 'get', null, header).map(response => response.json());
    }
    scheduleInterview = (hiringId: string, needId: string, details: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/interviews', 'post', details, header).map(response => response);
    }
    rescheduleInterview = (hiringId: string, needId: string, interviewId: string, details: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/interviews/' + interviewId, 'put', details, header).map(response => response);
    }
    getInterviewDetailsById = (interviewId: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/' + interviewId, 'get', null, header).map(response => response.json());
    }
    updateInterviewStatus = (prospectId: string, opCode: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.prospectCommandBasePath + '/prospects/' + prospectId + '/operation/' + opCode, 'put', null, header).map(response => response);
    }
    getProfilesByStatus = (pageNum: number, pageSize: number, status: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.prospectQueryBasePath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&statusCodes=' + status, 'get', null, header).map(response => response.json());
    }
    notifyCandidate = (prospectId: string, payload: any) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.prospectCommandBasePath + '/prospects/' + prospectId + '/notification', 'post', payload, header).map(response => response);
    }
    updateProspectStatus = (prospectId: string, opCode: string, payload: any) => {
        this.setToken();
        var header = { 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.prospectCommandBasePath + '/prospects/' + prospectId + '/operation/' + opCode, 'put', payload, header).map(response => response);
    }
    downloadResume = (prospectId: string, documentId: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken }, responseType = "ArrayBuffer";
        return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/' + prospectId + '/documents/' + documentId, 'get', null, header, responseType).map(response => response);
    }
}
