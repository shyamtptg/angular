import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MyErrorStateMatcher} from '../input-error-state-matcher';
import {PersonalInfoService} from '../personal-info.service';
import { Router} from '@angular/router';
import { OnboardingService } from './../onboarding.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
export interface Status {
    value: string;
    viewValue: string;
}
@Component({
    selector: 'app-contact-info',
    templateUrl: './contact-info.component.html',
    styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
   public contactInfoFormGroup: FormGroup;
   matcher = new MyErrorStateMatcher();
   public emailPattern = '^[a-z0-9._+-]+@[a-z0-9.-]+\.[com]{3}$';
   public contactInfo: any;
   public formstatus: any;
   public iscontactFormValid: any;
   public addressCheck: boolean = false;
   public countries: any = [];
   public statenames: any = [];
   public permenentstatenames: any = [];
   public cities: any = [];
   public currentCities: any = [];
   public permenentCities: any = [];
   public country: any;
   public state: any;
    status: Status[] = [
        { value: 'single', viewValue: 'Single' },
        { value: 'married', viewValue: 'Married' }
    ];
    constructor(private personalInfoService: PersonalInfoService,
        private router: Router,
        private appService: OnboardingService,
        private errorHandleService: ErrorHandleService) {
        this.personalInfoService.setIndexValue(2);

    }
    ngOnInit() {
            this.getcountries();
            this.formstatus = this.personalInfoService.stateObj.value;
            this.contactInfoFormGroup = new FormGroup({
            currentAddressId: new FormControl(''),
            address: new FormControl('', [Validators.required]),
            pincode : new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
            country : new FormControl('', [Validators.required]),
            state : new FormControl('', [Validators.required]),
            city : new FormControl('', [Validators.required]),

            perminentAddressId: new FormControl(''),
            address1: new FormControl(''),
            pincode1 : new FormControl('', [Validators.pattern('^[0-9]*$')]),
            country1 : new FormControl('', [Validators.required]),
            state1 : new FormControl('', [Validators.required]),
            city1 : new FormControl('', [Validators.required]),


            mobileNumber : new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(18)]),
            alternativeMobile : new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.maxLength(18)]),
            personalEmailId : new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
            skypeId: new FormControl(''),
            presentaddress: new FormControl(''),
            permanentAddressSameAsCurrentAddress: new FormControl('')
         });
         if (this.personalInfoService.subject.length) {
            this.contactInfo = this.personalInfoService.subject[0];
            if (this.contactInfo.permanentAddressSameAsCurrentAddress === true) {
                this.contactInfoFormGroup.get('country1').clearValidators();
                this.contactInfoFormGroup.get('state1').clearValidators();
                this.contactInfoFormGroup.get('city1').clearValidators();

            }
            this.contactInfoFormGroup.patchValue({
            currentAddressId: this.contactInfo.currentAddress.id,
            address:  this.contactInfo.currentAddress.address1,
            pincode: this.contactInfo.currentAddress.zipcode,
            country: this.contactInfo.currentAddress.country,
            state: this.contactInfo.currentAddress.state,
            city: this.contactInfo.currentAddress.city,

            perminentAddressId: this.contactInfo.permanentAddress.id,
            address1:  this.contactInfo.permanentAddress.address2,
            pincode1: this.contactInfo.permanentAddress.zipcode,
            country1: this.contactInfo.permanentAddress.country,
            state1: this.contactInfo.permanentAddress.state,
            city1: this.contactInfo.permanentAddress.city,

            permanentAddressSameAsCurrentAddress: this.contactInfo.permanentAddressSameAsCurrentAddress,
            mobileNumber: this.contactInfo.mobileNumber,
            alternativeMobile: this.contactInfo.alternativeMobile,
            personalEmailId: this.contactInfo.personalEmailId,
            skypeId: this.contactInfo.skypeId,

            }) ;
            this.addressCheck = !(this.contactInfo.permanentAddressSameAsCurrentAddress);
         }


            (this.contactInfoFormGroup.valid) ?
            this.personalInfoService.setValidFormStatus(true, this.contactInfoFormGroup)
           : this.personalInfoService.setValidFormStatus(false, this.contactInfoFormGroup);

           if (this.contactInfoFormGroup.valid) {
            this.iscontactFormValid = true;
            this.formstatus.isContact = true;
            this.formstatus.formData = {...this.formstatus.formData, ...this.contactInfoFormGroup.value};
            this.personalInfoService.setState(this.formstatus);

           } else {
            this.iscontactFormValid = false;
            this.formstatus.isContact = false;
            this.formstatus.formData = {...this.formstatus.formData, ...this.contactInfoFormGroup.value};
            this.personalInfoService.setState(this.formstatus);

            }

        this.contactInfoFormGroup.valueChanges.subscribe(form => {
        if (this.contactInfoFormGroup.valid) {
            this.iscontactFormValid = true;
            this.formstatus.isContact = true;
            this.formstatus.formData = {...this.formstatus.formData, ...this.contactInfoFormGroup.value};
            this.personalInfoService.setState(this.formstatus);

           } else {
            this.iscontactFormValid = false;
            this.formstatus.isContact = false;
            this.formstatus.formData = {...this.formstatus.formData, ...this.contactInfoFormGroup.value};
            this.personalInfoService.setState(this.formstatus);

            }
           (this.contactInfoFormGroup.valid) ?
           this.personalInfoService.setValidFormStatus(true, this.contactInfoFormGroup)
          : this.personalInfoService.setValidFormStatus(false, this.contactInfoFormGroup);
        });
    }
    getcountries() {
        this.appService.getService('api/core/countryInfo/').subscribe(res => {
            this.countries = res.countryNames;
            if (this.contactInfo !== undefined && this.contactInfo.currentAddress.country) {
                this.getstates(this.contactInfo.currentAddress.country);
            }
            if (this.contactInfo !== undefined && this.contactInfo.permanentAddress.country) {
                this.changecountry(this.contactInfo.permanentAddress.country);
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    getstates(countryvalue: any) {
        this.appService.getService('api/core/countryInfo?country=' + countryvalue).subscribe(res => {
            this.cities = [];
            this.cities.push(res.stateCities);
             if (this.contactInfo !== undefined && this.contactInfo.currentAddress.state) {
                this.getcities(this.contactInfo.currentAddress.state);
            }
            this.statenames = Object.keys(res.stateCities);
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    changecountry(countryvalue: any) {
        this.appService.getService('api/core/countryInfo?country=' + countryvalue).subscribe(res => {
            this.cities = [];
            this.cities.push(res.stateCities);
             if (this.contactInfo !== undefined && this.contactInfo.permanentAddress.state) {
                this.getpermenentcities(this.contactInfo.permanentAddress.state);
            }
            this.permenentstatenames = Object.keys(res.stateCities);
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
        this.currentCities = cityinfo;
    }
    getpermenentcities(statevalue: any) {
        const availablecities = this.cities[0];
        let cityinfo;
        Object.keys(availablecities).filter((item) => {
            if (item === statevalue) {
                cityinfo = this.cities[0][item];
                return ;
            }
        });
        this.permenentCities = cityinfo;
    }
    gotoNext() {
        this.router.navigate(['/onboarding/navigationBar/emergencyContact']);
    }
    changeaddress(event: any) {
        this.addressCheck = !event.checked;
        if ( event.checked) {
            this.contactInfoFormGroup.get('country1').clearValidators();
            this.contactInfoFormGroup.get('state1').clearValidators();
            this.contactInfoFormGroup.get('city1').clearValidators();
            this.contactInfoFormGroup.get('pincode1').clearValidators();

            Object.keys(  this.contactInfoFormGroup.controls).forEach(field => {
                const control =  this.contactInfoFormGroup.get(field);
                control.updateValueAndValidity();

            });

        } else {
            this.contactInfoFormGroup.get('country1').setValidators([Validators.required]);
            this.contactInfoFormGroup.get('state1').setValidators([Validators.required]);
            this.contactInfoFormGroup.get('city1').setValidators([Validators.required]);
            this.contactInfoFormGroup.get('pincode1').setValidators( [Validators.pattern('^[0-9]*$')]);
            Object.keys( this.contactInfoFormGroup.controls).forEach(field => {
                const control =  this.contactInfoFormGroup.get(field);
                control.updateValueAndValidity();

            });

        }


    }


}
