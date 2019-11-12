
import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../config/app.constants';
import { HttpService } from '../../../../shared/services/http.service';
import { CommonService } from '../../../../shared/services/common.service';

@Injectable()
export class AssignExecutiveDataService {
    public myspacenxApiUrl: string;
    private hiringComboData: any;
    private tokenDetails: any;
    private authorizationToken: string;
    private hiringQueryBasePath: string;
    private hiringCommandBasePath: string;
    constructor(private httpService: HttpService, public commonService: CommonService, private appConstants: AppConstants) {}
    setToken() {
        // this.hiringRequestData = null;
        // this.jobDescTemplateData = null;
        this.myspacenxApiUrl = this.appConstants.getConstants().myspacenxApiUrl;
        this.tokenDetails = this.commonService.getItem('tokenDetails');
        this.authorizationToken = 'Bearer ' + (this.tokenDetails && this.tokenDetails['access_token']);
        this.hiringQueryBasePath = this.appConstants.getConstants().hiringQueryBasePath;
        this.hiringCommandBasePath = this.appConstants.getConstants().hiringCommandBasePath;
        // this.prospectQueryBasePath = this.appConstants.getConstants().prospectQueryBasePath;
        // this.prospectCommandBasePath = this.appConstants.getConstants().prospectCommandBasePath;
    }
    loadHiringComboData = () => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/seeddata', 'get', null, header).map(response => response.json()).subscribe(data => {
            self.hiringComboData = data;
        }, error => { 
            
        });
    }
    getCombos = () => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/seeddata', 'get', null, header).map(response => response.json());
    }
    getDepartmentMap = () => {
        var depObj = {},
            pracInDep = {},
            result = {};
        this.hiringComboData && this.hiringComboData['DEPARTMENT'].forEach(function (element: any, index: any) {
            depObj[element['id']] = element['name'];
            pracInDep[element['id']] = element['practices'];
        });
        result['depNames'] = depObj;
        result['depPractices'] = pracInDep;
        return result;
    }
    getPracticeMap = () => {
        var pracObj = {},
            compInPrac = {},
            result = {},
            practices: any = [];
        this.hiringComboData && this.hiringComboData['DEPARTMENT'].forEach(function (element: any) {
            practices = practices.concat(element['practices']);
        });
        this.hiringComboData['PRACTICE'] = practices;
        this.hiringComboData && this.hiringComboData['PRACTICE'].forEach(function (element: any, index: any) {
            pracObj[element['id']] = element['name'];
            compInPrac[element['id']] = element['competencies'];
        });
        result['pracNames'] = pracObj;
        result['pracCompetencies'] = compInPrac;
        return result;
    }
    getClientMap = () => {
        var clientObj = {};
        this.hiringComboData && this.hiringComboData['CLIENT'].forEach(function (element: any, index: any) {
            clientObj[element['id']] = element['clientName'];
        });
        return clientObj;
    }
    getRecruiters = () => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + '/api/core/recruiters', 'get', null, header).map(response => response.json());
    }
    getAllHiringRequests = (pageNum: number, pageSize: number) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
    }
    getAllHiringRequestsByFilters = (pageNum: number, pageSize: number, status: string, priority: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        if (status !== "ALL" && priority !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize + '&status=' + status + '&priority=' + priority, 'get', null, header).map(response => response.json());
        }
        else if (status !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize + '&status=' + status, 'get', null, header).map(response => response.json());
        }
        else if (priority !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize + '&priority=' + priority, 'get', null, header).map(response => response.json());
        }
        else {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
        }
    }
    getAllHiringRequestsByFiltersForAssign = (pageNum: number, pageSize: number, status: string, priority: string, department?: string, practice?: string, defaultStatus?: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        
        return this.httpService.send(this.myspacenxApiUrl  + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize + ((department) ? ('&departments=' + department) : '') + ((practice) ? ('&practices=' + practice) : '') + ((status)? ('&status='+ status) : ('&status=' + defaultStatus)) + ((priority)? ('&priority='+ priority) : ''), 'get', null, header).map(response => response.json());

        /*
        if (status !== "ALL" && priority !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize + '&status=' + status + '&priority=' + priority, 'get', null, header).map(response => response.json());
        }
        else if (status !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize + '&status=' + status, 'get', null, header).map(response => response.json());
        }
        else if (priority !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize + '&priority=' + priority + '&status=' + defaultStatus, 'get', null, header).map(response => response.json());
        }
        else {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize + '&status=' + defaultStatus, 'get', null, header).map(response => response.json());
        }*/
    }
    assignRecruiter = (hiringId: any, assignDetails: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/recruiters', 'post', assignDetails, header).map(response => response);
    }
    getAssignedRecruiters = (hiringId: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/recruiters/' + hiringId, 'get', null, header).map(response => response.json());
    }
}
