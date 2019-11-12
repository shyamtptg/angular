import { HiringComponent } from './../../hiring.component';
import { Component, Input, ViewEncapsulation, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Tab } from '../../../../shared/tablist/tab';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { CommonService } from '../../../../shared/services/common.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { GridOptions } from 'ag-grid/main';
import 'ag-grid-angular/main';
import { AddProfileDataService } from '../../recruiter/addprofile/add-profile.service';
import { NewHiringRequestDataService1 } from '../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { OffersDataService } from '../offers/offers.service';
import { SearchService } from '../../recruiter/profiles/search/search.service';
import { AppConstants } from '../../../../config/app.constants';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

var FileSaver = require('filesaver.js-npm');
@Component({
  templateUrl: './fast-track-offer.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FastTrackOffer {
  @ViewChild('existingHiringDetails') existingHiringDetails: ElementRef;
  @ViewChild('newHiringDetails') newHiringDetails: ElementRef;
  @ViewChild('existProspect') existProspect: ElementRef;
  @ViewChild('newProspect') newProspect: ElementRef;
  @ViewChild('newHiringNext') newHiringNext: ElementRef;
  @ViewChild('existingHiringNext') existingHiringNext: ElementRef;
  @ViewChild('newHiringRadio') newHiringRadio: ElementRef;
  @ViewChild('existingHiringRadio') existingHiringRadio: ElementRef;
  @ViewChild('existingProspectRadio') existingProspectRadio: ElementRef;
  @ViewChild('newProspectRadio') newProspectRadio: ElementRef;
  @ViewChild('newProspectNext') newProspectNext: ElementRef;
  @ViewChild('existingProspectNext') existingProspectNext: ElementRef;
  @ViewChild('tablist') tablist: any;
  public priorityOptions: any[];
  public statusOptions: any[];
  public priority: string;
  public status: string;
  public comboData: any = {};
  public prospectComboData: any = {};
  public today: any = new Date();
  public yesterday: any;
  public offerexpirydate: boolean = true;
  public hide: boolean = false;
  public eHide: boolean = false;
  currentDoj: any = new Date();
  data: any;
  recordNotSelected: boolean = false;
  successMessage: string;
  columnDefs: any;
  hiringColumnDefs: any;
  gridOptions: GridOptions;
  hiringGridOptions: GridOptions;
  allOfTheData: any;
  allHiringData: any;
  totalProfiles: number = 0;
  sendTitle: any = "Notify Candidate";
  sendId: any = "notifyCandidate";
  hiringRequestId: any;
  hiringRequestNeedId: any;
  pageNum: number = 0;
  pageSize: number = 15;
  totalPages: number;
  searchData: SearchModel;
  newProspectData: any = {};
  newHiringData: any = {};
  offerDetails: any = {};
  hiringManagerOptions: any;
  hiringRequestOptions: any;
  hiringNeedOptions: any;
  ctcToWord: string;
  etcToWord: string;
  octcToWord: string;
  desigSuffix: any;
  annexure: any = { 'value': '' };
  uploader: FileUploader = new FileUploader({ url: this.appConstants.getConstants().myspacenxApiUrl + '/prospects', authToken: "Basic dXNlcjpjaGFuZHJh", authTokenHeader: "Authorization" });
  file: File;
  fastrackDetails: any = {
    "hiringRequestDetails": {
      "need": {}
    },
    "prospectDetails": {},
    "offerDetails": {}
  };
  configList: any = [];
  addons: any;
  paymentPeriods: any;
  lineItems: any = [];
  paymentPeriodMap: any = [];
  hiringNext: boolean = true;
  prospectNext: boolean = true;
  viewHiring: boolean = true;
  viewProspect: boolean = true;
  prospectId: string;
  constructor(
    private addProfileDataService: AddProfileDataService,
    private hiringRequestDataService: NewHiringRequestDataService1,
    private offersDataService: OffersDataService,
    private searchService: SearchService,
    private hiringComponent: HiringComponent,
    private router: Router,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private appConstants: AppConstants,
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
    this.data = {};
    this.comboData = {
      employmenttype: [],
      documenttype: [],
      noticeperiod: [],
      prospectSource: []
    };
    this.gridOptions = <GridOptions>{};
    this.hiringGridOptions = <GridOptions>{};
    this.hiringComponent.URLtitle = "Offers / FastTrackOffer";
    this.columnDefs = [
      { headerName: "Candidate Name", field: "firstName", minWidth: 260, cellClass: 'grid-align', cellRenderer: this.formatName },
      { headerName: "Relevant Experience", field: "relevantExperience", minWidth: 200, cellClass: 'grid-align' },
      { headerName: "Email", field: "email", minWidth: 220, cellClass: 'grid-align' },
      { headerName: "Mobile Number", field: "mobileNumber", minWidth: 220, unSortIcon: true },
      { headerName: "Notice Period", field: "noticePeriod", minWidth: 260, cellClass: 'grid-align' }
    ];
    this.hiringColumnDefs = [
      { headerName: "Purpose", field: "purpose", minWidth: 250, cellClass: 'grid-align' },
      { headerName: "Client", field: "clientName", minWidth: 200, cellClass: 'grid-align' },
      { headerName: "Hiring Manager", field: "hiringManager", minWidth: 200, cellClass: 'grid-align' },
      { headerName: "Hiring Type", field: "typeDisplayName", minWidth: 200, cellClass: 'grid-align' },
      { headerName: "Priority", field: "priorityDisplayName", minWidth: 200, cellClass: 'grid-align' }
    ];
    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: [
      ],
      enableSorting: true,
      rowSelection: 'single',
      //rowModelType: 'infinite'
    };
    this.hiringGridOptions = {
      columnDefs: this.hiringColumnDefs,
      rowData: [
      ],
      enableSorting: true,
      rowSelection: 'single',
      //rowModelType: 'infinite'
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
  ngOnInit() {
    var self = this;
    self.offerDetails.reportingTime = "10:00 am";
    self.offerDetails.signature = self.commonService.hrSignature;
    self.offerDetails.officeAddress = self.commonService.officeAddress;
    self.addProfileDataService.getProspectComboDetails().subscribe(data => {
      self.prospectComboData = {
        noticeperiod: data['NOTICE_PERIOD']
      };
      self.newProspectData.noticePeriod = 'THREE_MONTHS';
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
    self.hiringRequestDataService.getHiringComboDetails().subscribe(data => {
      self.comboData = {
        hiringForOptions: data['HIRING_REASON'],
        clientNameOptions: data['CLIENT'],
        deptOptions: data['DEPARTMENT'],
        workLocation: data['CLIENT'],
        designation: data['DESIGNATION'],
        practice: [],
        competency: []
      };
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
    self.hiringRequestDataService.getHiringManagers().subscribe(data => {
      self.hiringManagerOptions = data['_embedded']['employees'];
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
    self.addProfileDataService.getHiringRequests(this.pageNum, this.pageSize).subscribe(data => {
      if (data['content']) {
        /*var activeRequests: any = [];
         data['content'].forEach(function(elem: any, ind: any){
           if(elem.status == 'ACTIVE'){
             activeRequests.push(elem);
           }
         });
         self.hiringRequestOptions = activeRequests;*/
        self.hiringRequestOptions = data['content'];
        self.hiringRequestId = "";
        //self.setHiringData(activeRequests);
      }
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
    self.offersDataService.getCTCAddons().subscribe(data => {
      self.addons = data['addons'];
      self.paymentPeriods = data['paymentPeriods'];
      self.lineItems = self.createLineItems(data['addons']['lineItems']);
      self.paymentPeriodMap = self.createPaymentMap(data['paymentPeriods']);
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  onBlurMethod(event: any) {
    this.offerexpirydate = false;
    this.currentDoj = new Date(event);
    this.yesterday = new Date(event);
    this.yesterday = new Date(this.yesterday.setDate(this.offerDetails.expecJoiningDate.getDate() - 1));
    this.offerDetails.expDate = null;
    setTimeout(() => this.offerexpirydate = true, 300);
  }
  setDatesForExpiry(event: any) {
    if (this.offerDetails.expecJoiningDate) {
      this.yesterday = this.currentDoj;
      this.yesterday = new Date(this.yesterday.setDate(this.offerDetails.expecJoiningDate.getDate() - 1));
    }
  }
  loadNeedsByHiringId() {
    var hiringId = this.hiringRequestId, self = this;
    if (hiringId) {
      self.hiringRequestDataService.getNeedsByHiringId(hiringId).subscribe(data => {
        self.hiringNeedOptions = data;
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
      self.hiringRequestNeedId = '';
    }
  }
  formatName(res: any) {
    var firstName: string = res.data.firstName,
      lastName: string = res.data.lastName;
    if (firstName && lastName) {
      return firstName + ' ' + lastName;
    }
  }
  enableView() {
    this.viewHiring = false;
  }
  ngOnDestroy() {
    //$('.sidebar-menu').height('100%');
  }
  ngAfterViewChecked() {
    //var contentHeight = $('.content-wrapper').height();
    //$('.sidebar-menu').height(contentHeight+15);
    var prospectDetails = this.tablist.getTabByTitle('Prospect Details'),
      offerDetails = this.tablist.getTabByTitle('Offer Details');
    if (this.newHiringRadio.nativeElement.checked) {
      if (this.newHiringNext.nativeElement.disabled) {
        prospectDetails[0]['disabled'] = true;
        offerDetails[0]['disabled'] = true;
      } else {
        prospectDetails[0]['disabled'] = false;
        offerDetails[0]['disabled'] = false;
      }
    } else if (this.existingHiringRadio.nativeElement.checked) {
      if (this.existingHiringNext.nativeElement.disabled) {
        prospectDetails[0]['disabled'] = true;
        offerDetails[0]['disabled'] = true;
      } else {
        prospectDetails[0]['disabled'] = false;
        offerDetails[0]['disabled'] = false;
      }
    }
    if ((this.existingHiringRadio.nativeElement.checked && this.existingHiringNext.nativeElement.disabled) || (this.newHiringRadio.nativeElement.checked && this.newHiringNext.nativeElement.disabled) || (this.newProspectRadio.nativeElement.checked && this.newProspectNext.nativeElement.disabled) || (this.existingProspectRadio.nativeElement.checked && this.existingProspectNext.nativeElement.disabled)) {
      offerDetails[0]['disabled'] = true;
    } else {
      offerDetails[0]['disabled'] = false;
    }
  }
  tabSelect(currentTab: Tab) {
    var title = currentTab['title'],
      self = this;

  }
  onSelectionChange(event: any) {
    if (event.target.value == 1) {
      this.existProspect.nativeElement.hidden = false;
      this.newProspect.nativeElement.hidden = true;
    }
    else {
      this.existProspect.nativeElement.hidden = true;
      this.newProspect.nativeElement.hidden = false;
    }
  }
  getTime(date: any) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    this.offerDetails.reportingTime = strTime;
    // return strTime;
  }
  getDate(date: any) {
    date = new Date(date);
    return date.toDateString();
  }
  uploadFile(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      (<HTMLInputElement>document.getElementById('resumeNamePreview')).value = this.file.name;
    }
  }
  getDateString(date: any) {
    var mm: any = date.getMonth() + 1;
    var dd: any = date.getDate();
    var dateString: any = [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
    return dateString;
  }
  checkExpiryDate() {
    var offerDetails: any = this.offerDetails, self = this;
    if (offerDetails.expiryGracePeriod && offerDetails.expecJoiningDate && offerDetails.expDate) {
      var graceDays = offerDetails.expiryGracePeriod, joiningDate = new Date(self.getDateString(offerDetails.expecJoiningDate)), expiryDate = offerDetails.expDate;
      var maxExpiry = new Date(self.getDateString(expiryDate));
      maxExpiry.setDate(maxExpiry.getDate() + parseInt(graceDays));
      if (maxExpiry.getTime() > joiningDate.getTime()) {
        offerDetails.expiryGracePeriod = '';
        this.dialogService.render(
          [{
            title: 'Error',
            message: 'Offer Expiry Date and Expiry Grace period combination should not exceed the Date of Joining',
            yesLabel: 'OK'
          }]
        );
      }
    }
  }
  restrictMobilenumber(event: any) {
    return this.commonService.restrictMobilenumber(event);
  }
  restrictFloatnumber(e: any) {
    return this.commonService.restrictFloatnumber(e);
  }
  restrictCharcters(value: any) {
    this.commonService.restrictCharcters(value);
  }
  convertToWords(value: number, ctc: string) {
    if (ctc == "ctc") {
      if (value && this.commonService.convertNumberToWords(value)) {
        this.ctcToWord = this.commonService.convertNumberToWords(value) + " Rupees";
      }
      else {
        this.ctcToWord = '';
      }
    }
    else if (ctc == "octc") {
      if (value && this.commonService.convertNumberToWords(value)) {
        this.octcToWord = this.commonService.convertNumberToWords(value) + " Rupees";
      }
      else {
        this.octcToWord = '';
      }
    }
    else {
      if (value && this.commonService.convertNumberToWords(value)) {
        this.etcToWord = this.commonService.convertNumberToWords(value) + " Rupees";
      }
      else {
        this.etcToWord = '';
      }
    }
  }

  onCellClicked(value: any) {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      this.prospectId = selectedRecords[0]['prospectId'];
      this.viewProspect = false;
    }
    this.enableProspectNext();
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
    // this.gridOptions.api.setDatasource(dataSource);
  }
  createHiringDatasource() {
    if (!this.allHiringData) {
      return;
    }
    this.gridOptions.api.showLoadingOverlay();
    var allHiringData = this.allHiringData,
      self = this;
    var dataSource = {
      getRows: function (params: any) {
        setTimeout(function () {
          var rowsThisPage = allHiringData.slice(params.startRow, params.endRow);
          var lastRow = -1;
          if (allHiringData.length <= params.endRow) {
            lastRow = allHiringData.length;
          }
          params.successCallback(rowsThisPage, lastRow);
          self.gridOptions.api.hideOverlay();
          if (allHiringData.length == 0) {
            self.hiringGridOptions.api.showNoRowsOverlay();
          }
        }, 500);
      }
    };
    this.hiringGridOptions.api.setDatasource(dataSource);
  }

  resizeColumns() {
    this.gridOptions.api.sizeColumnsToFit();
  }
  onGridInitialize() {
    this.resizeColumns();
    // this.loadGrid();
  }
  setRowData(rowData: any) {
    this.allOfTheData = rowData;
    this.createNewDatasource();
  }
  setHiringData(rowData: any) {
    this.allHiringData = rowData;
    this.createHiringDatasource();
  }
  showProspectTimeline() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(), id;
    if (selectedRecords.length > 0) {
      id = selectedRecords[0]['id'];
      this.router.navigate(['hiring/profiles/prospect-timeline', id]);
    }
  }
  showOrHideDetails(event: any) {
    if (event.target.value == 2) {
      this.newHiringDetails.nativeElement.hidden = false;
      this.existingHiringDetails.nativeElement.hidden = true;
    } else {
      this.newHiringDetails.nativeElement.hidden = true;
      this.existingHiringDetails.nativeElement.hidden = false;
    }
  }
  navigateToNext() {
    var activeTab = this.tablist.getCurrentTab(),
      title = activeTab[0]['title'],
      tabs = ['Purpose', 'Prospect Details', 'Offer Details'],
      index = tabs.indexOf(title);
    activeTab[0]['active'] = false;
    if (index == tabs.length - 1) {
      this.tablist.getAllTabs()[0]['active'] = true;
    } else {
      this.tablist.getAllTabs()[index + 1]['active'] = true;
    }
  }
  navigateToPrevious() {
    var activeTab = this.tablist.getCurrentTab(),
      title = activeTab[0]['title'],
      tabs = ['Purpose', 'Prospect Details', 'Offer Details'],
      index = tabs.indexOf(title);
    activeTab[0]['active'] = false;
    if (index == 0) {
      this.tablist.getAllTabs()[tabs.length - 1]['active'] = true;
    } else {
      this.tablist.getAllTabs()[index - 1]['active'] = true;
    }
  }
  loadPracticesByDepartment() {
    var depId = this.newHiringData.depId;
    this.comboData['practice'] = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
    this.newHiringData.pracId = "";
    this.comboData.competency = [];
  }
  loadCompetenciesByPractice() {
    var practiceId = this.newHiringData.pracId;
    this.comboData.competency = this.hiringRequestDataService.getPracticeMap()['pracCompetencies'][practiceId];
    this.newHiringData.compId = "";
  }
  createPaymentMap(periods: any) {
    var periodMap: any = {};
    periods.forEach(function (elem: any, ind: any) {
      periodMap[elem.code] = elem;
    });
    return periodMap;
  }
  createLineItems(lineItems: any) {
    var lineItemsList: any = [];
    for (var key in lineItems) {
      if (lineItems.hasOwnProperty(key)) {
        lineItemsList.push({
          'code': lineItems[key]['code'],
          'description': lineItems[key]['description']
        });
      }
    }
    return lineItemsList;
  }
  addLineItem() {
    this.configList.push({
      "paymentPeriod": {
        "code": null
      }
    });
  }
  deleteLineItem(rowIndex: any) {
    this.configList.splice(rowIndex, 1);
  }
  getAddOnPayload(configList: any) {
    var self = this;
    configList.forEach(function (elem: any, ind: any) {
      if (!elem.code || !elem.paymentPeriod.code || !elem.amount) {
        configList = 'invalid';
        return;
      }
      elem['description'] = self.addons.lineItems[elem.code]['description'];
      elem['includeInCtc'] = self.addons.lineItems[elem.code]['includeInCtc'];
      elem['category'] = self.addons.lineItems[elem.code]['category'];
      elem['paymentPeriod']['description'] = self.paymentPeriodMap[elem.paymentPeriod.code]['description'];
    });
    return configList;
  }
  saveFastrackOffer() {
    var hiringData: any = {}, prospectData: any = {}, payload: any,
      hiringPayload: any = {}, prospectPayload: any = {}, self = this;
    if (this.existingHiringRadio.nativeElement.checked) {
      hiringData['hiringId'] = this.hiringRequestId;
      hiringData['needId'] = this.hiringRequestNeedId;
    } else if (this.newHiringRadio.nativeElement.checked) {
      hiringData = this.newHiringData;
    }
    if (this.existingProspectRadio.nativeElement.checked) {
      var selectedRecords = this.gridOptions.api.getSelectedRows();
      if (selectedRecords.length > 0) {
        prospectData['id'] = selectedRecords[0]['prospectId'];
      }
    } else if (this.newProspectRadio.nativeElement.checked) {
      prospectData = this.newProspectData;
    }
    if (hiringData.hiringId) {
      hiringPayload = {
        "id": hiringData.hiringId,
        "need": {
          "id": hiringData.needId
        }
      };
    } else {
      hiringPayload = {
        "purpose": hiringData.purpose,
        "departmentId": hiringData.depId,
        "hiringManagerId": hiringData.hiringManagerId,
        "clientId": hiringData.clientId,
        "expectedStartDate": new Date(hiringData.expectedStartDate).getTime(),
        "need": {
          "purpose": hiringData.purpose,
          "practiceId": hiringData.pracId,
          "competencyId": hiringData.compId,
          "workLocationId": hiringData.clientId
        }
      };
    }
    if (prospectData.id) {
      prospectPayload = {
        "id": prospectData.id
      };
    } else {
      prospectData['relevantExperience'] = prospectData['totalExperience'];
      prospectPayload = prospectData;
    }
    payload = {
      "hiringRequestDetails": hiringPayload,
      "prospectDetails": prospectPayload,
      "offerDetails": this.getOfferPayload(this.offerDetails)
    };
    if (payload['offerDetails'] == 'invalid') {
      this.dialogService.render(
        [{
          title: 'Warning',
          message: 'Please fill the details for CTC line item',
          yesLabel: 'OK'
        }]
      );
      return;
    }
    if (prospectData.id) {
      payload['offerDetails']['prospectId'] = prospectData.id;
    }
    self.loaderService.showLoading();
    this.offersDataService.saveFastrackOffer(payload, this.file).subscribe(data => {
      if (data.status == 201) {
        self.successMessage = 'Fastrack offer created successfully';
        self.loaderService.hideLoading();
        this.dialogService.render(
          [{
            title: 'Success',
            message: self.successMessage,
            yesLabel: 'OK'
          }],
        ).subscribe(result => {

          this.navigateToOffers();

        });
      }
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  getOfferPayload(offerDetails: any) {
    var lineItemPayload = this.getAddOnPayload(this.configList), payload: any;
    if (lineItemPayload == 'invalid') {
      return 'invalid';
    }
    payload = {
      lineItems: lineItemPayload,
      designationSuffix: this.desigSuffix,
      annexure: this.annexure['value']
    };
    //var profileDetails: any = this.offersDataService.prospectDetails, self = this;
    //offerDetails.prospectId = profileDetails.prospectId;
    offerDetails.expectedJoiningDate = new Date(offerDetails.expecJoiningDate).getTime();
    offerDetails.expiryDate = new Date(offerDetails.expDate).getTime();
    offerDetails.configurationSettings = JSON.stringify(payload);
    return offerDetails;
  }
  enableNext() {
    if (this.hiringRequestNeedId) {
      this.hiringNext = false;
      this.enableView();
    }
  }
  enableProspectNext() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(), id;
    if (selectedRecords.length > 0) {
      this.prospectNext = false;
    } else {
      this.prospectNext = true;
    }
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
    var keys = Object.keys(data);
    (keys).forEach(key => {
      if (data[key]) {
        this.data[key] = data[key];
        this.data["documentType"] = "RESUME";
      }
    })
    this.searchService.searchProfileData(this.pageNum, this.pageSize, this.data).subscribe(res => {
      if (res["content"].length > 0) {
        this.totalProfiles = res["content"].length;
        this.setRowData(res["content"]);
        this.totalPages = res.totalPages;
        this.enableProspectNext();
        this.data = {};
      } else {
        this.totalPages = 0;
        this.totalProfiles = 0;
        this.setRowData([]);
      }
    }, error => {
      this.errorHandleService.handleErrors(error);
    });
  }
  navigateToOffers() {
    this.router.navigate(['../hiring/offers/all']);
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