import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { HiringComponent } from './../../hiring.component';
import { NewHiringRequestDataService1 } from '../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { LoaderService } from './../../../../shared/services/loader.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './hiring-request-details.component.html'
})

export class CPOHiringDetails {
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
  public detailsFrmHiringRequestData: any;
  public viewMode: boolean;
  constructor(
    private hiringComponent: HiringComponent,
    private hiringRequestDataService: NewHiringRequestDataService1,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Hiring Requests / Hiring Request Details";
  }
  ngOnInit() {
    var self = this;
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
                self.hiringRequestDataService.hiringDepId = depId;
                self.hiringNeedComboData['practice'] = self.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
              }
              var hiringManager = self.detailsFrmHiringRequestData.hiringManagerId;
              self.hiringRequestDataService.getHiringManagers().subscribe(data => {
                self.hiringManagerOptions = data['_embedded']['employees'];
                self.detailsFrmHiringRequestData.hiringManagerId = hiringManager;
              }, error => {
                self.errorHandleService.handleErrors(error);
              });
              self.needList = (self.detailsFrmHiringRequestData ? self.detailsFrmHiringRequestData.needs : []);
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
  ngAfterViewChecked() {
    //var contentHeight = $('.content-wrapper').height();
    //$('.sidebar-menu').height(contentHeight+15);
  }
  ngOnDestroy() {
    //$('.sidebar-menu').height('100%');
  }
  loadPracticesByDepartment() {
    var depId = this.detailsFrmHiringRequestData.departmentId;
    this.hiringNeedComboData['practice'] = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
  }
  navigateToHiringRequests() {
    this.router.navigate(['../hiring/assign']);
  }
}