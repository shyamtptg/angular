
import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../hiring.component';
import { OffersDataService } from '../../cpo/offers/offers.service';
import { AddProfileDataService } from '../../recruiter/addprofile/add-profile.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { Subscription } from 'rxjs/Subscription';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './offerletter-details.component.html'
})

export class HRManagerOfferLetterDetails {
  comboData: any = {};
  offerDetails: any = {};
  hiringDetails: any = {};
  prospectName: string;
  relevantExp: any;
  totalExp: any;
  offerId: string;
  successMessage: string;
  editMode: boolean = false;
  configList: any = [];
  desigSuffix: any;
  annexure: any = {'value': ''};
  addons: any;
  paymentPeriods: any;
  lineItems: any = [];
  paymentPeriodMap: any = [];
  ctcToWord: string;
  reportingTime: string;
  today: any;
  yesterday: any;
  currentDoj: any;
  selectedDate: any;
  public readonly: boolean = false;
  public offerexpirydate: boolean = true;
  constructor(
    private hiringComponent: HiringComponent,
    private addProfileDataService: AddProfileDataService,
    private offersDataService: OffersDataService,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Offers / Prospective Hires / Offer Letter Details";
    this.today = new Date();
    this.selectedDate = new Date();
    this.currentDoj = new Date();
  }
  ngOnInit() {
    var hiringCombos = this.addProfileDataService.getHiringCombos(), self = this;
    self.route.params.subscribe(params => {
      if (hiringCombos) {
        this.comboData = {
          'workLocation': hiringCombos['CLIENT'],
          'designation': hiringCombos['DESIGNATION']
        };
        self.loadDetails(params);
      } else {
        self.addProfileDataService.getHiringComboDetails().subscribe(data => {
          if (data) {
            self.comboData = {
              'workLocation': data['CLIENT'],
              'designation': data['DESIGNATION']
            };
          }
          self.loadDetails(params);
        }, error => {
          self.errorHandleService.handleErrors(error);
        });
      }
    });

  }
  restrictNumeric = function (e: any) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }
  loadDetails(params: any) {
    var self = this;
    if (params['id']) {
      self.offerId = params['id'];
      let currentUrl = this.router.url.match("hiring/offers/view"); 
      if(currentUrl && currentUrl.length){
        this.readonly = true;
      }
      self.editMode = true;
      self.offersDataService.loadOffersDataById(self.offerId).subscribe(data => {
        self.offerDetails = (data ? data : undefined);
        //self.configList[0] = data.configurationSettings && JSON.parse(data.configurationSettings);
        self.offersDataService.getCTCAddons().subscribe(res => {
          self.addons = res['addons'];
          self.paymentPeriods = res['paymentPeriods'];
          self.lineItems = self.createLineItems(res['addons']['lineItems']);
          self.paymentPeriodMap = self.createPaymentMap(res['paymentPeriods']);
          var configSettings:any = data.configurationSettings && JSON.parse(data.configurationSettings);
          self.configList = configSettings.lineItems;
          self.desigSuffix = configSettings.designationSuffix;
          self.annexure['value'] = configSettings.annexure;
        }, error => {
          self.errorHandleService.handleErrors(error);
        });
        self.hiringDetails = {
          'hiringId': data.hiringRequestId,
          'hiringNeedId': data.hiringRequestNeedId,
          'prospectId': data.prospectId
        };
        self.offerDetails.expecJoiningDate = new Date(data.expectedJoiningDate);
        self.offerDetails.expDate = new Date(data.expiryDate);
        self.prospectName = data.prospectName;
        self.reportingTime = data.reportingTime;
        self.relevantExp = data.relevantExperienceInYears;
        self.totalExp = data.totalExperienceInYears;
        self.addProfileDataService.createAttachmentMap(data.offerAttachments);
        self.addProfileDataService.notifyAttachments({option: 'loadAttachments', value: 'From child'});
      }, error => { });
    } else if(params['prospectId']){
      self.hiringDetails = {
        'hiringId': params['reqId'],
        'hiringNeedId': params['needId'],
        'prospectId': params['prospectId']
      };
      self.editMode = false;
      self.reportingTime = "10:00 am";
      self.offerDetails.reportingTime = "10:00 am";
      self.offerDetails.signature =self.commonService.hrSignature;
      self.offerDetails.officeAddress = self.commonService.officeAddress;
      var prospectDetails = self.offersDataService.prospectDetails;
      if(prospectDetails && prospectDetails.prospectName){
        self.prospectName = prospectDetails.prospectName;
        self.relevantExp = prospectDetails.relevantExp;
        self.totalExp = prospectDetails.totalExp;
        self.getCTCDetails();
      }else{
        self.addProfileDataService.loadProspectDataById(params['prospectId']).subscribe(data=>{
          self.prospectName = data.displayName;
          self.relevantExp = data.relevantExperienceInYears;
          self.totalExp = data.totalExperienceInYears;
          self.getCTCDetails();
        });
      }
    }
  }
  getCTCDetails(){
    var self = this;
    self.offersDataService.getCTCAddons().subscribe(data => {
      self.addons = data['addons'];
      self.paymentPeriods = data['paymentPeriods'];
      self.lineItems = self.createLineItems(data['addons']['lineItems']);
      self.paymentPeriodMap = self.createPaymentMap(data['paymentPeriods']);
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
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
    this.offerDetails.reportingTime = strTime;
    // return strTime;
  }
  onBlurMethod(event: any) {
    this.offerexpirydate = false;
    this.currentDoj = new Date(event);
    this.yesterday = new Date(event);
    this.yesterday  = new Date(this.yesterday.setDate(this.offerDetails.expecJoiningDate.getDate() - 1));
    /*if (this.offerDetails.expDate && this.offerDetails.expDate.getDate() > this.offerDetails.expecJoiningDate.getDate()) {
      this.offerDetails.expDate = null;
    }*/
    this.offerDetails.expDate = null;
    setTimeout(() => this.offerexpirydate = true, 300);
  }
  setDatesForExpiry(event: any){
    if(this.offerDetails.expecJoiningDate){
      this.yesterday = this.currentDoj;
      this.yesterday  = new Date(this.yesterday.setDate(this.offerDetails.expecJoiningDate.getDate() - 1));
    }
  }
  checkExpiryDate() {
    var offerDetails: any = this.offerDetails, self = this;
    if (offerDetails.expiryGracePeriod && offerDetails.expecJoiningDate && offerDetails.expDate) {
      var graceDays = offerDetails.expiryGracePeriod, joiningDate = new Date(self.getDateString(offerDetails.expecJoiningDate)), expiryDate = offerDetails.expDate;
      var maxExpiry = new Date(self.getDateString(expiryDate));
      maxExpiry.setDate(maxExpiry.getDate() + parseInt(graceDays));
      if (maxExpiry.getTime() > joiningDate.getTime()) {
        offerDetails.expiryGracePeriod = '';
        self.dialogService.render(
          [{
              title: 'Error',
              message: 'Offer Expiry Date and Expiry Grace period combination should not exceed the Date of Joining',
              yesLabel: 'OK'
          }]
      );
      }
    }
  }
  restrictCharcters(value:any){
    if(value && value.toString().length > 8){
      return false;
    }else {
      return true;
    }
  }
  convertToWords(value: number) {
    if (value) {
      this.ctcToWord = this.commonService.convertNumberToWords(value) + " Rupees";
    }
    else {
      this.ctcToWord = ''; 
    }
  }
  addLineItem() {
    this.configList.push({
      "paymentPeriod": {
        "code": null
      }
    });
  }
  deleteLineItem(rowIndex: any) {
    this.configList.splice(rowIndex, 1);
  }
  createLineItems(lineItems: any) {
    var lineItemsList: any = [];
    for (var key in lineItems) {
      if (lineItems.hasOwnProperty(key)) {
        lineItemsList.push({
          'code': lineItems[key]['code'],
          'description': lineItems[key]['description']
        });
      }
    }
    return lineItemsList;
  }
  createPaymentMap(periods: any) {
    var periodMap: any = {};
    periods.forEach(function (elem: any, ind: any) {
      periodMap[elem.code] = elem;
    });
    return periodMap;
  }
  getAddOnPayload(configList: any) {
    var self = this;
    configList.forEach(function (elem: any, ind: any) {
      if(!elem.code || !elem.paymentPeriod.code || !elem.amount){
        configList = 'invalid';
        return;
      }
      elem['description'] = self.addons.lineItems[elem.code]['description'];
      elem['includeInCtc'] = self.addons.lineItems[elem.code]['includeInCtc'];
      elem['category'] = self.addons.lineItems[elem.code]['category'];
      elem['paymentPeriod']['description'] = self.paymentPeriodMap[elem.paymentPeriod.code]['description'];
    });
    return configList;
  }
  saveOffer() {
    var offerDetails: any = this.offerDetails,
      lineItemPayload = this.getAddOnPayload(this.configList), payload: any;
      if(lineItemPayload == 'invalid'){
        this.dialogService.render(
          [{
              title: 'Warning',
              message: 'Please fill the details for CTC line item',
              yesLabel: 'OK'
          }]
      );
        return;
      }
      payload = {
        lineItems: lineItemPayload,
        designationSuffix: this.desigSuffix,
        annexure: this.annexure['value']
      };
    //var profileDetails: any = this.offersDataService.prospectDetails, self = this;
    var self = this;
    if(self.hiringDetails['hiringId']){
    offerDetails.prospectId = self.hiringDetails['prospectId'];
    offerDetails.expectedJoiningDate = self.getEpochTime(new Date(offerDetails.expecJoiningDate));
    offerDetails.expiryDate = self.getEpochTime(new Date(offerDetails.expDate));
    //offerDetails.configurationSettings = JSON.stringify(this.configList[0]);
    offerDetails.configurationSettings = JSON.stringify(payload);
    self.loaderService.showLoading();
    this.offersDataService.createOffer(self.hiringDetails['hiringId'], self.hiringDetails['hiringNeedId'], offerDetails).subscribe(data => {
      if (data.status == 201) {
        self.successMessage = 'Offer created successfully';
        self.loaderService.hideLoading();
        self.dialogService.render(
          [{
              title: 'Success',
              message: self.successMessage,
              yesLabel: 'OK'
          }]
      ).subscribe(result => {
        self.navigateToOffers();
      });
      }
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
    }
  }
  updateOffer() {
    var offerDetails: any = this.offerDetails, self = this,
      lineItemPayload = this.getAddOnPayload(this.configList), payload: any;
      if(lineItemPayload == 'invalid'){
        this.dialogService.render(
          [{
              title: 'Warning',
              message: 'Please fill the details for CTC line item',
              yesLabel: 'OK'
          }]
      );
        return;
      }
      payload = {
        lineItems: lineItemPayload,
        designationSuffix: this.desigSuffix,
        annexure: this.annexure['value']
      };
    offerDetails.prospectId = self.hiringDetails.prospectId;
    offerDetails.expectedJoiningDate = self.getEpochTime(new Date(offerDetails.expecJoiningDate));
    offerDetails.expiryDate = self.getEpochTime(new Date(offerDetails.expDate));
    //offerDetails.configurationSettings = JSON.stringify(this.configList[0]);
    offerDetails.configurationSettings = JSON.stringify(payload);
    self.loaderService.showLoading();
    this.offersDataService.updateOffer(self.hiringDetails['hiringId'], self.hiringDetails['hiringNeedId'], self.offerId, self.offerDetails).subscribe(data => {
      if (data.status == 200) {
        self.successMessage = 'Offer updated successfully';
        self.loaderService.hideLoading();
        self.dialogService.render(
          [{
              title: 'Success',
              message: self.successMessage,
              yesLabel: 'OK'
          }]
      ).subscribe(result => {
        self.navigateToOffers();
      });
      }
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  getEpochTime(date: any) {
    var mm: any = date.getMonth() + 1;
    var dd: any = date.getDate();
    var dateString: any = [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
    return new Date(dateString).getTime();
  }
  getDateString(date: any) {
    var mm: any = date.getMonth() + 1;
    var dd: any = date.getDate();
    var dateString: any = [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
    return dateString;
  }
  navigateToOffers() {
    this.router.navigate(['../hiring/offers/all']);
  }
  navigateToPrevious() {
    var route = localStorage.getItem('previousRoute');
    route = (route) ? route : '/hiring/offers';
    this.router.navigate([route]);
  }
}