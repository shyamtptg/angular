import { Component, OnInit } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from './shared/services/auth.service';
import { LoaderService } from './shared/services/loader.service';
import { DialogService } from './shared/dialogs/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import * as jQuery from 'jquery';

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
	loadingRouteConfig: boolean;
	isLoaded: boolean;
	
	constructor(
		private idle: Idle,
		private keepalive: Keepalive,
		private authService: AuthService,
		private loaderService: LoaderService,
		private dialogService: DialogService,
		private translate: TranslateService
	) {
		translate.setDefaultLang('en');
		translate.use('en');
		// sets an idle timeout of 1200 seconds, for testing purposes.
		idle.setIdle(1200);
		// sets a timeout period of 1200 seconds. after 1200 seconds of inactivity, the user will be considered timed out.
		idle.setTimeout(1200);
		idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
		idle.onTimeout.subscribe(() => {
			setTimeout(() => {
				this.dialogService.render(
					[{
						title: 'Session Expired',
						message: 'Your Session has expired. Please login again',
						yesLabel: 'OK'
					}],
					'auto'
				).subscribe(result => {
					if (result) {
						this.authService.logout();
					}
				});
			},0);
		});
		this.idle.watch();
		window.addEventListener('storage', (event) => {
    		if (event.key == 'logout-event') { 
        		this.authService.logout();
    		}
		});
	}
	ngOnInit() {
		setInterval(() => {this.isLoaded = this.loaderService.isLoaded; }, 1);
	}
}
