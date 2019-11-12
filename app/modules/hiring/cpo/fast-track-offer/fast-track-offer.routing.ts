import { OfferLetterDetailsComponent } from './../offer-letter-details/offer-letter-details.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const offerRoutes: Routes = [
    {
        path: 'fasttrack', component: OfferLetterDetailsComponent 
    }
];

export const FastTrackOfferRouting: ModuleWithProviders = RouterModule.forChild(offerRoutes);