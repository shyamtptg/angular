import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../config/app.constants';
import { HttpService } from '../../../../shared/services/http.service';
import { CommonService } from '../../../../shared/services/common.service';

@Injectable()
export class OffersDataService {
    public myspacenxApiUrl: string;
    private tokenDetails: any;
    private authorizationToken: string;
    private hiringQueryBasePath: string;
    private hiringCommandBasePath: string;
    private prospectQueryBasePath: string;
    private prospectCommandBasePath: string;
    public prospectDetails: any = {};
    public hiringDetails: any = {};
    public documentId: string;
    public offerDetails: any = {};
    constructor(private httpService: HttpService, public commonService: CommonService, private appConstants: AppConstants) {}
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
    getAllOffers = (pageNum: number, pageSize: number) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
    }
    getAllOffersByFilters = (pageNum: number, pageSize: number, status: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        if (status !== "ALL") {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers?page=' + pageNum + '&size=' + pageSize + '&statusCodes=' + status, 'get', null, header).map(response => response.json());
        } else {
            return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
        }
    }
    createOffer = (hiringId: string, needId: string, payload: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/offers/', 'post', payload, header).map(response => response);
    }
    loadOffersDataById = (offerId: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers/' + offerId, 'get', null, header).map(response => response.json());
    }
    updateOffer = (hiringId: string, needId: string, offerId: string, offerDetails: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/offers/' + offerId, 'put', offerDetails, header).map(response => response);
    }
    deleteOffer = (hiringId: string, needId: string, offerId: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/offers/' + offerId, 'delete', null, header).map(response => response);
    }
    submitOffer = (hiringId: string, needId: string, offerId: string, opCode: string, payload?: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/offers/' + offerId + '/operation/' + opCode, 'put', ((payload)? payload: null), header).map(response => response);
    }
    byPassCPOApproval = (hiringId: string, needId: string, offerId: string, opCode: string, payload: any) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/offers/' + offerId + '/operation/' + opCode, 'put', payload, header).map(response => response);
    }
    getCTCConfigurations = () => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers/ctcconfigurations', 'get', null, header).map(response => response.json());
    }
    getCTCAddons = () => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers/ctc/addons', 'get', null, header).map(response => response.json());
    }
    downloadOffer = (offerId: string, documentId: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken }, responseType = "ArrayBuffer";
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers/' + offerId + '/documents/' + documentId, 'get', null, header, responseType).map(response => response);
    }
    getOffersByStatus = (pageNum: number, pageSize: number, status: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers?statusCodes=' + status + '&page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
    }
    postComments = (hiringId: string, needId: string, offerId: string, payload: string) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/hiring/requests/' + hiringId + '/needs/' + needId + '/offers/' + offerId + '/comments', 'post', payload, header).map(response => response);
    }
    getCommentsList = (offerId: string, pageNum: number, pageSize: number) => {
        this.setToken();
        var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers/' + offerId + '/comments?page=' + pageNum + '&size=' + pageSize, 'get', null, header).map(response => response.json());
    }
    /* saveFastrackOffer = (payload: any) => {
         var header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken };
         return this.httpService.send(this.myspacenxApiUrl  + this.hiringCommandBasePath + '/fasttrackoffers/', 'post', payload, header).map(response => response);
     }*/
    saveFastrackOffer = (payload: any, fileData: any) => {
        this.setToken();
        let formData: FormData = new FormData();
        fileData && formData.append('resume', fileData, fileData.name);
        formData.append('fasttrackMetadata', new Blob([JSON.stringify(payload)], {
            type: "application/json"
        }));
        var header = { 'Authorization': this.authorizationToken };
        return this.httpService.send(this.myspacenxApiUrl + this.hiringCommandBasePath + '/fasttrackoffers', 'post', formData, header).map(response => response);
    }
    exportOffers = (status: string) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': self.authorizationToken };
        if(status !=="ALL"){
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/offers/exportCsv?statusCodes=' + status, 'get', null, header).map(response => response);
        }else {
            return self.httpService.send(this.myspacenxApiUrl + self.hiringQueryBasePath + '/hiring/requests/offers/exportCsv', 'get', null, header).map(response => response);
        }
    }
    downloadAttachments = (offerId: string, attachmentId: any) => {
        this.setToken();
        var self = this, header = { 'Content-Type': 'application/json', 'Authorization': this.authorizationToken }, responseType = "ArrayBuffer";
        return this.httpService.send(this.myspacenxApiUrl + this.hiringQueryBasePath + '/hiring/requests/offers/' + offerId + '/attachments/' + attachmentId, 'get', null, header, responseType).map(response => response);
    }
}
