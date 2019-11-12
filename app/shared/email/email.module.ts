import { NgModule } from '@angular/core';
import { EmailModal } from './email-modal.component';
import { EditorModule } from 'primeng/primeng';

@NgModule({
  imports: [EditorModule],
  declarations: [EmailModal],
  providers: [],
  exports: [EmailModal]
})

export class EmailModule {}