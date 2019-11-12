import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoaderService } from '../../../shared/services/loader.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { OnboardingService } from './../onboarding.service';
import { MatCheckbox } from '@angular/material';
import { DialogService } from '../../../shared/dialogs/dialog.service';

export interface WorkExpType {
    duration: string;
    period: string;
    company: string;
    designation: string;
    place: string;
}

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss']
})
export class WorkExperienceComponent implements OnInit, OnChanges {
  public token: {};
  public prospectId: any;
  experience = localStorage.getItem('experience');
  btnDisable = false;
  header: object = {};
  employeeInfo: any;
  startDate: any;
  endDate: any;
  educationInfo: any[];
  showEducation = 0;
  origEduInfo = [];
  isAdding = false;
  editObject = null;
  startDateArr: any;
  endDateArr: any;
  dateArray = [];
  startDateString: any;
  endDateString: any;
  currentDate = new Date().toDateString();
  convertDays = 1000 * 60 * 60 * 24;
  host = environment.serviceUrl + '/';
  isEditing = false;
  workInfo: any[];
  origWorkInfo = [];
  @Output() closeEdit = new EventEmitter();
  @Output() disableProceed = new EventEmitter();
  @Output() disable = new EventEmitter();
  data = false;
  childObject = {
      data: false,
      body: null
  };
  data1 = null;
  @Input() childData: any;
  @ViewChild('child')
  private child: WorkExperienceComponent;
  @ViewChild('myCheckbox') private myCheckbox: MatCheckbox;

  constructor(
    private loaderService: LoaderService,
    private errorHandleService: ErrorHandleService,
    private ChangeDetectorRefs: ChangeDetectorRef,
    private appService: OnboardingService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getJoineeDetails();
  }

