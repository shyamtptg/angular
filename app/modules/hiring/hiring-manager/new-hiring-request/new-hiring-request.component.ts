import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HiringManagerComponent } from '../hiring-manager.component';
import { NewHiringRequestDataService } from './new-hiring-request-service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HiringRequestDetails } from '../models/hiring-request-details';
import { JobDescriptionDetails } from '../models/job-description';

import { Tab } from './../../../../shared/tablist/tab';

@Component({
  templateUrl: './new-hiring-request.component.html'
})
export class NewHiringRequest {
  @ViewChild('tablist') tablist:any;
  @ViewChild('jobDescription') jobDescription:ElementRef;
  @ViewChild('companyBackground') companyBackground:ElementRef;
  @ViewChild('basicHiringDetails') basicHiringDetails:ElementRef;
  @ViewChild('jobDescriptionDetails') jobDescriptionDetails:ElementRef;
  @ViewChild('interviewPanelDetails') interviewPanelDetails:ElementRef;
  @ViewChild('hiringRequestSummary') hiringRequestSummary:ElementRef;
  @ViewChild('jobDescriptionNext') jobDescriptionNext:ElementRef;
  @ViewChild('jobDescriptionFinish') jobDescriptionFinish:ElementRef;
  public code: string;
  public description: string;
  public location: string;
  public country: string;
  public designTags: string[];
  public technicalTags: string[];
  public certificationTags: string[];
  public progressPercentage: number;
  public panelList: any = [{"panelNumber": 1}];
  public existingJobDescId: string = "existingJobDescId";
  public existingJobDescTitle: string = "I Already have a Job Description";
  public newJobDescId: string = "newJobDescId";
  public newJobDescTitle: string = "Create a new Job Description";
  public detailsFrmHiringRequestData: HiringRequestDetails;
  public detailsFrmHiringSummaryData: HiringRequestDetails;
  public jobDescData: JobDescriptionDetails;
public today:Date;
   constructor(private HiringManagerComponent:HiringManagerComponent, private modalService: NgbModal, el: ElementRef, private hiringRequestDataService: NewHiringRequestDataService, private route: ActivatedRoute){
     this.today = new Date();
    HiringManagerComponent.URLtitle = "Hiring Requests / New Hiring Request";
    this.code = 'UX120981';
    this.description = 'UX Designer';
    this.location = 'Hyderabad';
    this.country = 'India';
    this.certificationTags = ['CUA(Usability Certification)'];
    this.progressPercentage = 0;
  }
  ngOnInit() {
    var self=this;
    setTimeout(()=>{
     self.route.params.subscribe(params => {
     if (params['id']) {
      self.hiringRequestDataService.loadHiringRequestDataById(params['id']);
     }else {
      self.hiringRequestDataService.loadHiringRequestData();
     }
     });
     setTimeout(()=>{
     var data: any = self.hiringRequestDataService.getHiringRequestData();
     self.detailsFrmHiringRequestData = (data ? data:undefined);
     self.panelList = (self.detailsFrmHiringRequestData ? self.detailsFrmHiringRequestData.interviewPanels : []);
    }, 100);
    },100);
  }
  ngOnDestroy() {
    $('.sidebar-menu').height('100%');
  }

