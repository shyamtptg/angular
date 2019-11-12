import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { JobDescriptionDetails } from '../../models/job-description';
import { NewHiringRequestDataService } from '../new-hiring-request-service';

@Component({
  selector: 'job-description-modal',
  templateUrl: 'job-description-modal.component.html',
  styles: [`
     .modal-dialog {
      width: 28em;
      position: relative;
      top: 7.5em;
      left: 0.6em;
     }
     .job-desc-button {
      border-radius:2px;
      min-width:72px;
      height:42px;
      margin-left: 0.5em;
     }
    .modal-details-btn {
      @extend .job-desc-button;
      color:#ffffff;
      background:rgba(39,70,98,0.96);
     }
     .modal-close {
       font-size: 1.4em;
       margin-right: 0.5em;
     }
    `]
})

export class JobDescriptionModalComponent implements OnInit {
  @Input() modalId: string;
  @Input() modalTitle: string;
  jobDescTemplateForm: JobDescriptionDetails;
  @Output() continue = new EventEmitter();
  @Output() loadJobDetails = new EventEmitter<JobDescriptionDetails>();
  constructor(private hiringRequestDataService: NewHiringRequestDataService) {}

  ngOnInit() {
    const self = this;
    setTimeout(() => {
       self.hiringRequestDataService.loadJobDescriptionTemplateData();
       setTimeout(() => {
        const data: any = self.hiringRequestDataService.getJobDescriptionTemplateData();
        self.jobDescTemplateForm = (data ? data : undefined);
        self.loadJobDetails.emit(self.jobDescTemplateForm);
      }, 100);
    }, 100);
  }
  continueJobDesc() {
    this.continue.emit();
  }
}
