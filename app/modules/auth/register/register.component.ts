import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    email: string;
    password: string;
    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }
    ngOnInit() {
        this.authService.logout();
    }
    register() {
        this.authService.login(this.email, this.password);
        let redirect = '/hiring/12345/hiringmanager';
        // Redirect the user
        this.router.navigate([redirect]);
    }
    navigateToLogin() {
        this.router.navigate(['../login'], { relativeTo: this.route });
    }
}