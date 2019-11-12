import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CpoComponent } from './cpo.component';
import { CpoProfiles } from './profiles/profiles.component';
import { CpoRecruiter } from './recruiter/recruiter.component';
import { CpoOffers } from './offers/offers.component';
import { ReadyToOffer } from './ready-to-offer/ready-to-offer.component';
import { ReleasedOffers } from './released/released-offers.component';
import { DeclinedOffers } from './declined/declined-offers.component';
import { CPOHiringDetails } from './hiringrequestdetails/hiring-request-details.component';
import { offerRoutes } from './offer-letter-details/offer-letter-details.routing';
import { PreviousRoute } from './offer-letter-details/previous-route/previous-route.guard';
import { RolePermissionRoute } from '../../../shared/guards/role-permission/role-permission.guard';
import { FastTrackOffer } from './fast-track-offer/fast-track-offer.component';
import { HRManagerOfferLetterDetails } from '../hr-manager/offerletter-details/offerletter-details.component';
export const cpoRoutes: Routes = [
            ...offerRoutes,
            { path: 'requestdetails/:id', component: CPOHiringDetails },
            { path: 'recruiter', component: CpoRecruiter },
            { path: 'profilesummary', component: CpoProfiles },
            { path: 'all', component: CpoOffers, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_OFFERS_LIST'}},
            { path: 'ready', component: ReadyToOffer, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_READY_TO_OFFER_LIST'}},
            { path: 'released', component: ReleasedOffers, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_RELEASED_OFFERS_LIST'}},
            { path: 'declined', component: DeclinedOffers, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_DECLINED_OFFERS_LIST'}},
            {path:'fastoffer',component:FastTrackOffer, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'CREATE_FASTTRACK_OFFER'}},
            { path: 'offerdetail', component: HRManagerOfferLetterDetails },
            { path: 'create-offer/:reqId/:needId/:prospectId', component: HRManagerOfferLetterDetails, canActivate: [RolePermissionRoute], data: {'feature': 'CREATE_OFFER'}},
            { path: 'offerdetail/:id', component: HRManagerOfferLetterDetails, canActivate: [RolePermissionRoute], data: {'feature': 'UPDATE_OFFER'}},
            { path: 'view/:id', component: HRManagerOfferLetterDetails, canActivate: [RolePermissionRoute], data: {'feature': 'VIEW_OFFER'}}
];
export const cpoRouting: ModuleWithProviders = RouterModule.forChild(cpoRoutes);