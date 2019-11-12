import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/primeng';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [CommonModule, DialogModule],
  declarations: [FooterComponent],
  providers: [],
  exports: [FooterComponent]
})

export class FooterModule {}
