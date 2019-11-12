import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DownloadLink } from './download-link/download-link.component';
import { HiringComponent } from '../../../hiring.component';
import { SearchService } from './search.service';
import { AddProfileDataService } from '../../addprofile/add-profile.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { GridOptions } from "ag-grid/main";
import "ag-grid-angular/main";
var profileData = require('../../models/profileData.json');

@Component({
    templateUrl: './search.component.html'
})

export class RecruiterSearch {
    public priorityOptions: any[];
    public statusOptions: any[];
    public priority: string;
    public status: string;
    public isDisable: boolean = true;
    searchData: SearchModel;
    data: any;
    showGrid: boolean;
    recordNotSelected: boolean = false;
    columnDefs: any;
    gridOptions: GridOptions;
    allOfTheData: any;
    totalProfiles: number = 0;
    sendTitle: any = "Notify Candidate";
    sendId: any = "notifyCandidate";
    hiringRequestId: any;
    hiringRequestNeedId: any;
    pageNum: number = 0;
    pageSize: number = 15;
    totalPages: number;
    constructor(
        private hiringComponent: HiringComponent,
        private router: Router,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private addProfileDataService: AddProfileDataService,
        private commonService: CommonService,
        private loaderService: LoaderService,
        private errorHandleService: ErrorHandleService
    ) {
        this.searchData = {
            firstName: '',
            lastName: '',
            email: '',
            mobileNumber: '',
            skills: '',
            relevantExperience: '',
            panNo: '',
        }
        this.data = {}
        this.gridOptions = <GridOptions>{};
        this.hiringComponent.URLtitle = "Profiles / Search";
        this.columnDefs = [
            { headerName: "Candidate Name", field: "candidatename", minWidth: 240, sort: 'desc', cellClass: 'grid-align' },
            { headerName: "Relevant Experience", field: "relevantExperience", minWidth: 190, cellClass: 'grid-align' },
            { headerName: "Email", field: "email", minWidth: 240, cellClass: 'grid-align' },
            { headerName: "Mobile Number", field: "mobileNumber", minWidth: 200, unSortIcon: true, cellClass: 'grid-align' },
            { headerName: "Resume", field: "resume", minWidth: 180, cellRendererFramework: DownloadLink, cellClass: 'grid-align' }
        ];
        this.gridOptions = {
            columnDefs: this.columnDefs,
            rowData: [
            ],
            enableSorting: true,
            rowSelection: 'single'
        };
        this.priorityOptions = [
            "All", "Low", "Normal", "High", "Very High", "Critical", "Very Critical"
        ];
        this.statusOptions = [
            "All", "Active", "Draft"
        ];
        this.priority = "All";
        this.status = "All";
    }
    restrictMobilenumber(event: any) {
        return this.commonService.restrictMobilenumber(event);
    }
    restrictFloatnumber = function (e: any) {
        return this.commonService.restrictFloatnumber(e);
    }
    validateExperience = function (value: any) {
        return this.commonService.validateExperience(value);
    }
    checkExperience = function (value: any) {
        var self = this;
        if (this.commonService.validateDecimalPlacesForExp(value) == false) {
            self.searchData.relevantExperience = undefined;
            this.dialogService.render(
                [{
                    title: 'Warning',
                    message: 'The value for Relevant Experience should be between 0 and 100',
                    yesLabel: 'OK'
                }]
            )
            return;
        }
    }
    checkModes() {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        this.isDisable = (selectedRecords.length > 0) ? false : true;
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
        this.setRowData(this.gridOptions.rowData);
    }
    setRowData(rowData: any) {
        this.allOfTheData = rowData;
        this.createNewDatasource();
    }
    setPageNum(pageNum: any) {
        this.pageNum = pageNum;
        this.profileSearch(this.searchData);
    }
    searchProfiles() {
        this.pageNum = 0;
        this.profileSearch(this.searchData);
    }
    profileSearch(data: any) {
        this.isDisable = true;
        var keys = Object.keys(data);
        (keys).forEach(key => {
            if (data[key]) {
                this.data[key] = data[key];
                this.data["documentType"] = "RESUME";
            }
        })
        var self = this;
        self.loaderService.showLoading();
        this.searchService.searchProfileData(this.pageNum, this.pageSize, this.data).subscribe(res => {
            this.gridOptions.rowData = [];
            if (res["content"].length) {
                res["content"].forEach((obj: any) => {
                    var tempObj = {
                        "candidatename": obj.firstName + " " + obj.lastName,
                        "relevantExperience": obj.relevantExperience,
                        "email": obj.email,
                        "mobileNumber": obj.mobileNumber,
                        "resume": "Download",
                        "offer": "Offered",
                        "id": obj.prospectId,
                        "documentId": obj.id,
                        "documentName": obj.documentName
                    }
                    this.gridOptions.rowData.push(tempObj);
                });
            }
            this.totalProfiles = res.totalElements;
            self.totalPages = res.totalPages;
            this.setRowData(this.gridOptions.rowData);
            this.data = {};
            this.showGrid = true;
            self.loaderService.hideLoading();
        }, error => {
            self.errorHandleService.handleErrors(error);
        });
    }
    viewProfile() {
        this.addProfileDataService.mode = 'view';
        localStorage.setItem('searchReq', JSON.stringify(this.searchData));
        this.loadProfileDetails('view');
    }
    updateProfile() {
        this.addProfileDataService.mode = 'edit';
        localStorage.setItem('searchReq', JSON.stringify(this.searchData));
        this.loadProfileDetails();
    }
    attachProfile() {
        this.addProfileDataService.mode = 'view';
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            this.recordNotSelected = false;
            var id = selectedRecords[0]['id'];
            this.router.navigate(['../attach', id], { relativeTo: this.route });
        } else {
            this.recordNotSelected = true;
        }
    }
    loadProfileDetails(mode?: string) {
        var selectedRecords = this.gridOptions.api.getSelectedRows();
        if (selectedRecords.length > 0) {
            this.recordNotSelected = false;
            var id = selectedRecords[0]['id'];
            this.searchService.prospectId = id;
            if (mode == 'view') {
                this.router.navigate(['../' + mode, id], { relativeTo: this.route });
            } else {
                this.router.navigate(['../details', id], { relativeTo: this.route });
            }
        } else {
            this.recordNotSelected = true;
        }
    }
    loadProfile() {
        profileData.currentAddress = {
            address1: null,
            address2: null,
            city: null,
            country: "India",
            state: null,
            zipcode: null
        };
        profileData.permanentAddress = {
            address1: null,
            address2: null,
            city: null,
            country: "India",
            state: null,
            zipcode: null
        };
        this.addProfileDataService.mode = 'new';
        this.router.navigate(['../details'], { relativeTo: this.route });
    }
    showProfiles() {
        if (this.hiringRequestId && !this.hiringRequestNeedId) {
            var self = this;
            this.addProfileDataService.getAllProfilesByHiringId(this.pageNum, this.pageSize, this.hiringRequestId).subscribe(data => {
                self.setRowData(data);
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else if (this.hiringRequestId && this.hiringRequestNeedId) {
            var self = this;
            this.addProfileDataService.getAllProfilesByHiringIdAndNeed(this.pageNum, this.pageSize, this.hiringRequestId, this.hiringRequestNeedId).subscribe(data => {
                self.setRowData(data);
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        }
    }
    ngOnInit() {
        var route = localStorage.getItem('profileRoute');
        if (route) {
            if (localStorage.getItem('searchReq')) {
                var data: any = JSON.parse(localStorage.getItem('searchReq'));
                this.searchData = data;
                if (data.firstName || data.lastName || data.email || data.relevantExperience || data.skills || data.panNo || data.mobileNumber) {
                    this.profileSearch(data);
                }
                localStorage.removeItem('searchReq');
            }
        } else {
            localStorage.removeItem('searchReq');
        }
        localStorage.removeItem('profileRoute');
    }
    showProspectTimeline() {
        var selectedRecords = this.gridOptions.api.getSelectedRows(), id;
        if (selectedRecords.length > 0) {
            id = selectedRecords[0]['id'];
            localStorage.setItem('searchReq', JSON.stringify(this.searchData));
            this.router.navigate(['hiring/profiles/prospect-timeline', id]);
        }
    }
}

export class SearchModel {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    skills: string;
    relevantExperience: string;
    panNo: string;
}