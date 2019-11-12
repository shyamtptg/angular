import { Component, OnInit} from '@angular/core';
import { FormControl, Validators , FormGroup} from '@angular/forms';
import {MyErrorStateMatcher} from '../input-error-state-matcher';
import {PersonalInfoService} from '../personal-info.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-financial-info',
    templateUrl: './financial-info.component.html',
    styleUrls: ['./financial-info.component.scss']
})
export class FinancialInfoComponent implements OnInit {
    public basicInfo: any;
    public financialInfoForm: FormGroup;
    matcher = new MyErrorStateMatcher();
    public formstatus: any;
    public isFinancialFormValid: any;
    constructor(private personalInfoService: PersonalInfoService, private router: Router) {
      this.personalInfoService.setIndexValue(1);

    }

    ngOnInit() {
          this.formstatus = this.personalInfoService.stateObj.value;
          this.financialInfoForm = new FormGroup({
            panNumber   : new FormControl('', Validators.required),
            aadharNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
            bankAccountNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
            sscNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
            previousPfAccountNumber: new FormControl('', Validators.required),
            uanAccountNumber: new FormControl('', Validators.required),
        });


          if (this.personalInfoService.subject.length) {
            this.basicInfo = this.personalInfoService.subject[0];
            this.financialInfoForm.patchValue({
              panNumber: this.basicInfo.panNumber,
              aadharNumber: this.basicInfo.aadharNumber,
              bankAccountNumber: this.basicInfo.bankAccountNumber,
              sscNumber: this.basicInfo.sscNumber,
              previousPfAccountNumber: this.basicInfo.previousPfAccountNumber,
              uanAccountNumber: this.basicInfo.uanAccountNumber,
          });

          }

        (this.financialInfoForm.valid) ?
            this.personalInfoService.setValidFormStatus(true, this.financialInfoForm)
            : this.personalInfoService.setValidFormStatus(false, this.financialInfoForm);

        if (this.financialInfoForm.valid) {
          this.isFinancialFormValid = true;
          this.formstatus.isFinancial = true;
          this.formstatus.formData = {...this.formstatus.formData, ...this.financialInfoForm.value};
          this.personalInfoService.setState(this.formstatus);

        } else {
            this.isFinancialFormValid = false;
            this.formstatus.isFinancial = false;
            this.formstatus.formData = {...this.formstatus.formData, ...this.financialInfoForm.value};
            this.personalInfoService.setState(this.formstatus);

        }


        this.financialInfoForm.valueChanges.subscribe(form => {
        if (this.financialInfoForm.valid) {
          this.isFinancialFormValid = true;
          this.formstatus.isFinancial = true;
          this.formstatus.formData = {...this.formstatus.formData, ...this.financialInfoForm.value};
          this.personalInfoService.setState(this.formstatus);


        } else {
         this.isFinancialFormValid = false;
         this.formstatus.isFinancial = false;
         this.formstatus.formData = {...this.formstatus.formData, ...this.financialInfoForm.value};
         this.personalInfoService.setState(this.formstatus);

        }
        (this.financialInfoForm.valid) ?
        this.personalInfoService.setValidFormStatus(true, this.financialInfoForm)
       : this.personalInfoService.setValidFormStatus(false, this.financialInfoForm);

       });
      }

      gotoNext() {
        this.router.navigate(['/onboarding/navigationBar/contactInfo']);
      }


}
