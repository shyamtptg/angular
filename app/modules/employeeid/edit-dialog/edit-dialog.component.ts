import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  url = '../../../assets/face.svg';
  status = [
    {value: 'Pending', viewValue: 'Pending'},
    {value: 'Active', viewValue: 'Active'}
  ];
  accessStatus: any;
  idCardStatus: any;
  comments: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditDialogComponent>
  ) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.idCardStatus === 'Active') {
        this.idCardStatus = this.status[1].value;
      } else {
        this.idCardStatus = this.status[0].value;
      }
      if (this.data.accessStatus === 'Completed') {
        this.accessStatus = this.status[1].value;
      } else {
        this.accessStatus = this.status[0].value;
      }
    }
  }

  save() {
    const dataObj = {
      comments: this.comments,
      status: this.idCardStatus
    };
    this.dialogRef.close(dataObj);
  }
}
