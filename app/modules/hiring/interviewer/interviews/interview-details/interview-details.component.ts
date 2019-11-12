import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../hiring.component';
import { AddProfileDataService } from '../../../recruiter/addprofile/add-profile.service';
import { ProfilesDataService } from '../../../recruiter/profiles/profile.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './interview-details.component.html'
})

export class InterviewDetails {
  interviewLevelOptions: any;
  interviewModeOptions: any;
  interviewDetails: any = {};
  hiringId: string;
  hiringNeedId: string;
  interviewId: string;
  panels: any;
  interviewers: any;
  interviewDate: any;
  today: Date;
  constructor(
    private hiringComponent: HiringComponent,
    private addProfileDataService: AddProfileDataService,
    private profileDataService: ProfilesDataService,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Interviews / Interview Details";
  }
  ngOnInit() {
    this.today = new Date();
    var data = this.addProfileDataService.getHiringCombos(), self = this;
    if (data) {
      this.interviewModeOptions = data['INTERVIEW_MODE'];
    }
    self.route.params.subscribe(params => {
      if (params['id']) {
        self.interviewId = params['id'];
          if (self.interviewId) {
            self.profileDataService.getInterviewDetailsById(self.interviewId).subscribe(data => {
              var interviewDetails: any = {};
              interviewDetails.interviewLevel = data['levelId'];
              if(!self.interviewModeOptions){
                var comboData = this.addProfileDataService.getHiringCombos();
                if (comboData) {
                  self.interviewModeOptions = comboData['INTERVIEW_MODE'];
                }
              }
              self.interviewDetails.interviewMode = data['mode'];
              self.interviewDetails.prospectId = data['prospect']['id']
              self.interviewDetails.prospectiveHireName = data['prospect']['displayName'];
              self.hiringId = data['hiringRequest']['id'];
              self.hiringNeedId = data['hiringRequestNeed']['id'];
              self.interviewDetails.recruiterComments = data['recruiterComments'];
              interviewDetails.interviewPanelId = data['interviewPanel']['id'];
              interviewDetails.interviewId = data['interviewer']['id'];
              self.interviewDate = new Date(data['interviewDate']);
              self.profileDataService.getInterviewLevels(this.hiringId, this.hiringNeedId).subscribe(data => {
                self.interviewLevelOptions = data;
                self.interviewDetails.interviewLevel = interviewDetails.interviewLevel;
                if (self.interviewDetails.interviewLevel) {
                  self.profileDataService.getPanels(
                    self.hiringId, self.hiringNeedId, self.interviewDetails.interviewLevel
                  ).subscribe( data => {
                    self.panels = data;
                    self.interviewDetails.interviewPanelId = interviewDetails.interviewPanelId;
                    self.getInterviewers(interviewDetails.interviewId);
                  }, error => {
                    self.errorHandleService.handleErrors(error);
                  });
                }
              }, error => {
                self.errorHandleService.handleErrors(error);
              });
            }, error => {
              self.errorHandleService.handleErrors(error);
            });
          }
      }
    });
  }
  getInterviewLevels() {
    var self = this;
    this.profileDataService.getInterviewLevels(this.hiringId, this.hiringNeedId).subscribe(data => {
      self.interviewLevelOptions = data;
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  loadPanels() {
   var self = this;
    if (this.hiringId && this.hiringNeedId && this.interviewDetails.interviewLevel) {
      this.profileDataService.getPanels(this.hiringId, this.hiringNeedId, this.interviewDetails.interviewLevel).subscribe(data => {
        self.panels = data;
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
      self.interviewDetails.interviewPanelId = "";
    }else if(!this.interviewDetails.interviewLevel){
      this.panels = [];
      this.interviewDetails.interviewPanelId = "";
      this.interviewers = [];
      this.interviewDetails.interviewerId = "";
    }
  }
  getInterviewers(interviewerId?: string) {
    var self = this;
    if (this.hiringId && this.hiringNeedId && this.interviewDetails.interviewLevel && this.interviewDetails.interviewPanelId) {
      this.profileDataService.getInterviewersByPanelId(this.hiringId, this.hiringNeedId, this.interviewDetails.interviewLevel, this.interviewDetails.interviewPanelId).subscribe(data => {
        self.interviewers = data;
        self.interviewDetails.interviewerId = "";
        if (interviewerId) {
          self.interviewDetails.interviewerId = interviewerId;
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }else if(!this.interviewDetails.interviewPanelId){
      self.interviewers = [];
      self.interviewDetails.interviewerId = "";
    }
  }
  navigateToPrevious() {
    var route = localStorage.getItem('previousRoute');
    route = (route) ? route : '../hiring/interviews/scheduled-interviews';
    this.router.navigate([route]);
  }
  ngOnDestroy() {
    this.interviewId = null;
  }
}