import { Component, OnInit, ViewChild, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import {PersonalInfoService} from '../personal-info.service';
import { MatStepper } from '@angular/material/stepper';
import { HttpService } from '../../../shared/services/http.service';
import { environment } from '../../../../environments/environment';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { BasicInfoComponent } from '../basic-info/basic-info.component';
import { LoaderService } from '../../../shared/services/loader.service';
import { OnboardingService } from './../onboarding.service';
import { DialogService } from '../../../shared/dialogs/dialog.service';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild(BasicInfoComponent ) basicInfoComponent: BasicInfoComponent ;

    selectedIndex: number = 0;
    formstatus = {};
    formGroup1: FormGroup;
    formGroup2: FormGroup;
    formGroup3: FormGroup;
    formGroup4: FormGroup;
    checkSelected: boolean;
    isLinear = true;
    proceed = false;
    stopProceed = false;
    disableMatStepper = true;
    check1 = 1;
    nonEditable = true;
    childObject = {
        data: false,
        body: null,
        call: false
    };
    childObject1 = {
        data: false,
        body: null,
    };
    data = false;
    data1 = false;
    data2 = null;
    data3 = null;
    disableProceedBtn = false;
    public tile = {};
    visible: boolean = false;
    workEditable = true;
    educationEditable = true;
    myVal: string;
    clicked = true;
    showEducation = 0;
    showWork = 0;
    isFormValid: boolean = false;
    isEmptyForm: boolean;
    tabs: any[];
    indexvalue: any;
    employeeinfo: any;
    officialinfo: any;
    officialformInfo: any;
    finalObject = {};
    officialObject = {};
    token: object = {};
    header: object = {};
    saveEnable: any;
    host = environment.serviceUrl + '/';
    totalinfo: any;
    array: any[] = [];
    public finalObjectdata: any;
    public convertdobActual: any;
    public convertdobRecords: any;
    public isvalidOfficial: any;
    public perminenttAddressInfo: any;
    public hgt: any = 0;
    public border: any;
    public hgt1: any;
    public border1: any;
    public step: any;
    public prospectId: any;
    public location: any;
    public workStation: any;
    public workstationStatus: any;
    public hardwareAllocationStatus: any;
    public emailIdCreation: any;
    public employeeIdCreation: any;
    public operatingSystem: any;
    public systemType: any;
    public ramConfiguration: any;
    public configuration: any;

    experience = localStorage.getItem('experience');
    employeeInfo: any;
    highestDegree: any;
    endEduDates = [];
    maxDegree = null;
    maxDateOccur: any;
    disable = true;
    @ViewChild('stepper') stepper: MatStepper;
    public reviewCheck: any;

    constructor(
        private _fromBuilder: FormBuilder,
        private router: Router,
        private commonService: CommonService,
        private personalInfoService: PersonalInfoService,
        private httpService: HttpService,
        private errorHandleService: ErrorHandleService,
        private loaderService: LoaderService,
        private appService: OnboardingService,
        private changeDetectorRefs: ChangeDetectorRef,
        private dialogService: DialogService,
        private dialog: MatDialog,
    ) {
        this.formGroup1 = this._fromBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.formGroup2 = this._fromBuilder.group({
            secondCtrl: ['', Validators.required]
        });
        this.formGroup3 = this._fromBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.formGroup4 = this._fromBuilder.group({
            secondCtrl: ['', Validators.required]
        });

    }
    ngOnInit() {
        this.step = 'step';
        this.tabs = ['Basic Info', 'Financial Info', 'Contact Info', 'Emergency Contact'];
        this.openFirst(0);
        if (localStorage.getItem('reviewFlag') === 'true') {
            this.isLinear = false;
            this.disableMatStepper = false;
        }
        this.personalInfoService.$isValidForm.subscribe((value: any) => {
            this.isFormValid = value.isValidForm;
            this.employeeinfo = value.empinfo;
        });
        this.personalInfoService.officialForm.subscribe((value: any) => {
            this.officialformInfo = value.offcialInfo;
            this.isvalidOfficial  = value.isValidForm;
        });

        this.personalInfoService.stateObj.subscribe(res => {
            this.totalinfo = res.formData;
            if (res.isBasic && res.isContact && res.isFinancial && res.isEmergency && JSON.stringify(res.formData).length > 0) {
                this.saveEnable = true;
            } else {
                this.saveEnable = false;
            }
        });

        this.personalInfoService.$emergencyInfoset.subscribe((res) => { });
        this.personalInfoService.$selectIndexValue.subscribe((value: any) => {
            this.indexvalue = value.indexvalue;
        });

        if (localStorage.getItem('maxQualification')) {
            this.maxDegree = localStorage.getItem('maxQualification');
        } else {
            this.maxDegree = 'not available';
        }
        if (localStorage.getItem('selectedStepperIndex') === '1') {
            // Official Information
            this.stepper.selectedIndex = 1;
            this.selectedIndex = 1;
            this.router.navigate(['/onboarding/navigationBar/officialinfo']);
        } else if (localStorage.getItem('selectedStepperIndex') === '2') {
            // Work Experience
            this.stepper.selectedIndex = 2;
            this.selectedIndex = 2;
            this.router.navigate(['/onboarding/navigationBar/workExperience']);
        } else if (localStorage.getItem('selectedStepperIndex') === '3') {
            // Educational Information
            this.stepper.selectedIndex = 3;
            this.selectedIndex = 3;
            this.router.navigate(['/onboarding/navigationBar/educationExperience']);
        } else {
            // Personal Information
            this.stepper.selectedIndex = 0;
            this.selectedIndex = 0;
            this.router.navigate(['/onboarding/navigationBar/basicInfo']);
        }
        this.prospectId = localStorage.getItem('prospectId');
    }
    public  getAllInfo() {
        this.appService.getService('api/q/onboarding/status?prospectId=' + this.prospectId).subscribe(res => {
            this.location = res.location;
            this.workStation = res.workStation;
            this.workstationStatus = (res.workStationAllocation === 1 ) ? 'Inprogress' :
            (res.workStationAllocation === 2 ) ? 'allocated' : 'Not Initiated';

            this.hardwareAllocationStatus = (res.hardwareAllocation === 1) ? 'Inprogress' :
            (res.hardwareAllocation === 2 ) ? 'allocated' : 'Not Initiated';

            this.emailIdCreation = (res.emailIdCreation === 1) ? 'Inprogress' :
            (res.emailIdCreation === 2 ) ? 'allocated' : 'Not Initiated';

            this.employeeIdCreation = (res.employeeIdCardCreation === 1) ? 'Inprogress' :
            (res.employeeIdCardCreation === 2 ) ? 'allocated' : 'Not Initiated';
            this.operatingSystem = res.operatingSystem;
            const asset =   (res.assetType === 1) ? 'Laptop' : 'Desktop';
            this.systemType = res.operatingSystem + '-' + asset;
            this.ramConfiguration = res.ram + 'GB';
            this.configuration = res.configuration;
        }, error => {
           this.errorHandleService.handleErrors(error);
       });
   }

    ngOnChanges() {
        if (localStorage.getItem('educationHistory')) {
            this.employeeInfo = localStorage.getItem('educationHistory');
            this.employeeInfo = JSON.parse(this.employeeInfo);
            this.maxDegree = this.employeeInfo[0].degree;
        }
    }

    ngOnDestroy() {
        localStorage.setItem('selectedStepperIndex', '0');
        this.selectedIndex = 0;
        this.formstatus = {isBasic : false};
        this.personalInfoService.setState(this.formstatus);
    }

    openFirst(index: any) {
        this.indexvalue = index;
        (index === 0) ? this.router.navigate(['/onboarding/navigationBar/basicInfo']) :
        (index === 1) ? this.router.navigate(['/onboarding/navigationBar/financialInfo']) :
        (index === 2) ? this.router.navigate(['/onboarding/navigationBar/contactInfo']) :
        (index === 3) ? this.router.navigate(['/onboarding/navigationBar/emergencyContact']) :
        this.router.navigate(['/onboarding/navigationBar/officialinfo']);
    }
    disableProceedFn(ev) {
        this.disableProceedBtn = ev;
    }
    stepClick(ev) {
        if (ev.selectedIndex === 0 ) {
            this.router.navigate(['/onboarding/navigationBar/basicInfo']);
        } else if (ev.selectedIndex === 1) {
            this.router.navigate(['/onboarding/navigationBar/officialinfo']);
        } else if (ev.selectedIndex === 2 ) {
            this.router.navigate(['/onboarding/navigationBar/workExperience']);
        } else if (ev.selectedIndex === 3 ) {
            this.router.navigate(['/onboarding/navigationBar/educationExperience']);
        }

        this.selectedIndex = ev.selectedIndex;
        this.officialinfo = this.personalInfoService.subject[0];
        localStorage.setItem('selectedStepperIndex', ev.selectedIndex);
    }
    navigateToEducationExperience() {
        this.router.navigate(['/onboarding/educationExperience']);
    }
    changeVarible() {
        this.visible = false;
        this.step = 'step1';
    }
    empstatuscheck(temp) {
        this.getAllInfo();
        this.myVal = temp;
        this.visible = true;
        if (temp === 'Workstaion') {
            this.step = 'step2';
          } else if (temp === 'Hardware') {
            this.step = 'step3';
          }
    }
    gotoNext(stepper: MatStepper) {
            this.finalObject = {...this.finalObject, ...this.employeeinfo.value};
            this.indexvalue = this.indexvalue + 1;
            (this.indexvalue === 0) ? this.router.navigate(['/onboarding/navigationBar/basicInfo']) :
            (this.indexvalue === 1) ? this.router.navigate(['/onboarding/navigationBar/financialInfo']) :
            (this.indexvalue === 2) ? this.router.navigate(['/onboarding/navigationBar/contactInfo']) :
            (this.indexvalue === 3) ? this.router.navigate(['/onboarding/navigationBar/emergencyContact']) :
            stepper.next();

    }
    gotoBack(stepper: MatStepper) {
        this.isLinear = false;
        localStorage.setItem('reviewFlag', 'false');
        this.disableMatStepper = true;
        stepper.previous();
    }
    private getToken() {
        const tokenDetails: any = this.commonService.getItem('tokenDetails');
        this.token = tokenDetails && tokenDetails['access_token'];
        return this.token;
    }
    private setHeader() {
        this.getToken();
        this.header = {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.token
        };
    }
    executeService(url: string, method: string, payLoad: any) {
        this.setHeader();
        return this.httpService.send(
                this.host + url,
                method,
                payLoad,
                this.header
        )
        .map(res => res,
        error =>  {
            this.errorHandleService.handleErrors(error);
        });
    }
    save(stepper: MatStepper) {
        if (this.selectedIndex === 0) {
            this.isLinear = false;
            this.formGroup1.setErrors(null);
            if (this.totalinfo['dateOfBirthActual']) {
                const date1 = this.totalinfo['dateOfBirthActual'].toISOString().split('T')[0];
                const unformattedDate1 = new Date(date1).toDateString();
                this.convertdobActual = Date.parse(unformattedDate1);
            }
        if (this.totalinfo['dateOfBirthRecords']) {
                const date2 = this.totalinfo['dateOfBirthRecords'].toISOString().split('T')[0];
                const unformattedDate2 = new Date(date2).toDateString();
                this.convertdobRecords = Date.parse(unformattedDate2);
            }

        if (this.totalinfo.personalInformationId === '') {
                const obj = {};
                const obj1 = {};
                const parentobj = {};
                this.array = [];
                obj['relation'] = this.totalinfo.relation1;
                obj['phoneNumber'] = parseInt(this.totalinfo.phoneNumber1, 10);
                obj['emergencyContactPerson1'] = this.totalinfo.emergencyContactPerson1;
                this.array.push(obj);
            if (this.totalinfo.relation2 !== '' && this.totalinfo.phoneNumber2 !== '' &&
                this.totalinfo.emergencyContactPerson2 !== '' ) {
                obj1['relation'] = this.totalinfo.relation2;
                obj1['phoneNumber'] = parseInt(this.totalinfo.phoneNumber2, 10);
                obj1['emergencyContactPerson2'] = this.totalinfo.emergencyContactPerson2;
                this.array.push(obj1);
            }

            const  presentAddressInfo = {
                'id' : this.totalinfo.currentAddressId,
                'address1': this.totalinfo.address,
                'city': this.totalinfo.city,
                'state': this.totalinfo.state,
                'country': this.totalinfo.country,
                'zipcode': this.totalinfo.pincode
                };
               if ( this.totalinfo.permanentAddressSameAsCurrentAddress === false) {
                this.perminenttAddressInfo = {
                    'id' : this.totalinfo.perminentAddressId  === undefined ? '' : this.totalinfo.perminentAddressId ,
                    'address2': this.totalinfo.address1 === undefined  ? '' : this.totalinfo.address1,
                    'city': this.totalinfo.city1,
                    'state': this.totalinfo.state1,
                    'country': this.totalinfo.country1,
                    'zipcode': this.totalinfo.pincode1 === undefined ? '' :  this.totalinfo.pincode1
                    };
                }
            this.finalObjectdata = {
                'prospectId': this.totalinfo['prospectId'],
                'firstName': this.totalinfo['firstName'],
                'middleName': this.totalinfo['MiddleName'],
                'lastName': this.totalinfo['lastName'],
                'gender': this.totalinfo['gender'],
                'motherName': this.totalinfo.motherName ? this.totalinfo.motherName : '',
                'fatherName': this.totalinfo.fatherName ? this.totalinfo.fatherName : '',
                'dateOfBirthRecords': this.convertdobRecords,
                'dateOfBirthActual': this.convertdobActual,
                'maritalStatus': this.totalinfo['maritalStatus'],
                'bloodGroup': this.totalinfo['bloodGroup'],
                'relocation': this.totalinfo['relocation'],
                'vehicleNumber': this.totalinfo['vehicleNumber'],
                'vehicleType': this.totalinfo['vehicleType'],
                'panNumber': this.totalinfo['panNumber'],
                'aadharNumber': this.totalinfo['aadharNumber'],
                'bankAccountNumber': this.totalinfo['bankAccountNumber'],
                'sscNumber': this.totalinfo['sscNumber'],
                'previousPfAccountNumber': this.totalinfo['previousPfAccountNumber'],
                'uanAccountNumber': this.totalinfo['uanAccountNumber'],
                'currentAddress' : presentAddressInfo,
                'permanentAddressSameAsCurrentAddress': this.totalinfo['permanentAddressSameAsCurrentAddress'],
                'permanentAddress' : (this.totalinfo.permanentAddressSameAsCurrentAddress === false) ? this.perminenttAddressInfo : null,
                'mobileNumber': parseInt(this.totalinfo['mobileNumber'], 10),
                'alternativeMobile': parseInt(this.totalinfo['alternativeMobile'], 10),
                'personalEmailId': this.totalinfo['personalEmailId'],
                'skypeId': this.totalinfo['skypeId'],
                'onboarding': 'Updating',
                'emergencyContactHistory': this.array
            };

            this.savepersonalInfo(this.finalObjectdata, stepper);

            } else {
                const obj = {};
                const obj1 = {};
                this.array = [];
                const parentobj = {};
                obj['id'] = this.totalinfo.id;
                obj['relation'] = this.totalinfo.relation1;
                obj['phoneNumber'] = parseInt(this.totalinfo.phoneNumber1, 10);
                obj['emergencyContactPerson1'] = this.totalinfo.emergencyContactPerson1;
                this.array.push(obj);
                 if (this.totalinfo.relation2 !== '' && this.totalinfo.phoneNumber2 !== '' &&
                    this.totalinfo.emergencyContactPerson2 !== '' ) {
                    obj['id'] = this.totalinfo.id;
                    obj1['relation'] = this.totalinfo.relation2;
                    obj1['phoneNumber'] = parseInt(this.totalinfo.phoneNumber2, 10);
                    obj1['emergencyContactPerson2'] = this.totalinfo.emergencyContactPerson2;
                    this.array.push(obj1);

                }
                 const  presentAddressInfo = {
                    'id' : this.totalinfo.currentAddressId,
                    'address1': this.totalinfo.address,
                    'city': this.totalinfo.city,
                    'state': this.totalinfo.state,
                    'country': this.totalinfo.country,
                    'zipcode': this.totalinfo.pincode
                   };
                if ( this.totalinfo.permanentAddressSameAsCurrentAddress === false) {
                    this.perminenttAddressInfo = {
                        'id' : this.totalinfo.perminentAddressId === undefined ? '' : this.totalinfo.perminentAddressId ,
                        'address2': this.totalinfo.address1 === undefined ? '' : this.totalinfo.address1 ,
                        'city': this.totalinfo.city1 ,
                        'state': this.totalinfo.state1,
                        'country': this.totalinfo.country1,
                        'zipcode': this.totalinfo.pincode1 === undefined ? '' : this.totalinfo.pincode1
                    };

                }
                this.finalObjectdata = {
                    'id': this.totalinfo['personalInformationId'],
                    'prospectId': this.totalinfo['prospectId'],
                    'firstName': this.totalinfo['firstName'],
                    'middleName': this.totalinfo['MiddleName'],
                    'lastName': this.totalinfo['lastName'],
                    'gender': this.totalinfo['gender'],
                    'motherName': this.totalinfo.motherName ? this.totalinfo.motherName : '',
                    'fatherName': this.totalinfo.fatherName ? this.totalinfo.fatherName : '',
                    'dateOfBirthRecords':  this.convertdobRecords,
                    'dateOfBirthActual': this.convertdobActual,
                    'maritalStatus': this.totalinfo['maritalStatus'],
                    'bloodGroup': this.totalinfo['bloodGroup'],
                    'relocation': this.totalinfo['relocation'],
                    'vehicleNumber': this.totalinfo['vehicleNumber'],
                    'vehicleType': this.totalinfo['vehicleType'],
                    'panNumber': this.totalinfo['panNumber'],
                    'aadharNumber': this.totalinfo['aadharNumber'],
                    'bankAccountNumber': this.totalinfo['bankAccountNumber'],
                    'sscNumber': this.totalinfo['sscNumber'],
                    'previousPfAccountNumber': this.totalinfo['previousPfAccountNumber'],
                    'uanAccountNumber': this.totalinfo['uanAccountNumber'],
                    'currentAddress' : presentAddressInfo,
                    'permanentAddress' : (this.totalinfo.permanentAddressSameAsCurrentAddress === false) ?
                    this.perminenttAddressInfo : null,
                    'permanentAddressSameAsCurrentAddress': this.totalinfo['permanentAddressSameAsCurrentAddress'],
                    'mobileNumber': parseInt(this.totalinfo['mobileNumber'], 10),
                    'alternativeMobile': parseInt(this.totalinfo['alternativeMobile'], 10),
                    'personalEmailId': this.totalinfo['personalEmailId'],
                    'skypeId': this.totalinfo['skypeId'],
                    'onboarding': 'Updating',
                    'emergencyContactHistory': this.array
                };
                this.updatepersonalInfo(this.finalObjectdata, stepper);
            }
        }
        if ( this.selectedIndex === 1) {
            this.isLinear = false;
            if (this.officialformInfo.officialInformationId === '') {
            this.officialObject = {
                'prospectId': this.officialformInfo.prospectId,
                'companyEmailId': this.officialformInfo.companyEmailId,
                'businessEmailId': this.officialformInfo.businessEmailId,
                'employeeCode': parseInt(this.officialformInfo.employeeCode, 10)
         };
            this.saveofficialInfo(this.officialObject, stepper);
       } else {
        this.officialObject = {
            'id': this.officialformInfo.officialInformationId,
            'prospectId': this.officialformInfo.prospectId,
            'companyEmailId': this.officialformInfo.companyEmailId,
            'businessEmailId': this.officialformInfo.businessEmailId,
            'employeeCode': parseInt(this.officialformInfo.employeeCode, 10)
         };
        this.updateofficialInfo(this.officialObject, stepper);
       }
    }
    if ( this.selectedIndex === 2 && !this.stopProceed) {
        this.isLinear = false;
        stepper.next();
        localStorage.setItem('selectedStepperIndex', '3');
        this.stopProceed = true;
    }
    if ( this.selectedIndex === 3 && !this.stopProceed) {
        this.isLinear = false;
        this.router.navigate(['/onboarding/review']);
        this.stopProceed = true;
    }
    this.stopProceed = false;
}

    disableStepper(ev) {
        if (localStorage.getItem('reviewFlag') !== 'true') {
            this.isLinear = ev;
        }
    }

    checkToDisable(data: number) {
        if (data === 1) {
            return true;
        } else {
            return false;
        }
    }
    public  savepersonalInfo(obj: any, stepper: MatStepper) {
         this.appService.postService('api/c/prospectivehires/personalInformation/' , obj).subscribe(res => {
            this.loaderService.hideLoading();
            if (res.done === true) {
                this.dialogService.render(
                    [{
                        title: 'Success',
                        message: 'successfully saved record',
                        yesLabel: 'OK'
                    }]
                  );

                if (this.reviewCheck) {
                   this.router.navigate(['/onboarding/review']);

                } else {
                    stepper.next();

                }
                this.disableStepper(true);
            }
         }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    public updatepersonalInfo(obj: any, stepper: MatStepper) {
        this.appService.putService('api/c/prospectivehires/personalInformation/' , obj).subscribe(res => {
            this.loaderService.hideLoading();
            if (res.done === true) {
                this.dialogService.render(
                    [{
                        title: 'Success',
                        message: 'successfully updated record',
                        yesLabel: 'OK'
                    }]
                  );
                 if (this.reviewCheck) {
                   this.router.navigate(['/onboarding/review']);

                } else {
                    stepper.next();

                }
                this.disableStepper(true);
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
   }
    public  updateofficialInfo(obj: any, stepper: MatStepper) {
        this.appService.putService('api/c/prospectivehires/officialInformation' , obj).subscribe(res => {
            this.loaderService.hideLoading();
            if (res.done === true) {
                this.dialogService.render(
                    [{
                        title: 'Success',
                        message: 'successfully updated record',
                        yesLabel: 'OK'
                    }]
                  );
                if (this.reviewCheck) {
                   this.router.navigate(['/onboarding/review']);

                } else {
                    stepper.next();

                }
                this.disableStepper(true);
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });

   }
   public  saveofficialInfo(obj: any, stepper: MatStepper) {
    this.appService.postService('api/c/prospectivehires/officialInformation' ,  obj).subscribe(
        res => {
            this.loaderService.hideLoading();
            if (res.done === true) {
                this.dialogService.render(
                    [{
                        title: 'Success',
                        message: 'successfully saved record',
                        yesLabel: 'OK'
                    }]
                  );
                if (this.reviewCheck) {
                   this.router.navigate(['/onboarding/review']);

                } else {
                    stepper.next();

                }
                this.disableStepper(true);
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        }
    );

    }
}
