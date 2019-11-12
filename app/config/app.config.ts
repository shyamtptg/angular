import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot,Router, ActivatedRoute} from '@angular/router';
import { AppConstants } from './app.constants';
import { CommonService } from '../shared/services/common.service';

@Injectable()
export class AppConfig implements CanActivate {
    public _config: Object;
    public isConfigLoaded = false;
    private userDetails: any;
    private tokenDetails: any;
    redirect: string;
    constructor(private appConstants: AppConstants, private router: Router,private route:ActivatedRoute, public commonService: CommonService) {};
    get(key: string) {
        return this._config[key];
    };
  canActivate() {
        this.redirect = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.userDetails = this.commonService.getItem('currentUser');
        this.tokenDetails = this.commonService.getItem('tokenDetails');
        if(this.userDetails && this.userDetails.isLogged && this.tokenDetails && this.commonService.getItem('currentUserInfo')) {
            this.router.navigate([this.redirect]);
            return false;
        }
        return true;
    }
    getConfig() {
        let self = this;
        /*return this.http.get('http://localhost:8080/src/app/config/app.config.json')
            .map((res) => {
                self._config = res.json();
                self.isConfigLoaded = true;
                return true;
            })
            .share()
            .catch((error: any) => {
              ;
                return Observable.throw(error.json().error);
            });*/
            var host = this.appConstants.getHost();
            if(host){
                self._config = host;
                //localStorage.setItem('hostConfig', JSON.stringify(host));
                self.isConfigLoaded = true;
                return true;
            }
    }
}