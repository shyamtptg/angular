import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../hiring.component';
import { NewHiringRequestDataService1 } from './new-hiring-request-service';
import { NewHiringRequestDetails } from '../models/hiring-request-details1';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Component({
	templateUrl: './update-hiring-request.component.html'
})

export class UpdateHiringRequest {
  @ViewChild('basicHiringDetails') basicHiringDetails:ElementRef;
  @ViewChild('hiringRequestNeeds') hiringRequestNeeds:ElementRef;
  public needList: any;
  public hiringForOptions: any;
  public clientNameOptions: any;
  public departmentOptions: any;
  public hiringTypeOptions: any;
  public hiringManagerOptions: any;
  public priorityOptions: any;
  public successMessage: string;
  public hiringNeedComboData: any = {};
  public hiringId: any;
  public hiringNeedButtonStatus: boolean = false;
  public needButtonStatus: boolean = false;
  public needWorkLocation: any;
  public isLoaderLoaded:boolean = false;
  public screeningList: any = [];
  public screeningMembersMap: any;
  loadDefaultPractice:Subject<any> = new Subject();
  public detailsFrmHiringRequestData: any;
  constructor(
    private hiringComponent: HiringComponent,
    private hiringRequestDataService: NewHiringRequestDataService1,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Hiring Requests / Update Hiring Request";
  }
  ngOnInit(){
    var self=this;
    self.loaderService.showLoading();
    setTimeout(()=>{
      self.hiringRequestDataService.getAllCombos().subscribe(data => {
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
            'criterion': data['INTERVIEW_CRITERIA']
            };
        self.route.params.subscribe(params => {
        if (params['id']) {
         self.hiringId = params['id'];
         if(self.router.url.match('hiring/hiring-requests/new')){
          self.hiringRequestDataService.mode = 'edit';
         }
         self.hiringRequestDataService.loadHiringRequestDataById(params['id']).subscribe(data => {
            self.detailsFrmHiringRequestData = (data ? data:undefined);
            if(self.detailsFrmHiringRequestData.departmentId){
               var depId = self.detailsFrmHiringRequestData.departmentId;
               self.hiringRequestDataService.hiringDepId = depId;
               self.hiringNeedComboData['practice'] = self.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
            }
            if(self.detailsFrmHiringRequestData.uid){
              self.hiringComponent.URLtitle = "Hiring Requests / Update Hiring Request (" + self.detailsFrmHiringRequestData.uid + ")";
            }
            var hiringManager = self.detailsFrmHiringRequestData.hiringManagerId;
            self.needWorkLocation = self.detailsFrmHiringRequestData.clientId;
            self.hiringRequestDataService.getHiringManagers().subscribe(data=>{
              
              self.hiringManagerOptions = data['_embedded']['employees'];
              self.detailsFrmHiringRequestData.hiringManagerId = hiringManager;
            },error =>{
              self.errorHandleService.handleErrors(error);
            });

            var screeningMembers: any = self.detailsFrmHiringRequestData.profileScreeningMembers;
            var membersList:any = [];
            var panelMemberObj = {};
            if(screeningMembers && screeningMembers.length>0){
              screeningMembers.forEach(function(element: any, index: any){
                membersList.push(element['fullName']);
                panelMemberObj[element.id] = element.fullName;
                panelMemberObj[element.fullName] = element.id;
              });
            }
            self.screeningList = membersList;
            self.screeningMembersMap = panelMemberObj;

            self.needList = (self.detailsFrmHiringRequestData ? self.detailsFrmHiringRequestData.needs : []);
            self.loaderService.hideLoading();
            }, error => {
              self.errorHandleService.handleErrors(error);
            });
       }else {
        self.hiringRequestDataService.loadHiringRequestData();
       }
       });
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    },100);
  }
  loadPracticesByDepartment(){
   var depId = this.detailsFrmHiringRequestData.departmentId;
   
   this.hiringNeedComboData['practice'] = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
   this.hiringRequestDataService.hiringDepId = depId;
  }
  loadPracticesForDepartment(){
   var depId = this.detailsFrmHiringRequestData.departmentId;
   this.hiringNeedComboData['practice'] = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
   this.hiringRequestDataService.hiringDepId = depId;
   if(this.hiringNeedComboData['practice'].length > 0){
    var data: any = {
     'practice': ((depId == 1)? '3' : this.hiringNeedComboData['practice'][0]['id']),
     'data': this.hiringNeedComboData['practice']
    };
    this.loadDefaultPractice.next(data);
   }
  }
  updateHiringRequests(){
    var self = this,
    hiringData = this.detailsFrmHiringRequestData,
    screeningMembers: any = this.getScreeningMembers(this.screeningList);
    var hiringDetailsPayload = {
      "hiringReason": hiringData.hiringReason,
      "clientId": hiringData.clientId,
      "departmentId": hiringData.departmentId,
      "hiringType": hiringData.hiringType,
      "hiringManagerId": hiringData.hiringManagerId,
      "hiringPriority": hiringData.hiringPriority,
      "purpose": hiringData.purpose,
      "profileScreeningMembers": screeningMembers
    }
    self.loaderService.showLoading();
    this.hiringRequestDataService.updateHiringRequest(hiringDetailsPayload, hiringData.id).subscribe(
      data => {
        if(data['status'] == 200){
          self.successMessage = 'Hiring request updated successfully';
          self.loaderService.hideLoading();
          this.dialogService.render([{
            title: 'Success',
            message: self.successMessage,
            yesLabel: 'OK'
          }]);
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
  }
  setWorkLocation(){
   this.needWorkLocation = this.detailsFrmHiringRequestData.clientId;
  }
  goBack(){
    this.basicHiringDetails.nativeElement.hidden = false;
    this.hiringRequestNeeds.nativeElement.hidden = true;
  }
  navigateToHiringRequests(){
    this.router.navigate(['../hiring/hiring-requests/myrequests']);
  }
  addHiringRequestNeed(){
   this.hiringNeedButtonStatus = true;
   if(this.commonService.hideFeature('UPDATE_HIRING_REQUEST_NEED')){
    this.needButtonStatus = true;
   }else{
    this.needButtonStatus = false;
   }
    this.needList.push({
        "model": 'ONSITE',
        "workLocationId": this.needWorkLocation,
        "interviewPanels": [{
          "panelNumber": 1
        }],
      "needNumber": this.needList.length + 1,
      "needStatus": "new"
    });
  }
  removeNeed(index: any){
    if (index !== -1) {
     var self = this;
     this.needList.splice(index, 1);
    }
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
}
