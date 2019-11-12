import { Component, ViewChild, OnInit, AfterViewChecked, ChangeDetectorRef, OnChanges } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, PageEvent, MatTable } from '@angular/material';
import { Router } from '@angular/router';
import { HttpService } from '../../../shared/services/http.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DialogService } from '../../../shared/dialogs/dialog.service';
import { EmployeeidService } from '../employeeid.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';

export interface RequestsTableInterface {
  joinee: number;
  date: any;
  status: string;
  request: any;
  workstation: any;
  availiability: string;
  action: number;
  src: string;
  name: string;
  id: string;
  building: string;
}


@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.scss']
})
export class ViewRequestsComponent implements OnInit, AfterViewChecked, OnChanges {
  requestTableColumns: string[] = ['src', 'joinee', 'dateOfJoining', 'bloodGroup', 'designation',
  'IDStatus', 'action'];
  requestTableSource: any;
  requestTableData: any[] = [];
  recordsCount: any;
  isLoaded = false;
  editPath = '../../../assets/edit-icon.svg';
  deletePath = '../../../assets/delete-icon.svg';
  dataLength: any;
  showPaginator = false;
  requests: any;
  selectedRequests: any;
  comments: any;
  src = '../../../assets/face.svg';
  submitObj: any;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
      private router: Router,
      private httpService: HttpService,
      private loaderService: LoaderService,
      private dialog: MatDialog,
      private cd: ChangeDetectorRef,
      private dialogService: DialogService,
      private employeeidService: EmployeeidService,
      private errorHandleService: ErrorHandleService
  ) { }

  ngOnInit() {
      this.requests = [
        { value: 'All records', viewValue: 'All records' },
        { value: 'Pending records', viewValue: 'Pending records' },
        { value: 'Active records', viewValue: 'Active records' }
      ];
      this.selectedRequests = this.requests[0].value;
      this.getContents('api/q/onboarding/idCardStatusDetails?idCardStatus=All');
  }

  ngAfterViewChecked() {
  }

  ngOnChanges() {
    this.dataLength = this.paginator.length;
    alert(this.dataLength);
    this.cd.detectChanges();
  }

  getContents(url: any) {
      this.employeeidService.getService(url)
      .subscribe(data => {
          this.refineContents(data);
          this.isLoaded = true;
          this.loaderService.hideLoading();
      }, error => {
        this.errorHandleService.handleErrors(error);
      });
  }
  refineContents(obj) {
    let i;
    this.requestTableData = [];
    for (i = 0; i < obj.length; i++) {
      this.requestTableData[i] = {};
      this.requestTableData[i] = obj[i];
    }
    this.requestTableSource = new MatTableDataSource(this.requestTableData);
    this.requestTableSource.sort = this.sort;
    this.requestTableSource.paginator = this.paginator;
    this.requestTableSource.paginator.page.subscribe((pageEvent: PageEvent) => {
      const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
      const endIndex = startIndex + pageEvent.pageSize;
    });
    if (this.requestTableData.length < 11) {
      $('.paginator').addClass('hide-paginator-div');
    } else {
      $('.paginator').removeClass('hide-paginator-div');
    }
  }
  navigateToWorkstationAllocationDetails(a: number) {
      const redirect: any = 'workstations/workstationAllocation';
      this.router.navigate([redirect, { 'data' : JSON.stringify(this.requestTableData[a - 1]) } ]);
  }

  openDeleteDialog(data: any) {
    this.dialogService.render(
      [{
          title: 'Please confirm',
          message: 'Are you sure you want to delete?',
          yesLabel: 'Yes',
          noLabel: 'No'
      }]
    ).subscribe(result => {
      if (result) {
        this.delete(data);
      }
    }, error => {
      this.errorHandleService.handleErrors(error);
    });
  }
  delete(data: any) {
  }
  openEditDialog(data: any) {
    if (data.idCardStatus === 'Pending') {
      const dialogRef = this.dialog.open(EditDialogComponent, {
        width: '480px',
        height: '550px',
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.comments = result;
          this.edit(data, result);
        }
      });
    }
  }
  edit(data: any, commentsObject: any) {
    this.submitObj = {
      'employeeName': data.employeeName,
      'employeeId': data.employeeId,
      'dateOfJoining': data.dateOfJoining,
      'idCardStatus': commentsObject.status,
      'adminComments': commentsObject.comments,
      'bloodGroup': data.bloodGroup,
      'designation': data.designation
    };
    this.employeeidService.postService('api/c/onboarding/idCardRequestDetails', this.submitObj).subscribe(() => {
      this.loaderService.hideLoading();
      this.dialogService.render(
        [{
            title: 'Success',
            message: 'Request edited successfully',
            yesLabel: 'OK'
        }]
      ).subscribe(result => {
        this.filterRequestValues(this.selectedRequests);
      });
    },
    error => {
      this.errorHandleService.handleErrors(error);
    });
  }
  filterRequestValues(filterValue: any) {
    if (filterValue === 'All records') {
      this.getContents('api/q/onboarding/idCardStatusDetails?idCardStatus=All');
      const self = this;
      setTimeout(function() {
        self.detectLength(self);
      }, 1);
      this.cd.detectChanges();
    } else if (filterValue === 'Pending records') {
      this.getContents('api/q/onboarding/idCardStatusDetails?idCardStatus=Pending');
      const self = this;
      setTimeout(function() {
        self.detectLength(self);
      }, 1);
      this.cd.detectChanges();
    } else if (filterValue === 'Active records') {
      this.getContents('api/q/onboarding/idCardStatusDetails?idCardStatus=Active');
      const self = this;
      setTimeout(function() {
        self.detectLength(self);
      }, 1);
      this.cd.detectChanges();
    }
  }
  detectLength(ref: any) {
    ref.dataLength = ref.paginator.length;
    if (ref.paginator.length < 11) {
      $('.paginator').addClass('hide-paginator-div');
    } else {
      $('.paginator').removeClass('hide-paginator-div');
    }
  }
}
