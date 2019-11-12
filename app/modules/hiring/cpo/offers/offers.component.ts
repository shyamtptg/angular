import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { HiringComponent } from '../../hiring.component';
import { DownloadOffer } from '../download-offer/download-offer.component';
import { OffersDataService } from './offers.service';
import { AssignExecutiveDataService } from '../assignexecutive/assign-executive.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { GridOptions } from 'ag-grid/main';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';
import 'ag-grid-angular/main';

@Component({
  templateUrl: './offers.component.html'
})
export class CpoOffers implements OnInit {
  public statusOptions: any[];
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
  byPassTitle: string = 'Bypass CPO Approval';
  byPassId: string = 'byPassId';
  constructor(
    private hiringComponent: HiringComponent,
    private offersDataService: OffersDataService,
    private loaderService: LoaderService,
    private dialogService: DialogService,
    public commonService: CommonService,
    private assignExecutiveService: AssignExecutiveDataService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandleService: ErrorHandleService
  ) {
    this.gridOptions = <GridOptions>{};
    this.hiringComponent.URLtitle = "Offers / All Offers";
    this.columnDefs = [
      /*{headerName: "Offer Id", field: "offerId", minWidth: 160, sort: 'desc', cellRenderer: this.formatId},*/
      { headerName: "Name", field: "prospectName", minWidth: 210 },
      { headerName: "Practice", field: "practice", minWidth: 170 },
      { headerName: "Designation", field: "designation", minWidth: 160, tooltipField: "designation", headerTooltip: "Designation" },
      { headerName: "Status", field: "offerStatus", minWidth: 120, tooltipField: "offerStatus", headerTooltip: "Status" },
      { headerName: "Work Location", field: "workLocation", minWidth: 180, tooltipField: "workLocation", headerTooltip: "Work Location" },
      { headerName: "Joining Date", field: "expectedJoiningDate", minWidth: 120, cellRenderer: this.formatDate },
      { headerName: "Offer Letter", field: "department", minWidth: 120, cellRendererFramework: DownloadOffer },
      { headerName: "Hiring Type", field: "hiringType", minWidth: 140 },
      { headerName: "Hiring Manager", field: "hiringManager", minWidth: 170, unSortIcon: true, tooltipField: "hiringManager", headerTooltip: "Hiring Manager" },
      { headerName: "Created Date", field: "offerCreationTimeStamp", minWidth: 150, cellRenderer: this.formatDate }
    ];
    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: [],
      enableSorting: true,
      rowSelection: 'single',
      getRowStyle: function (params: any) {
        if (params.data.isFasttrack) {
          return {
            'color': 'rgb(69, 135, 255)'
          };
        }
        return null;
      }
    };
    this.statusOptions = [];
    this.status = "ALL";
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
      //rowCount: ???, - not setting the row count, infinite paging will be used
      getRows: function (params: any) {
        // this code should contact the server for rows. however for the purposes of the demo,
        // the data is generated locally, a timer is used to give the experience of
        // an asynchronous call
        setTimeout(function () {
          // take a chunk of the array, matching the start and finish times
          var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
          // see if we have come to the last page. if we have, set lastRow to
          // the very last row of the last page. if you are getting data from
          // a server, lastRow could be returned separately if the lastRow
          // is not in the current page.
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
    const self = this;
    this.assignExecutiveService.getCombos().subscribe(data => {
      self.statusOptions = data['OFFER_STATUS'];
      self.loadGrid();
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  filterChanged(){
    this.pageNum = 0;
    this.loadGrid();
  }
  loadGrid() {
    var self = this;
    self.resetButtonModes();
    self.loaderService.showLoading();
    this.offersDataService.getAllOffersByFilters(this.pageNum, this.pageSize, this.status).subscribe(data => {
      self.setRowData(data['content']);
      self.recordsCount = data.totalElements;
      self.totalPages = data.totalPages;
      self.loaderService.hideLoading();
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
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
            }],
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
      }else if(opCode == 'CANCEL'){
        payload = {
          'cancellationComments': reason
        };
      }else{
        payload = null;
      }
      this.offersDataService.submitOffer(hiringId, hiringNeedId, id, opCode, payload).subscribe(data => {
        if (data.status == 200) {
          self.successMessage = (opCode == 'APPROVE') ? 'Offer approved successfully' : 'Offer submitted successfully';
          if (opCode == 'RELEASE') {
            self.successMessage = 'Offer released successfully';
          } else if (opCode == 'REJECT') {
            self.successMessage = 'Offer rejected successfully';
          }else if(opCode == 'CANCEL') {
            self.successMessage = 'Offer cancelled successfully';
          }
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }],
        ).subscribe(result => {
              this.loadGrid();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  byPassApproval(reason: string) {
    var selectedRecords = this.gridOptions.api.getSelectedRows(), self = this;
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['offerId'],
        hiringId = selectedRecords[0]['hiringRequestId'],
        hiringNeedId = selectedRecords[0]['needId'],
        opCode = 'APPROVE_WITH_BYPASS',
        payload = {
          'bypassOfferApprovalComments': reason
        };
      self.loaderService.showLoading();
      this.offersDataService.byPassCPOApproval(hiringId, hiringNeedId, id, opCode, payload).subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Offer approved successfully';
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
      this.buttonModes['open'] = false;
      this.buttonModes['view'] = (status == 'DRAFT') ? true : false;
      this.buttonModes['submit'] = (status == 'DRAFT') ? false : true;
      this.buttonModes['approve'] = (status == 'IN_REVIEW' || status == 'REJECTED') ? false : true;
      this.buttonModes['reject'] = (status == 'IN_REVIEW' || status == 'APPROVED') ? false : true;
      this.buttonModes['byPassApproval'] = (status == 'DRAFT' || status == 'IN_REVIEW' || status == 'DECLINED' ) ? false : true;
      this.buttonModes['edit'] = (status == 'ACCEPTED' || status == 'CANCELLED' || status == 'DELETED' ) ? true : false;
      this.buttonModes['delete'] = (status == 'ACCEPTED' || status == 'CANCELLED' || status == 'DELETED') ? true : false;
      this.buttonModes['release'] = (status == 'APPROVED') ? false : true;
      this.buttonModes['cancel'] = (status == 'UNDER_NEGOTIATION' || status == 'EXPIRED') ? false : true;
    }else{
      this.resetButtonModes();
    }
  }
  exportData() {
    var self = this;
    setTimeout(() => {
      self.offersDataService.exportOffers(self.status).subscribe(data => {
        self.commonService.downloadCsv('All Offers', data['_body']);
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  ngOnInit() {
    this.resetButtonModes();
  }
  resetButtonModes() {
    this.buttonModes = {
      edit: true,
      delete: true,
      submit: true,
      approve: true,
      reject: true,
      byPassApproval: true,
      view: true,
      open: true,
      release: true,
      cancel: true
    };
  }
}