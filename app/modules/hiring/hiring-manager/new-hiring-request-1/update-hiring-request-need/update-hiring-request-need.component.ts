import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NewHiringRequestDataService1 } from '../new-hiring-request-service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { DialogService } from './../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
	selector: 'update-hiring-request-need',
	templateUrl: './update-hiring-request-need.component.html'
})

export class UpdateHiringRequestNeed implements OnInit {
  @Input() needData: any;
  @Input() needIndex: any;
  @Input() comboData: any;
  @Input() hiringReqId: any;
  @Input() loadDefaultPractice:Subject<any>;
  resetJobDesc: Subject<any> = new Subject();
  public panelList: any;
  public modalId: any;
  public expectedStartingDate: string;
  private disableState: boolean;
  public interviewCriterion: any;
  public interviewPanelComboData: any;
  public successMessage: string;
  public jobDescriptionId: any;
  public needActive: boolean = false;
  public needNum: any;
  public  today:Date;
  public templateNames: any;
  public  removeHiringNeed:boolean
  public needStatus: boolean = true;
  @Input() hideFeature: boolean;
 isDisable:boolean =false;
  @Output() remove = new EventEmitter<number>();
  @ViewChild('hiringNeed') hiringNeed:ElementRef;
  constructor(
    private hiringRequestDataService: NewHiringRequestDataService1,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.today = new Date();
  }
  ngAfterViewChecked(){
    if(this.needActive){
     //var contentHeight = $('.content-wrapper').height();
     //$('.sidebar-menu').height(contentHeight+15);
    }
  }
  ngOnDestroy() {
    $('.ng2-tag-input').removeClass('adjust-index');
    this.needActive = false;
  }
  ngOnInit() {
    this.loadDetails();
    const self = this;
    this.loadDefaultPractice.subscribe(event => {
      self.comboData.practice = event['data'];
      self.needData.practiceId = event['practice'] * 1;
      self.loadCompetenciesForPractice();
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  toggleHiringNeedDetails(){
    var plusIcon = $('.plus-icon'),
    minusIcon = $('.minus-icon'),
    hiringNeedDetails = $('.hiring-need-details');
    $('.collapse-job-desc').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
    $('.job-desc-content').fadeOut(700);
  	if(hiringNeedDetails.eq(this.needIndex).hasClass('close')){
  	  hiringNeedDetails.each(function(ind:any, elem:any){
  		elem.style.display = 'none';
  	  });
  	  this.needActive = true;
  	  plusIcon.css("display","block");
  	  minusIcon.css("display","none");
  	  hiringNeedDetails.addClass('close');
  	  hiringNeedDetails.removeClass('open');
  	  plusIcon.eq(this.needIndex).css("display","none");
  	  minusIcon.eq(this.needIndex).css("display","block");
  	  hiringNeedDetails.eq(this.needIndex).addClass('open');
  	  hiringNeedDetails.eq(this.needIndex).removeClass('close');
  	  hiringNeedDetails.eq(this.needIndex).slideToggle(700);
  	  var self = this;
  	  setTimeout(()=>{
		    var body = $("html");
		    body.stop().animate({scrollTop: $('update-hiring-request-need').eq(self.needIndex).offset().top+56*(self.needIndex)-75}, 500, 'swing');
  	  },650);
  	}else{
  	  hiringNeedDetails.eq(this.needIndex).slideToggle(700);
  	  setTimeout(()=>{
  	  plusIcon.eq(this.needIndex).css("display","block");
  	  minusIcon.eq(this.needIndex).css("display","none");
  	  hiringNeedDetails.eq(this.needIndex).addClass('close');
  	  hiringNeedDetails.eq(this.needIndex).addClass('open');
  	  },650);
  	}
  }
  loadCompetenciesForPractice() {
    var practiceId = this.needData.practiceId, self = this;
  this.comboData.competency = this.hiringRequestDataService.getPracticeMap()['pracCompetencies'][practiceId];
  if(this.comboData.competency.length > 0){
    self.needData.competencyId = self.comboData.competency[0]['id'];
  }
  var practiceName = this.hiringRequestDataService.getPracticeMap();
    this.needData.practiceName = practiceName['pracNames'][practiceId];
   var depId = this.hiringRequestDataService.hiringDepId;
   self.resetJobDesc.next('reset');
   if (depId && practiceId) {
    this.hiringRequestDataService.loadJobDescriptionTemplateName(depId, practiceId, 0, 800).subscribe(data=>{
       data = data.json() && data.json().content;
       self.templateNames = data;
       this.isDisable = self.templateNames.length;
     }, error => {
      self.errorHandleService.handleErrors(error);
      });
    }
  }
  loadCompetenciesByPractice(){
  
	var practiceId = this.needData.practiceId, self = this;
	this.comboData.competency = this.hiringRequestDataService.getPracticeMap()['pracCompetencies'][practiceId];
	var practiceName = this.hiringRequestDataService.getPracticeMap();
    this.needData.practiceName = practiceName['pracNames'][practiceId];
   var depId = this.hiringRequestDataService.hiringDepId;
   if(depId && practiceId){
    this.hiringRequestDataService.loadJobDescriptionTemplateName(depId, practiceId, 0, 800).subscribe(data=>{
       data = data.json() && data.json().content;
       self.templateNames = data;
       if (self.templateNames.length === 0 ){
         this.isDisable = true;
         self.resetJobDesc.next('reset');
       } else {
         this.isDisable = false;
       }
     }, error => {
      self.errorHandleService.handleErrors(error);
      });
    }
  }
  addNewPanel(){
    this.panelList.push({
      "panelNumber": this.panelList.length + 1
    });
    this.adjustPanelNumbers(this.panelList);
  }
  removePanel(panel: any){
    var index = this.panelList.indexOf(panel), self = this;
    if (index !== -1 && this.panelList.length > 1) {
      this.dialogService.render([{
        title: 'Confirmation',
        message: 'Are you sure you want to remove the panel?',
        yesLabel: 'YES'
      }])
      .subscribe(result => {
        self.panelList.splice(index, 1);
        self.adjustPanelNumbers(self.panelList);
      });
    }
  }
  adjustPanelNumbers(panelList: any){
    panelList.forEach(function(element: any, index: any){
      panelList[index]['panelNumber'] = index + 1;
    });
  }
  setDisableState(state: boolean){
  	this.disableState = state;
  }
  validateExpReq(exp: string){
   const needData = this.needData,
   minExp = needData && needData.minimumExperienceInYears,
   maxExp = needData && needData.maximumExperienceInYears;
   if (minExp && maxExp && (minExp > maxExp)) {
    this.dialogService.render([{
      title: 'Warning',
      message: 'Minimum experience should be less than maximum experience.',
      yesLabel: 'OK'
    }])
    .subscribe(result => {
      if (this.needData && exp === 'min') {
        this.needData.minimumExperienceInYears = '';
      } else if (this.needData) {
        this.needData.maximumExperienceInYears = '';
      }
    });
   }
  }
  removeNeed() {
   var self = this;
   this.removeHiringNeed = true;
   if(self.needData.id){
   setTimeout(() => {
    self.successMessage = 'Do You Want to Delete Hiring Request Need ?';
    this.dialogService.render([{
      title: 'Confimation',
      message: self.successMessage,
      yesLabel: 'YES',
      noLabel: 'NO'
    }])
    .subscribe(result => {
      if (result) {
        self.loaderService.showLoading();
        self.hiringRequestDataService.deleteHiringRequestNeedDetails(self.hiringReqId, self.needData.id).subscribe(
           data => {
             if (data['status'] === 200) {
               self.successMessage = 'Hiring request need deleted successfully';
               self.loaderService.hideLoading();
               self.hiringRequestDataService.needNum = self.needIndex;
               this.dialogService.render([{
                  title: 'Success',
                  message: 'Hiring request need deleted successfully.',
                  yesLabel: 'OK'
                }])
                .subscribe(res => {
                  self.deleteNeed();
                });
             }
           }, error => {
            self.errorHandleService.handleErrors(error);
          });
      }
    });
   }, 400);
  } else{
    self.hiringRequestDataService.needNum = self.needIndex;
    self.deleteNeed();
  }
  }
  deleteNeed(){
  	this.remove.emit(this.hiringRequestDataService.needNum);
  	this.hiringRequestDataService.needNum = null;
  }
  getPanelMembers(panelMembers: any){
  	var self = this,
  	result: any = [];
  	panelMembers.forEach(function(element: any, index: any){
      result.push(self.getCode(element, self.interviewPanelComboData['panelMembers']));
    });
    return result;
  }
  getSelectionCriterion(selectionCriterion: any){
  	var self = this,
  	result: any = [];
  	selectionCriterion.forEach(function(element: any, index: any){
      result.push(self.getCode(element, self.interviewPanelComboData['panelCriterion']));
    });
    return result;
  }
  getCode(searchString: any, objects: any){
		for(var i=0; i<objects.length; i++) {
  			for(let key in objects[i]) {
    			if(objects[i][key].toString().indexOf(searchString)!=-1) {
      				return objects[i]['id'];
    			}
  			}
		}
  }
  getInterviewPanels(){
  	var panels = this.needData.interviewPanels,
  	interviewPanels: any = [],
  	self = this;
  	panels.forEach(function(element: any, index: any){
      interviewPanels.push({
      	"name": element.name,
      	"level": element.level,
      	"members": self.getPanelMembers(element.panelMembers),
      	"criteria": self.getSelectionCriterion(element.selectionCriterion)
      });
    });
    return interviewPanels;
  }
  getNeedPayload(){ 
  	var needDetails = this.needData;
  	var hiringNeedPayload = {
  		"practiceId": needDetails.practiceId,
  		"workLocationId": needDetails.workLocationId,
  		"competencyId": needDetails.competencyId,
  		"expectedRole": needDetails.expectedRole,
  		"expectedStartDate": new Date(needDetails.expectedStartDate).getTime(),
  		"resourcesCount": needDetails.resourcesCount,
  		"minimumExperienceInYears": needDetails.minimumExperienceInYears,
  		"maximumExperienceInYears": needDetails.maximumExperienceInYears,
  		"interviewPanels": this.getInterviewPanels(),
  		"operatingModel" : needDetails.model,
  		"purpose": needDetails.purpose,
  		"jobDescriptionId": this.jobDescriptionId
  	};
   return hiringNeedPayload;
  }
  updateHiringRequestNeed(){
    var self = this;
    var needPayload = self.getNeedPayload();
    if(!needPayload.jobDescriptionId){
      self.successMessage = 'Please Select Job Description';
      $('.ng2-tag-input').addClass('adjust-index');
      this.dialogService.render([{
        title: 'Warning',
        message: self.successMessage,
        yesLabel: 'OK'
      }]);
    } else {
      self.loaderService.showLoading();
      self.hiringRequestDataService.updateHiringRequestNeedDetails(needPayload, self.hiringReqId, self.needData.id).subscribe(
      data => {
        if (data['status'] === 200) {
          self.successMessage = 'Hiring request need updated successfully';
          self.loaderService.hideLoading();
          $('.ng2-tag-input').addClass('adjust-index');
          this.dialogService.render([{
            title: 'Success',
            message: self.successMessage,
            yesLabel: 'OK'
          }])
          .subscribe(result => {
            self.closeNeed();
          });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  saveHiringRequestNeed() {
    const self = this;
    const needPayload = self.getNeedPayload();
    if (!needPayload.jobDescriptionId) {
      this.dialogService.render([{
        title: 'Warning',
        message: 'Please Select Job Description.',
        yesLabel: 'OK'
      }],
      '350px');
    } else {
      self.loaderService.showLoading();
      self.hiringRequestDataService.saveHiringRequestNeedDetails(needPayload, self.hiringReqId).subscribe(
      data => {
        if (data['status'] === 201) {
          if (data['_body']) {
            self.needData.id = data['_body'];
          }
          self.successMessage = 'Hiring request need saved successfully';
          self.loaderService.hideLoading();
          $('.ng2-tag-input').addClass('adjust-index');
          this.dialogService.render([{
            title: 'Success',
            message: 'Hiring request need saved successfully.',
            yesLabel: 'OK'
          }],
          '350px');
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  setJobId(jobId: any) {
   this.jobDescriptionId = jobId;
  }
  closeNeed(){
    var plusIcon = $('.plus-icon'),
    minusIcon = $('.minus-icon'),
    hiringNeedDetails = $('.hiring-need-details.open');
    hiringNeedDetails.slideToggle(700);
    setTimeout(()=>{
  	  plusIcon.css("display","block");
  	  minusIcon.css("display","none");
  	  hiringNeedDetails.addClass('close');
  	  hiringNeedDetails.addClass('open');
  	  },650);
  	this.loadDetails();
  }
  getDetails(event: any){
   
  }
  loadDetails(){
    this.panelList = this.needData.interviewPanels;
    this.adjustPanelNumbers(this.panelList);
    this.modalId = "modal"+(new Date()).getMilliseconds()+Math.floor(Math.random()*1000);
    this.needData.expectedStartDate = this.needData.expectedStartDate && new Date(this.needData.expectedStartDate);
    this.jobDescriptionId = this.needData.jobDescriptionId;
    if(this.needData.practiceId){
      this.needStatus = false;
      this.loadCompetenciesByPractice();
    }else{
      var userInfo: any = this.commonService.getItem('currentUserInfo');
      if(userInfo && this.needStatus){
        var pracId = userInfo['practiceId'];
        if(this.commonService.isPracticeAvailable(this.comboData.practice, pracId)){
          this.needData.practiceId = pracId;
          this.loadCompetenciesByPractice();
        }
      }
    }
      this.interviewCriterion = this.comboData && this.comboData.criterion;
      var self = this;
      this.hiringRequestDataService.getPanelMembers().subscribe(data => {
      self.interviewPanelComboData = {
        'panelMembers': data['_embedded']['employees'],
        'panelCriterion': this.interviewCriterion
      };
      var panelMembers: any = [];
      self.interviewPanelComboData['panelMembers'] && self.interviewPanelComboData['panelMembers'].forEach(function(elem:any, ind:any){
          panelMembers.push({
              'id': elem.id,
              'name': elem.fullName
          });
       });
       var panelCriterion: any = [];
      self.interviewPanelComboData['panelCriterion'] && self.interviewPanelComboData['panelCriterion'].forEach(function(elem:any, ind:any){
          panelCriterion.push({
              'id': elem.id,
              'name': elem.title
          });
       });
       self.interviewPanelComboData['panelMembers'] = panelMembers;
       self.interviewPanelComboData['panelCriterion'] = panelCriterion;
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  validateFinalRoundSelection(panel: any){
    var count = 0;
    this.panelList && this.panelList.forEach((ele:any)=> {
      if(ele.level === 'FINAL'){
        count++;
      }
    });
    if (count > 1) {
      panel.level = '';
      panel.name = '';
      this.dialogService.render([{
        title: 'Warning',
        message: 'There is already one final round panel. Please select a different panel level.',
        yesLabel: 'OK'
      }]);
    }
  }
  restrictExpCharcters(value: any) {
    return  this.commonService.restrictExpCharcters(value);
  }

  restrictFloatnumber = function (e: any) {
    return this.commonService.restrictFloatnumber(e);
  };
}
