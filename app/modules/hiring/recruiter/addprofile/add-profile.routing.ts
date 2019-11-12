import { ModuleWithProviders } from '@angular/core';
import { CanActivate, CanDeactivate, Routes, RouterModule } from '@angular/router';
import { PersonalComponent } from './personal/personal.component';
import { ProfessionalComponent } from './professional/professional.component';
import { SkillsetComponent } from './skillset/skillset.component';
import { MiscellaneousuploadsComponent } from './miscellaneous/miscellaneous-uploads.component';
import { AddProfileComponent } from './add-profile.component';
import { DeactivatePersonalGuard } from './guards/deactivate-personal-guard';
import { ActivateProfessionalGuard } from './guards/activate-professional-guard';
import { ActivatePersonalGuard } from './guards/activate-personal-guard';
import { DeactivateProfessionalGuard } from './guards/deactivate-professional-guard';
import { DeactivateSkillGuard } from './guards/deactivate-skill-guard';
import { AuthGuard } from '../../../../modules/auth/auth.guard';
import { RolePermissionRoute } from '../../../../shared/guards/role-permission/role-permission.guard';
export const addProfileRoutes: Routes = [
    {
        path: 'details',
        component: AddProfileComponent,
        canActivate: [RolePermissionRoute], data: {'feature': 'ADD_PROFILE'},
        children: [
            {
                path: '', redirectTo: 'personal'
            },
            {
                path: 'personal', component: PersonalComponent
            },
            {
                path: 'professional', component: ProfessionalComponent,
                canActivate: [ActivatePersonalGuard]
            },
            {
                path: 'skillset', component: SkillsetComponent,
                canActivate: [ActivateProfessionalGuard]
            },
            {
                path: 'miscellaneous', component: MiscellaneousuploadsComponent
            }
        ]
    },
    {
        path: 'details/:id',
        component: AddProfileComponent,
        canActivate: [RolePermissionRoute], data: {'feature': 'UPDATE_PROFILE'},
        children: [
            {
                path: '', redirectTo: 'personal'
            },
            {
                path: 'personal', component: PersonalComponent
            },
            {
                path: 'professional', component: ProfessionalComponent,
                canActivate: [ActivatePersonalGuard]
            },
            {
                path: 'skillset', component: SkillsetComponent,
                canActivate: [ActivateProfessionalGuard]
            },
            {
                path: 'miscellaneous', component: MiscellaneousuploadsComponent
            }
        ]
    },{
        path: 'view/:id',
        component: AddProfileComponent,
        canActivate: [RolePermissionRoute], data: {'feature': 'VIEW_PROFILE'},
        children: [
            {
                path: '', redirectTo: 'personal'
            },
            {
                path: 'personal', component: PersonalComponent
            },
            {
                path: 'professional', component: ProfessionalComponent
            },
            {
                path: 'skillset', component: SkillsetComponent
            },
            {
                path: 'miscellaneous', component: MiscellaneousuploadsComponent
            }
        ]
    }, {
        path: 'attach/:id',
        component: AddProfileComponent,
        canActivate: [RolePermissionRoute], data: {'feature': 'ATTACH_PROFILE_TO_HIRING_REQUEST_NEED'},
        children: [
            {
                path: '', redirectTo: 'personal'
            },
            {
                path: 'personal', component: PersonalComponent,
            },
            {
                path: 'professional', component: ProfessionalComponent
            },
            {
                path: 'skillset', component: SkillsetComponent
            },
            {
                path: 'miscellaneous', component: MiscellaneousuploadsComponent
            }
        ]
    }
];

export const addProfileRouting: ModuleWithProviders = RouterModule.forChild(addProfileRoutes);