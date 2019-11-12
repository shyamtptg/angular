import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { InterviewDataService } from '../interviews.service';
import { AddProfileDataService } from '../../../recruiter/addprofile/add-profile.service';
import { SkillProficiency } from '../../../models/SkillProficiency';
import { SkillsProficiencyByCategory } from '../../../models/SkillsProficiencyByCategory';
import { AppConstants } from '../../../../../config/app.constants';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

var FileSaver = require('filesaver.js-npm');

@Component({
  selector: 'profile-details-dialog',
  templateUrl: 'profile-details.component.html'
})

export class InterviewerProfileDetails {
  // skillset variables
  private techSkills: Array<SkillProficiency>;
  public techSkillsCatwise: any;
  private availableTechSkills: Array<string>;
  private headers: any;
  public categoryId: any;
  public categoryNames: any;
  public skillProficiency: any = [];
  public categoryList: any = [];
  public editMode: boolean = false;
  public viewMode: boolean = true;
  // skillset varialbles end
  profileId: string;
  comboData: any;
  profileDetails: any = {};
  resumeDetails: any;
  // uploader:FileUploader = new FileUploader({url: this.appConstants.getConstants().myspacenxApiUrl + '/prospects', authToken: "Basic dXNlcjpjaGFuZHJh", authTokenHeader: "Authorization"});
  // file: File;
  // skillset view child
  @ViewChild('skillDetailsForm') public skillForm: any;
  @ViewChild('professionalDetailsForm') public frm: any;
  constructor(
    private interviewDataService: InterviewDataService,
    private router: Router, private route: ActivatedRoute,
    private addProfileDataService: AddProfileDataService,
    private appConstants: AppConstants,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) { }
  ngOnInit() {
    var self = this;
    var data = self.addProfileDataService.getProspectCombos();
    if (data) {
      self.comboData = {
        employmenttype: data['EMPLOYMENT_TYPE'],
        documenttype: data['DOCUMENT_TYPE'],
        noticeperiod: data['NOTICE_PERIOD'],
        prospectSource: data['PROSPECT_SOURCE']
      }
    }
    self.route.params.subscribe(params => {
      if (params['id']) {
        self.profileId = params['id'];
        self.loadProfileDataWithId(self.profileId);
      }
    });
  }
  loadProfileDataWithId(id: any) {
    var self = this;
    this.interviewDataService.loadProspectDataById(id).subscribe(data => {
      self.addProfileDataService.ProspectData = data;
      self.profileDetails = data;
      self.profileDetails.documents.forEach(function (elem: any, ind: any) {
        if (elem['documentType']['code'] == 'RESUME') {
          self.resumeDetails = {
            'title': elem['title'],
            'documentId': elem['documentId'],
            'prospectId': elem['prospectId']
          }
        }
      });
      var date = data.dateOfBirth && data.dateOfBirth.toString();
      var day = date && date.substring(0, 2),
        month = date && date.substring(2, 4),
        year = date && date.substring(4, 8);
      self.profileDetails.dateOfBirth = <any>(year + "-" + month + "-" + day);
      self.loadSkillSet();
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  loadSkillSet() {
    this.techSkillsCatwise = {
      'skillSets': []
    };
    var data = this.addProfileDataService.getHiringCombos();
    if (data) {
      this.categoryNames = data['SKILL_CATEGORY'];
      this.categoryId = 9999;
    }
    var data: any = this.addProfileDataService.getSkillData(), self = this;
    var skillCategoryList = (data ? data["skillSets"] : undefined);
    skillCategoryList && skillCategoryList.forEach(function (elem: any, ind: any) {
      var catId: any = elem['categoryId'];
      var categoryName = self.addProfileDataService.getSkillsMap()['skillCatNames'][catId];
      elem['categoryName'] = categoryName;
      var skills = self.addProfileDataService.getSkillsMap()['skills'][catId];
      var skillProficiencies = elem.skillProficiencies;
      skillProficiencies.forEach(function (elem: any, ind: any) {
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
  downloadFile(resumeDetails: any) {
    this.addProfileDataService.downloadResume(resumeDetails['prospectId'], resumeDetails['documentId']).subscribe(data => {
      var blob = new Blob([data['_body']], { type: "application/octet-stream" });
      FileSaver.saveAs(blob, resumeDetails['title']);
    }, error => {
      this.errorHandleService.handleErrors(error);
    });
  }
  navigateToPrevious() {
    var route = localStorage.getItem('previousRoute');
    route = (route) ? route : '../hiring/interviews/interviews';
    this.router.navigate([route]);
  }
}