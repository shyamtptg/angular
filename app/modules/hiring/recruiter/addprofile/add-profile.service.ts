import { Injectable } from '@angular/core';
import { ProfileDetails } from '../models/ProfileDetails';
import { Subject } from 'rxjs/Subject';
import { AppConstants } from '../../../../config/app.constants';
import { HttpService } from '../../../../shared/services/http.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Injectable()
export class AddProfileDataService {
    public ProspectData: ProfileDetails;
    public mode: string;
    public profileId: string;
    public apiUrl: string;
    public fileData: any;
    public hiringComboData: any;
    private prospectsComboData: any;
    private hiringRequestData: any;
    private tokenDetails: any;
    private authorizationToken: string;
    private hiringQPath: string;
    private hiringCPath: string;
    private prospectQPath: string;
    private prospectCPath: string;
    public personalForm: any;
    public personalFormSaved: boolean = false;
    public professionalFormSaved: boolean = false;
    public professionalForm: any;
    public prospectData: any;
    public documentMap: any = {};
    public attachmentMap: any = {};
    public docLength: any;
    public attachLength: any;
    public payslipDocs: any = [];
    private notify = new Subject<any>();
    private header: object = {};
    notifyObservable$ = this.notify.asObservable();
    constructor(
        private httpService: HttpService,
        public commonService: CommonService,
        private appConstants: AppConstants,
        private errorHandleService: ErrorHandleService
    ) {
        this.ProspectData = null;
    }
    setToken() {
        this.apiUrl = this.appConstants.getConstants().myspacenxApiUrl;
        this.tokenDetails = this.commonService.getItem('tokenDetails');
        this.authorizationToken = 'Bearer ' + (this.tokenDetails && this.tokenDetails['access_token']);
        this.hiringQPath = this.apiUrl + this.appConstants.getConstants().hiringQueryBasePath;
        this.hiringCPath = this.apiUrl + this.appConstants.getConstants().hiringCommandBasePath;
        this.prospectQPath = this.apiUrl + this.appConstants.getConstants().prospectQueryBasePath;
        this.prospectCPath = this.apiUrl + this.appConstants.getConstants().prospectCommandBasePath;
        this.header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
    }
    loadHiringComboData = () => {
        this.setToken();
        this.httpService.send(
            this.hiringQPath + '/hiring/seeddata',
            'get',
            null,
            this.header
        ).map(response => response.json()).subscribe(data => {
            this.hiringComboData = data;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    loadProspectComboData = () => {
        this.setToken();
        this.httpService.send(
            this.prospectQPath + '/prospects/seeddata',
            'get',
            null,
            this.header
        ).map(response => response.json()).subscribe(data => {
            this.prospectsComboData = data;
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    getHiringCombos = () => {
        return (this.hiringComboData) ? Object.assign({}, this.hiringComboData) : undefined;
    }
    getProspectCombos = () => {
        return (this.prospectsComboData) ? Object.assign({}, this.prospectsComboData) : undefined;
    }
    getProspectComboDetails = () => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/seeddata',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getHiringComboDetails = () => {
        this.setToken();
        return this.httpService.send(
            this.hiringQPath + '/hiring/seeddata',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getHiringRequestData = () => {
        return (this.hiringRequestData) ? Object.assign({}, this.hiringRequestData) : undefined;
    }
    getAllHiringRequests = (pageNum: number, pageSize: number) => {
        this.setToken();
        return this.httpService.send(
            this.hiringQPath + '/hiring/requests?page=' + pageNum + '&size=' + pageSize,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getHiringRequests = (pageNum: number, pageSize: number) => {
        this.setToken();
        return this.httpService.send(
            this.hiringQPath + '/hiring/requests/all?page=' + pageNum + '&size=' + pageSize,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getNeedsByHiringId = (hiringId: string) => {
        this.setToken();
        return this.httpService.send(
            this.hiringQPath + '/hiring/requests/' + hiringId + '/needs/purpose',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    downloadResume = (prospectId: string, documentId: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/' + prospectId + '/documents/' + documentId,
            'get',
            null,
            this.header,
            'ArrayBuffer'
        ).map(response => response);
    }
    getSkillsMap = () => {
        const skillsCat = {},
            skills = {},
            result = {};
        if (this.hiringComboData) {
            this.hiringComboData['SKILL_CATEGORY'].forEach(function (element: any, index: any) {
                skillsCat[element['id']] = element['name'];
                skills[element['id']] = element['skills'];
            });
        }
        result['skillCatNames'] = skillsCat;
        result['skills'] = skills;
        return result;
    }
    loadProspectDataById = (id: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/' + id,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getVerficationDetails = (id: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/' + id + '/verificationdetails',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    updateProspectVerfication = (id: string, verificationData: any, opCode: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectCPath + '/prospects/' + id + '/operation/' + opCode,
            'put',
            verificationData,
            { 'Authorization': this.authorizationToken }
        ).map(response => response);
    }
    getProfileData = () => {
        const data = require('../models/profileData.json');
        return (data) ? Object.assign({}, data) : undefined;
    }
    getProspectData = () => {
        let Prospectdata: any;
        if (this.ProspectData) {
            Prospectdata = this.ProspectData;
        }
        return Prospectdata;
    }
    getSkillData = () => {
        return (this.ProspectData) ? Object.assign({}, this.ProspectData) : undefined;
    }
    getProfessionalData = () => {
        return (this.ProspectData) ? Object.assign({}, this.ProspectData) : undefined;
    }
    getPersonalData = () => {
        return (this.ProspectData) ? Object.assign({}, this.ProspectData) : undefined;
    }
    updateAddProfileData = (addprofiledata: any) => {
        const tempaddprofiledata = this.ProspectData;
        tempaddprofiledata['hiringRequestId'] = addprofiledata['hiringRequestId'];
        tempaddprofiledata['hiringRequestNeedId'] = addprofiledata['hiringRequestNeedId'];
        this.ProspectData = tempaddprofiledata;
    }
    updateProspectSkillData = (skilldata: any) => {
        const tempupdprospectdata = this.ProspectData;
        tempupdprospectdata['skillSets'] = skilldata['skillSets'];
    }
    updateProspectPersonalData = (personaldata: any) => {
        let tempupdprospectdata = this.ProspectData;
        personaldata['hiringRequestId'] = tempupdprospectdata['hiringRequestId'];
        personaldata['hiringRequestNeedId'] = tempupdprospectdata['hiringRequestNeedId'];
        tempupdprospectdata = personaldata;
        this.ProspectData = tempupdprospectdata;
    }
    updateProspectProfessionalData = (professionaldata: any, fileData: any) => {
        let tempupdprospectdata = this.ProspectData;
        tempupdprospectdata = professionaldata;
        this.ProspectData = tempupdprospectdata;
        this.fileData = fileData;
    }
    saveProspectData = (ProspectData: any) => {
        this.setToken();
        const formData: FormData = new FormData();
        if (this.fileData) {
            formData.append('resume', this.fileData, this.fileData.name);
        }
        formData.append('prospectMetadata', new Blob([JSON.stringify(ProspectData)], {
            type: 'application/json'
        }));
        return this.httpService.send(
            this.prospectCPath + '/prospects',
            'post',
            formData,
            { 'Authorization': this.authorizationToken }
        ).map(response => response);
    }
    updateProspectData = (ProspectData: any, id: any) => {
        this.setToken();
        const formData: FormData = new FormData();
        if (this.fileData) {
            formData.append('resume', this.fileData, this.fileData.name);
        }
        formData.append('prospectMetadata', new Blob([JSON.stringify(ProspectData)], {
            type: 'application/json'
        }));
        return this.httpService.send(
            this.prospectCPath + '/prospects/' + id,
            'post',
            formData,
            { 'Authorization': this.authorizationToken }
        ).map(response => response);
    }
    getAllProfilesByHiringId = (pageNum: number, pageSize: number, id: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getAllProfilesByHiringIdAndNeed = (pageNum: number, pageSize: number, id: string, needId: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&needIds=' + needId,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getAllProfilesByHiringIdAndFilters = (pageNum: number, pageSize: number, id: string, noticePeriod: string, status: string) => {
        this.setToken();
        if (status !== 'ALL' && noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&statusCodes=' + status + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (status !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&statusCodes=' + status,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id,
                'get',
                null,
                this.header
            ).map(response => response.json());
        }
    }
    getAllProfilesByHiringIdAndNeedAndFilters = (pageNum: number, pageSize: number, id: string, needId: string, noticePeriod: string, status: string) => {
        this.setToken();
        if (status !== 'ALL' && noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&needIds=' + needId + '&statusCodes=' + status + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (status !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&needIds=' + needId + '&statusCodes=' + status,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&needIds=' + needId + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&needIds=' + needId,
                'get',
                null,
                this.header
            ).map(response => response.json());
        }
    }
    getAllProfilesByFilters = (pageNum: number, pageSize: number, noticePeriod: string, status: string) => {
        this.setToken();
        if (status !== 'ALL' && noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&statusCodes=' + status + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (status !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&statusCodes=' + status,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else if (noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response.json());
        } else {
            return this.httpService.send(
                this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize,
                'get',
                null,
                this.header
            ).map(response => response.json());
        }
    }
    exportAllProfilesByHiringIdAndFilters = (id: string, noticePeriod: string, status: string) => {
        this.setToken();
        if (status !== 'ALL' && noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/exportCsv?requestIds=' + id + '&statusCodes=' + status + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response);
        } else if (status !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/exportCsv?requestIds=' + id + '&statusCodes=' + status,
                'get',
                null,
                this.header
            ).map(response => response);
        } else if (noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/exportCsv?requestIds=' + id + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response);
        } else {
            return this.httpService.send(
                this.prospectQPath + '/prospects/exportCsv?requestIds=' + id,
                'get',
                null,
                this.header
            ).map(response => response);
        }
    }
    exportAllProfilesByHiringIdAndNeedAndFilters = (id: string, needId: string, noticePeriod: string, status: string) => {
        this.setToken();
        if (status !== 'ALL' && noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/exportCsv?requestIds=' + id + '&needIds=' + needId + '&statusCodes=' + status + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response);
        } else if (status !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/exportCsv?requestIds=' + id + '&needIds=' + needId + '&statusCodes=' + status,
                'get',
                null,
                this.header
            ).map(response => response);
        } else if (noticePeriod !== 'ALL') {
            return this.httpService.send(
                this.prospectQPath + '/prospects/exportCsv?requestIds=' + id + '&needIds=' + needId + '&noticePeriods=' + noticePeriod,
                'get',
                null,
                this.header
            ).map(response => response);
        } else {
            return this.httpService.send(
                this.prospectQPath + '/prospects/exportCsv?requestIds=' + id + '&needIds=' + needId,
                'get',
                null,
                this.header
            ).map(response => response);
        }
    }
    getAllProfilesByHiringIdAndStatus = (pageNum: number, pageSize: number, id: string, status: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&statusCodes=' + status,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getAllProfilesByHiringIdAndNeedAndStatus = (pageNum: number, pageSize: number, id: string, needId: string, status: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/all?page=' + pageNum + '&size=' + pageSize + '&requestIds=' + id + '&needIds=' + needId + '&statusCodes=' + status,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getReferrals = () => {
        this.setToken();
        return this.httpService.send(
            this.apiUrl + '/api/core/employees?projection=employeeprojection',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getReferralDetailsById = (referralId: any) => {
        this.setToken();
        return this.httpService.send(
            this.apiUrl + '/api/core/employees/' + referralId + '?projection=employeeprojection',
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    uploadDocumentData = (documentType: string, fileData: any, prospectId: string) => {
        this.setToken();
        const formData: FormData = new FormData();
        if (fileData) {
            formData.append('uploadedFile', fileData, fileData.name);
        }
        formData.append('documentType', documentType);
        return this.httpService.send(
            this.prospectCPath + '/prospects/' + prospectId + '/documents/sensitive',
            'post',
            formData,
            { 'Authorization': this.authorizationToken }
        ).map(response => response);
    }
    deleteDocumentData = (prospectId: string, documentId: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectCPath + '/prospects/' + prospectId + '/documents/sensitive/' + documentId,
            'delete',
            null,
            { 'Authorization': this.authorizationToken }
        ).map(response => response);
    }
    deleteResumeData = (prospectId: string, documentId: string) => {
        this.setToken();
        return this.httpService.send(
            this.prospectCPath + '/prospects/' + prospectId + '/documents/' + documentId,
            'delete',
            null,
            { 'Authorization': this.authorizationToken }
        ).map(response => response);
    }
    createDocumentMap = (documents: any) => {
        const self = this;
        self.payslipDocs = [];
        self.documentMap = [];
        if (documents) {
            documents.forEach(function (elem: any, ind: any) {
                if (elem.documentType.code === 'OTHERS') {
                    self.payslipDocs.push(elem);
                }
            });
        }
        self.docLength = self.payslipDocs.length;
        self.payslipDocs.forEach(function (elem: any, ind: any) {
            self.documentMap['OTHERS' + (ind + 1)] = elem;
        });
    }
    uploadAttachment = (hiringId: any, needId: any, offerId: any, fileData: any) => {
        this.setToken();
        const formData: FormData = new FormData();
        if (fileData) {
            formData.append('offer_attachment', fileData, fileData.name);
        }
        return this.httpService.send(
            this.hiringCPath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/offers/' + offerId + '/attachments',
            'post',
            formData,
            { 'Authorization': this.authorizationToken }
        ).map(response => response);
    }
    deleteAttachment = (hiringId: any, needId: any, offerId: any, attachmentId: any) => {
        this.setToken();
        return this.httpService.send(
            this.hiringCPath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/offers/' + offerId + '/attachments/' + attachmentId,
            'delete',
            null,
            { 'Authorization': this.authorizationToken }
        ).map(response => response);
    }
    createAttachmentMap = (attachments: any) => {
        const self = this;
        let attachmentCount: any;
        self.attachmentMap = [];
        attachmentCount = 0;
        if (attachments) {
            attachments.forEach(function (elem: any, ind: any) {
                self.attachmentMap['OTHERS' + (ind + 1)] = elem;
                attachmentCount++;
            });
        }
        self.attachLength = attachmentCount;
    }
    notifyAttachments = (data: any) => {
      if (data) {
        this.notify.next(data);
      }
    }
    getEmployees = (query: any, pageNum: number, pageSize: number) => {
        this.setToken();
        return this.httpService.send(
            this.apiUrl + '/api/core/employees/search?searchString=' + query + '&page=' + pageNum + '&size=' + pageSize,
            'get',
            null,
            this.header
        ).map(response => response.json());
    }
    getExistingProfileByEmail = (emailId: any) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/search/findByEmail?email=' + emailId,
            'get',
            null,
            this.header
        ).map(response => response);
    }
    getExistingProfileByMobile = (mobileNo: any) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/search/findByMobileNumber?mobileNumber=' + mobileNo,
            'get',
            null,
            this.header
        ).map(response => response);
    }
    getExistingProfileByCitizenIdentity = (citizenIdentityType: any, citizenIdentity: any) => {
        this.setToken();
        return this.httpService.send(
            this.prospectQPath + '/prospects/search/findByCitizenIdentity?citizenIdentity=' + citizenIdentity + '&citizenIdentityType=' + citizenIdentityType,
            'get',
            null,
            this.header
        ).map(response => response);
    }
}
