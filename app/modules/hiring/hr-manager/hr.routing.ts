import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrComponent } from './hr.component';
import { HRManagerProspectiveHires } from './prospective-hires/prospective-hires.component';

export const hrRoutes: Routes = [
            /*{ path: 'prospect', component: HRManagerProspectiveHires },*/
            //{ path: 'verification/:id', component: HRManagerVerification },
            //{ path: 'offerdetail', component: HRManagerOfferLetterDetails },
            //{ path: 'offerdetail/:id', component: HRManagerOfferLetterDetails }
    /*{
        path: ':id/hr', component: HrComponent,
        children: [
            { path: '', component: HRManagerDashboard },
            { path: 'dashboard', component: HRManagerDashboard },
            { path: 'prospect', component: HRManagerProspectiveHires },
            { path: 'verification', component: HRManagerVerification },
            { path: 'offerdetail', component: HRManagerOfferLetterDetails }
        ]
    }*/
];
export const hrRouting: ModuleWithProviders = RouterModule.forChild(hrRoutes);