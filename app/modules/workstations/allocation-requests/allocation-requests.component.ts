import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import { CommonService } from '../../../shared/services/common.service';
import { WorkstationsService } from '../workstations.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';

@Component({
    selector: 'app-allocation-requests',
    templateUrl: './allocation-requests.component.html',
    styleUrls: ['./allocation-requests.component.scss']
})
export class AllocationRequestsComponent implements OnInit {
    AllocationRequestsColumns: string[] = ['src', 'joinee', 'date', 'status', 'request', 'workstation', 'availiability', 'action'];
    AllocationRequestsSource: any;
    AllocationRequestsData: any[] = [];
    isLoaded = false;
    showPaginator = false;
    text: any;
    check: number;
    originalData: any;
    currentDate = new Date();
    selectedAPI = ['All', 'joiningThisWeek', 'joiningNextWeek', 'joinedLastWeek'];
    src = '../../../assets/face.svg';
    clientLocations: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public commonService: CommonService,
        private router: Router,
        private loaderService: LoaderService,
        private workstationsService: WorkstationsService,
        private errorHandleService: ErrorHandleService
    ) { }

    ngOnInit() {
        this.getAssetDetails();
    }
    getAssetDetails() {
        this.loaderService.showLoading();
        this.workstationsService.getClientStats().subscribe(data => {
            this.clientLocations = JSON.parse(data._body);
            this.loaderService.hideLoading();
            this.check = 2;
            this.getContents('api/q/onboarding/workStationsPendingDetails?weeklyWise=joiningThisWeek');
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }

    getContents(url: any) {
        this.workstationsService.getService(url)
        .subscribe(data => {
            this.originalData = data;
            if (data[0].responseStatus) {
                this.text = data[0].responseStatus;
                $('.paginator-div').css('display', 'none');
                this.AllocationRequestsData = [];
            } else {
                this.getTableData(data);
            }
            this.isLoaded = true;
            this.AllocationRequestsSource = new MatTableDataSource(this.AllocationRequestsData);
            this.AllocationRequestsSource.sort = this.sort;
            this.AllocationRequestsSource.paginator = this.paginator;
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    getTableData(object: any) {
        this.AllocationRequestsData = [];
        for (let i = 0; i < object.length; i++) {
            this.AllocationRequestsData[i] = {};
            this.AllocationRequestsData[i].joinee = i + 1;
            this.AllocationRequestsData[i].date = object[i].dateOfJoining;
            this.AllocationRequestsData[i].currentDate = object[i].currentDate;
            this.AllocationRequestsData[i].status = object[i].jobStatus;
            this.AllocationRequestsData[i].request = object[i].requestId;
            this.AllocationRequestsData[i].workstation = object[i].workStationNum;
            this.AllocationRequestsData[i].availiability = (object[i].workStationStatus === 1) ? 'Available' : 'Not Available';
            this.AllocationRequestsData[i].src = this.src;
            this.AllocationRequestsData[i].name = object[i].employeeName;
            this.AllocationRequestsData[i].id = object[i].employeeId;
            for (let j = 0; j < this.clientLocations.length; j++) {
                if (object[i].workStationLocationId === this.clientLocations[j].id) {
                    this.AllocationRequestsData[i].building = this.clientLocations[j].client_name;
                }
            }
            this.originalData[i].building = this.AllocationRequestsData[i].building;
            this.AllocationRequestsData[i].allocationType = object[i].allocationType;
            if (this.AllocationRequestsData[i].date < object[i].currentDate
            && object[i].allocationType === 'Allocate') {
                this.AllocationRequestsData[i].action = 'Edit and Deallocate';
            } else if (this.AllocationRequestsData[i].date < object[i].currentDate
            && object[i].allocationType === 'NotAllocate') {
                this.AllocationRequestsData[i].action = 'Allocate';
            } else if (this.AllocationRequestsData[i].date >= object[i].currentDate
            && object[i].allocationType === 'NotAllocate') {
                this.AllocationRequestsData[i].action = 'Allocate';
            } else if (this.AllocationRequestsData[i].date >= object[i].currentDate
            && object[i].allocationType === 'Allocate') {
                this.AllocationRequestsData[i].action = 'Edit and Deallocate';
            }
        }
        if (this.AllocationRequestsData.length < 11 && document.getElementsByClassName('.paginator-div')) {
            $('.paginator-div').css('display', 'none');
        } else if (document.getElementsByClassName('.paginator-div')) {
            $('.paginator-div').css('display', 'block');
        }
    }
    navigateToWorkstationAllocationDetails(a: number, action: any) {
        if (!((parseInt(this.originalData[a - 1].dateOfJoining, 10) < parseInt(this.originalData[a - 1].currentDate, 10))
        && this.originalData[a - 1].allocationType === 'Allocate')) {
            const redirect: any = 'workstations/workstationAllocation';
            this.router.navigate([redirect]);
            localStorage.setItem('data', JSON.stringify(this.originalData[a - 1]));
            localStorage.setItem('action', action);
            // localStorage.setItem('location', action);
        }
    }
    changeDisplayData(data: any, event: any) {
        this.getContents('api/q/onboarding/workStationsPendingDetails?weeklyWise=' + this.selectedAPI[data - 1]);
    }
}
