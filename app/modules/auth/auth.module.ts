import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from './../header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HomeComponent } from '../../home/home.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { authRouting } from './auth.routing';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ChartsModule } from './../../shared/charts/charts.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        FormsModule,
        HeaderModule,
        FooterModule,
        authRouting,
        CommonModule,
        MatInputModule,
        FlexLayoutModule,
        ChartsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        AuthComponent,
        LoginComponent,
        HomeComponent,
        RegisterComponent,
        ForgotPasswordComponent
    ]
})
export class AuthModule { }
