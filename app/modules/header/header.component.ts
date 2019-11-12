import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from './../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';
import { CommonService } from '../../shared/services/common.service';
import { AppConstants } from '../../config/app.constants';
import { HeaderService } from './header.service';
import { DialogService } from './../../shared/dialogs/dialog.service';
import { ErrorHandleService } from './../../shared/services/errorhandle.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public display: Boolean = false;
  public issueDetails: any = {};
  public file: File;
  modules: any;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private appConstants: AppConstants,
    private headerService: HeaderService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.modules = [
      {
          name: 'Hiring',
          short_name: 'Hiring'
      },
      {
          name: 'Leave Management System',
          short_name: 'LMS'
      },
      {
        name: 'Leave Management System',
        short_name: 'MGR'
    }
    ];
  }

  @Input() title: string;
  @Input() username: string;
  @Input() details: any;
  @Input() backLinkVisibility: string;
  @Input() helpDocUrl: string;

  ngOnInit() {
  }

  navigateLanding() {
    this.commonService.navigateToHome();
  }

  logout() {
    localStorage.setItem('logout-event', 'logout' + Math.random());
    this.authService.logout();
  }

  openHelp(url: string = this.appConstants.getConstants().myspacenxDocUrl) {
    window.open(url, '_blank');
  }

  navigate(module) {
    switch (module) {
        case 'Hiring':
            this.commonService.navigateToHiring();
            break;
        case 'LMS':
            this.commonService.navigateToLeaveManagement();
            break;
        case 'MGR':
        this.commonService.navigateToLeaveManagement();
        break;
        default:
            break;
    }
  }

  reportanissue() {
    this.display = true;
  }

  restrictSpace(event: any, value: any) {
    if (event.which === 32) {
      if (value) {
        return true;
      }
      return false;
    }
  }

  submitIssue() {
    const self = this;
      self.display = false;
      self.loaderService.showLoading();
      this.headerService.submitIssue(this.issueDetails, this.file).subscribe(data => {
        self.resetData();
        self.loaderService.hideLoading();
        if (data.status === 201) {
          self.dialogService.render(
            [{
                title: 'Success',
                message: 'Issue Submitted Successfully',
                yesLabel: 'OK'
            }]
          );
        }
      }, error => {
          self.display = false;
          self.resetData();
          self.errorHandleService.handleErrors(error);
      });
  }

  resetData() {
    this.issueDetails = {};
    this.file = null;
    $('#upFileTxt').html('No file choosen');
  }

  uploadScreenshot(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      if (fileList[0] && fileList[0].size > 1000000) {
      } else {
        this.file = fileList[0];
        $('#upFileTxt').html(this.file.name);
      }
    }
  }

}
