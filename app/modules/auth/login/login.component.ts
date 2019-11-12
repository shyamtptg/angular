import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonService } from '../../../shared/services/common.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { LoaderService } from './../../../shared/services/loader.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    private isLogged: boolean = false;
    private userDetails: any;
    private userInfo: any;
    public isDisplay: boolean;
    @ViewChild('loginbutton') loginbutton: ElementRef;
    redirect: string;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        public commonService: CommonService,
        private idle: Idle,
        private keepalive: Keepalive,
        private loaderService: LoaderService,
        private dialogService: DialogService
    ) {
       this.redirect = this.route.snapshot.queryParams['returnUrl'] || '/home';
    }
    ngOnInit() {
       this.idle.stop();
    }
    login() {
        this.idle.watch();
        this.loaderService.showLoading();
        var self = this, userDetails: any;
        userDetails = self.commonService.getItem('currentUser');
        if(userDetails && userDetails.isLogged && self.commonService.getItem('tokenDetails') && self.commonService.getItem('currentUserInfo')){
            this.router.navigate([this.redirect]);
            this.loaderService.hideLoading();
        }
        else {
            this.authService.login(this.email, this.password).subscribe(data => {
                if (data['access_token']) {
                    this.userDetails = {
                        'username': this.email,
                        'isLogged': true
                    };
                    self.commonService.setItem('currentUser', this.userDetails);
                    self.commonService.setItem('tokenDetails', data);
                    self.authService.getUserDetails().subscribe(data => {
                        self.userInfo = data;
                        self.commonService.setItem('currentUserInfo', self.userInfo);
                        self.router.navigate([self.redirect]);
                        this.loaderService.hideLoading();
                    }, error => {
                        this.loaderService.hideLoading();
                        this.dialogService.render(
                            [{
                                title: 'Error',
                                message: error.message,
                                yesLabel: 'OK'
                            }]
                        );
                    });
                }
            }, error => {
                this.loaderService.hideLoading();
                this.dialogService.render(
                    [{
                        title: 'Error',
                        message: ((error.message) ? error['message'] : 'Invalid Username and Password'),
                        yesLabel: 'OK'
                    }]
                );
            });
        }
    }
    navigateToRegister() {
        this.router.navigate(['../register'], { relativeTo: this.route });
    }
    handleEnter(e: any) {
        if (e.charCode == 13 && !this.loginbutton.nativeElement.disabled) {
            this.login();
        }
    }
}