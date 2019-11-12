
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferLetterDetailsComponent } from './offer-letter-details.component';
import { OfferLetterComponent } from './offer-letter/offer-letter.component';
import { CheckListComponent } from './check-list/check-list.component';
import { OfferHistoryComponent } from './offer-history/offer-history.component';
import { RolePermissionRoute } from '../../../../shared/guards/role-permission/role-permission.guard';

export const offerRoutes: Routes = [
    {
        path: 'offer-letter/:id', component: OfferLetterDetailsComponent, canActivate: [RolePermissionRoute], data: {'feature': 'VIEW_OFFER_LETTER'}
    }
];

export const offerLetterDetailsRouting: ModuleWithProviders = RouterModule.forChild(offerRoutes);