  showJobDescription(value: any) {
  
    //const modalRef = this.modalService.open(NgNewHiringModalContent, { windowClass: 'dark-modal' });
    //let modalInstance = modalRef.componentInstance;
    this.basicHiringDetails.nativeElement.hidden = true;
    this.jobDescriptionDetails.nativeElement.hidden = false;
    //modalInstance.name = 'Are you sure you want to accept the Offer?';
  }
  tabSelect(currentTab: Tab){
   var title = currentTab['title'],
  	tabs = ['Company Background', 'Job Description', 'Position/Responsibilities', 'Skills', 'Education', 'Initial Screening Questions'],
  	index = tabs.indexOf(title);
  	if(index == tabs.length-1){
       this.jobDescriptionNext.nativeElement.hidden = true;
       this.jobDescriptionFinish.nativeElement.hidden = false;
  	}else{
       this.jobDescriptionNext.nativeElement.hidden = false;
       this.jobDescriptionFinish.nativeElement.hidden = true;
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
       this.jobDescriptionFinish.nativeElement.hidden = false;
  	}else{
       this.jobDescriptionNext.nativeElement.hidden = false;
       this.jobDescriptionFinish.nativeElement.hidden = true;
  	}
  	this.updateProgress(index+1);
  }
  updateProgress(index: number){
  var tabs = ['Company Background', 'Job Description', 'Position/Responsibilities', 'Skills', 'Education', 'Initial Screening Questions'];
    this.progressPercentage = Math.round(((index+1)/(tabs.length))*100);
  }
  addNewPanel(){
    this.panelList.push({
      "panelNumber": this.panelList.length + 1
    });
    this.adjustPanelNumbers(this.panelList);
  }
  newHiringRequestNext(){
    this.basicHiringDetails.nativeElement.hidden = true;
    this.interviewPanelDetails.nativeElement.hidden = false;
    this.jobDescriptionDetails.nativeElement.hidden = true;
    this.hiringRequestSummary.nativeElement.hidden = true;
    this.HiringManagerComponent.URLtitle = "Hiring Requests / New Hiring Request";
  }
  finishJobDescription(){
    this.basicHiringDetails.nativeElement.hidden = false;
    this.jobDescriptionDetails.nativeElement.hidden = true;
    this.interviewPanelDetails.nativeElement.hidden = true;
    this.hiringRequestSummary.nativeElement.hidden = true;
    this.HiringManagerComponent.URLtitle = "Hiring Requests / New Hiring Request";
    /*if(this.jobDescData && this.jobDescData.details){
      var skills = this.jobDescData.details.skills,
      designSkills = skills.uxDesignSkills,
      technicalSkills = skills.technicalSkills,
      certificationSkills = skills.certifications,
      self = this;
      designSkills.length = 0;
      technicalSkills.length = 0;
      certificationSkills.length = 0;
      self.designTags.forEach(function(elem:any, ind:any){
        designSkills.push({
          "id": ind+1,
          "name": ((elem.display) ? elem.display : elem)
        });
      })
      self.technicalTags.forEach(function(elem:any,ind:any){
        technicalSkills.push({
          "id": ind+1,
          "name": ((elem.display) ? elem.display : elem)
        });
      })
      self.certificationTags.forEach(function(elem:any,ind:any){
        certificationSkills.push({
          "id": ind+1,
          "name": ((elem.display) ? elem.display : elem)
        });
      })
    }*/
  }
  /*saveHiringDetails(detailsFrmHiringRequestData: any){
    this.hiringRequestDataService.updateHiringDetailsData(detailsFrmHiringRequestData);
  }*/
  loadHiringRequestSummary(){
    var data: any = this.hiringRequestDataService.getHiringSummaryData();
    this.detailsFrmHiringSummaryData = (data ? data:undefined);
    this.panelList = (this.detailsFrmHiringSummaryData ? this.detailsFrmHiringSummaryData.interviewPanels : undefined);
    this.basicHiringDetails.nativeElement.hidden = true;
    this.jobDescriptionDetails.nativeElement.hidden = true;
    this.interviewPanelDetails.nativeElement.hidden = true;
    this.hiringRequestSummary.nativeElement.hidden = false;
    this.HiringManagerComponent.URLtitle = "Hiring Requests / Hiring Request Summary";
  }
  ngAfterViewChecked(){
    var contentHeight = $('.content-wrapper').height();
    $('.sidebar-menu').height(contentHeight+15);
  }
  removePanel(panel: any){
  var index = this.panelList.indexOf(panel);
    if (index !== -1 && this.panelList.length > 1) {
        this.panelList.splice(index, 1);
        this.adjustPanelNumbers(this.panelList);
    }  
  }
  adjustPanelNumbers(panelList: any){
    panelList.forEach(function(element: any, index: any){
      panelList[index]['panelNumber'] = index + 1;
    });
  }
  loadJobDescriptionDetails(data: JobDescriptionDetails){
    this.jobDescData = (data ? data:undefined);
    this.designTags = []; 
    this.technicalTags = [];
    this.certificationTags = [];
    if(this.jobDescData && this.jobDescData.details){
      var skills = this.jobDescData.details.skills,
      designSkills = skills.uxDesignSkills,
      technicalSkills = skills.technicalSkills,
      certificationSkills = skills.certifications,
      self = this;
      designSkills.forEach(function(element: any, index: any){
        self.designTags.push(element.name);
      });
      technicalSkills.forEach(function(element: any, index: any){
        self.technicalTags.push(element.name);
      });
      certificationSkills.forEach(function(element: any, index: any){
        self.certificationTags.push(element.name);
      });
    }   
  }
}