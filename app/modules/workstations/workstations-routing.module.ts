import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkstationsComponent } from './workstations.component';
import { WorkstationAllocationComponent } from './workstation-allocation/workstation-allocation.component';
import { AllocationRequestsComponent } from './allocation-requests/allocation-requests.component';
import { RolePermissionRoute } from './../../shared/guards/role-permission/role-permission.guard';
import { PreviousRoute } from './../../shared/guards/previous-route/previous-route.guard';

const routes: Routes = [
  {
    path: '',
    component: WorkstationsComponent,
    canActivate: [ RolePermissionRoute, PreviousRoute],
    data: {'feature': 'EMPLOYEE_ONBOARD_ADMIN'},
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AllocationRequestsComponent },
      { path: 'workstationAllocation', component: WorkstationAllocationComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  declarations: []
})

export class WorkstationsRoutingModule {}
