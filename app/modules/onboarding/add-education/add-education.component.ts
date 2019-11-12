import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, OnChanges,
  Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { PersonalInfoService } from './../personal-info.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { OnboardingService } from './../onboarding.service';
import { DialogService } from '../../../shared/dialogs/dialog.service';

@Component({
  selector: 'app-add-education',
  templateUrl: './add-education.component.html',
  styleUrls: ['./add-education.component.scss']
})
export class AddEducationComponent implements OnInit, OnChanges {
  public token: {};
  header: object = {};
  host = environment.serviceUrl + '/';
  certificationValues: any[] = [
    { value: 'Degree', viewValue: 'Degree' },
    { value: '10th', viewValue: '10th' },
    { value: '12th', viewValue: '12th' }
  ];
  boardValues: any[] = [
    { value: 'ICSE', viewValue: 'ICSE' },
    { value: 'CBSE', viewValue: 'CBSE' },
    { value: 'State', viewValue: 'State' }
  ];
  countryValues: any = [];
  stateValues: any = [];
  cityValues: any = [];
  countries: any = [];
  statenames: any = [];
  currentCities: any = [];
  certification: any;
  selectedCertification: any = null;
  stateCities: any;
  cityName: any;
  stateName: any;
  countryName: any;
  subjectValues: any[] = [
    { value: 'Science', viewValue: 'Science' },
    { value: 'Commerce', viewValue: 'Commerce' },
    { value: 'Arts', viewValue: 'Arts' }
  ];
  degreeValues: any[] = [
    { value: 'Bachelors', viewValue: 'Bachelors' },
    { value: 'Masters', viewValue: 'Masters' },
    { value: 'Doctorate', viewValue: 'Doctorate' }
  ];
  toSelectCountry: any;
  toSelectState: any;
  toSelectCity: any;
  start: any;
  end: any;
  getDate = 0;
  company: string;
  designation: string;
  startDate: string;
  endDate: string;
  country: string;
  state: string;
  city: string;
  isLoaded = false;
  certificationValue = '';
  public isEmptyForm: any;
  public cities: any = [];
  req = new FormControl('', [Validators.required]);
  reqPluspatt = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]);
  notReq = new FormControl('');
  reqPlusDisabled = new FormControl({value: '', disabled: true}, [Validators.required]);
  validate = [this.notReq, this.notReq, this.notReq, this.notReq,
    this.notReq, this.notReq, this.notReq, this.notReq, this.notReq, this.notReq, this.notReq, this.notReq];
  @Input() childData: any;
  @ViewChild('selectedFormGroup') myForm1;
  @Output() cancelEduEdit = new EventEmitter();
  @Output() saveEduEdit = new EventEmitter();
  @Output() saveEduEdit1 = new EventEmitter();
  certificationType: any;
  submitObject: any;
  submitObject1: any;
  public selectedFormGroup: FormGroup;
  public formGroups: FormGroup[] = [];
  planModel: any;
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
    this.resetSubmitObjects();
    this.planModel = {
      start_time: null,
      end_time: null
    };
    this.formGroups[0]  = new FormGroup({
      certification     : new FormControl('', [Validators.required])
    });

    this.formGroups[1] = new FormGroup({
      certification     : new FormControl('', [Validators.required]),
      country : new FormControl('', [Validators.required]),
      state    : new FormControl('', [Validators.required]),
      city    : new FormControl('', [Validators.required]),
      graduation      : new FormControl({value: '', disabled: true}),
      enrollment     : new FormControl({value: '', disabled: true}),
      university     : new FormControl('', [Validators.required]),
      specialization : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      degree    : new FormControl('', [Validators.required])
    });

    this.formGroups[2] = new FormGroup({
      subject     : new FormControl('', [Validators.required]),
      school      : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      board     : new FormControl('', [Validators.required]),
      certification     : new FormControl('', [Validators.required]),
      country : new FormControl('', [Validators.required]),
      state    : new FormControl('', [Validators.required]),
      city    : new FormControl('', [Validators.required]),
      year    : new FormControl({value: '', disabled: true})
    });

    this.formGroups[3] = new FormGroup({
      school      : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      board     : new FormControl('', [Validators.required]),
      certification     : new FormControl('', [Validators.required]),
      country : new FormControl('', [Validators.required]),
      state    : new FormControl('', [Validators.required]),
      city    : new FormControl('', [Validators.required]),
      year    : new FormControl({value: '', disabled: true})
    });

    if (this.childData.data) {
      this.selectedFormGroup = this.formGroups[0];
    }

    this.selectedFormGroup = this.formGroups[0];

    this.selectedFormGroup.valueChanges.subscribe(() => {
      this.isEmptyForm = Object.values(this.selectedFormGroup.value).every(x => !(x === undefined || x === ''));
      (this.selectedFormGroup.valid) ?
      this.personalInfoService.setValidFormStatus(true, this.isEmptyForm) :
      this.personalInfoService.setValidFormStatus(false, false);
      this.isLoaded = true;
    });
  }

  ngOnChanges() {
    this.changeDetectorRefs.detectChanges();
    this.getcountries();
  }
  getcountries() {
    this.loaderService.showLoading();
    this.appService.getService('api/core/countryInfo/').subscribe(res => {
        this.countries = res.countryNames;
        this.stateCities = null;
        if (this.childData.body && this.childData.body.country) {
          this.toSelectCountry = this.childData.body.country;
          this.getstates(this.childData.body.country);
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
          if (this.childData.body && this.childData.body.state) {
            this.toSelectState = this.childData.body.state;
            this.getcities(this.childData.body.state);
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
      if (this.childData.body && this.childData.body.city) {
        this.toSelectCity =  this.childData.body.city;
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
  resetSubmitObjects() {
    this.submitObject = {
      'certification': null,
      'prospectId': null,
      'instituteName': null,
      'specialization': null,
      'school': null,
      'subject': null,
      'year': null,
      'university': null,
      'startDate': null,
      'endDate': null,
      'description': null,
      'degree': null,
      'board': null,
      'country': null,
      'state': null,
      'city': null
    };
    this.submitObject1 = {
      'id': null,
      'prospectId': null,
      'certification': null,
      'specialization': null,
      'instituteName': null,
      'school': null,
      'subject': null,
      'year': null,
      'university': null,
      'startDate': null,
      'endDate': null,
      'description': null,
      'degree': null,
      'board': null,
      'country': null,
      'state': null,
      'city': null
    };
  }
  setDate() {
    this.getDate = Date.parse(this.selectedFormGroup.controls['startDate'].value);
  }
  submitData() {
    if (this.selectedFormGroup.controls['enrollment']) {
      this.start = Date.parse(this.selectedFormGroup.controls['enrollment'].value);
      this.end = Date.parse(this.selectedFormGroup.controls['graduation'].value);
    } else {
      if (this.selectedFormGroup.controls['year']) {
        this.end = Date.parse(this.selectedFormGroup.controls['year'].value);
        let day = this.selectedFormGroup.controls['year'].value.getDate();
        const month = this.selectedFormGroup.controls['year'].value.getMonth();
        const year = this.selectedFormGroup.controls['year'].value.getYear() + 1900;
        if ( month === 1 && day === 29) {
          day = day - 1;
        }
        this.start = new Date(year - 1, month, day);
      }
    }
    if (!this.end || this.start < this.end) {
    if (this.childData.body) {
      if (this.selectedFormGroup.controls['certification'].value === '10th') {
        this.submitObject1.board = this.selectedFormGroup.controls['board'].value;
        this.submitObject1.school = this.selectedFormGroup.controls['school'].value;
        this.submitObject1.instituteName = this.selectedFormGroup.controls['school'].value;
        this.submitObject1.year = Date.parse(this.selectedFormGroup.controls['year'].value);
        this.submitObject1.startDate = Date.parse(this.start);
        this.submitObject1.endDate = Date.parse(this.selectedFormGroup.controls['year'].value);
      } else if (this.selectedFormGroup.controls['certification'].value === '12th') {
        this.submitObject1.board = this.selectedFormGroup.controls['board'].value;
        this.submitObject1.school = this.selectedFormGroup.controls['school'].value;
        this.submitObject1.instituteName = this.selectedFormGroup.controls['school'].value;
        this.submitObject1.year = Date.parse(this.selectedFormGroup.controls['year'].value);
        this.submitObject1.startDate = Date.parse(this.start);
        this.submitObject1.endDate = Date.parse(this.selectedFormGroup.controls['year'].value);
        this.submitObject1.subject = this.selectedFormGroup.controls['subject'].value;
      } else {
        this.submitObject1.degree = this.selectedFormGroup.controls['degree'].value;
        this.submitObject1.specialization = this.selectedFormGroup.controls['specialization'].value;
        this.submitObject1.university = this.selectedFormGroup.controls['university'].value;
        this.submitObject1.instituteName = this.selectedFormGroup.controls['university'].value;
        this.submitObject1.startDate = Date.parse(this.selectedFormGroup.controls['enrollment'].value);
        this.submitObject1.endDate = Date.parse(this.selectedFormGroup.controls['graduation'].value);
      }
      this.submitObject1.certification = this.selectedFormGroup.controls['certification'].value;
      this.submitObject1.country = this.selectedFormGroup.controls['country'].value;
      this.submitObject1.state = this.selectedFormGroup.controls['state'].value;
      this.submitObject1.city = this.selectedFormGroup.controls['city'].value;
      if (localStorage.getItem('recordId')) {
        this.submitObject1.prospectId = localStorage.getItem('recordId');
      }
      if (localStorage.getItem('putID1')) {
        this.submitObject1.id = localStorage.getItem('putID1');
      }
      this.selectedFormGroup.reset();
      this.cancelClick();
      this.appService.putService('api/c/prospectivehires/educationHistory', this.submitObject1)
      .subscribe(data => {
        this.cancelClick();
        this.loaderService.hideLoading();
        this.dialogService.render(
          [{
              title: 'Success',
              message: 'Education detail edited successfully',
              yesLabel: 'OK'
          }]
        ).subscribe(result => {
          this.resetSubmitObjects();
          this.saveEduEdit.emit(false);
        });
      },
      error => {
        this.resetSubmitObjects();
        this.errorHandleService.handleErrors(error);
      });
    } else {
      if (this.selectedFormGroup.controls['certification'].value === '10th') {
        this.submitObject.board = this.selectedFormGroup.controls['board'].value;
        this.submitObject.school = this.selectedFormGroup.controls['school'].value;
        this.submitObject.instituteName = this.selectedFormGroup.controls['school'].value;
        this.submitObject.year = Date.parse(this.selectedFormGroup.controls['year'].value);
        this.submitObject.startDate = Date.parse(this.start);
        this.submitObject.endDate = Date.parse(this.selectedFormGroup.controls['year'].value);
      } else if (this.selectedFormGroup.controls['certification'].value === '12th') {
        this.submitObject.board = this.selectedFormGroup.controls['board'].value;
        this.submitObject.school = this.selectedFormGroup.controls['school'].value;
        this.submitObject.instituteName = this.selectedFormGroup.controls['school'].value;
        this.submitObject.year = Date.parse(this.selectedFormGroup.controls['year'].value);
        this.submitObject.startDate = Date.parse(this.start);
        this.submitObject.endDate = Date.parse(this.selectedFormGroup.controls['year'].value);
        this.submitObject.subject = this.selectedFormGroup.controls['subject'].value;
      } else if (this.selectedFormGroup.controls['certification'].value === 'Degree') {
        this.submitObject.degree = this.selectedFormGroup.controls['degree'].value;
        this.submitObject.specialization = this.selectedFormGroup.controls['specialization'].value;
        this.submitObject.university = this.selectedFormGroup.controls['university'].value;
        this.submitObject.instituteName = this.selectedFormGroup.controls['university'].value;
        this.submitObject.startDate = Date.parse(this.selectedFormGroup.controls['enrollment'].value);
        this.submitObject.endDate = Date.parse(this.selectedFormGroup.controls['graduation'].value);
      }
      this.submitObject.certification = this.selectedFormGroup.controls['certification'].value;
      this.submitObject.country = this.selectedFormGroup.controls['country'].value;
      this.submitObject.state = this.selectedFormGroup.controls['state'].value;
      this.submitObject.city = this.selectedFormGroup.controls['city'].value;
      if (localStorage.getItem('prospectId')) {
        this.submitObject.prospectId = localStorage.getItem('prospectId');
      }
      this.selectedFormGroup.reset();
      this.cancelClick();
      this.appService.postService('api/c/prospectivehires/educationHistory', this.submitObject)
      .subscribe(data => {
        this.cancelClick();
        this.loaderService.hideLoading();
        this.dialogService.render(
          [{
              title: 'Success',
              message: 'Education detail added successfully',
              yesLabel: 'OK'
          }]
        ).subscribe(result => {
          this.resetSubmitObjects();
          this.saveEduEdit.emit(false);
        });
      },
      error => {
        this.resetSubmitObjects();
        this.errorHandleService.handleErrors(error);
      });
    }
    this.start = null;
    this.end = null;
    } else if (this.start >= this.end) {
      this.dialogService.render(
        [{
            title: 'Error',
            message: 'Enrollment year cannot be greater than or equal to graduation year',
            yesLabel: 'OK'
        }]
      );
    }
  }
  setData() {
    if (this.childData.body && !this.countryName) {
      this.cityName = this.toSelectCity;
      this.stateName = this.toSelectState;
      this.countryName = this.toSelectCountry;
      this.planModel.start_time = new Date(this.childData.body.startDate);
      if (this.childData.body.endDate) {
        this.planModel.end_time = new Date(this.childData.body.endDate);
      } else {
        this.planModel.end_time = new Date();
      }
      if (this.childData.body.certification === '10th') {
        this.changeCertification({value: '10th'});
        this.selectedCertification = '10th';
        this.selectedFormGroup.patchValue({
          school: this.childData.body.instituteName,
          board: this.boardValues.find(c => c.viewValue === this.childData.body.board).value,
          country: this.toSelectCountry,
          state: this.toSelectState,
          city: this.toSelectCity
        });
      } else if (this.childData.body.certification === '12th') {
        this.changeCertification({value: '12th'});
        this.selectedCertification = '12th';
        this.selectedFormGroup.patchValue({
          subject     : this.subjectValues.find(c => c.viewValue === this.childData.body.subject).value,
          school      : this.childData.body.instituteName,
          board     : this.boardValues.find(c => c.viewValue === this.childData.body.board).value,
          country: this.toSelectCountry,
          state: this.toSelectState,
          city: this.toSelectCity
        });
      } else {
        this.changeCertification({value: 'Degree'});
        this.selectedCertification = 'Degree';
        this.selectedFormGroup.patchValue({
          country: this.toSelectCountry,
          state: this.toSelectState,
          city: this.toSelectCity,
          university     : this.childData.body.instituteName,
          specialization : this.childData.body.specialization,
          degree    : this.degreeValues.find(c => c.viewValue === this.childData.body.degree).value
        });
      }
    }
  }
  changeCertification(data: any) {
    this.certificationValue = data.value;
    if (this.certificationValue === 'Degree') {
      $('.job-edit').css('height', '540px');
      this.selectedFormGroup = this.formGroups[1];
      this.certification = this.certificationValues[0].value;
      this.selectedFormGroup.patchValue({
        certification: this.certificationValues[0].value
      });
      this.selectedFormGroup.valueChanges.subscribe(() => {
        this.isEmptyForm = Object.values(this.selectedFormGroup.value).every(x => !(x === undefined || x === ''));
        (this.selectedFormGroup.valid) ?
        this.personalInfoService.setValidFormStatus(true, this.isEmptyForm) :
        this.personalInfoService.setValidFormStatus(false, false);
        this.isLoaded = true;
        const controls = this.selectedFormGroup.controls;
        let c = 0;
        for (const name in controls) {
            if (controls[name].invalid) {
              c++;
            }
        }
      });
      if (this.selectedFormGroup !== this.formGroups[0]) {
        this.selectedFormGroup.updateValueAndValidity();
      }
    } else if (this.certificationValue === '12th') {
      this.selectedFormGroup = this.formGroups[2];
      this.certification = this.certificationValues[2].value;
      this.selectedFormGroup.patchValue({
        certification: this.certificationValues[2].value
      });
      this.selectedFormGroup.valueChanges.subscribe(() => {
        this.isEmptyForm = Object.values(this.selectedFormGroup.value).every(x => !(x === undefined || x === ''));
        (this.selectedFormGroup.valid) ?
        this.personalInfoService.setValidFormStatus(true, this.isEmptyForm) :
        this.personalInfoService.setValidFormStatus(false, false);
        this.isLoaded = true;
        const controls = this.selectedFormGroup.controls;
        let c = 0;
        for (const name in controls) {
            if (controls[name].invalid) {
              c++;
            }
        }
      });
      if (this.selectedFormGroup !== this.formGroups[0]) {
        this.selectedFormGroup.updateValueAndValidity();
      }
      $('.job-edit').css('height', '470px');
    } else if (this.certificationValue === '10th') {
      this.selectedFormGroup = this.formGroups[3];
      this.certification = this.certificationValues[1].value;
      this.selectedFormGroup.patchValue({
        certification: this.certificationValues[1].value
      });
      this.selectedFormGroup.valueChanges.subscribe(() => {
        this.isEmptyForm = Object.values(this.selectedFormGroup.value).every(x => !(x === undefined || x === ''));
        (this.selectedFormGroup.valid) ?
        this.personalInfoService.setValidFormStatus(true, this.isEmptyForm) :
        this.personalInfoService.setValidFormStatus(false, false);
        this.isLoaded = true;
        const controls = this.selectedFormGroup.controls;
        let c = 0;
        for (const name in controls) {
            if (controls[name].invalid) {
              c++;
            }
        }
      });
      if (this.selectedFormGroup !== this.formGroups[0]) {
        this.selectedFormGroup.updateValueAndValidity();
      }
      $('.job-edit').css('height', '470px');
    }
  }
  resetForm() {
    this.selectedFormGroup.reset();
  }
  cancelClick() {
    this.certificationValue = '';
    this.selectedFormGroup.reset();
    this.selectedFormGroup = this.formGroups[0];
    this.selectedFormGroup.reset();
    this.selectedCertification = null;
    $('.job-edit').css('height', '160px');
    this.cancelEduEdit.emit(false);
  }
}
