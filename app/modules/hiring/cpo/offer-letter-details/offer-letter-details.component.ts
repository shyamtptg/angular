import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OffersDataService } from '../offers/offers.service';
import { Tab } from '../../../../shared/tablist/tab';
import { Tabs } from '../../../../shared/tablist/tabs';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { HiringComponent } from '../../hiring.component';
import { CommonService } from '../../../../shared/services/common.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

var FileSaver = require('filesaver.js-npm');
@Component({
  templateUrl: './offer-letter-details.component.html',
  encapsulation: ViewEncapsulation.None
})
export class OfferLetterDetailsComponent {
  msgs: any = [];
  acceptTitle: string = "Accept";
  rejectTitle: string = "Reject";
  negotiateTitle: string = "Negotiate";
  pdfSrc: any = '';
  pdfData: any;
  docName: any = '';
  offerPayload: any = {};
  commentHistory: Array<any> = [];
  pageNum: number = 0;
  pageSize: number = 20;
  offerId: string;
  offerDetails: any;
  onScrollCallback: any;
  className: string = '';
  attachments: any = [];
  constructor(private dialogService: DialogService,
    private offersDataService: OffersDataService,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private hiringComponent: HiringComponent,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Dashboard / Offer Letter";
    this.onScrollCallback = this.loadTimeLine.bind(this);
  }
  ngOnInit() {
    var self = this;
    self.route.params.subscribe(params => {
      if (params['id']) {
        self.offerId = params['id'];
        self.loaderService.showLoading();
        self.offersDataService.loadOffersDataById(self.offerId).subscribe(data => {
          self.offerDetails = (data ? data : undefined);
          self.attachments = (data['offerAttachments'])?data['offerAttachments'] : [];
          self.offersDataService.offerDetails = {
            "hiringId": data['hiringRequestId'],
            "needId": data['hiringRequestNeedId'],
            "offerId": data['id']
          };
          if (self.offerDetails['id'] && data.documentId) {
            self.docName = data['documentName'];
            self.offersDataService.downloadOffer(self.offerDetails['id'], data.documentId).subscribe(data => {
              self.pdfData = data['_body'];
              self.loaderService.hideLoading();
              var blob = new Blob([data['_body']], { type: 'application/pdf' }),
                url = URL.createObjectURL(blob);
              self.pdfSrc = url;
              var _iFrame = document.createElement('iframe');
              _iFrame.setAttribute('src', url);
              _iFrame.setAttribute('style', 'height:100%;width:100%;');
              _iFrame.setAttribute('title', 'Offer Letter');
              $('#pdf-view').append(_iFrame);
              if(self.isIE()){
                $('#pdf-view').html('<div class="offerLink" style="padding:2em 3em;"><span>Click on<a style="cursor:pointer"> Download Offer </a>to download the offer letter</span></div>');
              }
              $('.offerLink').on('click', function(){
                if(self.pdfData){
                  var blob = new Blob([self.pdfData], { type: "application/octet-stream" });
                  var docName = self.docName || 'offer_letter.pdf';
                  FileSaver.saveAs(blob, docName);
                }
              });
            });
          }
        }, error => {
          self.errorHandleService.handleErrors(error);
        });
      }
    });
  }
  isIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    // other browser
    return false;
  }
  postMessage() {
    var self = this,
      details = this.offersDataService.offerDetails;
    if (details.hiringId && details.needId && details.offerId) {
      this.offersDataService.postComments(details.hiringId, details.needId, details.offerId, this.offerPayload).subscribe(data => {
        if (data.status == 201) {
          self.className = 'show';
          self.offerPayload.comments = '';
          self.offerPayload.isPublic = false;
          setTimeout(() => {
            self.className = '';
          }, 3000);
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  navigateToPrevious() {
    var route = localStorage.getItem('previousRoute');
    route = (route) ? route : '/hiring/offers';
    this.router.navigate([route]);
  }
  tabSelect(currentTab: Tab) {
    var title = currentTab['title'],
      details = this.offersDataService.offerDetails,
      self = this;
    if (title == 'History' && details.offerId) {
        //self.loadTimeLine();
        //self.onScrollCallback = self.loadTimeLine.bind(self);
        this.pageNum = 0;
        this.pageSize = 20;
        this.commentHistory = [];
        this.offersDataService.getCommentsList(this.offerId, this.pageNum, this.pageSize).subscribe(this.processOfferData, this.processError);
    }
  }
  loadTimeLine() {
    return this.offersDataService.getCommentsList(this.offerId, this.pageNum, this.pageSize).do(this.processOfferData, this.processError);
  }
  getTime(date: any) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  getDate(date: any) {
    date = new Date(date);
    return date.toDateString();
  }
  private processOfferData = (data: any) => {
    this.pageNum++;
    this.commentHistory = this.commentHistory.concat(data['content']);
  }
  private processError = (error: any) => {
    this.errorHandleService.handleErrors(error);
  }
  downloadAttachment(offerId: string, attchId: string, title: string){
    if(offerId && attchId && title){
      this.offersDataService.downloadAttachments(offerId, attchId).subscribe(data=>{
        var blob = new Blob([data['_body']], { type: "application/octet-stream" });
        FileSaver.saveAs(blob, title);
      }, error => {
        this.errorHandleService.handleErrors(error);
      });
    }
  }
}