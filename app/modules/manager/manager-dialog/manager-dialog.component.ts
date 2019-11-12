import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import {MyErrorStateMatcher} from '../input-error-state-matcher';
import { LoaderService } from '../../../shared/services/loader.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../shared/services/http.service';
import {ManagerService} from '../manager.service';
import { DialogService } from '../../../shared/dialogs/dialog.service';

@Component({
  selector: 'app-manager-dialog',
  templateUrl: './manager-dialog.component.html',
  styleUrls: ['./manager-dialog.component.scss'],
})
export class ManagerDialogComponent implements OnInit {
  public requestinfo: any;
  public assettypes: any;
  public operatingsystem: any;
  public itrequestForm: FormGroup;
  public prospectId: any;
  public joiningDate: any;
  public joinee: any;
  matcher = new MyErrorStateMatcher();
  public formvalid: any;
  public assets: any;
  public operatingtypes: any;
  public comment: any;
  public today: any;
  public prevComments: any;
  public commentname: any;
  public name: any;
  public previouscomments: any;

  constructor(private dialogRef: MatDialogRef<ManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private managerService: ManagerService,
    private loaderService: LoaderService,
    private errorHandleService: ErrorHandleService,
    private router: Router,
    private dialogService: DialogService
    ) {
        this.assettypes = data[0].serviceData.assestTypes.map(function(item) {
          return item === 1 ? 'Laptop' : 'Desktop';
          });
        this.prospectId = data[0].serviceData.prospectId;
        this.joiningDate = data[0].serviceData.joiningDate;
        this.joinee = data[0].serviceData.joinee;
        this.operatingsystem = data[0].serviceData.operatingSystems;
        this.prospectId = data[0].serviceData.prospectId;
   }

  ngOnInit() {
      this.itrequestForm = new FormGroup({
        assets : new FormControl('', [Validators.required]),
        operatingtypes : new FormControl('', [Validators.required]),
        comment: new FormControl(''),
      });
      this.formvalid = this.itrequestForm.valid;
      this.itrequestForm.valueChanges.subscribe(form => {
          if (this.itrequestForm.valid)  {
              this.formvalid =  true;
          } else {
              this.formvalid =  false;
          }
      });
      this.managerService.getService('api/q/onboarding/adminItRequest/' + this.prospectId + '?view=It').subscribe( res => {
        if (res && res.comments) {
          this.previouscomments = res.comments;
        }
      this.itrequestForm.patchValue({
        assets: res.requestedHardware === 1 ? 'Laptop' : res.requestedHardware === 2 ? 'Desktop' : '',
        operatingtypes: res.operatingSystem ? res.operatingSystem : '',
      });
      }, error => {
        this.errorHandleService.handleErrors(error);
      });
  }
  closedialog() {
    this.dialogRef.close();
  }
  onSubmit()  {
      const obj = {
        prospectId: this.prospectId,
        requestedHardware:  this.itrequestForm.value.assets === 'Laptop' ? 1 : 2,
        operatingSystem: this.itrequestForm.value.operatingtypes,
        comments:  this.itrequestForm.value.comment ? this.itrequestForm.value.comment : null ,
        dateOfJoining:  this.joiningDate,
        name: this.joinee
    };
    this.loaderService.showLoading();
    this.managerService.postService('api/c/onboarding/adminItRequest/' , obj).subscribe(res => {
    if (res.done === true) {
      this.loaderService.hideLoading();
       this.dialogService.render(
        [{
            title: 'Success',
            message: 'successfully saved record',
            yesLabel: 'OK'
        }]

      );
      this.dialogRef.close();
    }
   }, error => {
       this.errorHandleService.handleErrors(error);

   });

  }
  navigateToHome() {
    this.dialogRef.close();
  }

}
