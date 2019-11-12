import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { LoaderService } from '../../../shared/services/loader.service';
import { UtilService } from '../../../util.service';
import { CommonService } from '../../../shared/services/common.service';
import { ManagerService } from '../manager.service';
import { DialogService } from '../../../shared/dialogs/dialog.service';
import { Router } from '@angular/router';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';

@Component({
  selector: 'app-workstation-request',
  templateUrl: './workstation-request.component.html',
  styleUrls: ['./workstation-request.component.scss']
})
export class WorkstationRequestComponent implements OnInit, OnDestroy {

  workstationData: any[] = [];
  rawDataWorkstations: any[];
  rawDataLocations: any;
  originalData: any;
  isLoaded = false;
  btnText: any;
  navigationData: any;
  src = '../../../assets/face.svg';
  workstationDataSource: any;
  workstationRequestColumns: string[] = ['workstation', 'availiability', 'selected'];
  employeeObject: any;
  isEditing = false;
  selectedText: any;
  selectedIndex: any;
  disableClass = true;
  commentsText: any;
  submitObj: any;
  location: any[] = [];
  building: any[] = [];
  allocationData: any;
  lastSelected: any;
  originalAllocationData: any;
  edit: boolean;
  public selectedLocation: any;
  public selectedBuilding: any;

  allComments = [];

  constructor(
    public commonService: CommonService,
    private cd: ChangeDetectorRef,
    private loaderService: LoaderService,
    private utilService: UtilService,
    private managerService: ManagerService,
    private dialogService: DialogService,
    private router: Router,
    private errorHandleService: ErrorHandleService
  ) { }

