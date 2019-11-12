import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Tab } from '../../../../../shared/tablist/tab';
import { NewHiringRequestDataService1 } from '../new-hiring-request-service';
import { JobDescriptionDetails } from '../../models/job-description';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
	selector: 'job-desc-modal',
	templateUrl: './job-description.component.html'
})

export class JobDescModal {
  @Input() modalId: any;
  @Input() modalTitle: any;
  @Input() jobId: any;
  @Input() depId: any;
  @Input() practId: any;
  @Input() isDisable:boolean;
  @Input() resetJobDesc:Subject<any>;
  @Output() setjobid = new EventEmitter<number>();
  public jobDescData: JobDescriptionDetails;
  public departmentOptions: any;
  public practiceOptions: any;
  public templateNames: any;
  public jobDescTemplateName: string;
  public jobDescriptionData: any = {
   'details': {}
  };
  constructor(
    private hiringRequestDataService: NewHiringRequestDataService1,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ){

  }
  ngOnInit(){
   
    var self = this;
    var data = self.hiringRequestDataService.getHiringCombos();
    if(data){
      this.departmentOptions = data['DEPARTMENT'];
      this.practiceOptions = data['PRACTICE'];
    }
    
    self.jobDescTemplateName = "Select a Job Description";
    if(self.hiringRequestDataService.mode == 'edit' && self.jobId){
      var self = this;
    self.hiringRequestDataService.loadJobDescriptionDataById(self.jobId).subscribe(data => {
        self.jobDescriptionData = data.json();
        self.jobDescriptionData.details = JSON.parse(data.json().details);
        var uxSkills = '', technicalSkills = '', certifications = '';
        self.jobDescriptionData.details.skills &&  self.jobDescriptionData.details.skills.uxDesignSkills && self.jobDescriptionData.details.skills.uxDesignSkills.forEach(function(elem:any, ind:any){
            if(uxSkills)
          uxSkills = uxSkills +", "+ elem['display'];
          else
            uxSkills =  elem['display'];
        
        });
        if(uxSkills){
          self.jobDescriptionData.details.skills.uxDesignSkills = uxSkills;
        }
        self.jobDescriptionData.details.skills &&  self.jobDescriptionData.details.skills.technicalSkills && self.jobDescriptionData.details.skills.technicalSkills.forEach(function(elem:any, ind:any){
          if(technicalSkills)
          technicalSkills = technicalSkills +", "+ elem['display'];
          else
            technicalSkills = elem['display'];
        });
        if(technicalSkills){
          self.jobDescriptionData.details.skills.technicalSkills = technicalSkills;
        }
        self.jobDescriptionData.details.skills &&  self.jobDescriptionData.details.skills.certifications && self.jobDescriptionData.details.skills.certifications.forEach(function(elem:any, ind:any){
         if(certifications)
          certifications = certifications +", "+ elem['display'];
          else
            certifications = elem['display'];
        });
        if(certifications){
          self.jobDescriptionData.details.skills.certifications = certifications;
        }
        self.jobDescData = self.jobDescriptionData;
        self.jobDescTemplateName = self.jobDescriptionData.templateName;
        self.setjobid.emit(self.jobDescriptionData.id);
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }else {
      setTimeout(() => {
       self.hiringRequestDataService.loadJobDescTempData();
        setTimeout(()=>{
          var data: any = self.hiringRequestDataService.getJobDescriptionTemplateData();
          if(data){
            self.jobDescData = data;
          }else{
            var jobData: any = self.hiringRequestDataService.getJobDescTempData();
            self.jobDescData = jobData;
            /*self.hiringRequestDataService.getJobDescriptionTemplateDetails().subscribe(data=>{
              self.jobDescData = data;
            });*/
          }
        }, 100);
      }, 100);
    }
    self.resetJobDesc && self.resetJobDesc.subscribe(event => { 
      if(event == 'reset'){
        self.jobDescTemplateName = 'Select a Job Description';
        self.setjobid.emit(null);
      }
    });
  }
  showJobDescription(e: any){
    $(e.target).toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
    $('.job-desc-content').fadeToggle(700);
  }
  modalOpen(){
    $('.ng2-tag-input').addClass('adjust-index');
    var self = this;
    if(this.jobDescData){
      self.loadTemplateDetails();
    }else{
      var data: any = self.hiringRequestDataService.getJobDescriptionTemplateData();
      if(data){
        self.jobDescData = data;
        self.loadTemplateDetails();
      }else{
         var jobData: any = self.hiringRequestDataService.getJobDescTempData();
         self.jobDescData = jobData;
         self.loadTemplateDetails();
        /*self.hiringRequestDataService.getJobDescriptionTemplateDetails().subscribe(data=>{
          self.jobDescData = data;
          self.loadTemplateDetails();
        });*/
      }
    }
  }
  loadTemplateDetails(){
    this.jobDescData.departmentId = this.hiringRequestDataService.hiringDepId;
    this.loadPracticesByDepartment(); 
  }
  loadPracticesByDepartment(){
   var depId = this.jobDescData.departmentId;
   this.practiceOptions = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
   this.jobDescData.practiceId = this.practId;
   this.loadTemplateNames();
  }
  resetIndex(){
    //this.loadJobDescriptionDetails();
    this.jobDescTemplateName = 'Select a Job Description';
    this.setjobid.emit(null);
    $('.ng2-tag-input').removeClass('adjust-index');
  }
  loadJobDescriptionDetails(){
    var self = this;
    var templateName: any = self.jobDescData.templateName;
    if(templateName === '99'){
      self.jobDescTemplateName = 'Select a Job Description';
      self.setjobid.emit(null);
    }else{
    self.hiringRequestDataService.loadJobDescriptionDataById(self.jobDescData.templateName).subscribe(data => {
        self.jobDescriptionData = data.json();
        self.jobDescriptionData.details = JSON.parse(data.json().details);
        var uxSkills = '', technicalSkills = '', certifications = '';
        self.jobDescriptionData.details.skills &&  self.jobDescriptionData.details.skills.uxDesignSkills && self.jobDescriptionData.details.skills.uxDesignSkills.forEach(function(elem:any, ind:any){
          uxSkills = uxSkills + elem['display'];
        });
        if(uxSkills){
          self.jobDescriptionData.details.skills.uxDesignSkills = uxSkills;
        }
        self.jobDescriptionData.details.skills &&  self.jobDescriptionData.details.skills.technicalSkills && self.jobDescriptionData.details.skills.technicalSkills.forEach(function(elem:any, ind:any){
          technicalSkills = technicalSkills + elem['display'];
        });
        if(technicalSkills){
          self.jobDescriptionData.details.skills.technicalSkills = technicalSkills;
        }
        self.jobDescriptionData.details.skills &&  self.jobDescriptionData.details.skills.certifications && self.jobDescriptionData.details.skills.certifications.forEach(function(elem:any, ind:any){
          certifications = certifications + elem['display'];
        });
        if(certifications){
          self.jobDescriptionData.details.skills.certifications = certifications;
        }
        self.jobDescData = self.jobDescriptionData;
        self.jobDescTemplateName = self.jobDescriptionData.templateName;
        self.setjobid.emit(self.jobDescriptionData.id);
      },error =>{
        self.errorHandleService.handleErrors(error);
      });
      }
  }
  loadTemplateNames(){
   
   var self = this;
   if(self.jobDescData.departmentId && self.jobDescData.practiceId){
   self.hiringRequestDataService.loadJobDescriptionTemplateName(self.jobDescData.departmentId, self.jobDescData.practiceId, 0, 800).subscribe(data=>{
      
      data = data.json() && data.json().content;
      self.templateNames = data;
      self.jobDescData.templateName = (self.jobId)? self.jobId: '99';
    },error =>{
      self.errorHandleService.handleErrors(error);
    });
    }
  }
}