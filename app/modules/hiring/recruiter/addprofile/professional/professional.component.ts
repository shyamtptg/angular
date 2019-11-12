import { CommonService } from '../../../../../shared/services/common.service';
import { Component, ViewChild } from '@angular/core';
import { AddProfileDataService } from '../add-profile.service';
import { HiringComponent } from '../../../hiring.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { AppConstants } from '../../../../../config/app.constants';
import { ProfileDetails } from '../../models/ProfileDetails';

var FileSaver = require('filesaver.js-npm');
var converter = require('number-to-words');
@Component({
  selector: 'professional-details',
  templateUrl: './professional.component.html'
})
export class ProfessionalComponent {
  ProfessionalDataFrmProspectData: ProfileDetails;
  ProfessionalFrmNoticePeriodData: any;
  sendTitle: any = "Confirm & Send";
  sendId: any = "confirmSend";
  active: boolean = true;
  inactive: boolean = false;
  successMessage: string;
  viewMode: boolean = false;
  disableMode: boolean = true;
  hide: boolean = true;
  eHide: boolean = true;
  uploaded: boolean = false;
  public attachHide: boolean = false;
  public formSaved: boolean = false;
  comboData: any;
  resumeDetails: any;
  public isReferral: boolean;
  referralData: any = [{}];
  referralDetails: any = [{}];
  results: any;
  willingToRelocate: boolean = false;
  willingToRelocate1: any;
  public clientNameOptions: any;
  @ViewChild('professionalDetailsForm') public professionalForm: any;
  file: File;
  ctcToWord: string;
  etcToWord: string;
  constructor(
    private hiringComponent: HiringComponent,
    private addProfileDataService: AddProfileDataService,
    private router: Router, private route: ActivatedRoute,
    private appConstants: AppConstants,
    public commonService: CommonService,
    private loaderService: LoaderService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Profiles / Professional";
  }
  ngOnInit() {
    var self = this;
    let currentUrl = this.router.url.match("attach");
    if (currentUrl && currentUrl.length) {
      this.attachHide = true;
    }
    var data = self.addProfileDataService.getProspectCombos();
    if (data) {
      self.comboData = {
        employmenttype: data['EMPLOYMENT_TYPE'],
        documenttype: data['DOCUMENT_TYPE'],
        noticeperiod: data['NOTICE_PERIOD'],
        prospectSource: data['PROSPECT_SOURCE']
      }
    }else{
      self.addProfileDataService.getProspectComboDetails().subscribe(data=>{
        self.comboData = {
          employmenttype: data['EMPLOYMENT_TYPE'],
          documenttype: data['DOCUMENT_TYPE'],
          noticeperiod: data['NOTICE_PERIOD'],
          prospectSource: data['PROSPECT_SOURCE']
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
    setTimeout(() => {
      var data: any = self.addProfileDataService.getProfessionalData();
      if(data){
        self.loadDetails();
      }else{
        self.addProfileDataService.loadProspectDataById(self.addProfileDataService.profileId).subscribe(data => {
          self.addProfileDataService.ProspectData = data;
          self.addProfileDataService.getProspectComboDetails().subscribe(data=>{
            self.comboData = {
              employmenttype: data['EMPLOYMENT_TYPE'],
              documenttype: data['DOCUMENT_TYPE'],
              noticeperiod: data['NOTICE_PERIOD'],
              prospectSource: data['PROSPECT_SOURCE']
            }
            self.loadDetails();
          }, error => {
            self.errorHandleService.handleErrors(error);
          });
         }, error => {
          self.errorHandleService.handleErrors(error);
        });
      }
    }, 100);
    var data = self.addProfileDataService.getHiringCombos();
    if(data) {
       self.clientNameOptions = data['CLIENT'];
    }else{
      self.addProfileDataService.getHiringComboDetails().subscribe(data=>{
        self.clientNameOptions = data['CLIENT'];
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  search(event: any){
    var self = this;
    let query = event.query;
    self.addProfileDataService.getEmployees(query, 0, 3000).subscribe(data=>{
      self.results = data['content'];
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  loadDetails(){
    var self = this;
    var data: any = self.addProfileDataService.getProfessionalData();
    self.ProfessionalDataFrmProspectData = (data ? data : undefined);
    if(data['referralDetails'] && data['referralDetails'][0] && data['referralDetails'][0]['referralName']){
      self.referralData[0]['fullName'] = data['referralDetails'][0]['referralName'];
    }
    if (self.ProfessionalDataFrmProspectData) {
      var documents = self.ProfessionalDataFrmProspectData.documents;
      documents && documents.forEach(function (elem: any, ind: any) {
      if (elem['documentType']['code'] == 'RESUME') {
        self.resumeDetails = {
          'title': elem['title'],
          'documentId': elem['documentId'],
          'prospectId': elem['prospectId']
        }
      }
      });
      self.ProfessionalDataFrmProspectData.documentType = 'RESUME';
    }
    if (self.resumeDetails) {
      self.uploaded = true;
    }
    self.viewMode = (self.addProfileDataService.mode == 'view') ? true : false;
    self.disableMode = (self.viewMode) ? false : true;
    self.propsectSourceChange();
  }
  locationsdisplay() {
    if(!this.ProfessionalDataFrmProspectData["willingToRelocate"]){
      this.ProfessionalDataFrmProspectData["locationId"]=undefined;
      this.ProfessionalDataFrmProspectData["locationName"]="";
    }
  }
  restrictFloatnumber = function (e: any) {
    return this.commonService.restrictFloatnumber(e);
  }
  propsectSourceChange() {
    var professData: any = this.ProfessionalDataFrmProspectData;
    if (professData && professData.source == "REFERRAL") {
      this.isReferral = true;
    } else {
      this.isReferral = false;
      this.ProfessionalDataFrmProspectData.referralDetails = [];
      this.referralData[0]['fullName'] = '';
    }
  }
  loadReferralDetails(event: any) {
    var self = this,
      referralId: any = event.id;
    var professionalForm = self.ProfessionalDataFrmProspectData;
    if (referralId) {
      self.addProfileDataService.getReferralDetailsById(referralId).subscribe(data => {
        var referralDetails = {
          'referralId': data['employeeCode'],
          'referralName': data['fullName'],
          'referralEmail': data['companyEmail'],
          'referralPhone': data['mobileNumber']
        };
        professionalForm.referralDetails[0] = referralDetails;
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
restrictCharcters(value:any){
 return  this.commonService.restrictCharcters(value);
}
restrictExpCharcters(value:any){
 return  this.commonService.restrictExpCharcters(value);
}
validateExperience(value:any){
  return this.commonService.validateExperience(value); 
}
  convertToWords(value: number, ctc: string) {
    if (ctc == "ctc") {
      if (value && this.commonService.convertNumberToWords(value)) {
        this.ctcToWord = this.commonService.convertNumberToWords(value) + " Rupees";
      }
      else {
        this.ctcToWord = '';
      }
    }
    else {
      if (value && this.commonService.convertNumberToWords(value)) {
        this.etcToWord = this.commonService.convertNumberToWords(value) + " Rupees";
      }
      else {
        this.etcToWord = '';
      }
    }
  }
  ngAfterViewChecked() {
    this.addProfileDataService.professionalForm = this.professionalForm;
  }

  uploadFile(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      try {
        var isValid = this.commonService.validateFile(fileList[0], 'resume', 2097152, 69, ['doc', 'docx', 'rtf', 'pdf', 'txt']);
        if(isValid){
          this.file = fileList[0];
          (<HTMLInputElement>document.getElementById('fileNamePreview')).value = this.file.name;
          this.uploaded = true;
        }
      } catch (e) {
        this.errorHandleService.handleErrors(e);
      }
    }
  }
  totalExpirenece(totExp: any, relExp: any) {
    var self = this;
    if(this.commonService.validateDecimalPlacesForExp(totExp) == false){
      this.ProfessionalDataFrmProspectData.totalExperienceInYears = undefined;
      this.dialogService.render(
        [{
            title: 'Warning',
            message: 'The value for Total Experience should be between 0 and 100',
            yesLabel: 'OK'
        }]);
      return;
    }
    if (relExp && relExp > totExp) {
      this.ProfessionalDataFrmProspectData.totalExperienceInYears = undefined;
      this.dialogService.render(
        [{
            title: 'Warning',
            message: 'Total Experience should be greater than or equal to Relevant Experience',
            yesLabel: 'OK'
        }]);
    }
  }
  releventExpirence(totExp: any, relExp: any) {
    var self = this;
    if(this.commonService.validateDecimalPlacesForExp(relExp) == false){
      this.ProfessionalDataFrmProspectData.relevantExperienceInYears = undefined;
      this.dialogService.render(
        [{
            title: 'Warning',
            message: 'The value for Relevant Experience should be between 0 and 100',
            yesLabel: 'OK'
        }]);
      return;
    }
    if ((totExp || totExp == 0) && relExp > totExp) {
      this.ProfessionalDataFrmProspectData.relevantExperienceInYears = undefined;
      this.dialogService.render(
        [{
            title: 'Warning',
            message: 'Relevant Experience should be less than or equal to Total Experience',
            yesLabel: 'OK'
        }]);
    }
  }
  deleteDocument() {
    var self = this;
    if (self.resumeDetails && self.resumeDetails['documentId']) {
      var resumeDetails: any = self.resumeDetails;
      self.loaderService.showLoading();
      this.addProfileDataService.deleteResumeData(resumeDetails['prospectId'], resumeDetails['documentId']).subscribe(data => {
        if (data.status == 200) {
          self.uploaded = false;
          self.file = null;
          self.resumeDetails['title'] = "";
          self.resumeDetails['documentId'] = "";
          self.successMessage = 'Resume deleted successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: 'File removed successfully',
                yesLabel: 'OK'
            }])
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    } else {
      (<HTMLInputElement>document.getElementById('fileNamePreview')).value = "";
      self.uploaded = false;
      self.file = null;
    }
  }
  downloadFile(resumeDetails: any) {
    this.addProfileDataService.downloadResume(resumeDetails['prospectId'], resumeDetails['documentId']).subscribe(data => {
      var blob = new Blob([data['_body']], { type: "application/octet-stream" });
      FileSaver.saveAs(blob, resumeDetails['title']);
    }, error => {
      this.errorHandleService.handleErrors(error);
    });
  }

  navigateToProfiles() {
    this.router.navigate(['/hiring/recruiter/123/all']);
  }
  navigateToPrevious() {
    var route = localStorage.getItem('previousRoute');
    route = (route) ? route : '/hiring/profiles/all';
    this.router.navigate([route]);
  }

  saveNext(prospectprofessionaldata: any): void {
    var reffDetails: any = prospectprofessionaldata.referralDetails;
    if(this.isReferral && reffDetails.length == 0 ){
       this.dialogService.render(
        [{
            title: 'Warning',
            message: "Please enter the referral",
            yesLabel: 'OK'
        }])
    }
    else {
    if (reffDetails && reffDetails[0] && !reffDetails[0].referralId) {
      delete prospectprofessionaldata.referralDetails;
    }
    this.addProfileDataService.updateProspectProfessionalData(prospectprofessionaldata, this.file);
    this.router.navigate(['../skillset'], { relativeTo: this.route });
    this.formSaved = true;
    this.addProfileDataService.professionalFormSaved = true;
    this.addProfileDataService.personalFormSaved = true;
    }
  }
}