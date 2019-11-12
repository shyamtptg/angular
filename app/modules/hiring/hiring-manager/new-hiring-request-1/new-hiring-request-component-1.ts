import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../hiring.component';
import { NewHiringRequestDetails } from '../models/hiring-request-details1';
import { NewHiringRequestDataService1 } from './new-hiring-request-service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './new-hiring-request-component-1.html'
})

export class NewHiringRequest1 {
  @ViewChild('basicHiringDetails') basicHiringDetails:ElementRef;
  @ViewChild('basicHiringNeeds') basicHiringNeeds:ElementRef;
  public detailsFrmHiringRequestData: NewHiringRequestDetails;
  public needList: any;
  public disableNext: boolean = true;
  public hiringForOptions: any;
  public clientNameOptions: any;
  public departmentOptions: any;
  public hiringTypeOptions: any;
  public hiringManagerOptions: any;
  public priorityOptions: any;
  public hiringNeedComboData: any = {};
  public hiringRequestId: any = null;
  public successMessage: string;
  public screeningList: any;
  public screeningMembersMap: any;
  loadSelectedPractice:Subject<any> = new Subject();
  public needWorkLocation: any;
  public hiringRequestInitialData: any;
	constructor(
    private hiringComponent: HiringComponent,
    private loaderService: LoaderService,
    private hiringRequestDataService: NewHiringRequestDataService1,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ){
    this.hiringComponent.URLtitle = "Hiring Requests / New Hiring Request";
  }
  ngOnInit(){
    var currentUserInfo: any = this.commonService.getItem('currentUserInfo'), managerId: any, departmentId: any;
    if(currentUserInfo){
     managerId = currentUserInfo.id;
     departmentId = currentUserInfo.departmentId;
    }
    this.hiringRequestInitialData = {
    "primaryHiringDetails": {
        "hiringReason": 'ACCOUNT_GROWTH',
        "clientId": null,
        "departmentId": departmentId,
        "hiringType": 'PERMANENT',
        "hiringManagerId": managerId,
        "hiringPriority": 'NORMAL',
        "purpose": null,
        "profileScreeningMembers": []
    },
    "secondaryHiringDetails": [{
        "needNumber": 1,
        "needDetails": {
            "practice": null,
            "competency": null,
            "workLocation": null,
            "experienceReq": {
                "from": null,
                "to": null
            },
            "expectedRole": null,
            "numberOfResources": null,
            "expectedStartDate": null,
            "model": 'ONSITE',
            "purpose": null,
            "jobDescription": null,
            "interviewPanels": [{
                "panelNumber": 1,
                "name": null,
                "level": null,
                "panelMembers": null,
                "selectionCriterion": null
            }]
        }
      }]
    };
    var self=this;
    var data = self.hiringRequestDataService.getHiringCombos();
    if(data){
      this.hiringForOptions = data['HIRING_REASON'];
      this.clientNameOptions = data['CLIENT'];
      this.departmentOptions = data['DEPARTMENT'];
      this.hiringTypeOptions = data['HIRING_TYPE'];
      this.priorityOptions = data['HIRING_PRIORITY'];
      this.hiringNeedComboData = {
        'model': data['OPERATING_MODEL'],
        'workLocation': data['CLIENT'],
        'practice': data['PRACTICE'],
        'competency': data['COMPETENCY'],
        'criterion': data['INTERVIEW_CRITERIA'],
        'level': data['INTERVIEW_LEVEL']
      };
      self.loadDetails();
    }else{
      self.hiringRequestDataService.getHiringComboDetails().subscribe(data=>{
         self.hiringForOptions = data['HIRING_REASON'];
         self.clientNameOptions = data['CLIENT'];
         self.departmentOptions = data['DEPARTMENT'];
         self.hiringTypeOptions = data['HIRING_TYPE'];
         self.priorityOptions = data['HIRING_PRIORITY'];
         self.hiringNeedComboData = {
          'model': data['OPERATING_MODEL'],
          'workLocation': data['CLIENT'],
          'practice': data['PRACTICE'],
          'competency': data['COMPETENCY'],
          'criterion': data['INTERVIEW_CRITERIA'],
          'level': data['INTERVIEW_LEVEL']
        };
        self.loadDetails();
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
    self.screeningList = [];
    self.screeningMembersMap = {};
  }
  loadScreeningMembers(data: any){
    var screeningMembers = this.screeningList,
    items = data.items, self = this;
    if(screeningMembers && screeningMembers.length > 0) {
      items.forEach(function(elem:any, ind:any){
        screeningMembers.push(elem.name);
        self.screeningMembersMap[elem.id] = elem.name;
        self.screeningMembersMap[elem.name] = elem.id;
      });
      this.screeningList = this.commonService.removeDuplicatesStringsFromArray(screeningMembers);
    }else{
      items.forEach(function(elem:any, ind:any){
        screeningMembers.push(elem.name);
        self.screeningMembersMap[elem.id] = elem.name;
        self.screeningMembersMap[elem.name] = elem.id;  
      });
      this.screeningList = screeningMembers;
    }
  }
  getScreeningMembers(memberNames: any){
    var self = this,
    result: any = [];
    if(memberNames && memberNames.length>0){
      memberNames.forEach(function(element: any, index: any){
        if(self.screeningMembersMap[element]){
          result.push(self.screeningMembersMap[element]);
        }
      });
    }
    return result;
  }
  loadDetails(){
    var self = this;
    var hiringManagerData = self.hiringRequestDataService.getHiringManagerData();
    if(hiringManagerData){
      self.hiringManagerOptions = hiringManagerData['_embedded']['employees'];
    }
    setTimeout(()=>{
     var data: any = self.hiringRequestInitialData;
     self.detailsFrmHiringRequestData = (data ? data:undefined);
     if(self.detailsFrmHiringRequestData.primaryHiringDetails.departmentId){
       var depId = self.detailsFrmHiringRequestData.primaryHiringDetails.departmentId;
       self.hiringNeedComboData['practice'] = self.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
       self.hiringRequestDataService.hiringDepId = depId;
     }
     self.needList = (self.detailsFrmHiringRequestData ? self.detailsFrmHiringRequestData.secondaryHiringDetails : []);
    },100);
  }
  setWorkLocation(){ 
   this.needWorkLocation = this.detailsFrmHiringRequestData.primaryHiringDetails.clientId;
   var needDetails: any = this.detailsFrmHiringRequestData.secondaryHiringDetails && this.detailsFrmHiringRequestData.secondaryHiringDetails[0]['needDetails']; 
   if(needDetails){
    needDetails['workLocation'] = this.needWorkLocation;
   }
  }
  showHiringRequestDetails(){
    this.basicHiringDetails.nativeElement.hidden = false;
    this.basicHiringNeeds.nativeElement.hidden = true;
  }
  loadPracticesByDepartment(event?: any){
    var deptId, depId;
    if(event){
     deptId = event.target.value;
    }
    depId = (deptId) ? deptId : this.detailsFrmHiringRequestData.primaryHiringDetails.departmentId;
    this.hiringNeedComboData['practice'] = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
    this.hiringRequestDataService.hiringDepId = depId;
    if(this.hiringNeedComboData['practice'] && this.hiringNeedComboData['practice'].length > 0){
      var data: any = {
       'practice': this.hiringNeedComboData['practice'][0]['id'],
       'data': this.hiringNeedComboData['practice']
      };
    this.loadSelectedPractice.next(data);
    }
  }
  saveAndAddHiringRequestNeeds(){
   var self = this;
   var hiringRequestPayload = this.detailsFrmHiringRequestData.primaryHiringDetails;
   hiringRequestPayload.profileScreeningMembers = this.getScreeningMembers(this.screeningList);
   self.loaderService.showLoading();
   self.hiringRequestDataService.saveHiringRequestDetails(hiringRequestPayload).subscribe(
      data => {
        self.hiringRequestId = data.json().result;
        if(self.hiringRequestId){
          self.successMessage = 'Hiring request saved successfully';
          self.loaderService.hideLoading();
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              this.showHiringRequestNeeds();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
    });
  }
  showHiringRequestNeeds(){
    this.basicHiringDetails.nativeElement.hidden = true;
    this.basicHiringNeeds.nativeElement.hidden = false;
    $('hiring-request-need')[0]['hidden'] = false;
  }
  addNewNeed(){
    this.needList.length = 0;
    this.needList.push({
      "needDetails": {
        "experienceReq": {},
        "workLocation": this.needWorkLocation,
        "interviewPanels": [{
          "panelNumber": 1
        }]
      },
      "needNumber": this.needList.length + 1
    });
    this.adjustNeedNumbers(this.needList);
    var index = this.needList.length;
    setTimeout(()=>{
      $('hiring-request-need').each(function(index:any, elem:any){
        elem.hidden = true;
      });
      $('hiring-request-need')[index-1]['hidden'] = false;
    },100);
  }
  removeNeed(need: any){
    var index = this.needList.indexOf(need);
    if (index !== -1 && this.needList.length > 1) {
        this.needList.splice(index, 1);
        this.adjustNeedNumbers(this.needList);
    }
    var currentIndex = this.getCurrentNeedIndex(),
    length = $('hiring-request-need').length;
    if(currentIndex > 0){
      $('hiring-request-need')[currentIndex-1]['hidden'] = false;
    }else if(currentIndex == 0 && length > 1){
      $('hiring-request-need')[currentIndex+1]['hidden'] = false;
    }
  }
  adjustNeedNumbers(needList: any){
    needList.forEach(function(element: any, index: any){
      needList[index]['needNumber'] = index + 1;
    });
  }
  navigateToHiringRequests(){
    this.router.navigate(['../hiring/hiring-requests/myrequests']);
  }
  getCurrentNeedIndex(): any{
    $('hiring-request-need').removeClass('active-card');
    $('hiring-request-need').each(function(index:any, elem:any){
      if(elem.hidden == false){
        elem.className = 'active-card';
      }
    });
    return $('.active-card').index();
  }
  showNextNeed(){
    var index = this.getCurrentNeedIndex(),
    length = $('hiring-request-need').length;
    if(index < length-1){
      $('hiring-request-need')[index]['hidden'] = true;
      $('hiring-request-need')[index+1]['hidden'] = false;
    }
    if(index == length-2){
      this.disableNext = true;
    }
  }
  showPreviousNeed(){
    this.basicHiringDetails.nativeElement.hidden = false;
    this.basicHiringNeeds.nativeElement.hidden = true;
  }
  saveHiringRequest(){
    var self = this;
    var hiringRequestPayload = this.detailsFrmHiringRequestData.primaryHiringDetails;
    hiringRequestPayload.profileScreeningMembers = this.getScreeningMembers(this.screeningList);
    self.loaderService.showLoading();
    self.hiringRequestDataService.saveHiringRequestDetails(hiringRequestPayload).subscribe(
    data => {
      var hiringId = data['_body'];
      if(hiringId){
        self.successMessage = 'Hiring request saved successfully';
        self.loaderService.hideLoading();
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
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
}
