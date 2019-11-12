import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from '../../home/home.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AppConfig } from '../../config/app.config';
import { AppConfigGuard } from '../../config/app.config.guard';
import { AuthGuard } from './auth.guard';
const authRoutes: Routes = [
    {
        path: '',
        component: AuthComponent,
        canActivate: [ AppConfigGuard , AppConfig],
        children: [
            { path: '', redirectTo: 'login', 'pathMatch': 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'forgotpassword', component: ForgotPasswordComponent }
        ]
    },
    { path: 'home', component: HomeComponent, canActivate: [ AuthGuard ] }
];

export const authRouting: ModuleWithProviders = RouterModule.forChild(authRoutes);
