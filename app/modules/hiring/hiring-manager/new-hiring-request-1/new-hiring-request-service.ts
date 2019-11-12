import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../config/app.constants';
import { NewHiringRequestDetails } from '../models/hiring-request-details1';
import { JobDescriptionDetails } from '../models/job-description';
import { HttpService } from '../../../../shared/services/http.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ErrorHandleService } from './../../../../shared/services/errorhandle.service';

@Injectable()
export class NewHiringRequestDataService1 {
    private hiringRequestData: NewHiringRequestDetails;
    private hiringData: NewHiringRequestDetails;
    private jobDescTemplateData: JobDescriptionDetails;
    private hiringComboData: any;
    private interviewPanelMembers: any;
    private hiringManagers: any;
    private hiringRequestUpdateData: any;
    public mode: string;
    public jobDescMode: string;
    public needNum: any;
    public hiringDepId: any;
    public jobDescId: string;
    public myspacenxApiUrl: string;
    private tokenDetails: any;
    private header: any;
    private authorizationToken: string;
    private hiringQueryBasePath: string;
    private hiringCommandBasePath: string;
    private prospectQueryBasePath: string;
    private prospectCommandBasePath: string;
    constructor(
        private httpService: HttpService,
        public commonService: CommonService,
        private appConstants: AppConstants,
        private errorHandleService: ErrorHandleService
    ) {
        this.hiringRequestData = null;
        this.jobDescTemplateData = null;
    }
    setToken() {
        this.myspacenxApiUrl = this.appConstants.getConstants().myspacenxApiUrl;
        this.tokenDetails = this.commonService.getItem('tokenDetails');
        this.authorizationToken = 'Bearer ' + (this.tokenDetails && this.tokenDetails['access_token']);
        this.hiringQueryBasePath = this.appConstants.getConstants().hiringQueryBasePath;
        this.hiringCommandBasePath = this.appConstants.getConstants().hiringCommandBasePath;
        this.prospectQueryBasePath = this.appConstants.getConstants().prospectQueryBasePath;
        this.prospectCommandBasePath = this.appConstants.getConstants().prospectCommandBasePath;
    }
    private setHeader() {
        this.setToken();
        this.header = {
            'Content-Type': 'application/json',
            'Authorization': this.authorizationToken
        };
    }

