import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingComponent } from './onboarding.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { HeaderModule } from './../header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { CalendarViewComponent } from './calendar/calendar.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { FinancialInfoComponent } from './financial-info/financial-info.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from 'ng-fullcalendar';
import { AppMaterialModule } from './../../app.material';
import { EmployeeStatisticComponent } from './employee-statistic/employee-statistic.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { EducationExperienceComponent } from './education-experience/education-experience.component';

import { PersonalInfoService } from './personal-info.service';
import { OfficialInfoComponent } from './official-info/official-info.component';
import { AddWorkComponent } from './add-work/add-work.component';
import { AddEducationComponent } from './add-education/add-education.component';
import { ReviewComponent } from './review/review.component';
import { SuccessComponent } from './success/success.component';
import { OnboardingService } from './onboarding.service';
import { SortByPipe } from './../../shared/pipes/sort-by.pipe';
import { FinalSubmitComponent } from './final-submit/final-submit.component';

@NgModule({
    imports: [
        CommonModule,
        OnboardingRoutingModule,
        HeaderModule,
        FooterModule,
        FormsModule,
        ReactiveFormsModule,
        FullCalendarModule,
        AppMaterialModule,
        CommonModule,
        FlexLayoutModule
    ],
    declarations: [
        OnboardingComponent,
        NavigationBarComponent,
        BasicInfoComponent,
        FinancialInfoComponent,
        CalendarViewComponent,
        ContactInfoComponent,
        EmergencyContactComponent,
        EmployeeStatisticComponent,
        OfficialInfoComponent,
        WorkExperienceComponent,
        EducationExperienceComponent,
        AddWorkComponent,
        AddEducationComponent,
        ReviewComponent,
        SuccessComponent,
        SortByPipe,
        FinalSubmitComponent
    ],
    entryComponents: [
        FinalSubmitComponent
    ],
    providers: [
        PersonalInfoService,
        OnboardingService
    ]
})
export class OnboardingModule { }
