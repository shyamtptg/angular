import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { hrRouting } from './hr.routing';
import { HrComponent } from './hr.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CalendarModule} from 'primeng/primeng';
import { HRManagerProspectiveHires } from './prospective-hires/prospective-hires.component';
import { HRManagerLeftNavigation } from './leftnavigation/left-navigation.component';
import { OfferConfigurationDetails } from './offerletter-details/offer-configuration/offer-configuration.component';
import { ChartsModule } from '../../../shared/charts/charts.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { EmailModule } from '../../../shared/email/email.module';
import { LeftNavigationModule } from '../../../shared/left-nav/left-navigation.module';
import { RemarksModule } from '../../../shared/remarks/remarks.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        hrRouting,
        NgbModule.forRoot(),
        ChartsModule,
        AgGridModule.withComponents([]),
        EmailModule,
        LeftNavigationModule,
        RemarksModule,
        CalendarModule
    ],
    declarations: [HrComponent, HRManagerLeftNavigation, HRManagerProspectiveHires, OfferConfigurationDetails]
})
export class HrManagerModule { }
