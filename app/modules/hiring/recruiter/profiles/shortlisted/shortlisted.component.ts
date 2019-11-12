import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../hiring.component';
import { AddProfileDataService } from '../../addprofile/add-profile.service';
import { ProfilesDataService } from '../profile.service';
import { NewHiringRequestDataService1 } from '../../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';
import { DownloadLink } from '../search/download-link/download-link.component';
import { GridOptions } from 'ag-grid/main';
import 'ag-grid-angular/main';

@Component({
    templateUrl: './shortlisted.component.html'
})

export class RecruiterShortlisted {
    public noticePeriodOptions: any[];
    public noticePeriod: string;
    public status: string;
    public successMessage: string;
    public buttonModes: any = {};
    columnDefs: any;
    gridOptions: GridOptions;
    allOfTheData: any;
    disableShedule: boolean = true;
    public hiringRequestOptions: any;
    public hiringNeedOptions: any;
    hiringRequestId: any;
    hiringRequestNeedId: any;
    totalRecords: number = 0;
    pageNum: number = 0;
    pageSize: number = 20;
    totalPages: number;
    rejectTitle: string = 'Reject';
    rejectId: string = "RejectProfile";
    constructor(
        private hiringComponent: HiringComponent,
        private router: Router,
        private route: ActivatedRoute,
        private addProfileDataService: AddProfileDataService,
        private profileDataService: ProfilesDataService,
        private hiringRequestDataService: NewHiringRequestDataService1,
        public commonService: CommonService,
        private loaderService: LoaderService,
        private dialogService: DialogService,
        private errorHandleService: ErrorHandleService
    ) {
        this.hiringComponent.URLtitle = "Profiles / Shortlisted Profiles";
        this.gridOptions = <GridOptions>{};
        this.columnDefs = [
            { headerName: "Name", field: "displayName", minWidth: 170, tooltipField: "displayName", headerTooltip: "Name" },
            { headerName: "Resume", field: "resume", minWidth: 100, cellRendererFramework: DownloadLink },
            { headerName: "Hiring Purpose", field: "hiringPurpose", minWidth: 180, tooltipField: "hiringPurpose", headerTooltip: "Hiring Purpose" },
            { headerName: "Current Work Location", field: "currentWorkLocation", minWidth: 170, tooltipField: "currentWorkLocation", headerTooltip: "Current Work Location" },
            { headerName: "Current Employer", field: "currentEmployeer", minWidth: 130, tooltipField: "currentEmployeer", headerTooltip: "Current Employer" },
            { headerName: "Notice Period", field: "noticePeriod", minWidth: 120 },
            { headerName: "Status", field: "status", minWidth: 250, tooltipField: "status", headerTooltip: "Status" }
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
        this.status = "SHORTLISTED";
    }
    dateComparator(date1: any, date2: any) {
        // eg 29/08/2004 gets converted to 2004082
        return this.commonService.dateComparator(date1, date2);
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
    setRowData(rowData: any) {
        this.allOfTheData = rowData;
        this.createNewDatasource();
    }
    setModes() {
        var selectedRecord = this.gridOptions.api.getSelectedRows(), hiringId, needId, isOwner;
        if (selectedRecord.length > 0) {
            hiringId = selectedRecord[0]['hiringRequestId'];
            needId = selectedRecord[0]['hiringRequestNeedId'];
            isOwner = selectedRecord[0]['isOwnerOfHiringRequest'];
            this.buttonModes['reject'] = (isOwner == true) ? false : true;
            this.buttonModes['open'] = false;
            this.buttonModes['timeline'] = false;
            if (hiringId && needId) {
                this.disableShedule = false;
            } else {
                this.disableShedule = true;
            }
        } else {
            this.disableShedule = true;
            this.resetModes();
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
    resetModes() {
        this.buttonModes = {
            'reject': true,
            'open': true,
            'timeline': true
        };
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
    setPageNum(pageNum: any) {
        this.pageNum = pageNum;
        this.showProfiles();
    }
    filterChanged() {
        this.pageNum = 0;
        this.showProfiles();
    }
    showProfiles() {
        var self = this;
        self.disableShedule = true;
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
            this.profileDataService.getAllProfilesByFilters(this.pageNum, this.pageSize, this.noticePeriod, this.status).subscribe(data => {
                self.setRowData(data['content']);
                self.totalPages = data.totalPages;
                self.totalRecords = data.totalElements;
                self.loaderService.hideLoading();
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        }
    }
    exportData() {
        var self = this;
        if (this.hiringRequestId && !this.hiringRequestNeedId) {
            this.addProfileDataService.exportAllProfilesByHiringIdAndFilters(this.hiringRequestId, this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('Shortlisted Profiles', data);
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else if (this.hiringRequestId && this.hiringRequestNeedId) {
            this.addProfileDataService.exportAllProfilesByHiringIdAndNeedAndFilters(this.hiringRequestId, this.hiringRequestNeedId, this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('Shortlisted Profiles', data);
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else {
            this.profileDataService.exportAllProfilesByFilters(this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('Shortlisted Profiles', data);
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        }
    }
    resetFields() {
        if (this.hiringRequestOptions.length > 0) {
            this.hiringRequestId = this.hiringRequestOptions[0]['id'];
            this.hiringRequestNeedId = 0;
            this.setModes();
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
            this.hiringRequestDataService.updateProfileStatus(id, 'REJECT', payload).subscribe(data => {
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
                self.errorHandleService.handleErrors(error);
            });
        }
    }
}