import { FastTrackOfferRouting } from './fast-track-offer.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/primeng';

@NgModule({
    imports: [
        CommonModule,
        FastTrackOfferRouting,
        FormsModule,
        DialogModule
    ],
    declarations: [],
    providers: []
})
export class FastTrackOfferModule { }
