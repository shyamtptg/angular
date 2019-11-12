import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormControl, Validators , FormGroup} from '@angular/forms';
import {PersonalInfoService} from '../personal-info.service';
import { HttpService } from '../../../shared/services/http.service';
import { environment } from '../../../../environments/environment';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { CommonService } from '../../../shared/services/common.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { OnboardingService } from './../onboarding.service';
import { UtilService } from '../../../util.service';
import {MyErrorStateMatcher} from '../input-error-state-matcher';

@Component({
  selector: 'app-official-info',
  templateUrl: './official-info.component.html',
  styleUrls: ['./official-info.component.scss']
})
export class OfficialInfoComponent implements OnInit {
  public officialInfoForm: FormGroup;
  public prospectId: any;
  host = environment.serviceUrl + '/';
  public emailPattern = '^[a-z0-9._+-]+@(innominds)+\.[com]{3}$';
  @Output() disable = new EventEmitter();
  matcher = new MyErrorStateMatcher();


  constructor(private personalInfoService: PersonalInfoService,
              private httpService: HttpService,
              private errorHandleService: ErrorHandleService,
              private commonService: CommonService,
              private loaderService: LoaderService,
              private appService: OnboardingService,
              private utilService:  UtilService
              ) {
              this.personalInfoService.setValidFormStatus(true, this.officialInfoForm);


  }

  ngOnInit() {
    this.prospectId = localStorage.getItem('prospectId');
    this.getofficialInfo();
    this.officialInfoForm = new FormGroup({
      officialInformationId  : new FormControl(''),
      prospectId: new FormControl(''),
      departmentName   : new FormControl(''),
      practice: new FormControl(''),
      competency: new FormControl(''),
      designation: new FormControl(''),
      reportingManager: new FormControl(''),
      parmanentLocation: new FormControl(''),
      workLocationName: new FormControl(''),
      joiningDate: new FormControl(''),
      companyEmailId: new FormControl('', Validators.pattern(this.emailPattern)),
      businessEmailId: new FormControl('', Validators.pattern(this.emailPattern)),
      employmentType: new FormControl('', [Validators.pattern('^[a-zA-Z]+$')]),
      employeeCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      billable: new FormControl(''),
    });

  this.officialInfoForm.valueChanges.subscribe(form => {
    (this.officialInfoForm.valid) ?
    this.personalInfoService.setofficialInfo(true, this.officialInfoForm.value) :
    this.personalInfoService.setofficialInfo(false, this.officialInfoForm.value);

  });
  }
  getofficialInfo() {
    this.appService.getService('api/q/prospectivehires/newJoinee/' + this.prospectId + '?view=official').subscribe(res => {
        res.forEach(item => {
          this.officialInfoForm.patchValue({
            officialInformationId :  item.officialInformationId ? item.officialInformationId : '' ,
            prospectId: item.prospectId,
            departmentName:  item.departmentName,
            practice: item.practice,
            competency: item.competency,
            designation: item.designation,
            reportingManager: item.managerName,
            parmanentLocation: item.workLocationName,
            workLocationName: item.workLocationName,
            joiningDate: this.utilService.epochToDate(item.joiningDate),
            companyEmailId: item.companyEmailId,
            businessEmailId: item.businessEmailId,
            employmentType: item.employmentType,
            employeeCode: item.employeeCode,
            billable: item.billable
          });
        });

        if (this.officialInfoForm.valid) {
          this.personalInfoService.setofficialInfo(true, this.officialInfoForm.value);
        } else {
          this.personalInfoService.setofficialInfo(false, this.officialInfoForm.value);

         }
         this.disable.emit(true);
         this.loaderService.hideLoading();

    }, error => {
      this.errorHandleService.handleErrors(error);
  });

   }


}
