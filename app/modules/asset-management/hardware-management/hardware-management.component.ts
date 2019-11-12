import { Component, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { HttpService } from '../../../shared/services/http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HardwareManagementDialogComponent } from './hardware-management-dialog/hardware-management-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import {AssetService} from '../asset.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { DialogService } from '../../../shared/dialogs/dialog.service';
@Component({
  selector: 'app-hardware-management',
  templateUrl: './hardware-management.component.html',
  styleUrls: ['./hardware-management.component.scss']
})
export class HardwareManagementComponent implements OnInit {
  employeeObject: any;
  public selectedRowIndex: any;
  dataSource1: any;
  displayedColumns1: string[] = ['assestId', 'configuration', 'action' ];
  dataObject: any;
  assestType: any;
  make: any;
  default: any;
  url: any;
  url1: any;
  commenttext: boolean = true;
  isValid: boolean = false;
  commenttextvalue: any;
  inputvalue: any;
  hardwareId: any;
  prospectId: any;
  changeos: boolean = true;
  @ViewChild(MatSort) sort: MatSort;
   public previouscomments: any;
   public name: any;
   public showcomments: any;
   public selectedAssetId: any;
   public index: any;
   public arr: any = [];
   public currentasset: any;
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private assetService: AssetService,
    private errorHandleService: ErrorHandleService,
    private dialogService: DialogService
    ) {
    this.employeeObject = {
      info: [
        {
          attr: 'Joining Date',
          val: '',
          cols: 2
        },
        {
          attr: 'Job Status',
          val: '',
          cols: 2
        },
        {
          attr: 'Request#',
          val: '',
          cols: 2
        },
        {
          attr: 'Requested Hardware',
          val: '',
          cols: 2
        },
        {
          attr: 'Asset Type',
          val: '',
          cols: 2
        }
      ],
      name: '',
      id: '',
      image_path: 'test',
      cols: 16
    };
  }

  ngOnInit() {
    const obj = localStorage.getItem('hardwardrequestObj');
    this.dataObject = JSON.parse(obj);
    this.employeeObject.info[0].val = this.dataObject.dateOfJoining;
    this.employeeObject.info[1].val = this.dataObject.jobStatus;
    this.employeeObject.info[2].val = this.dataObject.id;
    this.employeeObject.info[3].val = this.dataObject.requestedHardware;
    this.employeeObject.name = this.dataObject.name;
    this.employeeObject.id = this.dataObject.id;
    this.hardwareId = this.dataObject.hardwareId;
    this.prospectId = this.dataObject.prospectId;
    this.arr = [];

    if (this.dataObject.action === 'Deallocate') {
      this.changeos = false;
      this.makeDeallocation();
    }  else {
      this.getAssetManagement();
    }
    this.url = '../../../assets/Add.svg';
    this.url1 = '../../../assets/tick.svg';
  }
  getAssetManagement() {
    this.loaderService.showLoading();
    this.assetService.getService('api/q/onboarding/hardwareAssests?id=' + this.dataObject.id).subscribe(res => {
        this.default = 'All';
        if (res && res.comments) {
          this.previouscomments = res.comments;
        }
        if ( res.assestType === 1) {
          this.assestType = 'Laptop';
          this.employeeObject.info[4].val = 'Laptop';
          this.currentasset = 1;
        } else {
          this.assestType = 'Desktop';
          this.employeeObject.info[4].val = 'Desktop';
          this.currentasset = 2;
        }

        this.make       = res.make;
        this.dataSource1 = new MatTableDataSource(res.hardwareAssestDtoList);
        this.dataSource1.sort = this.sort;
        this.loaderService.hideLoading();
    }, error => {
        this.errorHandleService.handleErrors(error);
    });
  }
  makeDeallocation() {
    this.loaderService.showLoading();
    this.assetService.getService('api/q/onboarding/view/hardwareAssest?hardwareId=' + this.hardwareId
    + '&prospectId=' + this.prospectId  ).subscribe(res => {
      if (res && res.comments) {
        this.previouscomments = res.comments;
      }
        if ( res.assestType === 1) {
          this.assestType = 'Laptop';
          this.employeeObject.info[4].val = 'Laptop';
          this.currentasset = 1;
        } else {
          this.assestType = 'Desktop';
          this.employeeObject.info[4].val = 'Desktop';
          this.currentasset = 2;
        }
        this.dataSource1 = new MatTableDataSource(res.hardwareAssestDtoList);
        this.dataSource1.sort = this.sort;
        this.loaderService.hideLoading();
    }, error => {
        this.errorHandleService.handleErrors(error);
    });

  }
  selectrow(data: any, index: any) {
    this.arr = [];
    this.index = index;
    this.arr.push(data);
    this.selectedRowIndex  = data.assetId;

  }
  saveDialog() {
    if (this.arr.length < 1) {
      this.dialogService.render(
      [{
      title: 'Warning',
      message: 'Are you sure you want to proceed without selecting asset?',
      yesLabel: 'Yes',
      noLabel: 'Cancel'
      }]
      ).subscribe(result => {
        if (result === true) {
           this.navigateToAssignHardwareForms();
        } else {
          // this.navigateToAssignHardwareForms();
        }
      });
      } else {
        this.navigateToAssignHardwareForms();
      }
    }

  navigateToAssignHardwareForms() {
    const obj = {
      'hardwareId': (this.arr &&  this.arr[0] ) ? this.arr[0].hardwareId : '',
      'prospectId': this.prospectId,
      'employeeId': this.dataObject.employeeId ? this.dataObject.employeeId : '',
      'action': this.dataObject.action === 'Allocate' ? 1 : (this.dataObject.action === 'Deallocate') ? 3 : 2,
      'employeeName': this.dataObject.name,
      'comment':  this.inputvalue ? this.inputvalue : null,
      'assestType': this.currentasset
    };
    this.loaderService.showLoading();
    this.assetService.postService('api/c/onboarding/allocateHardware', obj).subscribe(res => {
      if ( res.done === true) {
        this.dialogService.render(
          [{
              title: 'Success',
              message: 'successfully saved',
              yesLabel: 'OK'
          }]
        );
        this.router.navigate(['/assets/dashboard']);
      }
      this.loaderService.hideLoading();
    } , error => {
      this.errorHandleService.handleErrors(error);
    });
  }
  openDialog(arrdata: any) {
    const dialogRef = this.dialog.open(HardwareManagementDialogComponent, {
      width: '540px',
      height: '580px',
      data: [{
        serviceData: arrdata ? arrdata : '',
      }
      ]
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  changemake(asset: any) {
     this.default = asset.value;
     this.assetService.getService('api/q/onboarding/hardwareAssest?id=' + this.employeeObject.id + '&make=' + asset.value)
     .subscribe(res => {
       this.dataSource1 = new MatTableDataSource(res.hardwareAssestDtoList);
     });

  }
  public doFilter = (value: string) => {
    this.dataSource1.filter = value.trim().toLocaleLowerCase();
  }
  addcomment() {
    this.showcomments = ! this.showcomments;
    this.commenttext = !this.commenttext;
    this.inputvalue = '';
  }
  cancel() {
    this.showcomments = ! this.showcomments;
    this.commenttext = !this.commenttext;
    this.isValid = true;
  }
  savecomment(text: any) {
    this.commenttextvalue = text;
    this.commenttext = true;
    this.showcomments = false;
    this.isValid = true;
  }
}

