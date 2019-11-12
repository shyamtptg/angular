import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeidComponent } from './employeeid.component';
import { EmployeeidRoutingModule } from './employeeid-routing.module';
import { ViewRequestsComponent } from './view-requests/view-requests.component';
import { HeaderModule } from './../header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';

import { MsCommonModule } from './../../modules/ms-common/ms-common.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './../../app.material';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { EmployeeidService } from './employeeid.service';

@NgModule({
  imports: [
    CommonModule,
    EmployeeidRoutingModule,
    HeaderModule,
    FooterModule,
    MsCommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    FlexLayoutModule,
    AppMaterialModule
  ],
  declarations: [
    EmployeeidComponent,
    ViewRequestsComponent,
    EditDialogComponent
  ],
  entryComponents: [
    EditDialogComponent
  ],
  providers: [
    EmployeeidService
  ]
})
export class EmployeeidModule { }
