import { NgModule } from '@angular/core';
import { LineItemComponent } from './ctc-line-item/ctc-line-item.component';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [LineItemComponent],
  providers: [],
  exports: [LineItemComponent]
})

export class LineItemModule {}