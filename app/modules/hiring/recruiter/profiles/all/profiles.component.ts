import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../hiring.component';
import { ProfilesDataService } from '../profile.service';
import { AddProfileDataService } from '../../addprofile/add-profile.service';
import { OffersDataService } from '../../../cpo/offers/offers.service';
import { DownloadLink } from '../search/download-link/download-link.component';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from './../../../../../shared/services/errorhandle.service';
import { GridOptions } from 'ag-grid/main';
import 'ag-grid-angular/main';

@Component({
    templateUrl: './profiles.component.html',
    providers: [ProfilesDataService]
})

export class RecruiterProfiles {
    public noticePeriodOptions: any[];
    public statusOptions: any[];
    public noticePeriod: string;
    public status: string;
    public buttonModes: any = {};
    columnDefs: any;
    gridOptions: GridOptions;
    allOfTheData: any;
    totalRecords: number = 0;
    recordNotSelected: boolean = false;
    public hiringRequestOptions: any;
    public hiringNeedOptions: any;
    hiringRequestId: any;
    hiringRequestNeedId: any;
    successMessage: string;
    pageNum: number = 0;
    pageSize: number = 15;
    totalPages: number;
    constructor(
        private HiringComponent: HiringComponent,
        private router: Router,
        private dialogService: DialogService,
        private route: ActivatedRoute,
        private profileDataService: ProfilesDataService,
        private addProfileDataService: AddProfileDataService,
        private offersDataService: OffersDataService,
        private loaderService: LoaderService,
        public commonService: CommonService,
        private errorHandleService: ErrorHandleService
    ) {
        HiringComponent.URLtitle = "Profiles / All Profiles";
        this.gridOptions = <GridOptions>{};
        this.columnDefs = [
            { headerName: "Name", field: "displayName", minWidth: 170, tooltipField: "displayName", headerTooltip: "Name" },
            { headerName: "Resume", field: "resume", minWidth: 100, cellRendererFramework: DownloadLink },
            { headerName: "Hiring Purpose", field: "hiringPurpose", minWidth: 180, tooltipField: "hiringPurpose", headerTooltip: "Hiring Purpose" },
            { headerName: "Current Work Location", field: "currentWorkLocation", minWidth: 170, tooltipField: "currentWorkLocation", headerTooltip: "Current Work Location" },
            { headerName: "Current Employer", field: "currentEmployeer", minWidth: 130, tooltipField: "currentEmployeer", headerTooltip: "Current Employer" },
            { headerName: "Notice Period", field: "noticePeriod", minWidth: 120 },
            { headerName: "Status", field: "status", minWidth: 250, tooltipField: "status", headerTooltip: "Status" },
            { headerName: "Experience (In Years)", field: "relevantExperienceInYears", minWidth: 150 }
        ];
        this.gridOptions = {
            columnDefs: this.columnDefs,
            rowData: [],
            enableSorting: true,
            rowSelection: 'single',
            getRowStyle: function (params: any) {
                if (params.data.needAttached === true) {
                    return {
                        'color': 'rgb(69, 135, 255)'
                    };
                }
                return null;
            }
        };
        this.noticePeriodOptions = [];
        this.statusOptions = [];
        this.hiringRequestId = '';
        this.hiringRequestNeedId = '';
        this.noticePeriod = "ALL";
        this.status = "ALL";
    }
    concatenateNames(params: any) {
        return params.data.firstName + " " + params.data.lastName;
    }
    checkModes() {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            this.buttonModes['timeline'] = false;
            this.buttonModes['viewProfile'] = false;
            var status = selectedRecords[0]['statusCode'],
                offerExists: string = selectedRecords[0]['offerId'],
                hiringId = selectedRecords[0]['hiringRequestId'],
                needId = selectedRecords[0]['hiringRequestNeedId'],
                isOwner = selectedRecords[0]['isOwnerOfHiringRequest'],
                joiningDate = selectedRecords[0]['expectedJoiningDate'],
                currentDate = new Date().getTime(),
                joiningEpochTime = this.getDate(new Date(joiningDate)).getTime(),
                currentEpochTime = this.getDate(new Date(currentDate)).getTime();
            if (status == 'ACTIVE' || status == 'ATTACHED_TO_THE_NEED' || status == 'SHORTLISTED' || status == 'REJECTED' || status == 'DELETED' || status == 'INTERVIEW_SCHEDULED' || status == 'INACTIVE') {
                this.buttonModes['viewFeedback'] = true;
            } else {
                this.buttonModes['viewFeedback'] = false;
            }
            this.buttonModes['viewDetails'] = (status == 'VERIFICATION_IN_PROGRESS') ? false : true;
            this.buttonModes['notify'] = (status == 'SELECTED') ? false : true;
            this.buttonModes['join'] = ((status == 'OFFER_ACCEPTED') && (currentEpochTime <= joiningEpochTime)) ? false : true;
            this.buttonModes['noShow'] = ((status == 'OFFER_ACCEPTED') && (currentEpochTime > joiningEpochTime)) ? false : true;
            this.buttonModes['reject'] = ((isOwner == true) && (status == 'ATTACHED_TO_THE_NEED' || status == 'SHORTLISTED')) ? false : true;
            this.buttonModes['shortlist'] = ((isOwner == true) && (status == 'ATTACHED_TO_THE_NEED' || status == 'REJECTED')) ? false : true;
            this.buttonModes['startVerification'] = (status == 'COMPLETED_PREJOINING_FORMALITIES') ? false : true;
            this.buttonModes['createOffer'] = ((status == 'VERIFICATION_COMPLETED') && (!offerExists)) ? false : true;
            this.buttonModes['schedule'] = (hiringId && needId && (status == 'SHORTLISTED')) ? false : true;
        } else {
            this.resetModes();
        }
    }
    getDate(date: any) {
        var mm: any = date.getMonth() + 1;
        var dd: any = date.getDate();
        var dateString: any = [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
        return new Date(dateString);
    }
    createNewDatasource() {
        if (!this.allOfTheData) {
            return;
        }
        this.gridOptions.api.showLoadingOverlay();
        var allOfTheData = this.allOfTheData,
            self = this;
        var dataSource = {
            getRows: function (params: any) {
                setTimeout(function () {
                    var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                    var lastRow = -1;
                    if (allOfTheData.length <= params.endRow) {
                        lastRow = allOfTheData.length;
                    }
                    params.successCallback(rowsThisPage, lastRow);
                    self.gridOptions.api.hideOverlay();
                    if (allOfTheData.length == 0) {
                        self.gridOptions.api.showNoRowsOverlay();
                    }
                }, 500);
            }
        };
        self.gridOptions.api.setRowData(this.allOfTheData);
    }
    setPageNum(pageNum: any) {
        this.pageNum = pageNum;
        this.showProfiles();
    }
    resizeColumns() {
        this.gridOptions.api.sizeColumnsToFit();
    }

    onGridInitialize() {
        this.resizeColumns();
        var data = this.addProfileDataService.getProspectCombos();
        if (data) {
            this.noticePeriodOptions = data['NOTICE_PERIOD'];
            this.statusOptions = data['PROSPECT_STATUS'];
        }
        this.showProfiles();
    }
    setRowData(rowData: any) {
        this.allOfTheData = rowData;
        this.createNewDatasource();
    }
    loadProfile() {
        this.addProfileDataService.mode = 'new';
        this.router.navigate(['../details'], { relativeTo: this.route });
    }
    updateProfile() {
        this.addProfileDataService.mode = 'edit';
        this.loadProfileDetails();
    }
    viewProfile() {
        this.addProfileDataService.mode = 'view';
        this.loadProfileDetails('view');
    }
    viewFeedBack() {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            var id = selectedRecords[0]['id'],
                reqId = selectedRecords[0]['hiringRequestId'],
                needId = selectedRecords[0]['hiringRequestNeedId'];
            this.router.navigate(['../hiring/interviews/view-feedback', id, reqId, needId]);
        }
    }
    loadProfileDetails(mode?: string) {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords && selectedRecords.length > 0) {
            this.recordNotSelected = false;
            var id = selectedRecords[0]['id'];
            if (mode == 'view') {
                this.router.navigate(['../' + mode, id], { relativeTo: this.route });
            } else {
                this.router.navigate(['../details', id], { relativeTo: this.route });
            }
        } else {
            this.recordNotSelected = true;
        }
    }
    loadNeedsByHiringId() {
        var hiringId = this.hiringRequestId, self = this;
        self.hiringRequestNeedId = "";
        if (hiringId) {
            self.addProfileDataService.getNeedsByHiringId(hiringId).subscribe(data => {
                self.hiringNeedOptions = data;
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        } else if (hiringId == '') {
            self.hiringNeedOptions = [];
        }
        self.pageNum = 0;
        self.showProfiles();
    }
    attachProfile() {
        var hiringId = this.hiringRequestId, needId = this.hiringRequestNeedId, self = this,
            selectedRecords = this.gridOptions.api.getSelectedRows(), prospectId;
        if (selectedRecords.length > 0) {
            prospectId = selectedRecords[0]['id'];
            self.loaderService.showLoading();
            self.profileDataService.attachProfiletoNeed(hiringId, needId, prospectId).subscribe(
                data => {
                    if (data.status == 200) {
                        self.successMessage = 'Profile attached successfully';
                        self.loaderService.hideLoading();
                        this.dialogService.render(
                            [{
                                title: 'Success',
                                message: self.successMessage,
                                yesLabel: 'OK'
                            }]
                        ).subscribe(result => {
                            self.showProfiles();
                        });
                    }
                },
                error => {
                    this.errorHandleService.handleErrors(error);
                }
            );
        }
    }
    filterChanged() {
        this.pageNum = 0;
        this.showProfiles();
    }
    showProfiles() {
        var self = this;
        self.resetModes();
        self.loaderService.showLoading();
        if (this.hiringRequestId && !this.hiringRequestNeedId) {
            this.addProfileDataService.getAllProfilesByHiringIdAndFilters(this.pageNum, this.pageSize, this.hiringRequestId, this.noticePeriod, this.status).subscribe(data => {
                self.setRowData(data['content']);
                self.totalPages = data.totalPages;
                self.totalRecords = data.totalElements;
                self.loaderService.hideLoading();
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        } else if (this.hiringRequestId && this.hiringRequestNeedId) {
            var self = this;
            this.addProfileDataService.getAllProfilesByHiringIdAndNeedAndFilters(this.pageNum, this.pageSize, this.hiringRequestId, this.hiringRequestNeedId, this.noticePeriod, this.status).subscribe(data => {
                self.setRowData(data['content']);
                self.totalPages = data.totalPages;
                self.totalRecords = data.totalElements;
                self.loaderService.hideLoading();
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        } else {
            var self = this;
            this.profileDataService.getAllProfilesByFilters(this.pageNum, this.pageSize, this.noticePeriod, this.status).subscribe(data => {
                self.setRowData(data['content']);
                self.totalPages = data.totalPages;
                self.totalRecords = data.totalElements;
                self.loaderService.hideLoading();
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
    resetFields() {
        if (this.hiringRequestOptions.length > 0) {
            this.hiringRequestId = this.hiringRequestOptions[0]['id'];
            this.hiringRequestNeedId = '';
        }
    }
    resetModes() {
        this.buttonModes = {
            'schedule': true,
            'createOffer': true,
            'startVerification': true,
            'shortlist': true,
            'reject': true,
            'join': true,
            'noShow': true,
            'notify': true,
            'viewDetails': true,
            'viewProfile': true,
            'timeline': true,
            'viewFeedback': true
        };
    }
    ngOnInit() {
        var self = this;
        self.resetModes();
        this.addProfileDataService.getAllHiringRequests(this.pageNum, 1000).subscribe(data => {
            if (data['content']) {
                var activeRequests: any = [];
                data['content'].forEach(function (elem: any, ind: any) {
                    if (elem.status == 'ACTIVE') {
                        activeRequests.push(elem);
                    }
                });
                self.hiringRequestOptions = activeRequests;
            }
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    exportData() {
        var self = this;
        if (this.hiringRequestId && !this.hiringRequestNeedId) {
            this.addProfileDataService.exportAllProfilesByHiringIdAndFilters(this.hiringRequestId, this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('All Profiles', data);
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        } else if (this.hiringRequestId && this.hiringRequestNeedId) {
            this.addProfileDataService.exportAllProfilesByHiringIdAndNeedAndFilters(this.hiringRequestId, this.hiringRequestNeedId, this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('All Profiles', data);
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        } else {
            this.profileDataService.exportAllProfilesByFilters(this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('All Profiles', data);
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
    showProspectTimeline() {
        var selectedRecords = this.gridOptions.api.getSelectedRows(), id;
        if (selectedRecords.length > 0) {
            id = selectedRecords[0]['id'];
            this.router.navigate(['hiring/profiles/prospect-timeline', id]);
        }
    }
    showVerificationDetails() {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            var payload = {
                'hiringRequestId': selectedRecords[0]['hiringRequestId'],
                'hiringRequestNeedId': selectedRecords[0]['hiringRequestNeedId']
            };
            localStorage.setItem('verificationDetails', JSON.stringify(payload));
            this.recordNotSelected = false;
            var id = selectedRecords[0]['id'];
            this.router.navigate(['../hiring/profiles/verification', id]);
        } else {
            this.recordNotSelected = true;
        }
    }
    notifyCandidate() {
        var self = this, selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            var prospectId = selectedRecords[0]['id'];
            self.loaderService.showLoading();
            var payload = {
                'hiringRequestId': selectedRecords[0]['hiringRequestId'],
                'hiringRequestNeedId': selectedRecords[0]['hiringRequestNeedId']
            };
            this.profileDataService.notifyCandidate(prospectId, payload).subscribe(data => {
                if (data.status == 200) {
                    self.successMessage = 'Notification sent successfully';
                    self.loaderService.hideLoading();
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]
                    ).subscribe(result => {
                        self.showProfiles();
                    });
                }
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
    updateProspectStatus(opCode: string) {
        var self = this, id,
            selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            self.loaderService.showLoading();
            id = selectedRecords[0]['id'];
            var payload = {
                'hiringRequestId': selectedRecords[0]['hiringRequestId'],
                'hiringRequestNeedId': selectedRecords[0]['hiringRequestNeedId'],
                'offerId': selectedRecords[0]['offerId']
            };
            this.profileDataService.updateProspectStatus(id, opCode, payload).subscribe(data => {
                if (data.status == 200) {
                    self.successMessage = (opCode == 'JOIN') ? 'Prospect marked as Joined' : 'Prospect marked as No Show';
                    self.loaderService.hideLoading();
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]
                    ).subscribe(result => {
                        self.showProfiles();
                    });
                }
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
    rejectProfile(reason: any) {
        var selectedRecords = this.gridOptions.api.getSelectedRows(), id, hiringId, needId, self = this, payload = {};
        if (selectedRecords.length > 0) {
            id = selectedRecords[0]['id'];
            hiringId = selectedRecords[0]['hiringRequestId'];
            needId = selectedRecords[0]['hiringRequestNeedId'];
            payload = {
                'hiringRequestId': hiringId,
                'hiringRequestNeedId': needId,
                'decisionComments': reason
            };
            if (!this.commonService.validateCommentsLength(reason)) {
                this.dialogService.render(
                    [{
                        title: 'Warning',
                        message: 'Remarks entered exceeds the maximum length of 1024 characters',
                        yesLabel: 'OK'
                    }]
                )
                return;
            }
            self.loaderService.showLoading();
            this.profileDataService.updateProspectStatus(id, 'REJECT', payload).subscribe(data => {
                if (data.status == 200) {
                    self.successMessage = 'Profile rejected successfully';
                    self.loaderService.hideLoading();
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]
                    ).subscribe(result => {
                        self.showProfiles();
                    });
                }
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
    shortListProfile(reason: any) {
        var selectedRecords = this.gridOptions.api.getSelectedRows(), id, hiringId, needId, self = this, payload = {};
        if (selectedRecords.length > 0) {
            id = selectedRecords[0]['id'];
            hiringId = selectedRecords[0]['hiringRequestId'];
            needId = selectedRecords[0]['hiringRequestNeedId'];
            payload = {
                'hiringRequestId': hiringId,
                'hiringRequestNeedId': needId,
                'decisionComments': reason
            };
            if (!this.commonService.validateCommentsLength(reason)) {
                this.dialogService.render(
                    [{
                        title: 'Warning',
                        message: 'Remarks entered exceeds the maximum length of 1024 characters',
                        yesLabel: 'OK'
                    }]
                )
                return;
            }
            self.loaderService.showLoading();
            this.profileDataService.updateProspectStatus(id, 'SHORTLIST', payload).subscribe(data => {
                if (data.status == 200) {
                    self.successMessage = 'Profile shortlisted successfully';
                    self.loaderService.hideLoading();
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]
                    ).subscribe(result => {
                        self.showProfiles();
                    });
                }
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
    startVerification() {
        var self = this, selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            var id: string = selectedRecords[0]['id'];
            var payload = {
                'hiringRequestId': selectedRecords[0]['hiringRequestId'],
                'hiringRequestNeedId': selectedRecords[0]['hiringRequestNeedId']
            };
            self.loaderService.showLoading();
            this.profileDataService.updateProspectStatus(id, 'START_VERIFICATION', payload).subscribe(data => {
                if (data.status == 200) {
                    self.successMessage = 'Verification started successfully';
                    self.loaderService.hideLoading();
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]
                    ).subscribe(result => {
                        self.showProfiles();
                    });
                }
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
    navigateToOffers() {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            var prospectName = selectedRecords[0]['displayName'],
                relevantExp = selectedRecords[0]['relevantExperienceInYears'],
                totalExp = selectedRecords[0]['totalExperienceInYears'],
                id = selectedRecords[0]['id'],
                hiringId = selectedRecords[0]['hiringRequestId'],
                hiringNeedId = selectedRecords[0]['hiringRequestNeedId'];
            this.offersDataService.prospectDetails = {
                'prospectName': prospectName,
                'prospectId': id,
                'hiringId': hiringId,
                'hiringNeedId': hiringNeedId,
                'relevantExp': relevantExp,
                'totalExp': totalExp
            };
            this.router.navigate(['../hiring/offers/create-offer/', hiringId, hiringNeedId, id]);
        }
    }
    loadScheduleInterview() {
        var selectedRecord = this.gridOptions.api.getSelectedRows();
        if (selectedRecord.length > 0) {
            var prospectName = selectedRecord[0]['displayName'],
                id = selectedRecord[0]['id'],
                hiringId = selectedRecord[0]['hiringRequestId'],
                needId = selectedRecord[0]['hiringRequestNeedId'];
            this.profileDataService.prospectDetails = {
                'prospectName': prospectName,
                'hiringId': hiringId,
                'hiringNeedId': needId
            };
            this.router.navigate(['../schedule', id, hiringId, needId], { relativeTo: this.route });
        }
    }
}