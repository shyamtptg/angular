import { Component, OnInit, Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-final-submit',
  templateUrl: './final-submit.component.html',
  styleUrls: ['./final-submit.component.scss']
})
export class FinalSubmitComponent implements OnInit {

  comments: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FinalSubmitComponent>
  ) { }

  ngOnInit() {
  }

  save() {
    const dataObj = {
      comments: this.comments
    };
    this.dialogRef.close(dataObj);
  }
}
