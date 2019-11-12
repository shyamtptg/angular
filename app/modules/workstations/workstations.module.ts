import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCommonModule } from './../../modules/ms-common/ms-common.module';
import { WorkstationsComponent } from './workstations.component';
import { WorkstationsRoutingModule } from './workstations-routing.module';
import { HeaderModule } from './../header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { AllocationRequestsComponent } from './allocation-requests/allocation-requests.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './../../app.material';
import { WorkstationAllocationComponent } from './workstation-allocation/workstation-allocation.component';
import { WorkstationsService } from './workstations.service';

@NgModule({
  imports: [
    CommonModule,
    WorkstationsRoutingModule,
    HeaderModule,
    FooterModule,
    MsCommonModule,
    AppMaterialModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    FlexLayoutModule
  ],
  declarations: [
    WorkstationsComponent,
    AllocationRequestsComponent,
    WorkstationAllocationComponent
  ],
  providers: [
    WorkstationsService
  ]
})
export class WorkstationsModule { }
