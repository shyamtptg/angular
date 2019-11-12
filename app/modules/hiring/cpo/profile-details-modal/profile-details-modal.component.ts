import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { NewHiringRequestDataService1 } from '../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { AddProfileDataService } from '../../recruiter/addprofile/add-profile.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { SkillProficiency } from '../../models/SkillProficiency';
import { SkillsProficiencyByCategory } from '../../models/SkillsProficiencyByCategory';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

var FileSaver = require('filesaver.js-npm');

@Component({
	selector: 'profile-details-modal',
	templateUrl: 'profile-details-modal.component.html'
})

export class ProfileDetailsModal {
  @Input() profileId: string;
  @Input() disable: boolean;
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
    public rejectprofile: boolean = false;
    // skillset varialbles end
    display: boolean = false;
    comboData:any;
    profileDetails: any = {};
     resumeDetails: any;
    //skillset view child
    @ViewChild('skillDetailsForm') public skillForm: any;
    @ViewChild('tablist') tablist:any;
    constructor(
      private hiringRequestDataService: NewHiringRequestDataService1,
      private router: Router,
      private route: ActivatedRoute,
      private addProfileDataService: AddProfileDataService,
      private loaderService: LoaderService,
      private dialogService: DialogService,
      private errorHandleService: ErrorHandleService
    ){}
    showDialog(){
      var self = this;
      if (self.profileId) {
      	var data = self.addProfileDataService.getProspectCombos();
        if(data){
          self.comboData = {
            employmenttype: data['EMPLOYMENT_TYPE'],
            documenttype: data['DOCUMENT_TYPE'],
            noticeperiod: data['NOTICE_PERIOD'],
            prospectSource: data['PROSPECT_SOURCE']
          }
         }
         self.loadProfileDataWithId(self.profileId);
       }
    }
    loadProfileDataWithId(id: any){
    var self = this;
    this.hiringRequestDataService.loadProspectDataById(id).subscribe(data => {
          self.addProfileDataService.ProspectData = data;
          self.profileDetails = data;
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
            if(date){
              self.profileDetails.dateOfBirth = this.formatDate(date);
            }
           if(!(self.profileDetails.skillSets.length > 0)){
             var skillDetails = self.tablist.getTabByTitle('Skill Set');
             skillDetails[0]['hidden'] = true;
           }else{
             self.loadSkillSet();
          }  
        },error =>{
          self.errorHandleService.handleErrors(error);
        });
    }
    formatDate(date: any){
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
      this.techSkillsCatwise = {
         'skillSets': []
        };
        var data = this.addProfileDataService.getHiringCombos();
        if(data){
           this.categoryNames = data['SKILL_CATEGORY'];
           this.categoryId = 9999;
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
}