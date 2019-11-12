import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/primeng';
import { HeaderComponent } from './header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderService } from './header.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    FlexLayoutModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  providers: [HeaderService]
})
export class HeaderModule { }
