import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HiringComponent } from '../../hiring.component';
import { OffersDataService } from '../offers/offers.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { GridOptions } from 'ag-grid/main';
import 'ag-grid-angular/main';
import {DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './ready-to-offer.component.html'
})
export class ReadyToOffer {
  public priorityOptions: any[];
  public statusOptions: any[];
  public priority: string;
  public status: string;
  columnDefs: any;
  gridOptions: GridOptions;
  allOfTheData: any;
  public buttonModes: any = {};
  public recordsCount: number;
  pageNum: number = 0;
  pageSize: number = 20;
  totalPages: number;
  successMessage: string;
  constructor(
    private hiringComponent: HiringComponent,
    private offersDataService: OffersDataService,
    private loaderService: LoaderService,
    private dialogService: DialogService,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandleService: ErrorHandleService
  ) {
    this.gridOptions = <GridOptions>{};
    this.hiringComponent.URLtitle = "Offers / Ready to Offer";
    this.columnDefs = [
      /*{headerName: "Offer Id", field: "offerId", minWidth: 170, sort: 'desc', cellRenderer: this.formatId},*/
      { headerName: "Name", field: "prospectName", minWidth: 210 },
      { headerName: "Practice", field: "practice", minWidth: 170 },
      { headerName: "Designation", field: "designation", minWidth: 160, tooltipField: "designation", headerTooltip: "Designation" },
      { headerName: "Status", field: "offerStatus", minWidth: 120, tooltipField: "offerStatus", headerTooltip: "Status" },
      { headerName: "Work Location", field: "workLocation", minWidth: 180, tooltipField: "workLocation", headerTooltip: "Work Location" },
      { headerName: "Joining Date", field: "expectedJoiningDate", minWidth: 120, cellRenderer: this.formatDate },
      { headerName: "Hiring Type", field: "hiringType", minWidth: 140 },
      { headerName: "Hiring Manager", field: "hiringManager", minWidth: 160, unSortIcon: true, tooltipField: "hiringManager", headerTooltip: "Hiring Manager" },
      { headerName: "Created Date", field: "offerCreationTimeStamp", minWidth: 150, cellRenderer: this.formatDate }
    ];
    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: [],
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
  formatId(id: any) {
    return 'OF' + id.value.split('-')[0].toUpperCase();
  }
  formatDate(data: any) {
    var time = new Date(data.value * 1),
      result, year, month, today;
    year = time.getFullYear();
    month = time.getMonth() + 1;
    today = time.getDate();
    result = today + '/' + month + '/' + year;
    return result;
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
    this.loadGrid();
  }
  loadGrid() {
    var self = this;
    self.resetModes();
    setTimeout(() => {
      self.loaderService.showLoading();
      this.offersDataService.getOffersByStatus(this.pageNum, this.pageSize, 'APPROVED').subscribe(data => {
        self.setRowData(data['content']);
        self.recordsCount = data.totalElements;
        self.totalPages = data.totalPages;
        self.loaderService.hideLoading();
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  setPageNum(pageNum: any) {
    this.pageNum = pageNum;
    this.loadGrid();
  }
  setRowData(rowData: any) {
    this.allOfTheData = rowData;
    this.createNewDatasource();
  }
  viewOffer() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['offerId'];
      this.offersDataService.documentId = selectedRecords[0]['documentId'];
      this.router.navigate(['/hiring/offers/offer-letter', id]);
    }
  }
  openOffer(){
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['offerId'],
        hiringId = selectedRecords[0]['hiringRequestId'],
        hiringNeedId = selectedRecords[0]['needId'];
      this.offersDataService.hiringDetails = {
        'hiringId': hiringId,
        'hiringNeedId': hiringNeedId
      };
      this.router.navigate(['/hiring/offers/view', id]);
    }
  }
  editOffer() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['offerId'],
        hiringId = selectedRecords[0]['hiringRequestId'],
        hiringNeedId = selectedRecords[0]['needId'];
      this.offersDataService.hiringDetails = {
        'hiringId': hiringId,
        'hiringNeedId': hiringNeedId
      };
      this.router.navigate(['/hiring/offers/offerdetail', id]);
    }
  }
  deleteOffer() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(), self = this;
    this.dialogService.render(
      [{
          title: 'Delete Confirmation',
          message: 'Do you want to delete this offer?',
          yesLabel: 'YES',
          noLabel: 'NO'
      }],
  ).subscribe(result => {
    if(result){
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['offerId'],
      hiringId = selectedRecords[0]['hiringRequestId'],
      hiringNeedId = selectedRecords[0]['needId'];
      self.loaderService.hideLoading();
      this.offersDataService.deleteOffer(hiringId, hiringNeedId, id).subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Offer deleted successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              this.loadGrid();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
    }

  });
  }
  submitOffer(opCode: string, reason?: string) {
    var selectedRecords = this.gridOptions.api.getSelectedRows(), self = this;
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['offerId'],
        hiringId = selectedRecords[0]['hiringRequestId'],
        hiringNeedId = selectedRecords[0]['needId'], payload;
      self.loaderService.showLoading();
      if(opCode == 'REJECT'){
        payload = {
          'rejectionComments': reason
        };
      }else{
        payload = null;
      }
      this.offersDataService.submitOffer(hiringId, hiringNeedId, id, opCode, payload).subscribe(data => {
        if (data.status == 200) {
          if (opCode == 'RELEASE') {
            self.successMessage = 'Offer released successfully';
          } else if (opCode == 'REJECT') {
            self.successMessage = 'Offer rejected successfully';
          }
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              this.loadGrid();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  checkModes() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var status = selectedRecords[0]['offerStatusCode'];
      if (status == 'APPROVED') {
        this.buttonModes = {
          edit: false,
          release: false,
          view: false,
          open: false,
          reject: false,
          delete: false
        };
      } else {
        this.buttonModes = {
          edit: true,
          release: true,
          view: false,
          open: false,
          reject: true,
          delete: true
        };
      }
      if(status == 'ACCEPTED' || status == 'CANCELLED' || status == 'DELETED' ){
        this.buttonModes['edit'] = true;
        this.buttonModes['delete'] = true;
      }else{
        this.buttonModes['edit'] = false;
        this.buttonModes['delete'] = false;
      }
    }else{
     this.resetModes();
    }
  }
  exportData() {
    var self = this;
    setTimeout(() => {
      self.offersDataService.exportOffers('READY_TO_OFFER').subscribe(data => {
        self.commonService.downloadCsv('Ready To Offer', data['_body']);
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  resetModes() {
    this.buttonModes = {
      edit: true,
      release: true,
      view: true,
      open: true,
      reject: true,
      delete: true
    };
  }
}