    loadHiringComboData = () => {
        this.setHeader();

        this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/seeddata',
            'get',
            null,
            this.header
        ).map(
            response => response.json()
        ).subscribe(data => {
            this.hiringComboData = data;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    loadPanelMembers = () => {
        this.setHeader();

        const panelMemberEndpoint = '/api/core/employees/search/findEmployeesByRole?roleName=Interviewer&projection=employeeprojection';
        this.httpService.send(
            this.myspacenxApiUrl + panelMemberEndpoint,
            'get',
            null,
            this.header
        ).map(response => response.json()
        ).subscribe(data => {
            this.interviewPanelMembers = data;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    loadHiringManagers = () => {
        this.setHeader();

        const hiringManagerEndpoint = '/api/core/employees/search/findEmployeesByRole?roleName=Hiring Manager&projection=employeeprojection';
        this.httpService.send(
            this.myspacenxApiUrl + hiringManagerEndpoint,
            'get',
            null,
            this.header
        ).map(response => response.json()
        ).subscribe(data => {
            this.hiringManagers = data;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    getInterviewPanelMembers = () => {
        return (this.interviewPanelMembers) ? Object.assign({}, this.interviewPanelMembers) : undefined;
    }
    getHiringManagerData = () => {
        return (this.hiringManagers) ? Object.assign({}, this.hiringManagers) : undefined;
    }
    getDepartmentMap = () => {
        const depObj = {},
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
        const pracObj = {},
            compInPrac = {},
            result = {};
        let practices: any = [];
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
        const clientObj = {};
        this.hiringComboData && this.hiringComboData['CLIENT'].forEach(function (element: any, index: any) {
            clientObj[element['id']] = element['clientName'];
        });
        return clientObj;
    }
    getHiringCombos = () => {
        return (this.hiringComboData) ? Object.assign({}, this.hiringComboData) : undefined;
    }
    getHiringComboDetails = () => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/seeddata',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getAllCombos = () => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/seeddata',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getPanelMembers = () => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + '/api/core/employees/search/findEmployeesByRole?roleName=Interviewer&projection=employeeprojection',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getListData = (listName: string) => {
        this.setHeader();
        let role: string;
        if (listName.toLocaleLowerCase() === 'interview_panel_list') {
            role = 'Interviewer';
        } else if (listName.toLocaleLowerCase() === 'profile_screening_list') {
            role = 'Profile Screening Committee';
        }

        return this.httpService.send(
            this.myspacenxApiUrl + '/api/core/employees/search/findEmployeesByRole?roleName=' + role + '&projection=employeeprojection',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getHiringManagers = () => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + '/api/core/employees/search/findEmployeesByRole?roleName=Hiring Manager&projection=employeeprojection',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    loadHiringRequestData = () => {
        const data = require('../models/hiringRequestInitialData1.json');
        this.hiringRequestData = <NewHiringRequestDetails>data;
    }
    loadHiringRequestDataById = (id: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/' + id,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    loadHiringRequestDataByIdandNeed = (id: string, needId: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/' + id + '/needs/' + needId,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    saveHiringRequestDetails = (hiringRequestDetails: any) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests',
            'post',
            hiringRequestDetails,
            this.header
        ).map(response => response);
    }
    saveHiringRequestNeedDetails = (hiringNeedDetails: any, hiringId: any) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs',
            'post',
            hiringNeedDetails,
            this.header
        ).map(response => response);
    }
    updateHiringRequestNeedDetails = (hiringNeedDetails: any, hiringId: any, needId: any) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId,
            'put',
            hiringNeedDetails,
            this.header
        ).map(response => response);
    }
    deleteHiringRequestNeedDetails = (hiringId: any, needId: any) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId,
            'delete',
            null,
            this.header
        ).map(response => response);
    }
    updateHiringRequest = (hiringDetails: any, hiringId: any) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId,
            'put',
            hiringDetails,
            this.header
        ).map(response => response);
    }
    submitHiringRequest = (hiringId: string, opCode: string, payload?: any) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/operation/' + opCode,
            'put',
            ((payload) ? payload : null),
            this.header
        ).map(response => response);
    }
    deleteHiringReuest = (hiringId: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId,
            'delete',
            null,
            this.header
        ).map(response => response);
    }
    getHiringRequestUpdateData = () => {
        return (this.hiringRequestUpdateData) ? Object.assign({}, this.hiringRequestUpdateData) : undefined;
    }
    getHiringRequestData = () => {
        return (this.hiringRequestData) ? Object.assign({}, this.hiringRequestData) : undefined;
    }
    updateHiringDetailsData = (detailsFrmHiringRequestData: any) => {
        this.hiringData = detailsFrmHiringRequestData;
    }
    getHiringSummaryData = () => {
        return (this.hiringRequestData) ? Object.assign({}, this.hiringRequestData) : undefined;
    }
    getAllHiringRequests = (pageNum: number, pageSize: number) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getAllHiringRequestsByFilters = (pageNum: number, pageSize: number, status: string, priority: string, department?: string, practice?: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize + ((department) ? ('&departments=' + department) : '') + ((practice) ? ('&practices=' + practice) : '') + ((status) ? ('&status=' + status) : '') + ((priority) ? ('&priority=' + priority) : ''),
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getMyHiringRequests = (pageNum: number, pageSize: number) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/me?page=' + pageNum + '&size=' + pageSize,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getMyHiringRequestsByFilters = (pageNum: number, pageSize: number, status: string, priority: string, department?: string, practice?: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/me?page=' + pageNum + '&size=' + pageSize + ((department) ? ('&departments=' + department) : '') + ((practice) ? ('&practices=' + practice) : '') + ((status) ? ('&status=' + status) : '') + ((priority) ? ('&priority=' + priority) : ''),
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    /*getAssignedHiringRequests = (pageNum: number, pageSize: number) => {
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl  + this.hiringQueryBasePath + '/hiring/requests/assigned?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
    }*/
    getAssignedHiringRequestsByFilters = (pageNum: number, pageSize: number, status: string, priority: string, department?: string, practice?: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/assigned?page=' + pageNum + '&size=' + pageSize + ((department) ? ('&departments=' + department) : '') + ((practice) ? ('&practices=' + practice) : '') + ((status) ? ('&status=' + status) : '') + ((priority) ? ('&priority=' + priority) : ''),
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    exportMyHiringRequestsByFilters = (status: string, priority: string, department?: string, practice?: string) => {
        this.setHeader();

        let request = ((department) ? ('&departments=' + department) : '') + ((practice) ? ('&practices=' + practice) : '') + ((status) ? ('&status=' + status) : '') + ((priority) ? ('&priority=' + priority) : '');
        request = (request) ? (request.substr(1)) : '';
        request = (request) ? ('?' + request) : '';
        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/me/exportCsv' + request,
            'get',
            null,
            this.header
        ).map(response => response);
    }
    exportAllHiringRequestsByFilters = (status: string, priority: string, department?: string, practice?: string) => {
        this.setHeader();

        let request = ((department) ? ('&departments=' + department) : '') + ((practice) ? ('&practices=' + practice) : '') + ((status) ? ('&status=' + status) : '') + ((priority) ? ('&priority=' + priority) : '');
        request = (request) ? (request.substr(1)) : '';
        request = (request) ? ('?' + request) : '';
        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/all/exportCsv' + request,
            'get',
            null,
            this.header
        ).map(response => response);
    }
    exportAssignedHiringRequestsByFilters = (status: string, priority: string, department?: string, practice?: string) => {
        this.setHeader();

        let request = ((department) ? ('&departments=' + department) : '') + ((practice) ? ('&practices=' + practice) : '') + ((status) ? ('&status=' + status) : '') + ((priority) ? ('&priority=' + priority) : '');
        request = (request) ? (request.substr(1)) : '';
        request = (request) ? ('?' + request) : '';
        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/assigned/exportCsv' + request,
            'get',
            null,
            this.header
        ).map(response => response);
    }
    loadJobDescTempData = () => {
        const data = require('../models/jobDescription.json');
        this.jobDescTemplateData = (data) ? <JobDescriptionDetails>data : undefined;
    }
    loadJobDescriptionDataById = (jobDescId: any) => {
        this.setHeader();

        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/jobdescriptions/' + jobDescId,
            'get',
            null,
            this.header
        ).map(response => response);
    }
    getJobDescriptionTemplateData = () => {
        return (this.jobDescTemplateData) ? Object.assign({}, this.jobDescTemplateData) : undefined;
    }
    getJobDescTempData = () => {
        const data = require('../models/jobDescription.json');
        return (data) ? Object.assign({}, data) : undefined;
    }
    saveJobDescriptionDetails = (jobDescDetails: any) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/jobdescriptions',
            'post',
            jobDescDetails,
            this.header
        ).map(response => response);
    }
    updateJobDescriptionDetails = (jobDescDetails: any, jobDescId: any) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/jobdescriptions/' + jobDescId,
            'put',
            jobDescDetails,
            this.header
        ).map(response => response);
    }
    getAllJobDescriptions = (pageNum: number, pageSize: number) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/jobdescriptions?page=' + pageNum + '&size=' + pageSize,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getAllJobDescriptionsByFilters = (pageNum: number, pageSize: number, departmentId: string, practiceId: string, isDeprecated: boolean) => {
        this.setHeader();

        if (departmentId && practiceId) {
            return this.httpService.send(
                this.myspacenxApiUrl + this.hiringQueryBasePath + '/jobdescriptions/all?page=' + pageNum + '&size=' + pageSize + '&deprecated=' + isDeprecated + '&departments=' + departmentId + '&practices=' + practiceId,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (departmentId) {
            return this.httpService.send(
                this.myspacenxApiUrl + this.hiringQueryBasePath + '/jobdescriptions/all?page=' + pageNum + '&size=' + pageSize + '&deprecated=' + isDeprecated + '&departments=' + departmentId,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else {
            return this.httpService.send(
                this.myspacenxApiUrl + this.hiringQueryBasePath + '/jobdescriptions/all?page=' + pageNum + '&size=' + pageSize + '&deprecated=' + isDeprecated,
                'get',
                null,
                this.header
            ).map(response => response.json());
        }
    }
    loadJobDescriptionTemplateName = (depId: any, pracId: any, pageNum: number, pageSize: number) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/jobdescriptions/templatenames?practiceId=' + pracId + '&departmentId=' + depId + '&deprecated=false' + '&page=' + pageNum + '&size=' + pageSize,
            'get',
            null,
            this.header
        ).map(response => response);
    }
    startHiringRequest = (hiringId: string, opCode: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/operation/' + opCode,
            'put',
            null,
            this.header
        ).map(response => response);
    }
    getAllProfilesByHiringId = (id: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?hiringRequestId=' + id,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getAllProfilesByHiringIdAndNeed = (id: string, needId: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?hiringRequestId=' + id + '&needId=' + needId,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getAllProfilesByFilters = (pageNum: number, pageSize: number, noticePeriod: string, status: string) => {
        this.setHeader();

        if (status !== 'ALL' && noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&statusCodes=' + status + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (status !== 'ALL') {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&statusCodes=' + status,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize,
                'get',
                null,
                this.header
            ).map(response => response.json());
        }
    }
    getAllProfilesByHiringIdAndFilters = (pageNum: number, pageSize: number, id: string, noticePeriod: string, status: string) => {
        this.setHeader();

        if (status !== 'ALL' && noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&hiringRequestId=' + id + '&statusCodes=' + status + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (status !== 'ALL') {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&hiringRequestId=' + id + '&statusCodes=' + status,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&hiringRequestId=' + id + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&hiringRequestId=' + id,
                'get',
                null,
                this.header
            ).map(response => response.json());
        }
    }
    getAllProfilesByHiringIdAndNeedAndFilters = (pageNum: number, pageSize: number, id: string, needId: string, noticePeriod: string, status: string) => {
        this.setHeader();

        if (status !== 'ALL' && noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&hiringRequestId=' + id + '&needId=' + needId + '&statusCodes=' + status + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (status !== 'ALL') {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&hiringRequestId=' + id + '&needId=' + needId + '&statusCodes=' + status,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&hiringRequestId=' + id + '&needId=' + needId + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else {
            return this.httpService.send(
                this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/screening?page=' + pageNum + '&size=' + pageSize + '&hiringRequestId=' + id + '&needId=' + needId,
                'get',
                null,
                this.header
            ).map(response => response.json());
        }
    }
    getNeedsByHiringId = (hiringId: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/' + hiringId + '/needs/purpose',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    updateProfileStatus = (profileId: string, opCode: string, payload: any) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.prospectCommandBasePath + '/prospects/' + profileId + '/operation/' + opCode,
            'put',
            payload,
            this.header
        ).map(response => response);
    }
    getMetrics = (year: any, quarter: any, month: any, practiceId: any) => {
        this.setHeader();

        if (year) {
            if (!quarter && !month && !practiceId) {
                return this.httpService.send(
                    this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/dashboardMetrics?year=' + year,
                    'get',
                    null,
                    this.header
                ).map(response => response.json());
            } else {
                if (month) {
                    if (practiceId) {
                        return this.httpService.send(
                            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/dashboardMetrics?year=' + year + '&month=' + month + '&practiceId=' + practiceId,
                            'get',
                            null,
                            this.header
                        ).map(response => response.json());
                    } else {
                        return this.httpService.send(
                            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/dashboardMetrics?year=' + year + '&month=' + month,
                            'get',
                            null,
                            this.header
                        ).map(response => response.json());
                    }
                } else {
                    if (quarter) {
                        if (practiceId) {
                            return this.httpService.send(
                                this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/dashboardMetrics?year=' + year + '&quarter=' + quarter + '&practiceId=' + practiceId,
                                'get',
                                null,
                                this.header
                            ).map(response => response.json());
                        } else {
                            return this.httpService.send(
                                this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/dashboardMetrics?year=' + year + '&quarter=' + quarter,
                                'get',
                                null,
                                this.header
                            ).map(response => response.json());
                        }
                    } else {
                        return this.httpService.send(
                            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/dashboardMetrics?year=' + year + '&practiceId=' + practiceId,
                            'get',
                            null,
                            this.header
                        ).map(response => response.json());
                    }
                }
            }
        }
    }
    getPractices = () => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + '/api/core/departments',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    loadProspectDataById = (id: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.prospectQueryBasePath + '/prospects/' + id,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getHiringTimeline = (hiringId: string, pageNum: number, pageSize: number) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/' + hiringId + '/timeline?page=' + pageNum + '&size=' + pageSize,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getOpenHiringRequests = (pageNum: number, pageSize: number) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/public/all?page=' + pageNum + '&size=' + pageSize,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    applyRequest = (hiringId: string, needId: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/apply',
            'post',
            null,
            this.header
        ).map(response => response);
    }

    /*
    * Gets the statistics about a hiring request
    * @param hiringId: hiring request id
    */
    getHiringRequestDetails = (hiringId: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/' + hiringId + '/stats',
            'get',
            null,
            this.header
        ).map(response => response);
    }

    /*
    * Marks a hiring request as completed
    * @param hiringId: hiring request id
    */
    closeHiringRequest = (hiringId: string) => {
        this.setHeader();

        return this.httpService.send(
            this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/operation/COMPLETE',
            'put',
            null,
            this.header
        ).map(response => response);
    }
}
