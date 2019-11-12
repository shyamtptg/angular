import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewHiringRequestDataService1 } from '../new-hiring-request-service';
import { HiringComponent } from '../../../hiring.component';
import { JobDescriptionDetails } from '../../models/job-description';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { Tab } from '../../../../../shared/tablist/tab';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
	templateUrl: './new-job-description.component.html'
})

export class NewJobDescription {
  public code: string;
  public description: string;
  public location: string;
  public country: string;
  public designTags: string[];
  public technicalTags: string[];
  public certificationTags: string[];
  public progressPercentage: number;
  public jobDescData: JobDescriptionDetails;
  public departmentOptions: any;
  public practiceOptions: any;
  public jobDescId: string;
  public successMessage: string;
  public editMode: boolean = false;
  public viewMode: boolean = false;
  public jobDescriptionData: any = {
   'details':{}
  };
  @ViewChild('jobDescTemplateDetails') jobDescTemplateDetails:ElementRef;
  @ViewChild('jobDescriptionDetails') jobDescriptionDetails:ElementRef;
  @ViewChild('jobDescriptionNext') jobDescriptionNext:ElementRef;
  @ViewChild('jobDescriptionFinish') jobDescriptionFinish:ElementRef;
  @ViewChild('tablist') tablist:any;
  constructor(
    private hiringComponent: HiringComponent,
    private loaderService: LoaderService,
    private hiringRequestDataService: NewHiringRequestDataService1,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Hiring Requests / Create New Job Description";
    this.code = 'UX120981';
    this.description = 'UX Designer';
    this.location = 'Hyderabad';
    this.country = 'India';
    this.certificationTags = ['CUA(Usability Certification)'];
    this.progressPercentage = 0;
  }
  ngOnInit() {
    var self=this;
    self.editMode = (self.hiringRequestDataService.jobDescMode == 'edit') ? true : false;
      self.route.params.subscribe(params => {
        let currentUrl = this.router.url.match("jobdesc-details");
        self.viewMode = (currentUrl && currentUrl.length) ? true : false;
        var hiringCombos = self.hiringRequestDataService.getHiringCombos();
        if(!hiringCombos){
          self.hiringRequestDataService.getHiringComboDetails().subscribe(data=>{
            self.departmentOptions = data['DEPARTMENT'];
            self.practiceOptions = data['PRACTICE'];
            self.loadDetails(params);
          }, error => {
            self.errorHandleService.handleErrors(error);
          });
        }else if(hiringCombos){
          self.departmentOptions = hiringCombos['DEPARTMENT'];
          self.practiceOptions = hiringCombos['PRACTICE'];
          self.loadDetails(params);
        }
      });
  }
  loadDetails(params: any){
    var self = this;
    if (params['jobDescId']) {
      self.hiringComponent.URLtitle = "Hiring Requests / Edit Job Description";
      self.editMode = true;
      self.loaderService.showLoading();
      self.hiringRequestDataService.loadJobDescriptionDataById(params['jobDescId']).subscribe(data=>{
        self.jobDescriptionData = data.json();
        self.jobDescriptionData.details = JSON.parse(data.json().details);
        var details = JSON.parse(data.json().details);
        if(self.viewMode && details && details.skills){
          var designSkills = [];
           details.skills.uxDesignSkills && details.skills.uxDesignSkills.forEach(function (elem: any, ind: any) {
            designSkills.push({
              'display': elem['display'],
              'value': elem['value'],
              'readonly': true
            });
          });
          var technicalSkills = [];
          details.skills.technicalSkills && details.skills.technicalSkills.forEach(function (elem: any, ind: any) {
            technicalSkills.push({
              'display': elem['display'],
              'value': elem['value'],
              'readonly': true
            });
          });
          var certifications = [];
          details.skills.certifications && details.skills.certifications.forEach(function (elem: any, ind: any) {
            certifications.push({
              'display': elem['display'],
              'value': elem['value'],
              'readonly': true
            });
          });
          var skills = {
            designSkills : designSkills,
            technicalSkills: technicalSkills,
            certifications: certifications,
            others: details.skills.others
          };
          self.jobDescriptionData.details.skills = skills;
        }
        self.loaderService.hideLoading();
        self.jobDescData = self.jobDescriptionData;
        if(self.jobDescData.departmentId){
          self.loadPracticesByDepartment();
          self.jobDescData.practiceId = data.json().practiceId;
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }else {
      self.editMode = false;
      var jobData: any = self.hiringRequestDataService.getJobDescTempData();
      jobData.details.skills = (jobData.details.skills) ? jobData.details.skills : {};
      self.jobDescData = jobData;
      if(self.jobDescData){
        self.jobDescData.departmentId = <any>"";
        self.jobDescData.practiceId = <any>"";
      }
    }
  }
  ngOnDestroy() {
    this.hiringRequestDataService.jobDescMode= null;
    if(this.jobDescData){
      this.jobDescData.details.companyOverview = null;
      this.jobDescData.details.practiceOverview = null;
      this.jobDescData.details.jobDesc = null;
      this.jobDescData.details.responsibilities = null;
      this.jobDescData.details.skills = null;
      this.jobDescData.details.education = null;
      this.jobDescData.details.screeningQuestions = null;
    }
  }
  tabSelect(currentTab: Tab){
   var title = currentTab['title'],
    tabs = ['Company Background', 'Job Description', 'Position/Responsibilities', 'Skills', 'Education', 'Initial Screening Questions'],
    index = tabs.indexOf(title);
    if(index == tabs.length-1){
       this.jobDescriptionNext.nativeElement.hidden = true;
       if(this.commonService.hideFeature('UPDATE_JOB_DESCRIPTION')){
       this.jobDescriptionFinish  ?  this.jobDescriptionFinish.nativeElement.hidden = true:undefined;
       }else{
      this.jobDescriptionFinish ?  this.jobDescriptionFinish.nativeElement.hidden = false:undefined;
       }
    }else{
      this.jobDescriptionNext.nativeElement.hidden = false;
    this.jobDescriptionFinish ? this.jobDescriptionFinish.nativeElement.hidden = true:undefined;
    }
    this.updateProgress(index);
  }
  next(){
    var activeTab = this.tablist.getCurrentTab(),
    title = activeTab[0]['title'],
    tabs = ['Company Background', 'Job Description', 'Position/Responsibilities', 'Skills', 'Education', 'Initial Screening Questions'],
    index = tabs.indexOf(title);
    activeTab[0]['active'] = false;
    if(index == tabs.length-1){
       this.tablist.getAllTabs()[0]['active'] = true;
    }else{
       this.tablist.getAllTabs()[index+1]['active'] = true;
    }
    if(index == tabs.length-2){
       this.jobDescriptionNext.nativeElement.hidden = true;
       this.jobDescriptionFinish ?this.jobDescriptionFinish.nativeElement.hidden = false:undefined;
    }else{
      this.jobDescriptionNext.nativeElement.hidden = false;
     this.jobDescriptionFinish ? this.jobDescriptionFinish.nativeElement.hidden = true:undefined;
    }
    this.updateProgress(index+1);
  }
  updateProgress(index: number){
  var tabs = ['Company Background', 'Job Description', 'Position/Responsibilities', 'Skills', 'Education', 'Initial Screening Questions'];
    this.progressPercentage = Math.round(((index+1)/(tabs.length))*100);
  }
  finishJobDescription(){
    var jobDescData = this.jobDescData,
    jobDescriptionPayload = {
      "departmentId": jobDescData.departmentId,
      "practiceId": jobDescData.practiceId,
      "templateName": jobDescData.templateName,
      "details": JSON.stringify(jobDescData.details),
      "deprecated": ((this.hiringRequestDataService.jobDescMode == 'edit') ? jobDescData.deprecated : false)
    };
    if (!jobDescriptionPayload.departmentId) {
        this.dialogService.render(
          [{
              title: 'Warning',
              message: 'Please select a department',
              yesLabel: 'OK'
          }]
      );
        return;
    }else if(!jobDescriptionPayload.practiceId){
        this.dialogService.render(
          [{
              title: 'Warning',
              message: 'Please select a practice',
              yesLabel: 'OK'
          }]
      );
        return;
     }else if(!jobDescriptionPayload.templateName){
        this.dialogService.render(
          [{
              title: 'Warning',
              message: 'Please enter a template name',
              yesLabel: 'OK'
          }]
      );
        return;
     }

   var self = this,
   jobId;
    self.loaderService.showLoading();
    if(self.hiringRequestDataService.jobDescMode == 'edit'){
      jobId = self.hiringRequestDataService.jobDescId;
      self.hiringRequestDataService.updateJobDescriptionDetails(jobDescriptionPayload, jobId).subscribe(
      data => {
        if(data.status == 200){
          self.successMessage = 'Job description updated successfully';
          self.loaderService.hideLoading();
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              self.showJobDescList();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }else {
      self.hiringRequestDataService.saveJobDescriptionDetails(jobDescriptionPayload).subscribe(
      data => {
        self.jobDescId = data['_body'];
        if(self.jobDescId){
          self.successMessage = 'Job description created successfully';
          self.loaderService.hideLoading();
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              self.showJobDescList();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      }); 
    }  
  }
  showJobDescList(){
   this.hiringRequestDataService.jobDescMode = null;
   this.router.navigate(['../hiring/hiring-requests/jobdesclist']);
  }
  loadPracticesByDepartment(){
   var depId = this.jobDescData.departmentId;
   this.practiceOptions = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
   this.jobDescData.practiceId = <any>"";
  }
}