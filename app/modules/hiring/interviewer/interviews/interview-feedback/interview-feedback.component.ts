import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../hiring.component';
import { InterviewDataService } from '../interviews.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './interview-feedback.component.html'
})

export class InterviewerInterviewFeedback {
  val: number;
  experienceFeedBack: string;
  feedBackDetails: any;
  resultStatus: any;
  successMessage: string;
  interviewId: string;
  hiringId: string;
  needId: string;
  constructor(
    private hiringComponent: HiringComponent,
    private interviewDataService: InterviewDataService,
    public commonService: CommonService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Interviews / Interview Feedback";
  }
  ngOnInit() {
    this.feedBackDetails = {
      "criterionList": []
    };
    this.loadDetails();
  }
  loadDetails() {
    var self = this;
    self.route.params.subscribe(params => {
      if(params['interviewId'] && params['reqId'] && params['needId']){
        self.hiringId = params['reqId'];
        self.needId = params['needId'];
        self.interviewId = params['interviewId'];
        this.interviewDataService.getCriteria(self.interviewId).subscribe(data => {
          if (data.interviewCriteria.length > 0) {
            var criteriaList: any = [];
            data.interviewCriteria.forEach(function (elem: any, ind: any) {
              criteriaList.push({
                "criterionName": elem
              });
            });
            criteriaList.push({
              "criterionName": "Overall Summary"
            });
            this.feedBackDetails.criterionList = criteriaList;
          }
        }, error => {
          self.errorHandleService.handleErrors(error);
        });
      }
    });
  }
  submitFeedback() {
    var payload: any = {}, self = this;
    var i = 0;
    this.feedBackDetails.criterionList.forEach((ele:any)=>{
      if(ele.hasOwnProperty('feedback') && ele.hasOwnProperty('rating')){
        i++;
      }
    });
    if((this.feedBackDetails.criterionList.length !== i) || i==0) {
        this.dialogService.render(
          [{
              title: 'Warning',
              message: 'Please enter the feedback and give rating',
              yesLabel: 'OK'
          }])
        
    } else {
      payload.feedback = JSON.stringify(this.feedBackDetails.criterionList);
      if(!this.feedBackDetails.resultStatus){
        this.dialogService.render(
          [{
              title: 'Error',
              message: 'Please select Recommended or Not Recommended as the interview result status',
              yesLabel: 'OK'
          }])
        return;
      }
      payload.resultStatus = this.feedBackDetails.resultStatus;
      if(self.hiringId && self.needId && self.interviewId) {
        self.loaderService.showLoading();
        this.interviewDataService.submitFeedBack(self.hiringId, self.needId, self.interviewId, payload).subscribe(data => {
          if(data.status == 200) {
            self.successMessage = 'Feedback submitted successfully';
            self.loaderService.hideLoading();
            this.dialogService.render(
              [{
                  title: 'Success',
                  message: self.successMessage,
                  yesLabel: 'OK'
              }],
          ).subscribe(result => {
                this.navigateToInterviews();
          });
          }
        }, error => {
          self.errorHandleService.handleErrors(error);
        });
      }
    }
  }
  navigateToInterviews() {
    this.router.navigate(['../hiring/interviews/my-interviews']);
  }
}
