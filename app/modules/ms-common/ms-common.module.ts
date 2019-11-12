import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { EmployeeInfoBadgeComponent } from './../../shared/employee-info-badge/employee-info-badge.component';

@NgModule({
  declarations: [
    EmployeeInfoBadgeComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  exports: [
    EmployeeInfoBadgeComponent
  ]
})
export class MsCommonModule { }
