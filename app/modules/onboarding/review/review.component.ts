import { Component, OnInit} from '@angular/core';
import { CommonService } from './../../../shared/services/common.service';
import { OnboardingService } from './../onboarding.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { FinalSubmitComponent } from '../final-submit/final-submit.component';
import { MatDialog } from '@angular/material';

export interface IReviewData {
    aadharNumber: string;
    address1: string;
    alternativeMobile: string;
    bankAccountNumber: string;
    billable: boolean;
    bloodGroup: string;
    businessEmailId: string;
    city: string;
    clientId: number;
    companyEmailId: string;
    competency: string;
    competencyId: number;
    country: string;
    currentAddress: any;
    dateOfBirth: any;
    dateOfBirthActual: any;
    dateOfBirthRecords: any;
    departmentId: number;
    departmentName: string;
    designation: string;
    designationId: number;
    educationHistory: any[];
    emergencyContactHistory: any[];
    employeeCode: number;
    employmentHistory: any[];
    employmentType: string;
    experience: number;
    firstName: string;
    gender: string;
    joinee: string;
    joiningDate: any;
    lastName: string;
    managerName: string;
    maritalStatus: string;
    mobileNumber: string;
    officialInformationId: string;
    onboardingStatus: string;
    panNumber: string;
    permanentAddress: any;
    permanentAddressSameAsCurrentAddress: boolean;
    permanentLocationName: string;
    personalEmailId: string;
    personalInformationId: string;
    practice: string;
    practiceId: number;
    previousPfAccountNumber: string;
    prospectId: string;
    relations: any[];
    relocate: boolean;
    resourceType: string;
    skypeId: string;
    sscNumber: string;
    state: string;
    uanAccountNumber: string;
    vehicleNumber: string;
    vehicleType: string;
    workLocationName: string;
    zipcode: string;
}

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})

export class ReviewComponent implements OnInit {
    reviewData: IReviewData;
    dateArray = [];
    maxQualification: any;
    overallExperience: any;
    comments: any;

    constructor(
        private commonService: CommonService,
        private appService: OnboardingService,
        private loaderService: LoaderService,
        private dialog: MatDialog,
        private errorHandleService: ErrorHandleService
    ) {

    }

    ngOnInit() {
        this.getReviewData();
    }

    private getReviewData(): void {
        const prospectId = localStorage.getItem('prospectId');
        this.appService.getService('api/q/prospectivehires/newJoinee/' + prospectId + '?view=all').subscribe(
            response => {
                if (response[0].emergencyContactHistory && response[0].emergencyContactHistory.length > 1) {
                    this.updateEmergencyContactHistory(response[0].emergencyContactHistory);
                }
                this.reviewData = response[0];
                this.getHighestDegree(response[0].educationHistory);
                this.getOverallExperience(response[0].experience);
                this.loaderService.hideLoading();
            }, error => {
                this.errorHandleService.handleErrors(error);
            }
        );
    }

    getHighestDegree(educationObject) {
        for (let i = 0; i < educationObject.length; i++) {
            this.dateArray[i] = educationObject[i].startDate;
        }
        this.dateArray.sort(this.sortNumber);
        for (let i = 0; i < educationObject.length; i++) {
            if (educationObject[i].startDate === this.dateArray[0]) {
                this.maxQualification = educationObject[i].certification;
            }
        }
    }

    getOverallExperience(experience) {
        if (Math.floor(experience) !== NaN) {
            const text = experience.toString();
            let  yrs: number, mts: number;
            yrs = parseInt(text.split('.')[0], 10);
            mts = parseInt(text.split('.')[1], 10);
            this.overallExperience = yrs + ' years ' + mts + ' mos';
        } else {
            this.overallExperience = experience;
        }
    }

    sortNumber(a: number, b: number) {
        return b - a;
    }

    updateEmergencyContactHistory(data) {
        return data[0].emergencyContactPerson1 === undefined ? data.reverse() : data;
    }

    submitReview(data: any) {
        const prospectId = localStorage.getItem('prospectId');
        localStorage.removeItem('reviewFlag');
        this.appService.putService('api/q/prospectivehires/prospect/' + prospectId, {}).subscribe(
            response => {
                if  (response.status) {
                    this.loaderService.hideLoading();
                    this.generateIDRequest(data);
                }
            }, error => {
                this.errorHandleService.handleErrors(error);
            }
        );
    }
    generateIDRequest(data: any) {
        const prospectId = localStorage.getItem('prospectId');
        const submitObj = {
            'employeeName': this.reviewData.firstName + ' ' + this.reviewData.lastName,
            'employeeId': this.reviewData.employeeCode,
            'dateOfJoining': this.reviewData.joiningDate,
            'idCardStatus': 'Pending',
            'hrComments': data.comments,
            'prospectId': prospectId,
            'bloodGroup': this.reviewData.bloodGroup,
            'designation': this.reviewData.designation
        };
        this.appService.postService('api/c/onboarding/idCardRequestDetails', submitObj).subscribe(() => {
            this.loaderService.hideLoading();
            this.commonService.navigateToSuccess();
          },
        error => {
            this.loaderService.hideLoading();
        });
    }
    openSubmitDialog() {
      const dialogRef = this.dialog.open(FinalSubmitComponent, {
        width: '480px',
        height: '220px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.submitReview(result);
        }
      });
    }
    navigateToPersonalInfo() {
        localStorage.setItem('reviewFlag', 'true');
        localStorage.setItem('selectedStepperIndex', '0');
        this.commonService.navigateToStepper();

    }

    navigateToOfficialInfo() {
        localStorage.setItem('reviewFlag', 'true');
        localStorage.setItem('selectedStepperIndex', '1');
        this.commonService.navigateToStepper();
    }

    navigateToWorkInfo() {
        localStorage.setItem('reviewFlag', 'true');
        localStorage.setItem('selectedStepperIndex', '2');
        this.commonService.navigateToStepper();
    }

    navigateToEduInfo() {
        localStorage.setItem('reviewFlag', 'true');
        localStorage.setItem('selectedStepperIndex', '3');
        this.commonService.navigateToStepper();
    }
}
