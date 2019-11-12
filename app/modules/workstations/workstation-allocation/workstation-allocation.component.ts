import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkstationsService } from '../workstations.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { UtilService } from '../../../util.service';
import { CommonService } from '../../../shared/services/common.service';
import { DialogService } from '../../../shared/dialogs/dialog.service';
import { Router } from '@angular/router';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';

@Component({
  selector: 'app-workstation-allocation',
  templateUrl: './workstation-allocation.component.html',
  styleUrls: ['./workstation-allocation.component.scss']
})
export class WorkstationAllocationComponent implements OnInit, OnDestroy {
    workstationData: any[] = [];
    rawDataWorkstations: any[];
    rawDataLocations: any;
    originalData: any;
    isLoaded = false;
    previouscomment = [];
    btnText: any;
    src = '../../../assets/face.svg';
    workstationDataSource: any;
    workstationDataColumns: string[] = ['workstation', 'availiability', 'selected'];
    buildingValues: any[];
    employeeObject: any;
    dataObject: any;
    sub: any;
    isEditing = false;
    selectedText: any;
    selectedIndex: any;
    disableClass = true;
    commentsText: any;
    submitObj: any;
    searchText: any;
    location: any[] = [];
    building: any[] = [];
    public selectedLocation: any;
    public selectedBuilding: any;

    constructor(
      public commonService: CommonService,
      private cd: ChangeDetectorRef,
      private loaderService: LoaderService,
      private utilService: UtilService,
      private workstationsService: WorkstationsService,
      private dialogService: DialogService,
      private router: Router,
      private errorHandleService: ErrorHandleService
    ) { }

