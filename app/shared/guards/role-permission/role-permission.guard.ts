import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot  } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Injectable()
export class RolePermissionRoute implements CanActivate {
  constructor(
    public commonService: CommonService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (!this.commonService.hideFeature(route.data.feature)) {
      return true;
    } else if (route.data.module === 'lms') {
      this.router.navigate(['/leave-management/dashboard']);
      return false;
    } else if (route.data.module === 'hiring') {
      this.router.navigate(['/hiring/hiring-requests/open-positions']);
      return false;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
