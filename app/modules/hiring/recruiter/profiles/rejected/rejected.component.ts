import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../hiring.component';
import { AddProfileDataService } from '../../addprofile/add-profile.service';
import { ProfilesDataService } from '../profile.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { DownloadLink } from '../search/download-link/download-link.component';
import { NewHiringRequestDataService1 } from '../../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { GridOptions } from "ag-grid/main";
import "ag-grid-angular/main";

@Component({
    templateUrl: './rejected.component.html'
})

export class RecruiterRejected {
    public noticePeriodOptions: any[];
    public noticePeriod: string;
    public status: string;
    public hiringRequestOptions: any;
    public hiringNeedOptions: any;
    public buttonModes: any = {};
    hiringRequestId: any;
    hiringRequestNeedId: any;
    public successMessage: string;
    columnDefs: any;
    gridOptions: GridOptions;
    allOfTheData: any;
    totalRecords: number = 0;
    pageNum: number = 0;
    pageSize: number = 20;
    totalPages: number;
    shortListTitle: string = 'Shortlist';
    shortListId: string = "shortListProfile";
    constructor(
        private hiringComponent: HiringComponent,
        private router: Router,
        private route: ActivatedRoute,
        private addProfileDataService: AddProfileDataService,
        private profileDataService: ProfilesDataService,
        public commonService: CommonService,
        private hiringRequestDataService: NewHiringRequestDataService1,
        private loaderService: LoaderService,
        private dialogService: DialogService,
        private errorHandleService: ErrorHandleService
    ) {
        this.hiringComponent.URLtitle = "Profiles / Rejected Profiles";
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
        this.status = "REJECTED";
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
        //  this.gridOptions.api.setDatasource(dataSource);
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
        var selectedRecord = this.gridOptions.api.getSelectedRows(), isOwner;
        if (selectedRecord.length > 0) {
            isOwner = selectedRecord[0]['isOwnerOfHiringRequest'];
            this.buttonModes = {
                'shortlist': ((isOwner == true) ? false : true),
                'open': false,
                'timeline': false
            };
        } else {
            this.resetModes();
        }
    }
    /*loadScheduleInterview() {
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
        this.router.navigate(['../schedule', id], { relativeTo: this.route });
      }
    }*/
    setPageNum(pageNum: any) {
        this.pageNum = pageNum;
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
    resetModes() {
        this.buttonModes = {
            'shortlist': true,
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
                self.commonService.downloadCsv('Rejected Profiles', data);
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else if (this.hiringRequestId && this.hiringRequestNeedId) {
            this.addProfileDataService.exportAllProfilesByHiringIdAndNeedAndFilters(this.hiringRequestId, this.hiringRequestNeedId, this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('Rejected Profiles', data);
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else {
            this.profileDataService.exportAllProfilesByFilters(this.noticePeriod, this.status).subscribe(data => {
                data = data['_body'];
                self.commonService.downloadCsv('Rejected Profiles', data);
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
                );
                return;
            }
            self.loaderService.showLoading();
            this.hiringRequestDataService.updateProfileStatus(id, 'SHORTLIST', payload).subscribe(data => {
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
                self.errorHandleService.handleErrors(error);
            });
        }
    }
}
