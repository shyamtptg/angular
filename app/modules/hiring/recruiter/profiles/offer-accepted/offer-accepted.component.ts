import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../hiring.component';
import { AddProfileDataService } from '../../addprofile/add-profile.service';
import { ProfilesDataService } from '../profile.service';
import { OffersDataService } from '../../../cpo/offers/offers.service';
import { DownloadLink } from '../search/download-link/download-link.component';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';
import { GridOptions } from "ag-grid/main";
import "ag-grid-angular/main";

@Component({
    templateUrl: './offer-accepted.component.html'
})

export class OfferAccepted {
    columnDefs: any;
    gridOptions: GridOptions;
    allOfTheData: any;
    public buttonModes: any = {};
    successMessage: string;
    public noticePeriodOptions: any[];
    public noticePeriod: string;
    public status: string;
    public hiringRequestOptions: any;
    public hiringNeedOptions: any;
    hiringRequestId: any;
    hiringRequestNeedId: any;
    totalRecords: number = 0;
    pageNum: number = 0;
    pageSize: number = 20;
    totalPages: number;
    constructor(
        private hiringComponent: HiringComponent,
        private addProfileDataService: AddProfileDataService,
        private profilesDataService: ProfilesDataService,
        private offersDataService: OffersDataService,
        public commonService: CommonService,
        private loaderService: LoaderService,
        private router: Router,
        private route: ActivatedRoute,
        private dialogService: DialogService,
        private errorHandleService: ErrorHandleService
    ) {
        this.hiringComponent.URLtitle = "Profiles / Ready To Join";
        this.gridOptions = <GridOptions>{};
        this.columnDefs = [
            { headerName: "Name", field: "displayName", minWidth: 170, tooltipField: "displayName", headerTooltip: "Name" },
            { headerName: "Resume", field: "resume", minWidth: 100, cellRendererFramework: DownloadLink },
            { headerName: "Hiring Purpose", field: "hiringPurpose", minWidth: 180, tooltipField: "hiringPurpose", headerTooltip: "Hiring Purpose" },
            { headerName: "Client", field: "clientName", minWidth: 150, tooltipField: "clientName", headerTooltip: "Client" },
            { headerName: "Notice Period", field: "noticePeriod", minWidth: 120 },
            { headerName: "Work Location", field: "currentWorkLocation", minWidth: 150, tooltipField: "currentWorkLocation", headerTooltip: "Work Location" },
            { headerName: "Status", field: "status", minWidth: 200, tooltipField: "status", headerTooltip: "Status" },
            { headerName: "Hiring Type", field: "hiringTypeDescription", minWidth: 130 },
            { headerName: "Current Employer", field: "currentEmployeer", minWidth: 130, tooltipField: "currentEmployeer", headerTooltip: "Current Employer" },
            { headerName: "Total Experience (In Years)", field: "totalExperienceInYears", minWidth: 180 }
        ];
        this.gridOptions = {
            columnDefs: this.columnDefs,
            rowData: [],
            enableSorting: true,
            rowSelection: 'single'
        };
        this.noticePeriodOptions = [];
        this.hiringRequestId = '';
        this.hiringRequestNeedId = '';
        this.noticePeriod = "ALL";
        this.status = "OFFER_ACCEPTED";
    }
    showVerificationDetails() {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            var payload = {
                'hiringRequestId': selectedRecords[0]['hiringRequestId'],
                'hiringRequestNeedId': selectedRecords[0]['hiringRequestNeedId']
            };
            localStorage.setItem('verificationDetails', JSON.stringify(payload));
            var id = selectedRecords[0]['id'];
            this.router.navigate(['../hiring/profiles/verification-details', id]);
        }
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
    resizeColumns() {
        this.gridOptions.api.sizeColumnsToFit();
    }
    onGridInitialize() {
        this.resizeColumns();
        var data = this.addProfileDataService.getProspectCombos();
        if (data) {
            this.noticePeriodOptions = data['NOTICE_PERIOD'];
        }
        this.showProfiles();
    }
    ngOnInit() {
        var self = this;
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
            self.errorHandleService.handleErrors(error);
        });
    }
    loadNeedsByHiringId() {
        var hiringId = this.hiringRequestId, self = this;
        self.hiringRequestNeedId = "";
        if (hiringId) {
            self.addProfileDataService.getNeedsByHiringId(hiringId).subscribe(data => {
                self.hiringNeedOptions = data;
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else if (hiringId == '') {
            self.hiringNeedOptions = [];
        }
        self.pageNum = 0;
        self.showProfiles();
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
                self.errorHandleService.handleErrors(error);
            });
        } else if (this.hiringRequestId && this.hiringRequestNeedId) {
            this.addProfileDataService.getAllProfilesByHiringIdAndNeedAndFilters(this.pageNum, this.pageSize, this.hiringRequestId, this.hiringRequestNeedId, this.noticePeriod, this.status).subscribe(data => {
                self.setRowData(data['content']);
                self.totalPages = data.totalPages;
                self.totalRecords = data.totalElements;
                self.loaderService.hideLoading();
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else {
            this.profilesDataService.getAllProfilesByFilters(this.pageNum, this.pageSize, this.noticePeriod, this.status).subscribe(data => {
                self.setRowData(data['content']);
                self.totalPages = data.totalPages;
                self.totalRecords = data.totalElements;
                self.loaderService.hideLoading();
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        }
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
    checkModes() {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            var joiningDate = selectedRecords[0]['expectedJoiningDate'],
                currentDate = new Date().getTime(),
                joiningEpochTime = this.getDate(new Date(joiningDate)).getTime(),
                currentEpochTime = this.getDate(new Date(currentDate)).getTime();
            this.buttonModes['join'] = (currentEpochTime <= joiningEpochTime) ? false : true;
            this.buttonModes['noShow'] = (currentEpochTime > joiningEpochTime) ? false : true;
            this.buttonModes['open'] = false;
            this.buttonModes['timeline'] = false;
            this.buttonModes['viewFeedback'] = false;
            this.buttonModes['viewDetails'] = false;
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
    setPageNum(pageNum: any) {
        this.pageNum = pageNum;
        this.showProfiles();
    }
    setRowData(rowData: any) {
        this.allOfTheData = rowData;
        // this.totalRecords = this.allOfTheData.length;
        this.createNewDatasource();
    }
    navigateToOffers() {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            var prospectName = selectedRecords[0]['displayName'],
                id = selectedRecords[0]['id'],
                hiringId = selectedRecords[0]['hiringRequestId'],
                hiringNeedId = selectedRecords[0]['hiringRequestNeedId'];
            this.offersDataService.prospectDetails = {
                'prospectName': prospectName,
                'prospectId': id,
                'hiringId': hiringId,
                'hiringNeedId': hiringNeedId
            };
            this.router.navigate(['../hiring/offers/offerdetail']);
        }
    }
    showProfileDetails() {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            var id = selectedRecords[0]['id'];
            this.router.navigate(['../profile-details', id], { relativeTo: this.route });
        }
    }
    showProspectTimeline() {
        var selectedRecords = this.gridOptions.api.getSelectedRows(), id;
        if (selectedRecords.length > 0) {
            id = selectedRecords[0]['id'];
            this.router.navigate(['hiring/profiles/prospect-timeline', id]);
        }
    }
    exportData() {
        var self = this;
        if (this.hiringRequestId && !this.hiringRequestNeedId) {
            this.addProfileDataService.exportAllProfilesByHiringIdAndFilters(this.hiringRequestId, this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('Offer Accepted', data);
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else if (this.hiringRequestId && this.hiringRequestNeedId) {
            this.addProfileDataService.exportAllProfilesByHiringIdAndNeedAndFilters(this.hiringRequestId, this.hiringRequestNeedId, this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('Offer Accepted', data);
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else {
            this.profilesDataService.exportAllProfilesByFilters(this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('Offer Accepted', data);
            }, error => {
                self.errorHandleService.handleErrors(error);
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
            this.profilesDataService.updateProspectStatus(id, opCode, payload).subscribe(data => {
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
                self.errorHandleService.handleErrors(error);
            });
        }
    }
    resetModes() {
        this.buttonModes = {
            'open': true,
            'viewFeedback': true,
            'timeline': true,
            'viewDetails': true,
            'join': true,
            'noShow': true
        };
    }
}