import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import {MyErrorStateMatcher} from '../input-error-state-matcher';
import { environment } from '../../../../environments/environment';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import {PersonalInfoService} from '../personal-info.service';
import { MatStepper } from '@angular/material/stepper';
import { Router} from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import { OnboardingService } from './../onboarding.service';

export interface Status {
    value: string;
    viewValue: string|boolean;
}
@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.scss']
})

export class BasicInfoComponent implements OnInit, OnDestroy {
    matcher = new MyErrorStateMatcher();
    public prospectId: any;
    token: object = {};
    header: object = {};
    host = environment.serviceUrl + '/';
    public formstatus: any;
    public isBasicFormValid: any;
    public parentvalue: any;

    @ViewChild('basicInfoFormGroup') myForm1;
    @ViewChild('stepper') stepper: MatStepper;
    public basicInfoFormGroup: FormGroup;
    status: Status[] = [
        { value: 'single', viewValue: 'Single' },
        { value: 'married', viewValue: 'Married' }
    ];
    vehicleTypes: Status[] = [
        { value: 'twoWheeler', viewValue: 'Two Wheeler' },
        { value: 'fourWheeler', viewValue: 'Four Wheeler' }
    ];
    relocation: Status[] = [
        { value: 'Yes', viewValue: true},
        { value: 'No', viewValue: false}
    ];
    bloodGroups: Status[] = [
        { value: 'O+', viewValue: 'O+' },
        { value: 'O-', viewValue: 'O-' },
        { value: 'A+', viewValue: 'A+' },
        { value: 'A-', viewValue: 'A-' },
        { value: 'B+', viewValue: 'B+' },
        { value: 'B-', viewValue: 'B-' }
    ];

    constructor(
        private errorHandleService: ErrorHandleService,
        private personalInfoService: PersonalInfoService,
        private router: Router,
        private loaderService: LoaderService,
        private appService: OnboardingService
    ) {
        this.personalInfoService.setIndexValue(0);
    }

    ngOnInit() {
        this.formstatus = this.personalInfoService.stateObj.value;
        this.prospectId = localStorage.getItem('prospectId');
        this.getbasicIfo();
        this.basicInfoFormGroup  = new FormGroup({
            personalInformationId: new FormControl(''),
            prospectId: new FormControl(''),
            firstName     : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
            lastName      : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
            MiddleName    : new FormControl('', [Validators.pattern('^[a-zA-Z]+$')]),
            gender        : new FormControl('', [Validators.required]),
            dateOfBirthRecords     : new FormControl('', [Validators.required]),
            dateOfBirthActual     : new FormControl(''),
            maritalStatus : new FormControl('', [Validators.required]),
            bloodGroup    : new FormControl('', [Validators.required]),
            relocation    : new FormControl(''),
            vehicleNumber : new FormControl(''),
            vehicleType   : new FormControl(''),
            parentvalue   : new FormControl(''),
            fatherName   : new FormControl(''),
            motherName   : new FormControl(''),


        });
        this.personalInfoService.setValidFormStatus(this.basicInfoFormGroup.valid, this.basicInfoFormGroup);
        if (this.basicInfoFormGroup.valid) {
            this.isBasicFormValid = true;
            this.formstatus.isBasic = true;
            this.formstatus.formData = {...this.formstatus.formData, ...this.basicInfoFormGroup.value};
            this.personalInfoService.setState(this.formstatus);
        } else {
            this.isBasicFormValid = false;
            this.formstatus.isBasic = false;
            this.formstatus.formData = {...this.formstatus.formData, ...this.basicInfoFormGroup.value};
            this.personalInfoService.setState(this.formstatus);
        }

        this.basicInfoFormGroup.valueChanges.subscribe(form => {
            if (this.basicInfoFormGroup.valid) {
                this.isBasicFormValid = true;
                this.formstatus.isBasic = true;
                this.formstatus.formData = {...this.formstatus.formData, ...this.basicInfoFormGroup.value};
                this.personalInfoService.setState(this.formstatus);
            } else {
                this.isBasicFormValid = false;
                this.formstatus.isBasic = false;
                this.formstatus.formData = {...this.formstatus.formData, ...this.basicInfoFormGroup.value};
                this.personalInfoService.setState(this.formstatus);
            }
            this.personalInfoService.setValidFormStatus(this.basicInfoFormGroup.valid, this.basicInfoFormGroup);
        });
    }

    ngOnDestroy() {
    }

    getbasicIfo() {
        this.loaderService.showLoading();
        this.appService.getService('api/q/prospectivehires/newJoinee/' + this.prospectId + '?view=personal').subscribe(res => {
            this.personalInfoService.sendbasicInfo(res);
            res.forEach(item => {
                this.basicInfoFormGroup.patchValue({
                    personalInformationId: item.personalInformationId ? item.personalInformationId : '',
                    prospectId: item.prospectId,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    MiddleName: item.middleName,
                    gender: item.gender,
                    fatherName: item.fatherName,
                    motherName: item.motherName,
                    dateOfBirthRecords: new Date(item.dateOfBirthRecords),
                    dateOfBirthActual: new Date(item.dateOfBirthActual),
                    maritalStatus: item.maritalStatus,
                    bloodGroup: item.bloodGroup,
                    relocation: item.relocate,
                    vehicleNumber: item.vehicleNumber,
                    vehicleType: item.vehicleType
                }) ;
                localStorage.setItem('employeeInfo', JSON.stringify(item));
                localStorage.setItem('educationHistory', JSON.stringify(item['educationHistory']));
                localStorage.setItem('disableStepper', '1');
           });
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }

    gotoNext() {
        this.router.navigate(['/onboarding/navigationBar/financialInfo']);
    }

}
