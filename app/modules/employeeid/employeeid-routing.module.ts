import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeidComponent } from './employeeid.component';
import { ViewRequestsComponent } from './view-requests/view-requests.component';
import { RolePermissionRoute } from './../../shared/guards/role-permission/role-permission.guard';
import { PreviousRoute } from './../../shared/guards/previous-route/previous-route.guard';

const routes: Routes = [
  {
    path: '',
    component: EmployeeidComponent,
    canActivate: [ RolePermissionRoute, PreviousRoute],
    data: {'feature': 'EMPLOYEE_ONBOARD_ADMIN'},
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ViewRequestsComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  declarations: []
})

export class EmployeeidRoutingModule {}
