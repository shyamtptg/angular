import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetManagementComponent } from './asset-management.component';
import { AssetManagementRoutingModule  } from './asset-management-routing.module';
import { HeaderModule } from './../header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { AppMaterialModule } from './../../app.material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HardwareManagementComponent } from './hardware-management/hardware-management.component';
import { MsCommonModule } from './../../modules/ms-common/ms-common.module';
import { HardwarerequestsComponent } from './hardwarerequests/hardwarerequests.component';
import { HardwareManagementDialogComponent } from './hardware-management/hardware-management-dialog/hardware-management-dialog.component';
import { DialogpipePipe } from './hardware-management/hardware-management-dialog/hardware-management-dialog.pipe';
import { FormsModule } from '@angular/forms';
import {AssetService} from './asset.service';
import { AssetAllocationDatePipe } from './hardware-management/assetallocation-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    AssetManagementRoutingModule,
    HeaderModule,
    FooterModule,
    AppMaterialModule,
    FlexLayoutModule,
    MsCommonModule,
    FormsModule
    ],
  declarations: [
    AssetManagementComponent,
    HardwareManagementComponent,
    HardwarerequestsComponent,
    HardwareManagementDialogComponent,
    DialogpipePipe,
    AssetAllocationDatePipe,
  ],
  providers: [
    AssetService
  ],
  entryComponents: [HardwareManagementDialogComponent],
})
export class AssetManagementModule { }
