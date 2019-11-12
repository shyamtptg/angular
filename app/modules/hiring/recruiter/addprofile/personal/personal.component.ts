import { Component, ViewChild } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { AddProfileDataService } from '../add-profile.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { HiringComponent } from '../../../hiring.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileDetails } from '../../models/ProfileDetails';
import { CommonService } from '../../../../../shared/services/common.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
  selector: 'personal-details',
  templateUrl: './personal.component.html',
  styleUrls: [`./personal.component.scss`]
})
export class PersonalComponent {
  public personalDetailsFrmProspectData: any;
  public formSaved: boolean = false;
  public viewMode: boolean = false;
  public hide: boolean = false;
  public alreadyExists = {
    'email': false,
    'mobile': false,
    'citizenIdentity': false
  };
  public identityTypeSelected: boolean = false;
  public pattern = /([0-9]{10,})/;
  platformLoc: any;
  previousValues: any = {
    'email': '',
    'mobile': '',
    'citizenType': '',
    'citizenIdentity': ''
  };
  defaultDate=  new Date('1/1/1950');
  constructor(
    private addProfileDataService: AddProfileDataService,
    private hiringComponent: HiringComponent,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    public commonService: CommonService,
    private loaderService: LoaderService,
    private errorHandleService: ErrorHandleService,
    platformLocation: PlatformLocation
  ) {
    this.hiringComponent.URLtitle = "Profiles / Personal";
    var myEl = $('.left-sidebar');
    myEl.addClass('personal-left-nav');
    this.platformLoc = platformLocation;
  }

  @ViewChild('personalDetailsForm') public personalForm: any;

