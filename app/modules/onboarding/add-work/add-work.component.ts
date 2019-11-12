import { Component, OnInit, OnChanges, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { PersonalInfoService } from '../personal-info.service';
import { Validators, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { OnboardingService } from './../onboarding.service';
import { DialogService } from '../../../shared/dialogs/dialog.service';

@Component({
  selector: 'app-add-work',
  templateUrl: './add-work.component.html',
  styleUrls: ['./add-work.component.scss']
})
export class AddWorkComponent implements OnInit, OnChanges {
  public token: {};
  header: object = {};
  host = environment.serviceUrl + '/';
  submitObject = {
    'prospectId': null,
    'employerName': null,
    'designation': null,
    'startDate': null,
    'endDate': null,
    'country': null,
    'state': null,
    'city': null
  };
  submitObject1 = {
    'id': null,
    'prospectId': null,
    'employerName': null,
    'designation': null,
    'startDate': null,
    'endDate': null,
    'country': null,
    'state': null,
    'city': null
  };
  countryValues: any = [];
  stateValues: any = [];
  cityValues: any = [];
  countries: any = [];
  statenames: any = [];
  currentCities: any = [];
  cityName: any;
  stateName: any;
  countryName: any;
  stateCities: any;
  getDate = 0;
  planModel = {
    start_time: undefined,
    end_time: undefined
  };
  company: string;
  designation: string;
  startDate: string;
  endDate: string;
  country: string;
  state: string;
  city: string;
  isLoaded = false;
  toSelectCountry: any;
  toSelectState: any;
  toSelectCity: any;
  public isEmptyForm: any;
  public cities: any = [];
  @Input() childData: any;
  @ViewChild('addWorkFormGroup') myForm1;
  @Output() cancelEdit = new EventEmitter();
  @Output() saveEdit = new EventEmitter();
  @Output() saveEdit1 = new EventEmitter();
  public addWorkFormGroup: FormGroup;
  monthNum = {
    'Jan': 0,
    'Feb': 1,
    'Mar': 2,
    'Apr': 3,
    'May': 4,
    'Jun': 5,
    'Jul': 6,
    'Aug': 7,
    'Sep': 8,
    'Oct': 9,
    'Nov': 10,
    'Dec': 11,
  };

  constructor(
    private errorHandleService: ErrorHandleService,
    private loaderService: LoaderService,
    private changeDetectorRefs: ChangeDetectorRef,
    private personalInfoService: PersonalInfoService,
    private appService: OnboardingService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.addWorkFormGroup  = new FormGroup({
      company     : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      designation      : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      startDate     : new FormControl({value: '', disabled: true}, [Validators.required, this.checkStart()]),
      endDate     : new FormControl({value: undefined, disabled: true}, [Validators.required, this.checkEnd()]),
      country : new FormControl('', [Validators.required]),
      state    : new FormControl('', [Validators.required]),
      city    : new FormControl('', [Validators.required])
    });

    this.addWorkFormGroup.valueChanges.subscribe(() => {
      this.isEmptyForm = Object.values(this.addWorkFormGroup.value).every(x => !(x === undefined || x === ''));
      this.getDate = Date.parse(this.addWorkFormGroup.value.startDate);
      (this.addWorkFormGroup.valid) ?
      this.personalInfoService.setValidFormStatus(true, this.isEmptyForm) :
      this.personalInfoService.setValidFormStatus(false, false);
      this.isLoaded = true;
    });
  }

  ngOnChanges() {
    this.getcountries();
  }
  getcountries() {
    this.loaderService.showLoading();
    this.appService.getService('api/core/countryInfo').subscribe(res => {
        this.countries = res.countryNames;
        this.stateCities = null;
        if (this.childData.body && this.childData.body.place) {
          this.toSelectCountry = this.childData.body.place.split(', ')[2];
          this.getstates(this.childData.body.place.split(', ')[2]);
        }
    }, error => {
        this.errorHandleService.handleErrors(error);
    });
  }
  getstates(countryvalue: any) {
      this.appService.getService('api/core/countryInfo?country=' + countryvalue).subscribe(res => {
          this.stateCities = res;
          this.cities = [];
          this.cities.push(res.stateCities);
          if (this.childData.body && this.childData.body.place) {
            this.toSelectState = this.childData.body.place.split(', ')[1];
            this.getcities(this.childData.body.place.split(', ')[1]);
          }
          this.statenames = Object.keys(res.stateCities);
      }, error => {
          this.errorHandleService.handleErrors(error);
      });
  }
  getcities(statevalue: any) {
      const availablecities = this.cities[0];
      let cityinfo;
      Object.keys(availablecities).filter((item) => {
          if (item === statevalue) {
              cityinfo = this.cities[0][item];
              return ;
          }
      });
      if (this.childData.body && this.childData.body.place) {
        this.toSelectCity =  this.childData.body.place.split(', ')[0];
      }
      this.currentCities = cityinfo;
      this.setData();
      this.loaderService.hideLoading();
  }
  changeCityValue(state: any) {
    this.currentCities = this.stateCities['stateCities'][state];
    // this.cityName = this.currentCities[0];
  }
  changeStateValue() {
    this.loaderService.showLoading();
    this.appService.getService('api/core/countryInfo?country=' + this.countryName).subscribe(res => {
        this.stateCities = res;
        this.statenames = Object.keys(res.stateCities);
        // this.stateName = this.statenames[0];
        this.changeCityValue(this.stateName);
        this.loaderService.hideLoading();
    }, error => {
        this.errorHandleService.handleErrors(error);
    });
  }
  setDate() {
    this.getDate = Date.parse(this.addWorkFormGroup.controls['startDate'].value);
  }
  setData() {
    this.changeDetectorRefs.detectChanges();
    if (this.childData.body && !this.countryName) {
      const start = this.childData.body.duration.split(' --- ')[0];
      const startYear = start.split(', ')[1];
      const startDayMonth = start.split(', ')[0];
      const startDay = startDayMonth.split(' ')[1];
      const startMonth = startDayMonth.split(' ')[0];
      const end = this.childData.body.duration.split(' --- ')[1];
      this.planModel.start_time = new Date(parseInt(startYear, 10), this.monthNum[startMonth], parseInt(startDay, 10));
      if (end === 'Present') {
        this.planModel.end_time = new Date();
      } else {
        const endYear = end.split(', ')[1];
        const endDayMonth = end.split(', ')[0];
        const endDay = endDayMonth.split(' ')[1];
        const endMonth = endDayMonth.split(' ')[0];
        this.planModel.end_time = new Date(parseInt(endYear, 10), this.monthNum[endMonth], parseInt(endDay, 10));
      }
      this.addWorkFormGroup.patchValue({
        company: this.childData.body.company,
        designation: this.childData.body.designation,
        country: this.toSelectCountry,
        state: this.toSelectState,
        city: this.toSelectCity,
      });
    }
  }
  submitData() {
    const start = Date.parse(this.addWorkFormGroup.controls['startDate'].value);
    const end = Date.parse(this.addWorkFormGroup.controls['endDate'].value);
    if ( start < end) {
    if (this.childData.body) {
      this.submitObject1.employerName = this.addWorkFormGroup.controls['company'].value;
      this.submitObject1.designation = this.addWorkFormGroup.controls['designation'].value;
      this.submitObject1.startDate = Date.parse(this.addWorkFormGroup.controls['startDate'].value);
      this.submitObject1.endDate = Date.parse(this.addWorkFormGroup.controls['endDate'].value);
      this.submitObject1.country = this.addWorkFormGroup.controls['country'].value;
      this.submitObject1.state = this.addWorkFormGroup.controls['state'].value;
      this.submitObject1.city = this.addWorkFormGroup.controls['city'].value;
      if (localStorage.getItem('prospectId1')) {
        this.submitObject1.prospectId = localStorage.getItem('prospectId1');
      }
      if (localStorage.getItem('putID')) {
        this.submitObject1.id = localStorage.getItem('putID');
      }
      this.appService.putService('api/c/prospectivehires/employmentHistory', this.submitObject1)
      .subscribe(data => {
        this.cancelClick();
        this.loaderService.hideLoading();
        this.dialogService.render(
          [{
              title: 'Success',
              message: 'Job detail edited successfully',
              yesLabel: 'OK'
          }]
        ).subscribe(result => {
          this.saveEdit.emit(false);
        });
      },
      error => {
        this.cancelClick();
        this.errorHandleService.handleErrors(error);
      });
    } else {
      this.submitObject.employerName = this.addWorkFormGroup.controls['company'].value;
      this.submitObject.designation = this.addWorkFormGroup.controls['designation'].value;
      this.submitObject.startDate = Date.parse(this.addWorkFormGroup.controls['startDate'].value);
      this.submitObject.endDate = Date.parse(this.addWorkFormGroup.controls['endDate'].value);
      this.submitObject.country = this.addWorkFormGroup.controls['country'].value;
      this.submitObject.state = this.addWorkFormGroup.controls['state'].value;
      this.submitObject.city = this.addWorkFormGroup.controls['city'].value;
      this.submitObject.prospectId = localStorage.getItem('prospectId');
      this.appService.postService('api/c/prospectivehires/employmentHistory', this.submitObject)
      .subscribe(data => {
        this.cancelClick();
        this.loaderService.hideLoading();
        this.dialogService.render(
          [{
              title: 'Success',
              message: 'Job detail added successfully',
              yesLabel: 'OK'
          }]
        ).subscribe(result => {
          this.saveEdit.emit(false);
        });
      },
      error => {
        this.cancelClick();
        this.errorHandleService.handleErrors(error);
      });
    }
    this.addWorkFormGroup.reset();
    } else {
      this.dialogService.render(
        [{
            title: 'Error',
            message: 'Start date cannot be greater than or equal to end date',
            yesLabel: 'OK'
        }]
      );
    }
  }
  resetForm() {
    this.addWorkFormGroup.reset();
  }
  cancelClick() {
    this.cancelEdit.emit(false);
    this.addWorkFormGroup.reset();
  }
  checkEnd(): ValidatorFn {
    return (control: FormControl): { [key: string]: string } | null => {
      if ( Date.parse(control.value) && Date.parse(this.addWorkFormGroup.controls['startDate'].value)) {
        if (control.value < Date.parse(this.addWorkFormGroup.controls['startDate'].value)) {
            return { 'message': 'End date cannot be less than start date' };
        }
      }
      return null;
    };
  }
  checkStart(): ValidatorFn {
    return (control: FormControl): { [key: string]: string } | null => {
      if ( Date.parse(control.value) && Date.parse(this.addWorkFormGroup.controls['endDate'].value)) {
        if (control.value > Date.parse(this.addWorkFormGroup.controls['endDate'].value)) {
            return { 'message': 'End date cannot be less than start date' };
        }
      }
      return null;
    };
  }
}
