import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'email-modal',
  templateUrl: 'email-modal.component.html'
})

export class EmailModal {
  @Input() modalId: string;
  @Input() modalTitle: string;
  @Input() formValidationState: boolean;
  @Output() mailSent = new EventEmitter();
  sendMail() {
    this.mailSent.emit();
  }
}