  ngAfterViewChecked() {
    this.addProfileDataService.personalForm = this.personalForm;
  }
  ngOnInit() {
    let currentUrl = this.router.url.match("attach");
    if (currentUrl && currentUrl.length) {
      this.hide = true;
    }
    var self = this;
    if (self.addProfileDataService.profileId && self.addProfileDataService.mode != 'new') {
      self.loadProfileDataWithId(self.addProfileDataService.profileId);
    } else {
      self.loadProfileData();
    }
  }
  checkEmail(value: any){
    var self = this, origin = self.platformLoc.location.origin, url;
    if(value && (self.previousValues.email!=value)){
      self.addProfileDataService.getExistingProfileByEmail(value).subscribe(data=>{
        if(data.status == 200 && data['_body'] && self.personalDetailsFrmProspectData){
          self.personalDetailsFrmProspectData.email = '';
          self.alreadyExists.email = true;
          if(self.commonService.IsJsonString(data['_body'])){
            url = (JSON.parse(data['_body'])['id']) ? (origin + '/hiring/profiles/profile-details/' + JSON.parse(data['_body'])['id']) : (origin + '/hiring/profiles/search');
          }else{
            url = origin + '/hiring/profiles/search';
          }
          this.dialogService.render(
            [{
                title: 'Warning',
                message: `Profile with this email id (${value}) already exists. <a href=${url} target="_blank"><span style="color:blue;">Click here</span></a> to view the details.`,
                yesLabel: 'OK'
            }])
        }else if(data.status == 200){
          self.alreadyExists.email = false;
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  checkMobile(value: any){
    var self = this, origin = self.platformLoc.location.origin, url;
    if(value && (self.previousValues.mobile!=value)){
      self.addProfileDataService.getExistingProfileByMobile(value).subscribe(data=>{
        if(data.status == 200 && data['_body'] && self.personalDetailsFrmProspectData){
          self.personalDetailsFrmProspectData.mobileNumber = '';
          self.alreadyExists.mobile = true;
          if(self.commonService.IsJsonString(data['_body'])){
            url = (JSON.parse(data['_body'])['id']) ? (origin + '/hiring/profiles/profile-details/' + JSON.parse(data['_body'])['id']) : (origin + '/hiring/profiles/search');
          }else{
            url = origin + '/hiring/profiles/search';
          }
          this.dialogService.render(
            [{
                title: 'Warning',
                message:  `Profile with this mobile number (${value}) already exists. <a href=${url} target="_blank"><span style="color:blue;">Click here</span></a> to view the details.`,
                yesLabel: 'OK'
            }])
        }else if(data.status == 200){
          self.alreadyExists.mobile = false;
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  checkCitizenIdentity(value: any){
    var self = this, identityType, origin = self.platformLoc.location.origin, url;
    if(self.personalDetailsFrmProspectData){
      identityType = self.personalDetailsFrmProspectData.citizenIdentity1Type;
    }
    if(identityType && value && ((self.previousValues.citizenIdentity!=value) || (self.previousValues.citizenType!=identityType))){
      self.addProfileDataService.getExistingProfileByCitizenIdentity(identityType, value).subscribe(data=>{
        if(data.status == 200 && data['_body'] && self.personalDetailsFrmProspectData){
          self.personalDetailsFrmProspectData.citizenIdentity1 = '';
          self.alreadyExists.citizenIdentity = true;
          if(self.commonService.IsJsonString(data['_body'])){
            url = (JSON.parse(data['_body'])['id']) ? (origin + '/hiring/profiles/profile-details/' + JSON.parse(data['_body'])['id']) : (origin + '/hiring/profiles/search');
          }else{
            url = origin + '/hiring/profiles/search';
          }
          this.dialogService.render(
            [{
                title: 'Warning',
                message: `Profile with this citizen identity (${value}) already exists. <a href=${url} target="_blank"><span style="color:blue;">Click here</span></a> to view the details.`,
                yesLabel: 'OK'
            }])
        }else if(data.status == 200){
          self.alreadyExists.citizenIdentity = false;
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  enableCitizenIdentity(){
    var personalData = this.personalDetailsFrmProspectData;
    if(personalData && personalData.citizenIdentity1Type){
      this.identityTypeSelected = true;
    }
    if(personalData){
      personalData.citizenIdentity1 = '';
    }
  }
  restrictMobilenumber(event:any){
    return this.commonService.restrictMobilenumber(event);
     }
  restrictFloatnumber = function (e: any) {
    this.commonService.restrictFloatnumber(e);
  }
  restrictNumeric = function (e: any) {
   var input = String.fromCharCode(e.which);
    var cAdd = this.personalDetailsFrmProspectData.currentAddress.zipcode;
    var pAdd = this.personalDetailsFrmProspectData.permanentAddress.zipcode;
    if(((cAdd && cAdd.length==5 && parseInt(cAdd)==0)||(pAdd && pAdd.length==5 && parseInt(pAdd)==0))&&parseInt(input)==0){
      return false;
    }
 return this.commonService.restrictNumeric(e);
  }
  restrictLetters = function (e: any) {
   return this.commonService.restrictLetters(e);
  }
  ngOnDestroy() {
    $('.sidebar-menu').height('100%');
  }

  copyCurrentToPermanentAddress() {
    var form = this.personalDetailsFrmProspectData;
    form.permanentAddress.address1 = form.currentAddress.address1;
    form.permanentAddress.address2 = form.currentAddress.address2;
    form.permanentAddress.city = form.currentAddress.city;
    form.permanentAddress.state = form.currentAddress.state;
    form.permanentAddress.country = form.currentAddress.country;
    form.permanentAddress.zipcode = form.currentAddress.zipcode;
  }

  saveNext(prospectpersonaldata: any): void {
    var self = this;
    setTimeout(() => {
      if(!prospectpersonaldata.citizenIdentity1){
        self.alreadyExists.citizenIdentity = false;
      }
      if(!self.alreadyExists.email && !self.alreadyExists.mobile && !self.alreadyExists.citizenIdentity){
        if (prospectpersonaldata.permanentAddressSameAsCurrentAddress == true) {
          self.copyCurrentToPermanentAddress();
        }
        var dob = prospectpersonaldata.dateOfBirth;
        prospectpersonaldata.dateOfBirth = new Date(dob).getTime();
        self.addProfileDataService.updateProspectPersonalData(prospectpersonaldata);
        self.formSaved = true;
        self.addProfileDataService.personalFormSaved = true;
        self.router.navigate(['../professional'], { relativeTo: self.route });
      }  
    }, 100);
  }
  public loadProfileData = () => {
    var self = this;
    var data: any = self.addProfileDataService.getPersonalData();
    if (data) {
      self.loadDetails();
    }else{
      var profileModalData: any = this.addProfileDataService.getProfileData();
      self.addProfileDataService.ProspectData = profileModalData;
      self.loadDetails();
    }
  }
  public loadProfileDataWithId = (id: any) => {
    var self = this;
    self.loaderService.showLoading();
    this.addProfileDataService.loadProspectDataById(id).subscribe(data => {
      self.addProfileDataService.ProspectData = data;
      self.loadDetails();
      self.loaderService.hideLoading();
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  loadDetails() {
    var self = this;
    var data: any = self.addProfileDataService.getPersonalData();
    self.personalDetailsFrmProspectData = (data ? data : undefined);
    var personalFormData = self.personalDetailsFrmProspectData;
    var date = personalFormData.dateOfBirth;
    if (date) {
      self.personalDetailsFrmProspectData.dateOfBirth = new Date(date);
    }
    if(personalFormData && personalFormData.citizenIdentity1Type){
      self.identityTypeSelected = true; 
    }else{
      self.identityTypeSelected = false;
    }
    if(data){
      self.previousValues.citizenIdentity = data.citizenIdentity1;
      self.previousValues.citizenType = data.citizenIdentity1Type;
      self.previousValues.mobile = data.mobileNumber;
      self.previousValues.email = data.email;
    }
    self.viewMode = (self.addProfileDataService.mode == 'view') ? true : false;
    setTimeout(() => {
      var contentHeight = $('.content-wrapper').height();
      $('.sidebar-menu').height(contentHeight + 15);
    }, 50);
  }
  formatDate(date: any) {
    var time = new Date(date),
      result, year, month, today;
    year = time.getFullYear();
    month = time.getMonth() + 1;
    today = time.getDate();
    month = ((month < 10) ? ('0' + month) : month);
    today = ((today < 10) ? ('0' + today) : today);
    result = year + '-' + month + '-' + today;
    return result;
  }
  navigateToPrevious() {
    var route = localStorage.getItem('previousRoute');
    route = (route) ? route : '/hiring/profiles/all';
    this.router.navigate([route]);
  }
  viewProfile(id: any){
    this.router.navigate(['/hiring/profiles/profile-details/', id]);
  }
}