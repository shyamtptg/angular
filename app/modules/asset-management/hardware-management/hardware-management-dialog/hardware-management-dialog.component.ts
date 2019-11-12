import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-hardware-management-dialog',
  templateUrl: './hardware-management-dialog.component.html',
  styleUrls: ['./hardware-management-dialog.component.scss']
})
export class HardwareManagementDialogComponent implements OnInit {
  objectKeys: any;
  constructor(private dialogRef: MatDialogRef<HardwareManagementDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = this.data[0].serviceData;
  }
  ngOnInit() {
  }
  closedialog() {
    this.dialogRef.close();
  }

}
