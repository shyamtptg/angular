import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RemarksModal } from '../../../../../shared/remarks/remarks-modal/remarks-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NewHiringRequestDataService1 } from '../../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { AddProfileDataService } from '../../addprofile/add-profile.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { HiringComponent } from '../../../hiring.component';
import { SkillProficiency } from '../../../models/SkillProficiency';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';
import { Tab } from '../../../../../shared/tablist/tab';

var FileSaver = require('filesaver.js-npm');
@Component({
  selector: 'profile-details-dialog',
  templateUrl: 'profile-details.component.html'
})

export class ProfileDetailsDialog {
    // skillset variables
    private techSkills: Array<SkillProficiency>;
    public techSkillsCatwise: any;
    private availableTechSkills: Array<string>;
    public successMessage: string;
    private headers: any;
    public categoryId: any;
    public categoryNames: any;
    public skillProficiency: any = [];
    public categoryList: any = [];
    public editMode: boolean = false;
    public viewMode: boolean = true;
    public rejectprofile: boolean = true;
    // skillset varialbles end
    display: boolean = false;
    shortListTitle: string = "Shortlist Profile";
    rejectTitle: string = "Reject Profile";
    onHoldTitle: string = "Keep Profile On Hold";
    shortListId: string = "shortListProfile";
    rejectId: string = "rejectProfile";
    onHoldId: string = "onHoldProfile";
    profileId: string;
    reqId: string;
    needId: string;
    comboData: any;
    profileDetails: any = {
     'documentType': null
    };
     resumeDetails: any;
     public isReferral: boolean;
     referralData: any = [{}];
     referralDetails: any = [{}];
     results: any;
    @ViewChild('shortListModal') shortListModal: RemarksModal;
    @ViewChild('rejectModal') rejectModal: ElementRef;
    @ViewChild('onHoldModal') onHoldModal: ElementRef;
    @ViewChild('skillDetailsForm') public skillForm: any;

