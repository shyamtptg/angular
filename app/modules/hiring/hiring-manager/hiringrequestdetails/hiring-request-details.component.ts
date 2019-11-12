import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../shared/services/common.service';
import { HiringComponent } from '../../hiring.component';
import { NewHiringRequestDataService1 } from '../new-hiring-request-1/new-hiring-request-service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './hiring-request-details.component.html',
  encapsulation: ViewEncapsulation.None
})

export class RecruiterHiringDetails implements OnInit {
  @ViewChild('basicHiringDetails') basicHiringDetails: ElementRef;
  @ViewChild('hiringRequestNeeds') hiringRequestNeeds: ElementRef;
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
  public disableState: boolean = false;
  public notAssigned: boolean = true;
  public detailsFrmHiringRequestData: any;
  public viewMode: boolean;
  public screeningList: any;
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
      this.hiringComponent.URLtitle = 'Hiring Requests / Hiring Request Details';
  }
  ngOnInit() {
    const self = this;
    this.loaderService.showLoading();
    self.viewMode = true;
    setTimeout(() => {
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
            self.hiringRequestDataService.loadHiringRequestDataById(params['id']).subscribe(data => {
              self.detailsFrmHiringRequestData = (data ? data : undefined);
              if (self.detailsFrmHiringRequestData.departmentId) {
                var depId = self.detailsFrmHiringRequestData.departmentId;
                self.disableState = (self.detailsFrmHiringRequestData.hiringRequestStatus == 'ASSIGNED') ? false : true;
                self.hiringRequestDataService.hiringDepId = depId;
                self.hiringNeedComboData['practice'] = self.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
              }
              if(self.detailsFrmHiringRequestData.uid){
                self.hiringComponent.URLtitle = "Hiring Requests / Hiring Request Details (" + self.detailsFrmHiringRequestData.uid + ")";
              }
              var hiringManager = self.detailsFrmHiringRequestData.hiringManagerId;
              self.hiringRequestDataService.getHiringManagers().subscribe(data => {
                self.hiringManagerOptions = data['_embedded']['employees'];
                self.detailsFrmHiringRequestData.hiringManagerId = hiringManager;
              }, error => {
                self.errorHandleService.handleErrors(error);
              });

              var screeningMembers: any = self.detailsFrmHiringRequestData.profileScreeningMembers;
              var membersList:any = [];
              screeningMembers && screeningMembers.forEach(function(element: any, index: any){
                membersList.push(element['fullName']);
              });
              self.screeningList = membersList;
              
              self.needList = (self.detailsFrmHiringRequestData ? self.detailsFrmHiringRequestData.needs : []);
              var currentUser: any, recruiters = self.detailsFrmHiringRequestData && self.detailsFrmHiringRequestData.recruiters;
              if (self.commonService.getItem('currentUserInfo')) {
                currentUser = self.commonService.getItem('currentUserInfo')['id'];
              } 
              if(recruiters){
                recruiters.forEach(function(elem: any, ind: any){
                  if(elem['id'] == currentUser){
                    self.notAssigned = false;
                  }
                });
              }
              this.loaderService.hideLoading();
            }, error => {
              self.errorHandleService.handleErrors(error);
            });
          } else {
            self.hiringRequestDataService.loadHiringRequestData();
          }
        });
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  loadPracticesByDepartment() {
    var depId = this.detailsFrmHiringRequestData.departmentId;
    this.hiringNeedComboData['practice'] = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
  }
  navigateToHiringRequests() {
    var route = localStorage.getItem('previousRoute'), isRecruiter: boolean;
    if (this.commonService.getItem('currentUserInfo')) {
      isRecruiter = (this.commonService.getItem('currentUserInfo').roles.indexOf('Recruiter') != -1) ? true : false;
    }
    route = (route) ? route : ((isRecruiter) ? '../hiring/hiring-requests/requests' : '../hiring/hiring-requests/myrequests');
    localStorage.removeItem('previousRoute');
    this.router.navigate([route]);
  }
  startHiringRequest() {
    var self = this;
    self.loaderService.showLoading();
    this.hiringRequestDataService.startHiringRequest(this.hiringId, 'START').subscribe(data => {
      if (data.status == 200) {
        self.successMessage = 'Hiring request started successfully';
        self.loaderService.hideLoading();
        self.dialogService.render(
          [{
              title: 'Success',
              message: self.successMessage,
              yesLabel: 'OK'
          }]
      ).subscribe(result => {
            self.navigateToHiringRequests();
      });
      }
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
}
