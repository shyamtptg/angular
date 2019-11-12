import { Component, Input, ViewEncapsulation } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './modal-window.component.html'
})

export class NgbdModalContent {
  @Input() name:any;
  @Input() isText:boolean;
  @Input() title:string;
  @Input() cancelBtnText:string;
  @Input() confirmBtnText:string;
  @Input() modalText:string;
  
  constructor(public activeModal: NgbActiveModal) {}
}