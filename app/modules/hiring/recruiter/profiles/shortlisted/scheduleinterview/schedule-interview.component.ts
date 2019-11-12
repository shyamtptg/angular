import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../../hiring.component';
import { AddProfileDataService } from '../../../addprofile/add-profile.service';
import { ProfilesDataService } from '../../profile.service';
import { LoaderService } from '../../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../../shared/services/common.service';
import { DialogService } from '../../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../../shared/services/errorhandle.service';

@Component({
    templateUrl: './schedule-interview.component.html'
})

export class ScheduleInterview {
    interviewLevelOptions: any;
    interviewModeOptions: any;
    interviewDetails: any = {};
    hiringId: string;
    hiringNeedId: string;
    interviewId: string;
    successMessage: string;
    panels: any;
    interviewers: any;
    interviewDate: any;
    today: Date;
    constructor(
        private hiringComponent: HiringComponent,
        private addProfileDataService: AddProfileDataService,
        private profileDataService: ProfilesDataService,
        private loaderService: LoaderService,
        public commonService: CommonService,
        private router: Router,
        private route: ActivatedRoute,
        private dialogService: DialogService,
        private errorHandleService: ErrorHandleService
    ) {
        this.hiringComponent.URLtitle = "Profiles / Schedule Interview";
    }
    ngOnInit() {
        this.today = new Date();
        var data = this.addProfileDataService.getHiringCombos(), self = this;
        if (data) {
            this.interviewModeOptions = data['INTERVIEW_MODE'];
        }
        self.route.params.subscribe(params => {
            if (params['id']) {
                var prospectDetails: any = this.profileDataService.prospectDetails;
                self.interviewDetails.prospectiveHireName = prospectDetails['prospectName'];
                self.interviewId = prospectDetails['interviewId'];
                self.interviewDetails.prospectId = params['id'];
                self.hiringId = params['reqId'];
                self.hiringNeedId = params['needId'];
                if ((self.hiringId && self.hiringNeedId)) {
                    if (self.interviewDetails.prospectiveHireName) {
                        self.loadDetails();
                    } else {
                        self.addProfileDataService.loadProspectDataById(params['id']).subscribe(data => {
                            self.interviewDetails.prospectiveHireName = data.displayName;
                            if (self.interviewModeOptions) {
                                self.loadDetails();
                            } else {
                                self.setInterviewModeOptionsAndLoad();
                            }
                        }, error => {
                            self.errorHandleService.handleErrors(error);
                        });
                    }
                }
            } else if (params['interviewId']) {
                self.interviewId = params['interviewId'];
                if (self.interviewModeOptions) {
                    self.loadDetails();
                } else {
                    self.setInterviewModeOptionsAndLoad();
                }
            }
        });
    }
    setInterviewModeOptionsAndLoad() {
        var self = this;
        self.addProfileDataService.getHiringComboDetails().subscribe(data => {
            self.interviewModeOptions = data['INTERVIEW_MODE'];
            self.loadDetails();
        }, error => {
            self.errorHandleService.handleErrors(error);
        });
    }
    loadDetails() {
        var self = this;
        if (self.interviewId) {
            self.hiringComponent.URLtitle = "Profiles / Reschedule Interview";
            self.profileDataService.getInterviewDetailsById(self.interviewId).subscribe(data => {
                var interviewDetails: any = {};
                interviewDetails.interviewLevel = data['levelId'];
                self.interviewDetails.interviewMode = data['mode'];
                self.interviewDetails.recruiterComments = data['recruiterComments'];
                interviewDetails.interviewPanelId = data['interviewPanel']['id'];
                interviewDetails.interviewId = data['interviewer']['id'];

                self.interviewDetails.prospectiveHireName = data['prospect'] && data['prospect']['displayName'];
                self.interviewDetails.prospectId = data['prospect'] && data['prospect']['id'];

                self.interviewDate = new Date(data['interviewDate']);
                self.hiringId = data['hiringRequest'] && data['hiringRequest']['id'];
                self.hiringNeedId = data['hiringRequestNeed'] && data['hiringRequestNeed']['id'];
                self.profileDataService.getInterviewLevels(self.hiringId, self.hiringNeedId).subscribe(data => {
                    self.interviewLevelOptions = data;
                    self.interviewDetails.interviewLevel = interviewDetails.interviewLevel;
                    if (self.interviewDetails.interviewLevel) {
                        self.profileDataService.getPanels(self.hiringId, self.hiringNeedId, self.interviewDetails.interviewLevel).subscribe(data => {
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
        } else {
            this.profileDataService.getInterviewLevels(this.hiringId, this.hiringNeedId).subscribe(data => {
                self.interviewLevelOptions = data;
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        }
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
            self.interviewDetails.interviewPanelId = '';
        } else if (!this.interviewDetails.interviewLevel) {
            this.panels = [];
            this.interviewDetails.interviewPanelId = '';
            this.interviewers = [];
            this.interviewDetails.interviewerId = '';
        }
    }
    formatDate(date: any) {
        var time = new Date(date),
            result, year, month, today;
        year = time.getFullYear();
        month = time.getMonth() + 1;
        today = time.getDate();
        month = ((month < 10) ? ('0' + month) : month);
        today = ((today < 10) ? ('0' + today) : today);
        result = year + '-' + month + '-' + today;
        return result;
    }
    getDateAndTime(date: any) {
        var result, year, month, today;
        year = date.getFullYear();
        month = date.getMonth() + 1;
        today = date.getDate();
        month = ((month < 10) ? ('0' + month) : month);
        today = ((today < 10) ? ('0' + today) : today);
        result = year + '-' + month + '-' + today;
        var hours = date.getHours();
        var minutes = date.getMinutes();
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes;
        return result + ' ' + strTime;
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
        } else if (!this.interviewDetails.interviewPanelId) {
            self.interviewers = [];
            self.interviewDetails.interviewerId = "";
        }
    }
    scheduleInterview() {
        var self = this, userDetails: any = this.commonService.getItem('currentUserInfo');
        this.interviewDetails.interviewScheduledBy = (userDetails) ? userDetails.id : '';
        if (!this.interviewDate) {
            this.dialogService.render(
                [{
                    title: 'Warning',
                    message: 'Please select the interview date',
                    yesLabel: 'OK'
                }]
            );
            return;
        }
        this.interviewDetails.interviewDate = new Date(this.interviewDate).getTime();
        var interviewDateString: string = this.getDateAndTime(this.interviewDate),
            currentDateString: string = this.getDateAndTime(new Date());
        if (new Date(interviewDateString).getTime() < new Date(currentDateString).getTime()) {
            this.dialogService.render(
                [{
                    title: 'Warning',
                    message: 'Interview date should not be less than current date',
                    yesLabel: 'OK'
                }]
            )
            return;
        }
        if (this.hiringId && this.hiringNeedId) {
            self.loaderService.showLoading();
            if (self.interviewId) {
                this.profileDataService.rescheduleInterview(this.hiringId, this.hiringNeedId, self.interviewId, this.interviewDetails).subscribe(data => {
                    if (data.status == 200) {
                        self.successMessage = 'Interview rescheduled successfully';
                        self.loaderService.hideLoading();
                        this.dialogService.render(
                            [{
                                title: 'Success',
                                message: self.successMessage,
                                yesLabel: 'OK'
                            }]
                        ).subscribe(result => {
                            self.navigateToShorlistedProfiles();
                        });
                    }
                }, error => {
                    self.errorHandleService.handleErrors(error);
                });
            } else {
                this.profileDataService.scheduleInterview(this.hiringId, this.hiringNeedId, this.interviewDetails).subscribe(data => {
                    if (data.status == 201) {
                        self.successMessage = 'Interview scheduled successfully';
                        self.loaderService.hideLoading();
                        this.dialogService.render(
                            [{
                                title: 'Success',
                                message: self.successMessage,
                                yesLabel: 'OK'
                            }]
                        ).subscribe(result => {
                            self.navigateToShorlistedProfiles();
                        });
                    }
                }, error => {
                    self.errorHandleService.handleErrors(error);
                });
            }
        }
    }
    navigateToShorlistedProfiles() {
        this.router.navigate(['../hiring/interviews/scheduled-interviews']);
    }
    navigateToPrevious() {
        var route = (this.interviewId) ? '../hiring/interviews/scheduled-interviews' : '../hiring/profiles/shortlist';
        this.router.navigate([route]);
    }
    ngOnDestroy() {
        this.interviewId = null;
    }
}
