import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddProfileDataService } from './add-profile.service';
import { ProfilesDataService } from '../profiles/profile.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './add-profile.component.html'
})
export class AddProfileComponent implements OnInit, OnDestroy {
  public code: string;
  public description: string;
  public location: string;
  public country: string;
  public id: any;
  public paramsSub: any;
  public hiringRequestOptions: any;
  public hiringNeedOptions: any;
  public addProfileData: any;
  public viewMode: boolean = false;
  public editMode: boolean = false;
  public attachMode: boolean = false;
  pageNum: number = 0;
  pageSize: number = 900;
  public hide: boolean = false;
  successMessage: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private addProfileDataService: AddProfileDataService,
    private router: Router,
    private profileDataService: ProfilesDataService,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.code = 'UX120981';
    this.description = 'UX Designer';
    this.location = 'Hyderabad';
    this.country = 'India';
    this.addProfileData = {};
  }
  ngOnInit() {
    this.addProfileDataService.ProspectData = undefined;
    var self = this;
    localStorage.setItem('profileRoute', 'true');
    let currentUrl = this.router.url.match("attach");
    if (currentUrl && currentUrl.length) {
      this.hide = true;
      this.attachMode = true;
    }
    if (self.commonService.hideFeature('VIEW_PROFILE_CONFIDENTIAL_DOCUMENT')) {
      $('.miscellaneous-link').hide();
    } else {
      $('.miscellaneous-link').show();
    }
    self.viewMode = (self.addProfileDataService.mode == 'view') ? true : false;
    self.editMode = (self.addProfileDataService.mode == 'edit') ? true : false;
    self.addProfileData.hiringRequestId = '';
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        self.addProfileDataService.profileId = params['id'];
        var view = self.router.url.match("profiles/view");
        if(view && view.length){
          self.viewMode = true;
          self.addProfileDataService.mode = 'view';
        }
        if(!self.addProfileDataService.mode && !self.commonService.hideFeature('UPDATE_PROFILE')){
          var url = this.router.url.match("attach")
          if(url && url.length){
            self.attachMode = true;
            self.addProfileDataService.mode = 'view';
          }else{
            self.editMode = true;
            self.addProfileDataService.mode = 'edit';
          }
        }
      }
      self.addProfileDataService.getAllHiringRequests(this.pageNum, this.pageSize).subscribe(data => {
        if (data['content']) {
          var activeRequests: any = [];
          data['content'].forEach(function (elem: any, ind: any) {
            if (elem.status == 'ACTIVE') {
              activeRequests.push(elem);
            }
          });
          self.hiringRequestOptions = activeRequests;
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    });
  }
  loadNeedsByHiringId() {
    var hiringId = this.addProfileData.hiringRequestId, self = this;
    if (hiringId) {
      self.addProfileDataService.getNeedsByHiringId(hiringId).subscribe(data => {
       self.hiringNeedOptions = data;
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    } else {
      self.hiringNeedOptions = [];
    }
    self.addProfileData.hiringRequestNeedId = '';
    self.updateAddProfileData();
  }
  updateAddProfileData() {
    this.addProfileDataService.updateAddProfileData(this.addProfileData);
  }
  attachProfile() {
    var hiringId = this.addProfileData.hiringRequestId, needId = this.addProfileData.hiringRequestNeedId, self = this,
      prospectId: string;
    prospectId = self.addProfileDataService.profileId;
    if (hiringId && needId) {
      self.loaderService.showLoading();
      self.profileDataService.attachProfiletoNeed(hiringId, needId, prospectId).subscribe(
        data => {
          if (data.status == 200) {
            self.successMessage = 'Profile attached successfully';
            self.loaderService.hideLoading();
            this.dialogService.render(
              [{
                  title: 'Success',
                  message: self.successMessage,
                  yesLabel: 'OK'
              }]).subscribe(result => {
                    self.navigateToSearch(); 
              });
          }
        },
        error => {
          self.errorHandleService.handleErrors(error);
        });
    } else {
      this.dialogService.render(
        [{
            title: 'Warning',
            message: 'Please select Hiring Request and Hiring Need before Attaching the profile.',
            yesLabel: 'OK'
        }]);
    }
  }
  ngOnDestroy() {
    this.addProfileDataService.ProspectData = undefined;
  }
  navigateToSearch() {
    this.router.navigate(['hiring/profiles/search']);
  }
}