    // confidential document variables
    addDocuments: any[] = [1];
    file: any = {};
    uploaded: any = {
      'OTHERS': false,
      'HIKE_LETTER': false,
      'PAYSLIP1': false,
      'PAYSLIP2': false,
      'PAYSLIP3': false,
      'BANK_STATEMENT': false
    };
  docMapLoaded: boolean = false;
    constructor(private hiringRequestDataService: NewHiringRequestDataService1,
      private router: Router,
      private route: ActivatedRoute,
      private addProfileDataService: AddProfileDataService,
      private loaderService: LoaderService,
      private hiringComponent: HiringComponent,
      private dialogService: DialogService,
      public commonService: CommonService,
      private cdr: ChangeDetectorRef,
      private errorHandleService: ErrorHandleService
    ) {
      this.hiringComponent.URLtitle = "Profiles / Profile Details";
    }
	showDialog(){
     this.display = true;
	}
	onAfterHide(){
     this.display = false;
	}
  ngOnInit(){
      var self = this;
      let currentUrl = this.router.url.match("screening"); 
        if( currentUrl && currentUrl.length){
          this.rejectprofile = false;
        }
      var prospectComboData = self.addProfileDataService.getProspectCombos();
        if(prospectComboData){
          self.comboData = {
            employmenttype: prospectComboData['EMPLOYMENT_TYPE'],
            documenttype: prospectComboData['DOCUMENT_TYPE'],
            noticeperiod: prospectComboData['NOTICE_PERIOD'],
            prospectSource: prospectComboData['PROSPECT_SOURCE']
          };
        }
      self.route.params.subscribe(params => {
        if (params['id']) {
          self.profileId = params['id'];
          self.reqId = params['reqId'];
          self.needId = params['needId'];
          if (!prospectComboData) {
            self.addProfileDataService.getProspectComboDetails().subscribe(data => {
              if (data) {
                self.comboData = {
                  employmenttype: data['EMPLOYMENT_TYPE'],
                  documenttype: data['DOCUMENT_TYPE'],
                  noticeperiod: data['NOTICE_PERIOD'],
                  prospectSource: data['PROSPECT_SOURCE']
                };
              }
              self.loadProfileDataWithId(self.profileId);
            }, error => {
              self.errorHandleService.handleErrors(error);
            });
          } else {
            self.loadProfileDataWithId(self.profileId);
          }
        }
      });
    }
    loadProfileDataWithId(id: any){
    var self = this;
    self.loaderService.showLoading();
    this.hiringRequestDataService.loadProspectDataById(id).subscribe(data => {
          self.addProfileDataService.ProspectData = data;
          self.profileDetails = data;
          self.profileDetails.documentType = 'RESUME';
          self.profileDetails.documents.forEach(function(elem:any, ind:any){
            if(elem['documentType']['code'] == 'RESUME'){
              self.resumeDetails = {
                'title': elem['title'],
                'documentId': elem['documentId'],
                'prospectId': elem['prospectId']
              }
            }   
          });
          var date = data.dateOfBirth;
            self.profileDetails.dateOfBirth = (date) ? new Date(this.formatDate(date)) : '';
            if(data['referralDetails'] && data['referralDetails'][0] && data['referralDetails'][0]['referralName']){
            self.referralData[0]['fullName'] = data['referralDetails'][0]['referralName'];
          }
          self.propsectSourceChange();
          self.loadSkillSet();
          self.loaderService.hideLoading();
        }, error => {
          self.errorHandleService.handleErrors(error);
        });
    }
    formatDate(date: any) {
     var time = new Date(date),
     result, year, month, today;
     year = time.getFullYear();
     month = time.getMonth() + 1;
     today = time.getDate();
     month = ((month < 10)? ('0' + month) : month);
     today = ((today < 10)? ('0' + today) : today);
     result = year + '-' + month + '-' + today;
     return result;
    }
    loadSkillSet(){ 
      var self = this;
      this.techSkillsCatwise = {
         'skillSets': []
        };
        var data = this.addProfileDataService.getHiringCombos();
        if(data){
           this.categoryNames = data['SKILL_CATEGORY'];
           this.categoryId = 9999;
        }else{
          this.addProfileDataService.getHiringComboDetails().subscribe(data=>{
            self.categoryNames = data['SKILL_CATEGORY'];
            self.categoryId = 9999;
          }, error => {
            self.errorHandleService.handleErrors(error);
          });
        }
        var data: any= this.addProfileDataService.getSkillData(), self = this;
        var skillCategoryList = (data ? data["skillSets"]:undefined);
        skillCategoryList && skillCategoryList.forEach(function(elem: any, ind: any){
            var catId: any = elem['categoryId'];
            var categoryName = self.addProfileDataService.getSkillsMap()['skillCatNames'][catId];
            elem['categoryName'] = categoryName;
            var skills = self.addProfileDataService.getSkillsMap()['skills'][catId];
            var skillProficiencies = elem.skillProficiencies;
              skillProficiencies.forEach(function(elem: any, ind: any){
                  elem['skill'] = skills;
            });
        });
        this.techSkillsCatwise['skillSets'] = skillCategoryList;
        this.headers = [{
            "skillHeader": {
                "item": "Tool",
                "experience": "Years of Experience",
                "rating": "Rate yourself"
            }
        }];
    }
    propsectSourceChange() {
      var professData: any = this.profileDetails;
      if (professData && professData.source == "REFERRAL") {
        this.isReferral = true;
      } else {
        this.isReferral = false;
        this.profileDetails.referralDetails = [];
        this.referralData[0]['fullName'] = '';
      }
    }
    shortListProfile(reason: any){
      if(!this.commonService.validateCommentsLength(reason)){
        this.dialogService.render(
          [{
              title: 'Warning',
              message: 'Remarks entered exceeds the maximum length of 1024 characters',
              yesLabel: 'OK'
          }]
          );
        return;
      }
      var purposeDetails = {
        'hiringRequestId': this.reqId,
        'hiringRequestNeedId': this.needId,
        'decisionComments': reason
      };
      if(purposeDetails['hiringRequestId'] && purposeDetails['hiringRequestNeedId']){
      var self = this;
      self.loaderService.showLoading();
      this.hiringRequestDataService.updateProfileStatus(this.profileId, 'SHORTLIST', purposeDetails).subscribe(data =>{
        if(data.status == 200){
          self.successMessage = 'Profile shortlisted successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
          [{
            title: 'Success',
            message: self.successMessage,
            yesLabel: 'OK'
        }]
    ).subscribe(result => {
          self.navigateToProfiles();
    });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
      }
    }
    rejectProfile(reason: any){
      if(!this.commonService.validateCommentsLength(reason)) {
        this.dialogService.render(
          [{
              title: 'Warning',
              message: 'Remarks entered exceeds the maximum length of 1024 characters',
              yesLabel: 'OK'
          }]
          );
        return;
      }
      var purposeDetails = {
        'hiringRequestId': this.reqId,
        'hiringRequestNeedId': this.needId,
        'decisionComments': reason
      };
      if(purposeDetails['hiringRequestId'] && purposeDetails['hiringRequestNeedId']){
      var self = this;
      self.loaderService.showLoading();
      this.hiringRequestDataService.updateProfileStatus(this.profileId, 'REJECT', purposeDetails).subscribe(data =>{
        if(data.status == 200){
          self.successMessage = 'Profile rejected successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
          [{
              title: 'Success',
              message: self.successMessage,
              yesLabel: 'OK'
          }]
      ).subscribe(result => {
            self.navigateToProfiles();
      });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
      }
    }
    downloadFile(resumeDetails: any){
      this.addProfileDataService.downloadResume(resumeDetails['prospectId'], resumeDetails['documentId']).subscribe(data=>{
       var blob = new Blob([data['_body']], {type: "application/octet-stream"});
       FileSaver.saveAs(blob, resumeDetails['title']);
      }, error => {
        this.errorHandleService.handleErrors(error);
      });
    }
    navigateToProfiles(){
      this.router.navigate(['/hiring/profiles/profiles']);
    }
    navigateToPrevious(){
     var route = localStorage.getItem('previousRoute');
     route = (route)? route : '/hiring/profiles/screening';
     this.router.navigate([route]);
    }

    tabSelect(currentTab: Tab) {
      var title = currentTab['title'],
      self = this;
      self.docMapLoaded = false;
      self.uploaded = {
       'OTHERS': false,
       'HIKE_LETTER': false,
       'PAYSLIP1': false,
       'PAYSLIP2': false,
       'PAYSLIP3': false,
       'BANK_STATEMENT': false
      };
      if (title == 'Confidential Documents') {
        self.addDocuments = [1];
        $('#confidentialDoc1').show();
        $('.add-confidential-item').show();
        self.addDocuments.forEach(function (elem: any, ind: any) {
          self.uploaded['OTHERS' + (ind + 1)] = false;
        });
        self.loadProfileDataById(self.profileId);
      }
    }
    setFileData(fileData: any, fileName: string) {
    if(fileData.length>0){
      this.file[fileName] = fileData[0];
    }
  }
  uploadDocument(docType: any) {
    var self = this, docId: string;
    if (self.profileId) {
      if (this.file[docType] && this.file[docType].size > 1000000) {
      } else if (this.file[docType]) {
        self.loaderService.showLoading();
        docId = 'OTHERS';
        this.addProfileDataService.uploadDocumentData(docId, this.file[docType], self.profileId).subscribe(data => {
          if (data.status == 200) {
            self.addProfileDataService.documentMap[docType] = { 'documentId': data['_body'], 'title': self.file[docType]['name'] };
            self.uploaded[docType] = true;
            $('.add-confidential-item').show();
            self.successMessage = 'Document uploaded successfully';
            self.loaderService.hideLoading();
            this.dialogService.render(
              [{
                  title: 'Success',
                  message: self.successMessage,
                  yesLabel: 'OK'
              }]
          );
          }
        }, error => {
          self.errorHandleService.handleErrors(error);
        });
      }
    }
  }
  deleteDocument(docType: any) {
    var docMap = this.addProfileDataService.documentMap, self = this,
      docDetails = docMap[docType];
    if (self.profileId && docDetails['documentId']) {
      self.loaderService.showLoading();
      this.addProfileDataService.deleteDocumentData(self.profileId, docDetails['documentId']).subscribe(data => {
        if (data.status == 200) {
          delete self.addProfileDataService.documentMap[docType];
          self.uploaded[docType] = false;
          self.hideConfidentialItem(docType);
          self.successMessage = 'Document deleted successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        );
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  downloadDocument(docType: any) {
    var docMap = this.addProfileDataService.documentMap, self = this,
      docDetails = docMap[docType];
    if (self.profileId && docDetails['documentId']) {
      this.addProfileDataService.downloadResume(self.profileId, docDetails['documentId']).subscribe(data => {
        var blob = new Blob([data['_body']], { type: "application/octet-stream" });
        FileSaver.saveAs(blob, docDetails['title']);
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  loadDocumentName(docType: any) {
    if (this.docMapLoaded) {
      var docMap = this.addProfileDataService.documentMap, self = this,
        docDetails;
      if (docMap) {
        docDetails = docMap[docType];
        if (docDetails) {
          self.uploaded[docType] = true;
          return docDetails.title;
        } else {
          return '';
        }
      }
    }
  }
  /* This method temporarily hides uploaded element when deleted */
  hideConfidentialItem(docType: string){
    var index: any = docType.split("OTHERS")[1];
    var elem = '#confidentialDoc'+(index*1);
    $(elem).hide();
  }
  public loadProfileDataById = (id: any) => {
    var self = this;
    this.addProfileDataService.loadProspectDataById(id).subscribe(data => {
      self.addProfileDataService.ProspectData = data;
      self.loadDetails(data);
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  loadDetails(data: any) {
    this.addProfileDataService.prospectData = data;
    this.addProfileDataService.createDocumentMap(data.documents);
    this.docMapLoaded = true;
    var docLength: any = this.addProfileDataService.docLength;
    for (var i = 0; i < docLength - 1; i++) {
      this.addDocuments.push(1);
    }
    this.cdr.detectChanges();
  }
  addMore() {
    this.addDocuments.push(1);
    $('.add-confidential-item').hide();
  }
  remove(i: number) {
    this.addDocuments.splice(i, 1);
  }
}