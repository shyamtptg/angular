import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoaderService } from '../../../shared/services/loader.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { Router } from '@angular/router';
import { OnboardingService } from './../onboarding.service';
import { MatCheckbox } from '@angular/material';
import { DialogService } from '../../../shared/dialogs/dialog.service';

@Component({
  selector: 'app-education-experience',
  templateUrl: './education-experience.component.html',
  styleUrls: ['./education-experience.component.scss']
})
export class EducationExperienceComponent implements OnInit, OnChanges {

  public token: {};
  header: object = {};
  host = environment.serviceUrl + '/';
  employeeInfo: any;
  educationInfo: any[];
  startDate: any;
  endDate: any;
  startDateArr: any;
  endDateArr: any;
  dateArray = [];
  btnDisable = false;
  startDateString: any;
  endDateString: any;
  isEditing = false;
  isAdding = false;
  origEduInfo = [];
  showWork = 0;
  editObject = null;
  currentDate = new Date().toDateString();
  prospectId: string;
  workInfo: any[];
  origWorkInfo = [];
  maxDegree = 'Not available';
  @Output() closeEduEdit = new EventEmitter();
  @Output() disableProceed = new EventEmitter();
  data = false;
  childObject = {
    data: null,
    body: null
  };
  @Input() childData: any;
  @ViewChild('myCheckbox1') private myCheckbox1: MatCheckbox;
  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private errorHandleService: ErrorHandleService,
    private appService: OnboardingService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.employeeInfo = localStorage.getItem('employeeInfo');
    this.getJoineeDetails();
  }

  ngOnChanges() {
    if (this.childData && this.childData === true) {
        this.btnDisable = true;
    } else {
        this.btnDisable = false;
    }
  }

    showHideWork() {
        if (this.showWork === 0) {
            this.showWork = 1;
            this.getJoineeWorkDetails();
        } else {
            this.showWork = 0;
        }
    }

    getJoineeWorkDetails() {
        if (localStorage.getItem('prospectId')) {
            this.prospectId = localStorage.getItem('prospectId');
        } else {
            return false;
        }
      this.appService.getService('api/q/prospectivehires/newJoinee/' + this.prospectId + '?view=employment').subscribe(res => {
          this.createEmployeeWorkRecord(res[0]);
          this.loaderService.hideLoading();
          if ((this.educationInfo && this.educationInfo.length)
          || (this.workInfo && this.workInfo.length && (this.showWork === 1))
          || (this.childObject.data === true)) {
              $('.timeline').css('display', 'block');
          } else {
              $('.timeline').css('display', 'none');
          }
      }, error => {
          this.errorHandleService.handleErrors(error);
      });
    }

    getJoineeDetails() {
        if (localStorage.getItem('prospectId')) {
            this.prospectId = localStorage.getItem('prospectId');
        } else {
            return false;
        }
        this.appService.getService('api/q/prospectivehires/newJoinee/' + this.prospectId + '?view=education').subscribe(res => {
            this.createEmployeeEducationRecord(res[0]);
            this.loaderService.hideLoading();
            if ((this.educationInfo && this.educationInfo.length)
            || (this.workInfo && this.workInfo.length && (this.showWork === 1))
            || (this.childObject.data === true)) {
                $('.timeline').css('display', 'block');
            } else {
                $('.timeline').css('display', 'none');
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }

    createEmployeeWorkRecord(object: any) {
        this.workInfo = [];
        const workInfoCopy = [];
        for (let i = 0; i < object['employmentHistory'].length; i++) {
            this.workInfo[i] = {};
            this.dateArray[i] = object['employmentHistory'][i].startDate;
            this.startDate = new Date(object['employmentHistory'][i].startDate);
            this.endDate = new Date(object['employmentHistory'][i].endDate);
            this.startDateArr = this.startDate.toDateString().split(' ');
            this.endDateArr = this.endDate.toDateString().split(' ');
            this.startDateString = this.startDateArr[1] + ' ' + this.startDateArr[2] + ', ' + this.startDateArr[3];
            this.endDateString = this.endDateArr[1] + ' ' + this.endDateArr[2] + ', ' + this.endDateArr[3];
            if (this.endDate.toDateString() === this.currentDate) {
                this.endDateString = 'Present';
            }
            const dateDifference = new Date(this.endDate - this.startDate);
            const years = ((parseInt(dateDifference.toISOString().slice(0, 4), 10) - 1970) === 0) ? ''
            : (((parseInt(dateDifference.toISOString().slice(0, 4), 10) - 1970) === 1) ?
            ((parseInt(dateDifference.toISOString().slice(0, 4), 10) - 1970) + ' Year ') :
            ((parseInt(dateDifference.toISOString().slice(0, 4), 10) - 1970) + ' Years '));
            const months = (dateDifference.getMonth() === 0) ? ''
            : ((dateDifference.getMonth() === 1) ?
            (dateDifference.getMonth() + ' Month ') :
            (dateDifference.getMonth() + ' Months '));
            const days = (dateDifference.getDate() === 0) ? ''
            : ((dateDifference.getDate() === 1) ?
            (dateDifference.getDate() + ' Day ') :
            (dateDifference.getDate() + ' Days '));
            this.workInfo[i].duration = this.startDateString + ' --- ' + this.endDateString;
            this.workInfo[i].period = years + months + days;
            this.workInfo[i].id = object['employmentHistory'][i].prospectId;
            this.workInfo[i].company = object['employmentHistory'][i].employerName;
            this.workInfo[i].designation = object['employmentHistory'][i].designation;
            this.workInfo[i].place = object['employmentHistory'][i].city + ', ' + object['employmentHistory'][i].state + ', ' +
            object['employmentHistory'][i].country;
            this.workInfo[i].startDate = object.employmentHistory[i].startDate;
            this.workInfo[i].data = false;
            this.workInfo[i].sequence = i;
            workInfoCopy[i] = this.workInfo[i];
        }
        this.dateArray.sort(this.sortNumber);
        for (let i = 0; i < object['employmentHistory'].length; i++) {
            const index = this.dateArray.indexOf(object['employmentHistory'][i].startDate);
            this.workInfo[index] = workInfoCopy[i];
            this.workInfo[index].sequence = index;
            this.origWorkInfo[i] = object['employmentHistory'][index];
        }
    }

    notifyMe() {
        this.getJoineeDetails();
    }
    editEducationExperience(row: any) {
        if (!this.isAdding && !this.isEditing) {
            this.isEditing = true;
            this.disableProceed.emit(true);
            for (let i = 0; i < this.educationInfo.length; i++) {
                if ( row !== this.educationInfo[i].sequence ) {
                    this.educationInfo[i].data = true;
                    this.educationInfo[i].data = false;
                } else {
                    this.educationInfo[i].data = true;
                }
                if ( row === this.origEduInfo[i].id) {
                    this.editObject = this.origEduInfo[i];
                    localStorage.setItem('putID1', row);
                    localStorage.setItem('recordId', this.educationInfo[i].id);
                }
            }
            this.childObject = {
                data: true,
                body: this.editObject
            };
            this.closeEduEdit.emit(false);
            this.btnDisable = true;
        }
    }
  navigateToWorkExperience() {
    this.router.navigate(['/onboarding/workExperience']);
    }
  createEmployeeEducationRecord(object: any) {
    this.educationInfo = [];
    const educationInfoCopy = [];
    for (let i = 0; i < object.educationHistory.length; i++) {
        this.educationInfo[i] = {};
        this.dateArray[i] = object.educationHistory[i].startDate;
        this.startDate = new Date(object.educationHistory[i].startDate);
        if (object.educationHistory[i].endDate) {
            this.endDate = new Date(object.educationHistory[i].endDate);
        } else {
            this.endDate = new Date();
        }
        this.startDateArr = this.startDate.toDateString().split(' ');
        this.endDateArr = this.endDate.toDateString().split(' ');
        this.startDateString = this.startDateArr[1] + ' ' + this.startDateArr[2] + ', ' + this.startDateArr[3];
        this.endDateString = this.endDateArr[1] + ' ' + this.endDateArr[2] + ', ' + this.endDateArr[3];
        if (this.endDate.toDateString() === this.currentDate) {
            this.endDateString = 'Present';
        }
        const dateDifference = new Date(this.endDate - this.startDate);
        const years = ((parseInt(dateDifference.toISOString().slice(0, 4), 10) - 1970) === 0) ? ''
        : (((parseInt(dateDifference.toISOString().slice(0, 4), 10) - 1970) === 1) ?
        ((parseInt(dateDifference.toISOString().slice(0, 4), 10) - 1970) + ' Year ') :
        ((parseInt(dateDifference.toISOString().slice(0, 4), 10) - 1970) + ' Years '));
        const months = (dateDifference.getMonth() === 0) ? ''
        : ((dateDifference.getMonth() === 1) ?
        (dateDifference.getMonth() + ' Month ') :
        (dateDifference.getMonth() + ' Months '));
        const days = (dateDifference.getDate() === 0) ? ''
        : ((dateDifference.getDate() === 1) ?
        (dateDifference.getDate() + ' Day ') :
        (dateDifference.getDate() + ' Days '));
        this.educationInfo[i].duration = this.startDateString + ' --- ' + this.endDateString;
        this.educationInfo[i].period = years + months + days;
        this.educationInfo[i].degree = object.educationHistory[i].certification;
        this.educationInfo[i].id = object['educationHistory'][i].prospectId;
        this.educationInfo[i].stream = (object.educationHistory[i].specialization === '') ? null
        : object.educationHistory[i].specialization;
        this.educationInfo[i].university = object.educationHistory[i].instituteName;
        this.educationInfo[i].place = object.educationHistory[i].city + ', ' + object.educationHistory[i].state + ', ' +
        object.educationHistory[i].country;
        this.educationInfo[i].data = false;
        this.educationInfo[i].sequence = object.educationHistory[i].id;
        this.educationInfo[i].startDate = object.educationHistory[i].startDate;
        educationInfoCopy[i] = this.educationInfo[i];
    }
        this.dateArray.sort(this.sortNumber);
        for (let i = 0; i < object.educationHistory.length; i++) {
            const index = this.dateArray.indexOf(object.educationHistory[i].startDate);
            educationInfoCopy[index] = this.educationInfo[i];
            this.origEduInfo[i] = object['educationHistory'][i];
        }
        if (educationInfoCopy[0]) {
            this.maxDegree = educationInfoCopy[0].degree;
        } else {
            this.maxDegree = 'Not available';
        }
    }
    sortNumber(a: number, b: number) {
        return b - a;
    }
    cancelEditFn(editData) {
        this.disableProceed.emit(false);
        for (let i = 0; i < this.educationInfo.length; i++) {
            this.educationInfo[i].data = false;
        }
        this.btnDisable = false;
        this.childObject.data = editData;
        this.isEditing = false;
        this.isAdding = false;
        this.closeEduEdit.emit(true);
        if ((this.educationInfo && this.educationInfo.length)
        || (this.workInfo && this.workInfo.length && (this.showWork === 1))
        || (this.childObject.data === true)) {
            $('.timeline').css('display', 'block');
        } else {
            $('.timeline').css('display', 'none');
        }
    }
    addEduExperience() {
        if (!this.isEditing) {
            this.isAdding = true;
            this.disableProceed.emit(true);
            for (let i = 0; i < this.educationInfo.length; i++) {
                this.educationInfo[i].data = false;
            }
            this.childObject.data = true;
            this.childObject.body = null;
            this.btnDisable = true;
            if ((this.educationInfo && this.educationInfo.length)
            || (this.workInfo && this.workInfo.length && (this.showWork === 1))
            || (this.childObject.data === true)) {
                $('.timeline').css('display', 'block');
            } else {
                $('.timeline').css('display', 'none');
            }
        }
    }
    uncheckCheckBox() {
        this.myCheckbox1.checked = false;
    }
    openDeleteDialog(data: any) {
        this.dialogService.render(
          [{
              title: 'Please confirm',
              message: 'Are you sure you want to delete?',
              yesLabel: 'Yes',
              noLabel: 'No'
          }]
        ).subscribe(result => {
          if (result) {
            this.deleteEducationExperience(data);
          }
        });
    }
    deleteEducationExperience(row: any) {
        if (!this.isAdding && !this.isEditing) {
            this.appService.deleteService(
                'api/c/prospectivehires/educationHistory?id=' + row,
                null
            ).subscribe(data => {
                this.loaderService.hideLoading();
                this.dialogService.render(
                  [{
                      title: 'Success',
                      message: 'Education detail deleted successfully',
                      yesLabel: 'OK'
                  }]
                ).subscribe(result => {
                    this.getJoineeDetails();
                });
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
}
