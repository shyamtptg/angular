import { Component, Input } from '@angular/core';
import { AuthService } from './../../shared/services/auth.service';
import { CommonService } from './../../shared/services/common.service';
import { DialogService } from './../../shared/dialogs/dialog.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {
  public version: string;
  constructor(
    private authService: AuthService,
    public commonService: CommonService,
    private dialogService: DialogService
  ) {
    if (this.commonService.getItem('appVersion')) {
      this.version = this.commonService.getItem('appVersion');
    } else {
      this.authService.getAppInfo().subscribe(data => {
        this.version = (data.versionNumber) ? data.versionNumber.split('-')[0] : '';
        (this.version) ? this.commonService.setItem('appVersion', this.version) : this.version;
      }, error => {
        this.dialogService.render(
          [{
              title: 'Error',
              message: error.message,
              yesLabel: 'OK'
          }]
        );
      });
    }
  }
}
