import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManagerinfoComponent} from '../manager/managerinfo/managerinfo.component';
import {ManagerComponent} from './manager.component';
import { RolePermissionRoute } from './../../shared/guards/role-permission/role-permission.guard';
import { PreviousRoute } from './../../shared/guards/previous-route/previous-route.guard';
import {WorkstationRequestComponent} from './workstation-request/workstation-request.component';

const routes: Routes = [
    {path: '',	component : ManagerComponent,
    canActivate: [ RolePermissionRoute, PreviousRoute],
    data: {'feature': 'EMPLOYEE_ONBOARD_VIEW_NEW_JOINEES'},
    children: [
        { path: '', redirectTo: '/managerinfo', pathMatch: 'full' },
        { path: 'managerinfo', component: ManagerinfoComponent },
        { path: 'workstationRequests', component: WorkstationRequestComponent },
    ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})

export class ManagerRoutingModule { }
