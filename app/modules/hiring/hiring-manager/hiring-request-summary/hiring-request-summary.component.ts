import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { HiringManagerComponent } from '../hiring-manager.component';
import { HiringComponent } from '../../hiring.component';
import { NewHiringRequestDataService } from '../new-hiring-request/new-hiring-request-service';
import { HiringRequestDetails } from '../models/hiring-request-details';
import { DialogService } from '../../../../shared/dialogs/dialog.service';

@Component({
  selector: 'hiring-request-summary',
  templateUrl: './hiring-request-summary.component.html'
})

export class HiringRequestSummary {
  @Input() public detailsFrmHiringSummaryData: HiringRequestDetails;
  @Input() public panelList: any;
  @Output() back = new EventEmitter();
  msgs: any = [];
  constructor(
    private hiringComponent: HiringComponent,
    /*private HiringManagerComponent: HiringManagerComponent,*/
    private hiringRequestDataService: NewHiringRequestDataService,
    private dialogService: DialogService
  ) { }
  loadInterviewPanels() {
    this.back.emit();
  }
  confirmSubmit() {
    this.dialogService.render(
      [{
          title: 'Confirmation',
          message: 'Are you sure that you want to submit this Hiring Request?',
          yesLabel: 'OK',
          noLabel: 'CANCEL'
      }],
  ).subscribe(result => {
    if (result) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
    }
  });
  }
}
