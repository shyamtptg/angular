import { Component } from '@angular/core';
import {GridOptions} from "ag-grid/main";
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../shared/services/common.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';
import { HiringComponent } from '../../hiring.component';
import { AddProfileDataService } from '../addprofile/add-profile.service';
import { DownloadLink } from '../profiles/search/download-link/download-link.component';
import { NewHiringRequestDataService1 } from '../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import "ag-grid-angular/main";

@Component({
  templateUrl: './profiles.component.html'
})
export class HiringManagerProfiles {
   public noticePeriodOptions: any[];
   public statusOptions:any[];
   public noticePeriod: string;
   public status: string;
   public buttonModes: any = {};
   columnDefs: any;
   gridOptions: GridOptions;
   allOfTheData: any;
   totalRecords: number = 0;
   public hiringRequestOptions: any;
   public hiringNeedOptions: any;
   hiringRequestId: any;
   hiringRequestNeedId: any;
   public recordsCount: number;
   pageNum: number = 0;
   pageSize: number = 20;
   totalPages: number;

   constructor(
     private hiringComponent: HiringComponent,
     private hiringRequestDataService: NewHiringRequestDataService1,
     private addProfileService: AddProfileDataService,
     private router: Router,
     private route: ActivatedRoute,
     private dialogService: DialogService,
     public commonService: CommonService,
     private loaderService: LoaderService,
     private errorHandleService: ErrorHandleService
    ) {
    this.hiringComponent.URLtitle = "Profiles / Profile Screening";
    this.gridOptions = <GridOptions>{};
    this.columnDefs = [
      {headerName: "Name", field: "displayName", minWidth: 220, tooltipField: "displayName", headerTooltip: "Name" },
      { headerName: "Resume", field: "resume", minWidth: 130, cellRendererFramework: DownloadLink },
      { headerName: "Hiring Purpose", field: "hiringPurpose", minWidth: 180, tooltipField: "hiringPurpose", headerTooltip: "Hiring Purpose", "hide": true },
      { headerName: "Current Work Location", field: "currentWorkLocation", minWidth: 160, tooltipField: "currentWorkLocation", headerTooltip: "Current Work Location" },
      { headerName: "Current Employer", field: "currentEmployer", minWidth: 190, tooltipField: "currentEmployeer", headerTooltip: "Current Employer" },
      {headerName: "Notice Period", field: "noticePeriod", minWidth: 140 },
      {headerName: "Status", field: "status", minWidth: 190}
    ];
    this.gridOptions = {
     columnDefs: this.columnDefs,
     rowData: [],
     enableSorting: true,
     rowSelection: 'single'
    };
    this.noticePeriodOptions = [];
    this.statusOptions = [];
    this.hiringRequestId = '';
    this.hiringRequestNeedId = '';
    this.noticePeriod = "ALL";
    this.status = "ATTACHED_TO_THE_NEED";
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
            setTimeout( function() {
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
resizeColumns(){
  this.gridOptions.api.sizeColumnsToFit();
}
onGridInitialize(){
   var self = this;
   self.resizeColumns();
   var data = this.addProfileService.getProspectCombos();
   if(data){
    this.noticePeriodOptions = data['NOTICE_PERIOD'];
    this.statusOptions = data['PROSPECT_STATUS'];
   }
   self.showProfiles();
}
setPageNum(pageNum: any) {
  this.pageNum = pageNum;
  this.showProfiles();
}
setRowData(rowData: any) {
   this.allOfTheData = rowData;
   this.createNewDatasource();
}
ngOnInit(){
  var self = this;
  self.resetModes();
  this.hiringRequestDataService.getAllHiringRequests(this.pageNum, 1000).subscribe(data => {
     if(data['content']){
     var activeRequests: any = [];
      data['content'].forEach(function(elem: any, ind: any){
        if(elem.status == 'ACTIVE'){
          activeRequests.push(elem);
        }
      });
      self.hiringRequestOptions = activeRequests;
      /*self.hiringRequestId = self.hiringRequestOptions[0] && self.hiringRequestOptions[0]['id'];
      if(self.hiringRequestId){
        self.loadNeedsByHiringId();
      }*/
    }
  }, error => {
    self.errorHandleService.handleErrors(error);
  });
}
loadNeedsByHiringId() {
    var hiringId = this.hiringRequestId, self = this;
    self.hiringRequestNeedId = '';
    if (hiringId) {
      self.hiringRequestDataService.getNeedsByHiringId(hiringId).subscribe(data=> {
        self.hiringNeedOptions = data;
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    } else if (self.hiringRequestId === ''){
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
     if(this.hiringRequestId && !this.hiringRequestNeedId){
       this.hiringRequestDataService.getAllProfilesByHiringIdAndFilters(
         this.pageNum, this.pageSize, this.hiringRequestId, this.noticePeriod, this.status
        ).subscribe(data => {
        self.setRowData(data['content']);
        self.totalPages = data.totalPages;
        self.totalRecords = data.totalElements;
        self.loaderService.hideLoading();
       }, error => {
        self.errorHandleService.handleErrors(error);
        });
     } else if (this.hiringRequestId && this.hiringRequestNeedId) {
       this.hiringRequestDataService.getAllProfilesByHiringIdAndNeedAndFilters(
         this.pageNum, this.pageSize, this.hiringRequestId, this.hiringRequestNeedId, this.noticePeriod, this.status
        ).subscribe(data => {
        self.setRowData(data['content']);
        self.totalPages = data.totalPages;
        self.totalRecords = data.totalElements;
        self.loaderService.hideLoading();
       }, error => {
        self.errorHandleService.handleErrors(error);
        });
     } else if (!this.hiringRequestId && !this.hiringRequestNeedId) {
        this.hiringRequestDataService.getAllProfilesByFilters(
          this.pageNum, this.pageSize, this.noticePeriod, this.status
        ).subscribe(data => {
         self.setRowData(data['content']);
         self.totalPages = data.totalPages;
         self.totalRecords = data.totalElements;
         self.loaderService.hideLoading();
       }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  resetFields() {
    if (this.hiringRequestOptions.length > 0) {
      this.hiringRequestId = this.hiringRequestOptions[0]['id'];
      this.hiringRequestNeedId = 0;
    }
  }
  showProfileDetails() {
   var selectedRecords = this.gridOptions.api.getSelectedRows();
   if (selectedRecords.length>0) {
    var id = selectedRecords[0]['id'],
    hiringRequestId = selectedRecords[0]['hiringRequestId'],
    hiringRequestNeedId = selectedRecords[0]['needId'];
    this.router.navigate(['../screening', id, hiringRequestId, hiringRequestNeedId], { relativeTo: this.route });
   }
  }
  showProspectTimeline() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(), id;
    if (selectedRecords.length > 0) {
      id = selectedRecords[0]['id'];
      this.router.navigate(['hiring/profiles/prospect-timeline', id]);
    }
  }
  checkModes(){
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      this.buttonModes['open'] = false;
      this.buttonModes['timeline'] = false;
    }else{
      this.resetModes();
    }
  }
  resetModes() {
    this.buttonModes = {
      'open': true,
      'timeline': true
    };
  }
}