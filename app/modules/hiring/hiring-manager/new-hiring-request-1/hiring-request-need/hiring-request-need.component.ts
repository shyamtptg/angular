import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewHiringRequestDataService1 } from '../new-hiring-request-service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { Tab } from '../../../../../shared/tablist/tab';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
	selector: 'hiring-request-need',
	templateUrl: './hiring-request-need.component.html'
})

export class HiringRequestNeed {
    public panelList: any;
    public modalId: any;
    public disableState: boolean;
    public interviewPanelComboData: any;
    public interviewCriterion: any;
    public interviewLevel: any;
    public successMessage: string;
    public jobDescriptionId: any;
    public pracId: any;
    public  today:Date;
    public templateNames: any;
    isDisable:boolean;
    @Input() needDetailsFrmHiringRequestData: any;
    @Input() disableStatus: boolean;
    @Input() hiringId: string;
    @Input() comboData: any;
    @Input() loadSelectedPractice:Subject<any>;
	@Output() back = new EventEmitter();
	@Output() addNewNeed = new EventEmitter();
	@Output() removeNeed = new EventEmitter();
	@Output() previousNeed = new EventEmitter();
	@Output() nextNeed = new EventEmitter();
  resetJobDesc:Subject<any> = new Subject();
	constructor(
    private hiringRequestDataService: NewHiringRequestDataService1,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.today = new Date();
  }
	ngOnInit() {
      this.panelList = this.needDetailsFrmHiringRequestData.needDetails && this.needDetailsFrmHiringRequestData.needDetails.interviewPanels;
      this.modalId = this.needDetailsFrmHiringRequestData.needNumber;
      var userInfo: any = this.commonService.getItem('currentUserInfo');
      if(userInfo){
        var pracId = userInfo['practiceId'],
        needDetails = this.needDetailsFrmHiringRequestData.needDetails;
        if(needDetails && this.commonService.isPracticeAvailable(this.comboData.practice, pracId)){
          needDetails.practice = pracId;
          this.loadCompetenciesByPractice();
        }
      }
      var self = this;
      this.loadSelectedPractice.subscribe(event => {
       self.comboData.practice = event['data'];
       self.needDetailsFrmHiringRequestData.needDetails.practice = event['practice']*1;
       self.loadCompetenciesByPractice();
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
      this.interviewCriterion = this.comboData && this.comboData.criterion;
      this.interviewLevel = this.comboData && this.comboData.level;
      if(interviewPanelData){
        var interviewPanelData = this.hiringRequestDataService.getInterviewPanelMembers();
        this.interviewPanelComboData = {
          'panelMembers': interviewPanelData['_embedded']['employees'],
          'panelCriterion': this.interviewCriterion
        };
        var panelMembers: any = [];
        this.interviewPanelComboData['panelMembers'] && this.interviewPanelComboData['panelMembers'].forEach(function(elem:any, ind:any){
          panelMembers.push({
            'id': elem.id,
            'name': elem.fullName
          });
        });
        var panelCriterion: any = [];
        this.interviewPanelComboData['panelCriterion'] && this.interviewPanelComboData['panelCriterion'].forEach(function(elem:any, ind:any){
          panelCriterion.push({
            'id': elem.id,
            'name': elem.title
          });
        });
        this.interviewPanelComboData['panelMembers'] = panelMembers;
        this.interviewPanelComboData['panelCriterion'] = panelCriterion;
      }else{
        var self = this;
        this.hiringRequestDataService.getPanelMembers().subscribe(data => {
          self.interviewPanelComboData = {
           'panelMembers': data['_embedded']['employees'],
           'panelCriterion': self.interviewCriterion
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
    }
	goBack(){
		this.back.emit();
	}
	addNew(){
		this.addNewNeed.emit();
	}
	setDisableState(state:boolean){
      this.disableState = state;
	}
	loadCompetenciesByPractice(){
   var self = this;
	 var practiceId = this.needDetailsFrmHiringRequestData.needDetails.practice;
	 this.comboData.competency = this.hiringRequestDataService.getPracticeMap()['pracCompetencies'][practiceId];
   if(this.comboData.competency.length > 0){
    this.needDetailsFrmHiringRequestData.needDetails.competency = this.comboData.competency[0]['id'];
   }
   var depId = this.hiringRequestDataService.hiringDepId;
   self.resetJobDesc.next('reset');
   if(depId && practiceId){
    this.hiringRequestDataService.loadJobDescriptionTemplateName(depId, practiceId, 0, 800).subscribe(data=>{
       data = data.json() && data.json().content;
       self.templateNames = data;
       if(self.templateNames.length == 0){
         this.isDisable = true;
       }
       else{
         this.isDisable = false;
       }
     },error => {});
    }
	 this.pracId = practiceId;
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
      self.dialogService.render(
        [{
            title: 'Confirmation',
            message: 'Are you sure you want to remove the panel?',
            yesLabel: 'YES',
            noLabel: 'NO'
        }]
    ).subscribe(result => {
      if (result) {
          self.panelList.splice(index, 1);
          self.adjustPanelNumbers(self.panelList);
      }
    });
    }
  }
  adjustPanelNumbers(panelList: any){
    panelList.forEach(function(element: any, index: any){
      panelList[index]['panelNumber'] = index + 1;
    });
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
  	var needDetails = this.needDetailsFrmHiringRequestData.needDetails,
  	panels = needDetails.interviewPanels,
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
  	var needDetails = this.needDetailsFrmHiringRequestData.needDetails;
  	var hiringNeedPayload = {
  		"practiceId": needDetails.practice*1,
  		"workLocationId": needDetails.workLocation*1,
  		"competencyId": needDetails.competency*1,
  		"expectedRole": needDetails.expectedRole,
  		"expectedStartDate": new Date(needDetails.expectedStartDate).getTime(),
  		"resourcesCount": needDetails.numberOfResources,
  		"minimumExperienceInYears": needDetails.experienceReq.from,
  		"maximumExperienceInYears": needDetails.experienceReq.to,
  		"interviewPanels": this.getInterviewPanels(),
  		"operatingModel" : needDetails.model,
  		"purpose": needDetails.purpose,
  		"jobDescriptionId": this.jobDescriptionId
  	};
    return hiringNeedPayload;
  }
  setJobId(jobId: any){
   this.jobDescriptionId = jobId;
  }
  saveHiringNeed(){
    var self = this;
    var hiringNeed = self.getNeedPayload();
    if(!hiringNeed.jobDescriptionId){
      self.successMessage = 'Please Select Job Description';
      $('.ng2-tag-input').addClass('adjust-index');
      self.dialogService.render(
        [{
            title: 'Warning',
            message: self.successMessage,
            yesLabel: 'OK'
        }]
    );
    }
    else{
    self.loaderService.showLoading();
    self.hiringRequestDataService.saveHiringRequestNeedDetails(self.getNeedPayload(), self.hiringId).subscribe(
      data => {
        if(data['status'] == 201){
          self.successMessage = 'Hiring need saved successfully';
          self.loaderService.hideLoading();
          $('.ng2-tag-input').addClass('adjust-index');
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              this.navigateToHiringRequests();
        });
        }
      },error =>{
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  saveAndAddNew(){ 
    var self = this;
    var hiringNeed = self.getNeedPayload();
    if(!hiringNeed.jobDescriptionId){
      self.successMessage = 'Please Select Job Description';
      $('.ng2-tag-input').addClass('adjust-index');
      self.dialogService.render(
        [{
            title: 'Warning',
            message: self.successMessage,
            yesLabel: 'OK'
        }]
    );
    }
    else{
      self.loaderService.showLoading();
      self.hiringRequestDataService.saveHiringRequestNeedDetails(self.getNeedPayload(), self.hiringId).subscribe(
      data => {
        if(data['status'] == 201){
          self.successMessage = 'Hiring need saved successfully';
          self.loaderService.hideLoading();
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              self.addNew();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  restrictExpCharcters(value:any){
    return  this.commonService.restrictExpCharcters(value);
  }
  restrictFloatnumber = function (e: any) {
    return this.commonService.restrictFloatnumber(e);
  }
  showPreviousNeed(){
  	this.previousNeed.emit();
  }
  showNextNeed(){
  	this.nextNeed.emit();
  }
  navigateToHiringRequests(){
    this.router.navigate(['../hiring/hiring-requests/myrequests']);
  }
  ngOnDestroy(){
  	$('.ng2-tag-input').removeClass('adjust-index');
  }
  validateFinalRoundSelection(panel: any){
    var count = 0;
    this.panelList && this.panelList.forEach((ele:any)=> {
      if(ele.level === 'FINAL'){
        count++;
      }
    });
    if(count > 1){
      panel.level="";
      panel.name="";
      this.dialogService.render(
        [{
            title: 'Warning',
            message: 'There is already one final round panel. Please select a different panel level.',
            yesLabel: 'OK'
        }]
    );
    }
  }
  validateExpReq(exp: string){
   var needData = this.needDetailsFrmHiringRequestData,
   needDetails = needData && needData.needDetails,
   minExp = needDetails && needDetails.experienceReq && needDetails.experienceReq.from,
   maxExp = needDetails && needDetails.experienceReq && needDetails.experienceReq.to;
   if(minExp && maxExp && (minExp > maxExp)){
    this.dialogService.render(
      [{
          title: 'Warning',
          message: 'Minimum experience should be less than maximum experience.',
          yesLabel: 'OK'
      }]
  ).subscribe(result => {
        if (needDetails && needDetails.experienceReq && exp == 'min') {
          needDetails.experienceReq.from = '';
        } else if (needDetails && needDetails.experienceReq) {
          needDetails.experienceReq.to = '';
        }
  });
   }
  }	
}