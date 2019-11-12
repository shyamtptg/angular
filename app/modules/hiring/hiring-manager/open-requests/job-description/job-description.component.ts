import { Component, Input} from '@angular/core';
import { NewHiringRequestDataService1 } from '../../new-hiring-request-1/new-hiring-request-service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './job-description.component.html',
  selector: 'open-job-desc'
})
export class OpenJobDescription {
   public display: boolean = false;
   public jobDescData: any;
   @Input() jobDescId: any;
   public jobDescriptionData: any = {
    'details': {}
   };
   constructor(
     private hiringRequestDataService: NewHiringRequestDataService1,
     private dialogService: DialogService,
     private errorHandleService: ErrorHandleService
    ){
  }
  ngOnInit() {
    this.jobDescData = {};
  }
  showDialog() {
    this.getJobDescDetails();
  }
  getJobDescDetails() {
    var self = this;
    self.hiringRequestDataService.loadJobDescriptionDataById(this.jobDescId).subscribe(data => {
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
      self.display = true;
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  closeDialog() {
    this.display = false;
  }
}