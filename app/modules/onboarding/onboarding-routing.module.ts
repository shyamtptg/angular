import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OnboardingComponent } from './onboarding.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';

import { BasicInfoComponent } from './basic-info/basic-info.component';
import { FinancialInfoComponent } from './financial-info/financial-info.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';
import { CalendarViewComponent } from './calendar/calendar.component';
import { EmployeeStatisticComponent } from './employee-statistic/employee-statistic.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { OfficialInfoComponent } from './official-info/official-info.component';

import { EducationExperienceComponent } from './education-experience/education-experience.component';
import { ReviewComponent } from './review/review.component';
import { SuccessComponent } from './success/success.component';
import { RolePermissionRoute } from './../../shared/guards/role-permission/role-permission.guard';
import { PreviousRoute } from './../../shared/guards/previous-route/previous-route.guard';

const routes: Routes = [
    {
        path: '',
        component: OnboardingComponent,
        canActivate: [ RolePermissionRoute, PreviousRoute],
        data: {'feature': 'EMPLOYEE_ONBOARD_HR'},
        children: [
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: CalendarViewComponent },
            { path: 'employeestatistics', component: EmployeeStatisticComponent },
            {
                path: 'navigationBar',
                component: NavigationBarComponent,
                children: [
                    { path: 'basicInfo', component: BasicInfoComponent },
                    { path: 'contactInfo', component: ContactInfoComponent },
                    { path: 'financialInfo', component: FinancialInfoComponent },
                    { path: 'emergencyContact', component: EmergencyContactComponent },
                    { path: 'officialinfo', component: OfficialInfoComponent },
                    { path: 'workExperience', component: WorkExperienceComponent },
                    { path: 'educationExperience', component: EducationExperienceComponent },
                ]
            },
            { path: 'review', component: ReviewComponent },
            { path: 'success', component: SuccessComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})

export class OnboardingRoutingModule { }
