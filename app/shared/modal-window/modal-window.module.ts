import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbdModalContent } from './modal-window.component'; 

@NgModule({
  imports: [CommonModule, FormsModule ],
  declarations: [NgbdModalContent],
  providers: [],
  exports: [NgbdModalContent]
})

export class NgbdModalContentModule {}