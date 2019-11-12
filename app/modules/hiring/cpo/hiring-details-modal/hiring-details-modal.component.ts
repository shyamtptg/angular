import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { HiringComponent } from './../../hiring.component';
import { NewHiringRequestDataService1 } from '../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  selector: 'hiring-details-modal',
  templateUrl: 'hiring-details-modal.component.html'
})

export class HiringDetailsModal implements OnInit {
  @Input() disable: boolean;
  @Input() hiringId: string;
  @Input() needId: string;
  @Output() updateReason = new EventEmitter<any>();
  reason: string;
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
  public hiringNeedButtonStatus: boolean = false;
  public detailsFrmHiringRequestData: any;
  public viewMode: boolean = true;
  public display: boolean = false;
  constructor(
    private hiringComponent: HiringComponent,
    private hiringRequestDataService: NewHiringRequestDataService1,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = 'Offers / Hiring Request Details';
  }
  ngOnInit() {
  }

  showDialog() {
    const self = this;

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
        if (self.hiringId && self.needId) {
          self.hiringRequestDataService.loadHiringRequestDataByIdandNeed(self.hiringId, self.needId).subscribe(data => {
            self.detailsFrmHiringRequestData = (data ? data : undefined);
            if (self.detailsFrmHiringRequestData.departmentId) {
              const depId = self.detailsFrmHiringRequestData.departmentId;
              self.hiringRequestDataService.hiringDepId = depId;
              self.hiringNeedComboData['practice'] = self.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
            }
            self.detailsFrmHiringRequestData.hiringManagerId = 1;
            self.needList = (self.detailsFrmHiringRequestData ? self.detailsFrmHiringRequestData.needs : []);
            self.display = true;
          }, error => {
            self.errorHandleService.handleErrors(error);
          });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }

  loadPracticesByDepartment() {
    const depId = this.detailsFrmHiringRequestData.departmentId;
    this.hiringNeedComboData['practice'] = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
  }
  navigateToHiringRequests() {
    this.router.navigate(['../hiring/assign']);
  }
  saveRemarks() {
    this.updateReason.emit(this.reason);
  }
}