import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/primeng';
import { offerLetterDetailsRouting } from './offer-letter-details.routing';
import { OfferLetterDetailsComponent } from './offer-letter-details.component';
import { OfferLetterComponent } from './offer-letter/offer-letter.component';
import { CheckListComponent } from './check-list/check-list.component';
import { OfferHistoryComponent } from './offer-history/offer-history.component';
import { PdfViewerComponent } from '../../../../shared/pdf-viewer/pdf-viewer.component';
import { OfferConfirmationDialog } from './offer-confirmation/offer-confirmation.component';
// import { Tabs } from '../../shared/tablist/tabs';
// import { Tab } from '../../shared/tablist/tab';
import { TabsModule } from '../../../../shared/tablist/tabs.module';
import { PreviousRoute } from './previous-route/previous-route.guard';
import { InfiniteScrollModule } from '../../../../shared/infinite-scrolling/infinite-scroll.module';

@NgModule({
    imports: [
        CommonModule,
        offerLetterDetailsRouting,
        FormsModule,
        DialogModule,
        InfiniteScrollModule,
        TabsModule
    ],
    declarations: [
        OfferLetterDetailsComponent,
        OfferLetterComponent,
        CheckListComponent,
        OfferHistoryComponent,
        PdfViewerComponent,
        OfferConfirmationDialog
    ],
    providers: [ PreviousRoute ]
})
export class OfferLetterDetailsModule { }
