import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProfileComponent } from './add-profile.component';
import { PersonalComponent } from './personal/personal.component';
import { ProfessionalComponent } from './professional/professional.component';
import { SkillsetComponent } from './skillset/skillset.component';
import { Rating } from './skillset/rating.component';
import { MiscellaneousuploadsComponent } from './miscellaneous/miscellaneous-uploads.component';
import { UploadDocModule } from '../../../../shared/upload-doc/upload-doc.module';
import { addProfileRouting } from './add-profile.routing';
import { JobDescriptionModule } from './../../job-description/job-description.module';
import { SkillModule } from '../skill/skill.module';
import { EmailModule } from '../../../../shared/email/email.module';
import { CalendarModule, AutoCompleteModule} from 'primeng/primeng';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        addProfileRouting,
        JobDescriptionModule,
        EmailModule,
        SkillModule,
        UploadDocModule,
        CalendarModule,
        AutoCompleteModule
    ],
    declarations: [
        AddProfileComponent,
        PersonalComponent,
        ProfessionalComponent,
        SkillsetComponent,
        Rating,
        MiscellaneousuploadsComponent
    ]
})
export class AddProfileModule { }