  ngOnChanges() {
    if (this.childData.data && this.childData.data === true) {
        this.btnDisable = true;
    } else {
        this.btnDisable = false;
    }
    this.ChangeDetectorRefs.detectChanges();
    if (localStorage.getItem('call') && localStorage.getItem('call') === 'call') {
        this.getJoineeDetails();
    }
    if (localStorage.getItem('hasExecutedWork') === '1' && localStorage.getItem('employeeInfo')) {
        this.employeeInfo = localStorage.getItem('employeeInfo');
        this.employeeInfo = JSON.parse(this.employeeInfo);
        localStorage.setItem('hasExecutedWork', '0');
        this.createEmployeeWorkRecord(this.employeeInfo);
    }
  }
  showHideEducation() {
    if (this.showEducation === 0) {
        this.showEducation = 1;
        this.getJoineeEduDetails();
    } else {
        this.showEducation = 0;
    }
  }
    getJoineeDetails() {
        if (localStorage.getItem('prospectId')) {
            this.prospectId = localStorage.getItem('prospectId');
        } else {
            return false;
        }
        this.loaderService.showLoading();
        this.appService.getService('api/q/prospectivehires/newJoinee/' + this.prospectId + '?view=employment').subscribe(res => {
            this.createEmployeeWorkRecord(res[0]);
            this.disable.emit(true);
            this.loaderService.hideLoading();
            if ((this.workInfo && this.workInfo.length)
            || (this.educationInfo && this.educationInfo.length && (this.showEducation === 1))
            || (this.childObject.data === true)) {
                $('.timeline').css('display', 'block');
            } else {
                $('.timeline').css('display', 'none');
            }
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
  getJoineeEduDetails() {
    if (localStorage.getItem('prospectId')) {
        this.prospectId = localStorage.getItem('prospectId');
    } else {
        return false;
    }
    this.loaderService.showLoading();
    this.appService.getService('api/q/prospectivehires/newJoinee/' + this.prospectId + '?view=education').subscribe(res => {
        this.createEmployeeEducationRecord(res[0]);
        this.loaderService.hideLoading();
        if ((this.workInfo && this.workInfo.length)
        || (this.educationInfo && this.educationInfo.length && (this.showEducation === 1))
        || (this.childObject.data === true)) {
            $('.timeline').css('display', 'block');
        } else {
            $('.timeline').css('display', 'none');
        }
        this.loaderService.hideLoading();
    }, error => {
        this.errorHandleService.handleErrors(error);
    });
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
            this.educationInfo[i].stream = (object.educationHistory[i].specialization === '') ? null
            : object.educationHistory[i].specialization;
            this.educationInfo[i].university = object.educationHistory[i].instituteName;
            this.educationInfo[i].place = object.educationHistory[i].city + ',' + object.educationHistory[i].state + ',' +
            object.educationHistory[i].country;
            this.educationInfo[i].data = false;
            this.educationInfo[i].sequence = i;
            this.educationInfo[i].startDate = object.educationHistory[i].startDate;
            educationInfoCopy[i] = this.educationInfo[i];
        }
            this.dateArray.sort(this.sortNumber);
            for (let i = 0; i < object.educationHistory.length; i++) {
                const index = this.dateArray.indexOf(object.educationHistory[i].startDate);
                this.educationInfo[index] = educationInfoCopy[i];
                this.educationInfo[index].sequence = index;
                this.origEduInfo[i] = object['educationHistory'][index];
            }
            if (this.origEduInfo[0]) {
                localStorage.setItem('maxQualification', this.origEduInfo[0].certification);
            }
        }
    notifyMe() {
        this.getJoineeDetails();
    }
    editWorkExperience(row: any) {
        if (!this.isAdding && !this.isEditing) {
            this.disableProceed.emit(true);
            this.isEditing = true;
            for (let i = 0; i < this.workInfo.length; i++) {
                if ( row !== this.workInfo[i].sequence ) {
                    this.workInfo[i].data = false;
                } else {
                    this.workInfo[i].data = true;
                    this.editObject = this.workInfo[i];
                    localStorage.setItem('putID', row);
                    localStorage.setItem('prospectId1', this.workInfo[i].id);
                }
            }
            this.childObject = {
                data: true,
                body: this.editObject
            };
            this.closeEdit.emit(false);
            this.btnDisable = true;
        }
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
            this.workInfo[i].sequence = object.employmentHistory[i].id;
            workInfoCopy[i] = this.workInfo[i];
            this.origWorkInfo[i] = object['employmentHistory'][i];
        }
    }
    sortNumber(a: number, b: number) {
        return b - a;
    }
    getDetailsAgain(details) {
        if (details === false) {
            this.getJoineeDetails();
        }
    }
    cancelEditFn(editData) {
        for (let i = 0; i < this.workInfo.length; i++) {
                this.workInfo[i].data = false;
        }
        this.btnDisable = false;
        this.childObject.data = editData;
        this.isEditing = false;
        this.isAdding = false;
        this.closeEdit.emit(true);
        this.disableProceed.emit(false);
        if ((this.workInfo && this.workInfo.length)
        || (this.educationInfo && this.educationInfo.length && (this.showEducation === 1))
        || (this.childObject.data === true)) {
            $('.timeline').css('display', 'block');
        } else {
            $('.timeline').css('display', 'none');
        }
    }
    addWorkExperience() {
        if (!this.isEditing) {
            this.isAdding = true;
            this.disableProceed.emit(true);
            for (let i = 0; i < this.workInfo.length; i++) {
                this.workInfo[i].data = false;
            }
            this.childObject.data = true;
            this.childObject.body = null;
            this.btnDisable = true;
            if ((this.workInfo && this.workInfo.length)
            || (this.educationInfo && this.educationInfo.length && (this.showEducation === 1))
            || (this.childObject.data === true)) {
                $('.timeline').css('display', 'block');
            } else {
                $('.timeline').css('display', 'none');
            }
        }
    }
    uncheckCheckBox() {
        this.myCheckbox.checked = false;
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
            this.deleteWorkExperience(data);
          }
        });
    }
    deleteWorkExperience(row: any) {
        if (!this.isAdding && !this.isEditing) {
            this.loaderService.showLoading();
            this.appService.deleteService('api/c/prospectivehires/employmentHistory?id=' + row, null)
            .subscribe(data => {
                this.loaderService.hideLoading();
                this.getJoineeDetails();
            },
            error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
}
