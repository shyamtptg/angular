import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {MyErrorStateMatcher} from '../input-error-state-matcher';
import {PersonalInfoService} from '../personal-info.service';

@Component({
    selector: 'app-emergency-contact',
    templateUrl: './emergency-contact.component.html',
    styleUrls: ['./emergency-contact.component.scss']
})
export class EmergencyContactComponent implements OnInit {
    public emergencyInfoFormGroup: FormGroup;
    matcher = new MyErrorStateMatcher();
    public formstatus: any;
    public basicInfo: any;
    public relationships: any;
    public sortlist: any;
    constructor(private personalInfoService: PersonalInfoService) {
        this.personalInfoService.setIndexValue(3);


     }

    ngOnInit() {
        this.formstatus = this.personalInfoService.stateObj.value;
        this.emergencyInfoFormGroup = new FormGroup({
            id : new FormControl(''),
            emergencyContactPerson1 : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
            phoneNumber1 : new FormControl('', [Validators.required , Validators.maxLength(18), Validators.pattern('^[0-9]*$')]),
            relation1 : new FormControl('',  [Validators.required]),

            emergencyContactPerson2 : new FormControl('', [ Validators.pattern('^[a-zA-Z]+$')]),
            phoneNumber2 : new FormControl('', [ Validators.maxLength(18), Validators.pattern('^[0-9]*$')]),
            relation2 : new FormControl(''),
        });

        if ( this.personalInfoService.subject.length &&
           typeof this.personalInfoService.subject[0].emergencyContactHistory !== 'undefined') {
            this.basicInfo = this.personalInfoService.subject[0].emergencyContactHistory;
            this.relationships = this.personalInfoService.subject[0].relations;

        } else {
            this.basicInfo = '';
            if (this.personalInfoService.subject.length && this.personalInfoService.subject[0].relations !== 'undefined') {
              this.relationships = this.personalInfoService.subject[0].relations;

            }



        }
        if (this.basicInfo !== '') {
          this.sortlist =    this.basicInfo.sort(function(a, b) {
            if (Object.keys(a)[1] > Object.keys(b)[1]) {
              return 1;
            } else {
             return -1;
            }
           });

        }

        if (this.basicInfo !== '') {
          this.basicInfo.forEach(item => {
          this.emergencyInfoFormGroup.patchValue({
            id: (typeof this.sortlist[0] === 'undefined') ? '' : this.sortlist[0].id ? this.sortlist[0].id : '',
              emergencyContactPerson1:  ( typeof this.sortlist[0] === 'undefined') ? '' :
              this.sortlist[0].emergencyContactPerson1 ?
              this.sortlist[0].emergencyContactPerson1 : '',

              phoneNumber1: (typeof this.sortlist[0] === 'undefined') ? '' :
              this.sortlist[0].phoneNumber ?
              this.sortlist[0].phoneNumber : '' ,

              relation1:   ( typeof this.sortlist[0] === 'undefined') ? '' :
              this.sortlist[0].relation  ? this.sortlist[0].relation : '',

              emergencyContactPerson2:  ( typeof this.sortlist[1] === 'undefined') ? '' : this.sortlist[1].emergencyContactPerson2 ?
              this.sortlist[1].emergencyContactPerson2 : '' ,

              phoneNumber2:  (typeof this.sortlist[1] === 'undefined') ? '' : this.sortlist[1].phoneNumber ?
              this.sortlist[1].phoneNumber : '' ,
              relation2:  ( typeof this.sortlist[1] === 'undefined') ? '' : this.sortlist[1].relation ? this.sortlist[1].relation : '',

        });
      });

      }


      (this.emergencyInfoFormGroup.valid) ?
      this.personalInfoService.setValidFormStatus(true, this.emergencyInfoFormGroup)
      : this.personalInfoService.setValidFormStatus(false, this.emergencyInfoFormGroup);

            if (this.emergencyInfoFormGroup.valid) {
              this.formstatus.isEmergency = true;
              this.formstatus.formData = {...this.formstatus.formData, ...this.emergencyInfoFormGroup.value};
              this.personalInfoService.setState(this.formstatus);

            } else {
              this.formstatus.isEmergency = false;
              this.formstatus.formData = {...this.formstatus.formData, ...this.emergencyInfoFormGroup.value};
              this.personalInfoService.setState(this.formstatus);

            }


        this.emergencyInfoFormGroup.valueChanges.subscribe(form => {
        if (this.emergencyInfoFormGroup.valid) {
            this.formstatus.isEmergency = true;
            this.formstatus.formData = {...this.formstatus.formData, ...this.emergencyInfoFormGroup.value};
            this.personalInfoService.setState(this.formstatus);

         } else {
            this.formstatus.isEmergency = false;
            this.formstatus.formData = {...this.formstatus.formData, ...this.emergencyInfoFormGroup.value};
            this.personalInfoService.setState(this.formstatus);

          }
        (this.emergencyInfoFormGroup.valid) ?
        this.personalInfoService.setValidFormStatus(true, this.emergencyInfoFormGroup)
        : this.personalInfoService.setValidFormStatus(false, this.emergencyInfoFormGroup);
        });



    }


}
