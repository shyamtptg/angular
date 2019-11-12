
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { InterviewDataService } from '../interviews.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
  template: `<span><a style="cursor: pointer;" (click)="showDialog()">{{jobDesc}}</a></span>`
})
export class JobDescPopup implements ICellRendererAngularComp {
  public params: any;
  public jobDesc: string;
  public jobDescData: any;
  private result: any;
  public display: boolean = false;
  public jobDescriptionData: any = {
    'details': {}
  };
  constructor(
    private interviewDataService: InterviewDataService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {}

  agInit(params: any): void {
    this.params = params;
    this.jobDescData = {};
    this.jobDesc = params.data.jobDescriptionTemplateName;
  }
  showDialog() {
    this.getJobDescDetails();
  }
  getJobDescDetails() {
    var jobDescId = this.params.data.jobDescriptionId, self = this;
    self.interviewDataService.loadJobDescriptionDataById(jobDescId).subscribe(data => {
      self.jobDescriptionData = data.json();
      self.jobDescriptionData.details = JSON.parse(data.json().details);
      var uxSkills = '', technicalSkills = '', certifications = '';
      self.jobDescriptionData.details.skills && self.jobDescriptionData.details.skills.uxDesignSkills && self.jobDescriptionData.details.skills.uxDesignSkills.forEach(function (elem: any, ind: any) {
        if (uxSkills)
          uxSkills = uxSkills + ", " + elem['display'];
        else
          uxSkills = elem['display'];
      });
      if (uxSkills) {
        self.jobDescriptionData.details.skills.uxDesignSkills = uxSkills;
      }
      self.jobDescriptionData.details.skills && self.jobDescriptionData.details.skills.technicalSkills && self.jobDescriptionData.details.skills.technicalSkills.forEach(function (elem: any, ind: any) {
        if (technicalSkills)
          technicalSkills = technicalSkills + ", " + elem['display'];
        else
          technicalSkills = elem['display'];
      });
      if (technicalSkills) {
        self.jobDescriptionData.details.skills.technicalSkills = technicalSkills;
      }
      self.jobDescriptionData.details.skills && self.jobDescriptionData.details.skills.certifications && self.jobDescriptionData.details.skills.certifications.forEach(function (elem: any, ind: any) {
        if (certifications)
          certifications = certifications + ", " + elem['display'];
        else
          certifications = elem['display'];
      });
      if (certifications) {
        self.jobDescriptionData.details.skills.certifications = certifications;
      }
      self.jobDescData = self.jobDescriptionData;
      this.params.context.componentParent.showJobDesc(self.jobDescData);
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  closeDialog() {
    this.display = false;
  }
  refresh(): boolean {
    return false;
  }
}