    ngOnInit() {
      this.sub = JSON.parse(localStorage.getItem('data'));
      if (localStorage.getItem('action')) {
        this.btnText = localStorage.getItem('action');
      }
      if (this.sub.comments) {
        for (let i = 0; i < this.sub.comments.length; i++) {
          this.previouscomment[i] = this.sub.comments[i];
        }
      }
      localStorage.setItem('currentID', this.sub.workStationLocationId);
      if (localStorage.getItem('currentID')) {
        this.getWorkstationLists('api/q/onboarding/workStationDetails?clientId=' + localStorage.getItem('currentID'));
      }
      if (this.sub && this.src) {
        this.employeeObject = {
          info: [
            {
              attr: 'Joining Date',
              val: this.utilService.epochToDate(this.sub.dateOfJoining),
              cols: 2
            },
            {
              attr: 'Job Status',
              val: this.sub.jobStatus,
              cols: 2
            },
            {
              attr: 'Request#',
              val: this.sub.requestId ? this.sub.requestId : 'Not available',
              cols: 2
            },
            {
              attr: 'Requested Workstation',
              val: this.sub.workStationNum,
              cols: 2
            },
            {
              attr: 'Workstation Location',
              val: this.sub.building,
              cols: 2
            }
          ],
          name: this.sub.employeeName,
          id: this.sub.employeeId ? this.sub.employeeId : 'Not available',
          image_path: this.src,
          cols: 16
        };
      }
    }
    ngOnDestroy() {
      localStorage.removeItem('data');
      localStorage.removeItem('dropdownLoaded');
      localStorage.removeItem('action');
    }
    uncheck(k: number) {
      if (this.btnText !== 'Deallocate') {
        this.workstationData[k - 1].availiability = 'Available Stations';
        this.workstationData[k - 1].selected = false;
        this.selectedText = null;
        this.disableClass = false;
        this.cd.detectChanges();
      } else {
        this.workstationData[k - 1].availiability = 'Not Available';
        this.workstationData[k - 1].selected = false;
        this.selectedText = null;
        this.disableClass = false;
        this.cd.detectChanges();
      }
    }
    checkSelected(k: number) {
      let i: number;
      for (i = 0; i < this.workstationData.length; i++) {
          /* if (this.btnText !== 'Deallocate'
            && this.workstationData[i].index === k
            && this.workstationData[i].availiability === 'Selected') {
              this.workstationData[i].availiability = 'Available Stations';
              this.workstationData[i].selected = false;
              this.selectedText = null;
              this.disableClass = false;
              this.cd.detectChanges();
              return;
          } */
          if ((this.workstationData[i].availiability !== 'Not Available' || this.workstationData[i].availiability === 'Selected')
          && this.btnText !== 'Deallocate') {
            if (this.workstationData[i].index === k) {
                this.workstationData[i].availiability = 'Selected';
                this.workstationData[i].selected = true;
                this.selectedText = this.workstationData[k - 1].workstation;
                this.selectedIndex = i;
                this.disableClass = false;
                this.cd.detectChanges();
            } else {
                this.workstationData[i].availiability = 'Available Stations';
                this.workstationData[i].selected = false;
            }
          }
          if ((this.workstationData[i].availiability === 'Not Available' || this.workstationData[i].availiability === 'Selected')
          && this.btnText === 'Deallocate') {
            if (this.workstationData[i].index === k) {
                this.workstationData[i].availiability = 'Selected';
                this.workstationData[i].selected = true;
                this.selectedText = this.workstationData[k - 1].workstation;
                this.selectedIndex = i;
                this.disableClass = false;
                this.cd.detectChanges();
            } else {
                this.workstationData[i].availiability = 'Not Available';
                this.workstationData[i].selected = false;
            }
          }
      }
    }
    getWorkstationLists(url: any) {
      this.loaderService.showLoading();
      this.workstationsService.getService(url)
      .subscribe(data => {
          this.rawDataWorkstations = data;
          this.refineWSContents(this.rawDataWorkstations);
          this.loaderService.hideLoading();
          this.getDropdownContents('api/core/clientLocations');
      }, error => {
        this.errorHandleService.handleErrors(error);
      });
    }
    getDropdownContents(url: any) {
      if (!this.originalData) {
        this.loaderService.showLoading();
        this.workstationsService.getService(url)
        .subscribe(data => {
          this.originalData = data;
          this.rawDataLocations = data;
          this.refineDropdownContents(this.rawDataLocations);
          this.loaderService.hideLoading();
        }, error => {
          this.errorHandleService.handleErrors(error);
        });
      }
    }
    applyFilter(filterValue: string) {
      const tableFilters = [];
      tableFilters.push({
        id: 'workstation',
        value: filterValue
      });
      this.workstationDataSource.filter = JSON.stringify(tableFilters);
    }
    refineDropdownContents(obj: any) {
      let i, j, k;
      this.location = Object.keys(obj).map(function(place) {
        return { value: place, viewValue: place };
      });
      this.building = [];
      for (i = 0; i < this.location.length; i++) {
        for (j = 0; j < obj[this.location[i].value].length; j++) {
          if (obj[this.location[i].value][j].locationId === this.sub.workStationLocationId) {
            this.selectedLocation = this.location[i].value;
            for (k = 0; k < obj[this.location[i].value].length; k++) {
              this.building[k] = {};
              this.building[k].value = this.originalData[this.selectedLocation][k].clientLocationName;
              this.building[k].viewValue = this.originalData[this.selectedLocation][k].clientLocationName;
            }
            this.selectedBuilding = obj[this.location[i].value][j].clientLocationName;
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
        this.workstationData[i].selected = false;
        if (obj[i].status === 1) {
          this.workstationData[i].availiability = 'Available Stations';
        } else if (obj[i].status === 2) {
          this.workstationData[i].availiability = 'Not Available';
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
    filterValuesBuilding() {
      this.selectedText = null;
      this.searchText = null;
      this.cd.detectChanges();
      let i;
      this.building = [];
      for (i = 0; i < this.originalData[this.selectedLocation].length; i++) {
        this.building[i] = {};
        this.building[i].value = this.originalData[this.selectedLocation][i].clientLocationName;
        this.building[i].viewValue = this.originalData[this.selectedLocation][i].clientLocationName;
      }
      this.selectedBuilding = this.building[0].value;
      localStorage.setItem('currentID', this.originalData[this.selectedLocation][0].locationId);
      this.getWorkstationLists('api/q/onboarding/workStationDetails?clientId=' + this.originalData[this.selectedLocation][0].locationId);
    }
    filterValuesLocation() {
      this.selectedText = null;
      this.searchText = null;
      this.cd.detectChanges();
      let i, id;
      for (i = 0; i < this.originalData[this.selectedLocation].length; i++) {
        if (this.originalData[this.selectedLocation][i].clientLocationName === this.selectedBuilding) {
          id = this.originalData[this.selectedLocation][i].locationId;
        }
      }
      localStorage.setItem('currentID', id);
      this.getWorkstationLists('api/q/onboarding/workStationDetails?clientId=' + id);
    }
    cancel() {
      this.isEditing = false;
      this.commentsText = null;
    }
    saveDialog() {
      if (!this.selectedText) {
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
      } else {
        this.save();
      }
    }
    save() {
      let displayMsg = null;
      if (this.btnText === 'Deallocate') {
        const deallocateDate = new Date();
        this.submitObj = {
          endDate: deallocateDate.getTime(),
          prospectId: this.sub.prospectId,
          employeeId: this.sub.employeeId,
          name: this.sub.employeeName,
          comment: this.commentsText,
          allocationType: this.btnText,
          workStationId: this.rawDataWorkstations[this.selectedIndex].workStationId
        };
        displayMsg = 'Workstation deallocated successfully';
      } else {
        this.submitObj = {
          prospectId: this.sub.prospectId,
          employeeId: this.sub.employeeId,
          name: this.sub.employeeName,
          startDate: this.sub.dateOfJoining,
          comment: this.commentsText,
          allocationType: this.btnText,
          workStationId: this.rawDataWorkstations[this.selectedIndex].workStationId
        };
        if (this.btnText === 'Allocate') {
          displayMsg = 'Workstation allocated successfully';
        } else {
          displayMsg = 'Workstation details changed successfully';
        }
      }
      this.workstationsService.postService('api/c/onboarding/saveWorkStationDetails', this.submitObj).subscribe(data => {
        this.loaderService.hideLoading();
        this.dialogService.render(
          [{
              title: 'Success',
              message: displayMsg,
              yesLabel: 'OK'
          }]
        ).subscribe(result => {
          const redirect: any = 'workstations/dashboard';
          this.router.navigate([redirect]);
        });
      }, error => {
        this.errorHandleService.handleErrors(error);
      });
    }
}