  ngOnInit() {
    if (this.src && localStorage.getItem('request')) {
      this.navigationData = JSON.parse(localStorage.getItem('request'));
      this.getPrevAllocDetails('api/q/onboarding/adminItRequest/' + this.navigationData.prospectId + '?view=Admin');
      this.employeeObject = {
        info: [
          {
            attr: 'Joining Date',
            val: this.utilService.epochToDate(this.navigationData.joiningDate),
            cols: 2
          },
          {
            attr: 'Job Status',
            val: this.navigationData.jobStatus,
            cols: 2
          }
        ],
        name: this.navigationData.joinee,
        id: this.navigationData.employeeCode ? this.navigationData.employeeCode : 'Not Available',
        image_path: this.src,
        cols: 16
      };
    }
  }
  ngOnDestroy() {
    localStorage.removeItem('request');
  }
  uncheck(k: number, unselect: any) {
    if (this.workstationData[k - 1].status === 1) {
      this.workstationData[k - 1].availiability = 'Available Stations';
      this.workstationData[k - 1].selected = false;
      if (unselect === true) {
        this.clearText();
      }
      this.disableClass = false;
      this.cd.detectChanges();
    } else if (this.workstationData[k - 1].status === 2) {
      this.workstationData[k - 1].availiability = 'Not Available';
      this.workstationData[k - 1].selected = false;
      if (unselect === true) {
        this.clearText();
      }
      this.disableClass = true;
      this.cd.detectChanges();
    }
  }
  clearText() {
    this.selectedText = null;
    this.lastSelected = null;
    this.cd.detectChanges();
  }
  checkSelected(k: number) {
    // let i: number;
    /* for (i = 0; i < this.workstationData.length; i++) {
        if ((this.workstationData[i].availiability !== 'Not Available')) {
          if (this.workstationData[i].index === k) {
              this.workstationData[i].availiability = 'Selected';
              this.workstationData[i].selected = true;
              this.selectedText = this.workstationData[k - 1].workstation;
              this.selectedIndex = i;
              this.disableClass = false;
              this.cd.detectChanges();
          } else if (this.workstationData[i].status === 1) {
              this.workstationData[i].availiability = 'Available Stations';
              this.workstationData[i].selected = false;
          } else if (this.workstationData[i].status === 2) {
            this.workstationData[i].availiability = 'Not Available';
            this.workstationData[i].selected = false;
          }
        }
    } */
    this.workstationData[k - 1].availiability = 'Selected';
    this.workstationData[k - 1].selected = true;
    this.selectedText = this.workstationData[k - 1].workstation;
    this.selectedIndex = k - 1;
    this.disableClass = false;
    /* if (this.workstationData[this.lastSelected].status === 1) {
      this.workstationData[this.lastSelected].availiability = 'Available Stations';
    } else if (this.workstationData[this.lastSelected].status === 2) {
      this.workstationData[this.lastSelected].availiability = 'Not Available';
    }
    this.workstationData[this.lastSelected].selected = false; */
    this.uncheck(this.lastSelected, false);
    this.cd.detectChanges();
    this.lastSelected = k;
  }
  getPrevAllocDetails(url: any) {
    this.loaderService.showLoading();
    this.managerService.getService(url)
    .subscribe(data => {
      this.originalAllocationData = data;
      if (data.workStationNum) {
        this.allocationData = data;
        this.btnText = 'Edit';
      } else {
        this.btnText = 'Allocate';
      }
      if (this.originalAllocationData.comments && this.originalAllocationData.comments[0]) {
        this.allComments = this.originalAllocationData.comments;
      }
      this.loaderService.hideLoading();
      if ((this.btnText === 'Edit') && (this.navigationData.joiningDate < this.originalAllocationData.currentTime)) {
        this.edit = false;
      } else {
        this.edit = true;
        this.getLocationDetails('api/core/clientLocations');
      }
    }, error => {
      this.errorHandleService.handleErrors(error);
    });
  }
  getWorkstationLists(url: any) {
    this.loaderService.showLoading();
    this.managerService.getService(url)
    .subscribe(data => {
        this.rawDataWorkstations = data;
        this.refineWSContents(this.rawDataWorkstations);
        this.loaderService.hideLoading();
    }, error => {
      this.errorHandleService.handleErrors(error);
    });
  }
  getLocationDetails(url: any) {
    this.loaderService.showLoading();
    this.managerService.getService(url)
    .subscribe(data => {
      this.originalData = data;
      this.rawDataLocations = data;
      this.getSelectedLocationDetails(this.rawDataLocations);
      this.loaderService.hideLoading();
      this.getWorkstationLists('api/q/onboarding/workStationDetails?clientId=' + this.navigationData.workLocationId);
    }, error => {
      this.errorHandleService.handleErrors(error);
    });
  }
  applyFilter(filterValue: string) {
    const tableFilters = [];
      tableFilters.push({
        id: 'workstation',
        value: filterValue
      });
      this.workstationDataSource.filter = JSON.stringify(tableFilters);
  }
  getSelectedLocationDetails(obj: any) {
    let i, j;
    this.location = Object.keys(obj).map(function(place) {
      return { value: place, viewValue: place };
    });
    this.building = [];
    for (i = 0; i < this.location.length; i++) {
      for (j = 0; j < obj[this.location[i].value].length; j++) {
        if (obj[this.location[i].value][j].locationId === this.navigationData.workLocationId) {
          this.selectedLocation = this.location[i].value;
          this.selectedBuilding = obj[this.selectedLocation][j].clientLocationName;
          return;
        }
      }
    }
  }
  showSelectedValues(data: any) {
    const tableFilters = [];
    tableFilters.push({
      id: 'availiability',
      value: data
    });
    this.workstationDataSource.filter = JSON.stringify(tableFilters);
  }
  addComment() {
    if (this.selectedText) {
      this.isEditing = true;
    }
  }
  refineWSContents(obj: any) {
    if (obj.length === 0) {
      this.workstationData = [];
    }
    for (let i = 0; i < obj.length; i++) {
      this.workstationData[i] = {};
      this.workstationData[i].index = i + 1;
      this.workstationData[i].workstation = 'Workstation ' + obj[i].workStationNum;
      this.workstationData[i].workIndex = obj[i];
      this.workstationData[i].selected = false;
      if (obj[i].status === 1) {
        this.workstationData[i].availiability = 'Available Stations';
      } else if (obj[i].status === 2) {
        this.workstationData[i].availiability = 'Not Available';
      }
      this.workstationData[i].status = obj[i].status;
      if (this.originalAllocationData && this.workstationData[i].workstation === 'Workstation '
      + this.originalAllocationData.workStationNum) {
        this.lastSelected = i + 1;
        this.workstationData[i].availiability = 'Selected';
        this.workstationData[i].selected = true;
        this.selectedText = this.workstationData[i].workstation;
        this.selectedIndex = i;
        this.disableClass = false;
        this.cd.detectChanges();
      }
    }
    this.isLoaded = true;
    this.workstationDataSource = new MatTableDataSource(this.workstationData);
    this.workstationDataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);

