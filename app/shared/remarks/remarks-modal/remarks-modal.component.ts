import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'remarks-modal',
	templateUrl: 'remarks-modal.component.html',
  	styles:[`
     .modal-dialog {
      width: 400px;
      position: relative;
      top: 5.1em;
      left: 0.6em;
     }
     .remarks-button {
      border-radius:2px;
      min-width:72px;
      height:42px;
      margin-left: 0.5em;
     }
    .remarks-details-button {
      @extend .remarks-button;
      color:#ffffff;
      background:rgba(39,70,98,0.96);
     }
     .remarks-close {
       font-size: 1.4em;
     }
    `]
})

export class RemarksModal {
    @Input() remarkTitle: string;
    @Input() modalId: string;
    @Input() required: boolean;
    @Input() message: string;
    @Input() isDisable: boolean;
    @Output() updateReason = new EventEmitter<any>();
    reason: string;
    showMessage: boolean = false;
    saveRemarks() {
      if(!(this.required == true && (!this.reason))){
        this.updateReason.emit(this.reason);
        (<any>$('[name=remarksPopup]')).modal('hide');
        this.resetData();
       }else{
        this.showMessage = true;
       }
    }
    restrictSpace = function (e: any,value?:any) {
      var input;
      if (e.metaKey || e.ctrlKey) {
        return true;
      }
      if (e.which === 32) {
        if(value){
          return true
        }
        return false;
      }
      if (e.which === 0) {
        return true;
      }
      if (e.which < 33) {
        return true;
      }
      if(value){
        this.showMessage = false;
      }
      input = String.fromCharCode(e.which);
      return !!/.*\S+.*/.test(input);
    }
    resetData(){
      this.reason = '';
    }
}