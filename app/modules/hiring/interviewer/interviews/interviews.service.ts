import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../config/app.constants';
import { HttpService } from '../../../../shared/services/http.service';
import { CommonService } from '../../../../shared/services/common.service';

@Injectable()
export class InterviewDataService {
    public myspacenxApiUrl: string;
    private tokenDetails: any;
    private authorizationToken: string;
    private hiringQueryBasePath: string;
    private hiringCommandBasePath: string;
    private prospectQueryBasePath: string;
    private prospectCommandBasePath: string;
    public feedBackDetails: any = {};
    constructor(private httpService: HttpService, public commonService: CommonService, private appConstants: AppConstants) {
    }
    setToken() {
        // this.hiringRequestData = null;
        // this.jobDescTemplateData = null;
         this.myspacenxApiUrl = this.appConstants.getConstants().myspacenxApiUrl;
         this.tokenDetails = this.commonService.getItem('tokenDetails');
         this.authorizationToken = 'Bearer ' + (this.tokenDetails && this.tokenDetails['access_token']);
         this.hiringQueryBasePath = this.appConstants.getConstants().hiringQueryBasePath;
         this.hiringCommandBasePath = this.appConstants.getConstants().hiringCommandBasePath;
         this.prospectQueryBasePath = this.appConstants.getConstants().prospectQueryBasePath;
         this.prospectCommandBasePath = this.appConstants.getConstants().prospectCommandBasePath;
     }
    getCombos = () => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/seeddata', 'get', null, header).map(response => response.json());
    }
    getScheduledInterviews = (pageNum: number, pageSize: number, resultStatus: string, scheduleStatus: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        if(resultStatus !== "ALL" && scheduleStatus !== "ALL"){
           return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/scheduled?page=' + pageNum + '&size=' + pageSize + '&resultStatus=' + resultStatus + '&scheduleStatus=' + scheduleStatus, 'get', null, header).map(response => response.json());
        } else if (scheduleStatus !== "ALL") {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/scheduled?page=' + pageNum + '&size=' + pageSize + '&scheduleStatus=' + scheduleStatus, 'get', null, header).map(response => response.json());
        } else if (resultStatus !== "ALL") {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/scheduled?page=' + pageNum + '&size=' + pageSize + '&resultStatus=' + resultStatus, 'get', null, header).map(response => response.json());
        } else {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/scheduled?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
        }
    }
    getMyInterviews = (pageNum: number, pageSize: number, resultStatus: string, scheduleStatus: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        if(resultStatus !== "ALL" && scheduleStatus !== "ALL"){
           return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/me?page=' + pageNum + '&size=' + pageSize + '&resultStatus=' + resultStatus + '&scheduleStatus=' + scheduleStatus, 'get', null, header).map(response => response.json());
        } else if (scheduleStatus !== "ALL") {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/me?page=' + pageNum + '&size=' + pageSize + '&scheduleStatus=' + scheduleStatus, 'get', null, header).map(response => response.json());
        } else if (resultStatus !== "ALL") {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/me?page=' + pageNum + '&size=' + pageSize + '&resultStatus=' + resultStatus, 'get', null, header).map(response => response.json());
        } else {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/me?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
        }
    }
    exportScheduledInterviews = (resultStatus: string, scheduleStatus: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        if(resultStatus !=="ALL" && scheduleStatus !=="ALL"){
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/needs/interviews/scheduled/exportCsv?resultStatus=' + resultStatus + '&scheduleStatus=' + scheduleStatus, 'get', null, header).map(response => response);
        } else if(scheduleStatus !== "ALL") {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/needs/interviews/scheduled/exportCsv?scheduleStatus=' + scheduleStatus, 'get', null, header).map(response => response);
        } else if(resultStatus !=="ALL"){
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/needs/interviews/scheduled/exportCsv?resultStatus=' + resultStatus, 'get', null, header).map(response => response);
        } else {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/needs/interviews/scheduled/exportCsv', 'get', null, header).map(response => response);
        }
    }
    exportMyInterviews = (resultStatus: string, scheduleStatus: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        if(resultStatus !=="ALL" && scheduleStatus !=="ALL"){
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/needs/interviews/me/exportCsv?resultStatus=' + resultStatus + '&scheduleStatus=' + scheduleStatus, 'get', null, header).map(response => response);
        } else if(scheduleStatus !== "ALL") {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/needs/interviews/me/exportCsv?scheduleStatus=' + scheduleStatus, 'get', null, header).map(response => response);
        } else if(resultStatus !=="ALL"){
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/needs/interviews/me/exportCsv?resultStatus=' + resultStatus, 'get', null, header).map(response => response);
        } else {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/needs/interviews/me/exportCsv', 'get', null, header).map(response => response);
        }
    }
    acceptInterview = (hiringId: string, needId: string, interviewId: string, opCode: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/interviews/' + interviewId + '/operation/' + opCode, 'put', null, header).map(response => response);
    }
    declineInterview = (hiringId: string, needId: string, interviewId: string, opCode: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/interviews/' + interviewId + '/operation/' + opCode, 'put', null, header).map(response => response);
    }
    cancelInterview = (hiringId: string, needId: string, interviewId: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/interviews/' + interviewId, 'delete', null, header).map(response => response);
    }
    getCriteria = (interviewId: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/interviews/' + interviewId + '/criteria', 'get', null, header).map(response => response.json());
    }
    submitFeedBack = (hiringId: string, needId: string, interviewId: string, payload: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/interviews/' + interviewId + '/feedback', 'post', payload, header).map(response => response);
    }
    getFeedbackDetails = (hiringId: string, needId: string, prospectId: string, interviewId: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/prospects/' + prospectId + '/interviews/' + interviewId + '/feedback', 'get', null, header).map(response => response.json());
    }
    getFeedbackDetailsList = (hiringId: string, needId: string, prospectId: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/prospects/' + prospectId + '/interviews/feedback', 'get', null, header).map(response => response.json());
    }
    downloadResume = (prospectId: string, documentId: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken }, responseType = "ArrayBuffer";
        return this.httpService.send(this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/' + prospectId + '/documents/' + documentId, 'get', null, header, responseType).map(response => response);
    }
    loadJobDescriptionDataById = (jobDescId: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/jobdescriptions/' + jobDescId, 'get', null, header).map(response => response);
    }
    loadProspectDataById = (id: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.prospectQueryBasePath + '/prospects/' + id, 'get', null, header).map(response => response.json());
    }
}
