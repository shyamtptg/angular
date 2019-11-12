import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {
  modaldata: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.modaldata = data;
  }

  ngOnInit() {}

}
