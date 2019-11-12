import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetManagementComponent } from './asset-management.component';
import {HardwareManagementComponent} from './hardware-management/hardware-management.component';
import {HardwarerequestsComponent} from './hardwarerequests/hardwarerequests.component';
import { RolePermissionRoute } from './../../shared/guards/role-permission/role-permission.guard';
import { PreviousRoute } from './../../shared/guards/previous-route/previous-route.guard';

const routes: Routes = [
    {
        path: '',
        component: AssetManagementComponent,
        canActivate: [ RolePermissionRoute, PreviousRoute],
        data: {'feature': 'EMPLOYEE_ONBOARD_IT'},
        children: [
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: HardwarerequestsComponent },
            { path: 'assignhardware', component: HardwareManagementComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})

export class AssetManagementRoutingModule { }
