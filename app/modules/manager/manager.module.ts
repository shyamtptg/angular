import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerComponent } from './manager.component';
import {ManagerRoutingModule} from './manager-routing.module';
import {ManagerinfoComponent} from './managerinfo/managerinfo.component';
import { HeaderModule } from './../header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { WorkstationRequestComponent } from './workstation-request/workstation-request.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MsCommonModule } from './../../modules/ms-common/ms-common.module';
import { AppMaterialModule } from './../../app.material';
import { ManagerService } from './manager.service';
import { ManagerDialogComponent } from './manager-dialog/manager-dialog.component';

@NgModule({
  declarations: [ManagerComponent, ManagerinfoComponent, WorkstationRequestComponent, ManagerDialogComponent],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    HeaderModule,
    FooterModule,
    FlexLayoutModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatGridListModule,
    MsCommonModule,
    AppMaterialModule
  ],
  providers: [
    ManagerService
  ],
  entryComponents: [
    ManagerDialogComponent
  ]
})
export class ManagerModule { }
