import { NgModule } from '@angular/core';
import { RemarksModal } from './remarks-modal/remarks-modal.component';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [RemarksModal],
  providers: [],
  exports: [RemarksModal]
})

export class RemarksModule {}
