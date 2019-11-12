import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorHandleService} from './shared/services/errorhandle.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { CoreModule } from './modules/core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { AppConstants } from './config/app.constants';
import { AppConfig } from './config/app.config';
import { HttpService } from './shared/services/http.service';
import { LoaderService } from './shared/services/loader.service';
import { CommonService } from './shared/services/common.service';
import { AppConfigGuard } from './config/app.config.guard';
import { AuthGuard } from './modules/auth/auth.guard';
import { PreviousRoute } from './shared/guards/previous-route/previous-route.guard';
import { RolePermissionRoute } from './shared/guards/role-permission/role-permission.guard';
import { AppCustomPreloader } from './app.routing.loader';
import { HomeService } from './home/home.service';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AuthService } from './shared/services/auth.service';
import { AppMaterialModule } from './app.material';
import { ConfirmationComponent } from './shared/dialogs/confirmation/confirmation.component';
import { DialogService } from './shared/dialogs/dialog.service';
import { UtilService } from './util.service';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    routing,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    CoreModule,
    AuthModule,
    HttpModule,
    NgbModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppMaterialModule
  ],
  declarations: [AppComponent, ConfirmationComponent],
  bootstrap: [AppComponent],
  providers: [
    appRoutingProviders,
    AppConstants,
    ErrorHandleService,
    AuthService,
    AppConfig,
    AppConfigGuard,
    AuthGuard,
    PreviousRoute,
    RolePermissionRoute,
    HttpService,
    LoaderService,
    CommonService,
    AppCustomPreloader,
    HttpClient,
    HomeService,
    DialogService,
    UtilService,
  ],
  entryComponents: [
    ConfirmationComponent
  ]
})

export class AppModule { }
