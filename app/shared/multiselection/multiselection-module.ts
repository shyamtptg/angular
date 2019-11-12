import { NgModule } from '@angular/core';
import { MultiSelectionModal } from './multiselection-modal/multi-selection.component';
import { DataTableModule, DialogModule, ButtonModule } from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from './multiselection-modal/search-filter.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule],
  declarations: [MultiSelectionModal, SearchFilterPipe],
  providers: [],
  exports: [MultiSelectionModal]
})

export class MultiSelectionModule {}