      filters.forEach(filter => {
        const val = data[filter.id] === null ? '' : data[filter.id];
        matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
      });
        return matchFilter.every(Boolean);
    };
  }
  cancel() {
    this.isEditing = false;
    this.commentsText = null;
  }
  saveDialog() {
    // if (!this.selectedText) {
      this.dialogService.render(
        [{
            title: 'Warning',
            message: 'Are you sure you want to proceed without selecting workstation?',
            yesLabel: 'Yes',
            noLabel: 'No'
        }]
      ).subscribe(result => {
        if (result === true) {
          this.save();
        }
      });
    /* } else {
      this.save();
    } */
  }
  save() {
    if (this.btnText === 'Allocate') {
      this.submitObj = {
        'prospectId': this.navigationData.prospectId,
        'workStationLocationId': this.navigationData.workLocationId,
        'workStationNum': this.selectedText.split(' ')[1],
        'comments': (this.commentsText !== '') ? this.commentsText : null,
        'dateOfJoining': this.navigationData.joiningDate,
        'name': this.navigationData.joinee,
        'allocationType': 'Allocate'
      };
      this.managerService.postService('api/c/onboarding/adminItRequest', this.submitObj).subscribe(data => {
        this.loaderService.hideLoading();
        this.dialogService.render(
          [{
              title: 'Success',
              message: 'Workstation requested successfully',
              yesLabel: 'OK'
          }]
        ).subscribe(result => {
          const redirect: any = 'manager/managerinfo';
          this.router.navigate([redirect]);
        });
      }, error => {
        this.errorHandleService.handleErrors(error);
      });
    } else if (this.btnText === 'Edit'
    && this.selectedText !== 'Workstation ' + this.originalAllocationData.workStationNum) {
      this.submitObj = {
        'prospectId': this.navigationData.prospectId,
        'workStationLocationId': this.navigationData.workLocationId,
        'workStationNum': this.selectedText.split(' ')[1],
        'comments':  (this.commentsText !== '') ? this.commentsText : null,
        'dateOfJoining': this.navigationData.joiningDate,
        'name': this.navigationData.joinee
      };
      this.managerService.postService('api/c/onboarding/adminItRequest', this.submitObj).subscribe(data => {
        this.loaderService.hideLoading();
        this.dialogService.render(
          [{
              title: 'Success',
              message: 'Workstation requested successfully',
              yesLabel: 'OK'
          }]
        ).subscribe(result => {
          const redirect: any = 'manager/managerinfo';
          this.router.navigate([redirect]);
        });
      }, error => {
        this.errorHandleService.handleErrors(error);
      });
    } else {
      this.dialogService.render(
        [{
            title: 'Error',
            message: 'You have already requested this workstation. Please select a different one',
            yesLabel: 'OK'
        }]
      ).subscribe(result => {
        this.cancel();
      });
    }
  }
  navigateToRequests() {
    const redirect: any = '/manager/managerinfo';
    this.router.navigate([redirect]);
  }
}
