import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../hiring.component';
import { InterviewDataService } from '../interviews.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './view-feedback.component.html'
})

export class InterviewerViewFeedback {
  val: number;
  experienceFeedBack: string;
  feedBackDetails: any;
  resultStatus: any;
  successMessage: string;
  interviewList: any;
  hiringDetails: any = {};
  constructor(
    private hiringComponent: HiringComponent,
    private interviewDataService: InterviewDataService,
    private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Interviews / View Feedback";
  }
  ngOnInit() {
    var self = this;
    this.feedBackDetails = {
      "criterionList": []
    };
    self.route.params.subscribe(params => {
      if (params['id'] && params['reqId'] && params['needId']) {
        self.loaderService.showLoading();
        self.interviewDataService.getFeedbackDetailsList(params['reqId'], params['needId'], params['id']).subscribe(data => {
          self.interviewList = data['interviews'];
          self.loaderService.hideLoading();
          self.hiringDetails = {
            "hiringPurpose": data['hiringRequestPurpose'],
            "needPurpose": data['hiringRequestNeedPurpose'],
            "clientName": data['clientName']
          };
        }, error => {
          self.errorHandleService.handleErrors(error);
        });
      }
    });
  }
  navigateToPrevious() {
    var route = localStorage.getItem('previousRoute');
    route = (route) ? route : '../hiring/interviews/my-interviews';
    this.router.navigate([route]);
  }
}
