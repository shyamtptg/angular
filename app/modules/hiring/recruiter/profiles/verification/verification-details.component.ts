import { Component } from '@angular/core';
import { HiringComponent } from '../../../hiring.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AddProfileDataService } from '../../addprofile/add-profile.service';
import { ProfilesDataService } from '../profile.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';
var FileSaver = require('filesaver.js-npm');
@Component({
    templateUrl: './verification-details.component.html'
})

export class HRManagerVerification {
    sendTitle: any = "Send Message";
    sendId: any = "sendMessageAfterVerify";
    id: string;
    successMessage: string;
    verificationDeatils: any;
    appointmentLetter: any = {};
    hikeLetter: any = {};
    bankStatement: any = {};
    idProof: any = {};
    addressProof: any = {};
    relievingLetter: any = {};
    postBackTitle: string = 'Request For Corrections';
    postBackId: string = 'postBackProfile';
    playships: any[] = [];
    ishide: boolean = false;
    constructor(
        private hiringComponent: HiringComponent,
        private router: Router,
        private route: ActivatedRoute,
        private addProfileDataService: AddProfileDataService,
        private profileDataService: ProfilesDataService,
        private loaderService: LoaderService,
        public commonService: CommonService,
        private dialogService: DialogService,
        private errorHandleService: ErrorHandleService
    ) {
        this.hiringComponent.URLtitle = "Profiles / Prospective Hires / Verification Details";
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.id = params['id'];
                if (location.pathname.includes('verification-details')) {
                    this.ishide = true;
                } else {
                    this.ishide = false;
                }
            }
        });
        this.addProfileDataService.getVerficationDetails(this.id).subscribe(res => {
            this.verificationDeatils = res;
            if (!this.commonService.hideFeature('DOWNLOAD_CANDIDATE_SUPPORTING_DOCUMENTS') && this.verificationDeatils && this.verificationDeatils.documents.length) {
                (this.verificationDeatils.documents).forEach((element: any) => {
                    if (element.documentType.code == "APPOINTMENT_LETTER") {
                        this.appointmentLetter = element;
                    }
                    if (element.documentType.code == "HIKE_LETTER") {
                        this.hikeLetter = element;
                    }
                    if (element.documentType.code == "BANK_STATEMENT") {
                        this.bankStatement = element;
                    }
                    if (element.documentType.code == "ID_PROOF") {
                        this.idProof = element;
                    }
                    if (element.documentType.code == "ADDRESS_PROOF") {
                        this.addressProof = element;
                    }
                    if (element.documentType.code == "RELIEVING_LETTER") {
                        this.relievingLetter = element;
                    }
                    if (element.documentType.code == "PAYSLIPS") {
                        this.playships.push(element);
                    }
                });
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    getYear(time: any) {
        var d = new Date(time);
        return d.getFullYear();
    }
    openOfferLetterDetails() {
        this.router.navigate(['../offerdetail'], { relativeTo: this.route });
    }
    navigateToProfiles() {
        var route = localStorage.getItem('previousRoute');
        route = (route) ? route : '/hiring/profiles/readytoverify';
        this.router.navigate([route]);
    }
    verficationPass() {
        var self = this,
            details = JSON.parse(localStorage.getItem('verificationDetails'));
        if (details) {
            self.loaderService.showLoading();
            var payload = {
                'hiringRequestId': details['hiringRequestId'],
                'hiringRequestNeedId': details['hiringRequestNeedId']
            };
            this.profileDataService.updateProspectStatus(this.id, 'COMPLETE_VERIFICATION', payload).subscribe(data => {
                if (data.status == 200) {
                    self.successMessage = 'Verification Passed';
                    self.loaderService.hideLoading();
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]
                    ).subscribe(result => {
                        this.navigateToProfiles();
                    });
                }
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        }
    }
    verficationFail() {
        var self = this,
            details = JSON.parse(localStorage.getItem('verificationDetails'));
        if (details) {
            self.loaderService.showLoading();
            var payload = {
                'hiringRequestId': details['hiringRequestId'],
                'hiringRequestNeedId': details['hiringRequestNeedId']
            };
            this.profileDataService.updateProspectStatus(this.id, 'FAIL_VERIFICATION', payload).subscribe(data => {
                if (data.status == 200) {
                    self.successMessage = 'Verification Failed';
                    self.loaderService.hideLoading();
                    //$('[name=myModal]').modal('show');
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]
                    ).subscribe(result => {
                        this.navigateToProfiles();
                    });
                }
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        }
    }
    downloadFile(resumeDetails: any) {
        this.profileDataService.downloadResume(resumeDetails['prospectId'], resumeDetails['documentId']).subscribe(data => {
            var blob = new Blob([data['_body']], { type: "application/octet-stream" });
            FileSaver.saveAs(blob, resumeDetails['title']);
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    postBack(reason: any) {
        var self = this,
            details = JSON.parse(localStorage.getItem('verificationDetails'));
        if (details) {
            self.loaderService.showLoading();
            var payload = {
                'hiringRequestId': details['hiringRequestId'],
                'hiringRequestNeedId': details['hiringRequestNeedId'],
                'verificationComments': reason
            };
            this.profileDataService.updateProspectStatus(this.id, 'REQUEST_FOR_CORRECTIONS', payload).subscribe(data => {
                if (data.status == 200) {
                    self.successMessage = 'Posted back successfully';
                    self.loaderService.hideLoading();
                    // $('[name=myModal]').modal('show');
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]
                    ).subscribe(result => {
                        this.navigateToProfiles();
                    });
                }
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        }
    }
}