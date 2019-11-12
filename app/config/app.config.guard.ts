import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AppConfig } from './app.config';
@Injectable()
export class AppConfigGuard implements CanActivate {
    private isConfigLoaded = false;
    constructor(private appConfig: AppConfig) { }
    canActivate(): boolean | Observable<boolean> {
        return this.isConfigLoaded ? Observable.of(true) : this.getConfig()
    };

    getConfig() {
        let self = this;
        var config = this.appConfig.getConfig();
        /*config.subscribe(() => {
            self.isConfigLoaded = true;
        });*/
        if(config){
          self.isConfigLoaded = true;
        }
        return config;
    }
};