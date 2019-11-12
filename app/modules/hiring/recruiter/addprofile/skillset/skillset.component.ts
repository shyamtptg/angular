import { Component, ViewChild } from '@angular/core';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { AppConstants } from '../../../../../config/app.constants';
import { SkillProficiency } from '../../models/SkillProficiency';
import { HiringComponent } from '../../../hiring.component';
import { AddProfileDataService } from '../add-profile.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { Router } from '@angular/router';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../../../shared/services/loader.service';

@Component({
    selector: 'skillset',
    templateUrl: './skillset.component.html'
})
export class SkillsetComponent {
    public msgs: any[] = [];
    private techSkills: Array<SkillProficiency>;
    public techSkillsCatwise: any;
    private availableTechSkills: Array<string>;
    public successMessage: string;
    private headers: any;
    public categoryId: any;
    public categoryNames: any;
    public skillProficiency: any = [];
    public categoryList: any = [];
    public editMode: boolean = false;
    public viewMode: boolean = false;
    public hideEdit: boolean = true;
    public hide: boolean = false;
    constructor(
        private appConstants: AppConstants,
        private psService: AddProfileDataService,
        public commonService: CommonService,
        private router: Router,
        private dialogService: DialogService,
        private loaderService: LoaderService,
        private hiringComponent: HiringComponent,
        private errorHandleService: ErrorHandleService
    ) {
        this.hiringComponent.URLtitle = "Profiles / Skillset";
    }
    ngOnInit() {
        let currentUrl = this.router.url.match("attach");
        if (currentUrl && currentUrl.length) {
          this.hide = true;
        }
        this.techSkillsCatwise = {
            'skillSets': []
        };
        var data = this.psService.getHiringCombos(), self = this;
        if (data) {
            this.categoryNames = data['SKILL_CATEGORY'];
            this.categoryId = 9999;
        }
        var data: any = this.psService.getSkillData();
        if (data) {
          self.loadDetails();
        } else {
          self.psService.loadProspectDataById(self.psService.profileId).subscribe(data => {
            self.psService.ProspectData = data;
            self.psService.getHiringComboDetails().subscribe(data => {
              self.psService.hiringComboData = data;
              self.categoryNames = data['SKILL_CATEGORY'];
              self.categoryId = 9999;
              self.loadDetails();
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
          }, error => {
            self.errorHandleService.handleErrors(error);
          });
        }
    }
    loadDetails() {
        var data: any = this.psService.getSkillData(), self = this;
        this.categoryList = (data ? data["skillSets"] : undefined);
        if (!this.categoryList) {
            this.categoryList = [];
        }
        this.categoryList && this.categoryList.forEach(function (elem: any, ind: any) {
            var catId: any = elem['categoryId'];
            var categoryName = self.psService.getSkillsMap()['skillCatNames'][catId];
            elem['categoryName'] = categoryName;
            var skills = self.psService.getSkillsMap()['skills'][catId];
            var skillProficiencies = elem.skillProficiencies;
            skillProficiencies.forEach(function (elem: any, ind: any) {
                elem['skill'] = skills;
            });
        });
        this.techSkillsCatwise['skillSets'] = this.categoryList;
        this.viewMode = (this.psService.mode == 'view') ? true : false;
        this.hideEdit = (this.psService.mode == 'edit') ? false : true;
        this.headers = [{
            "skillHeader": {
                "item": "Skill",
                "experience": "Years of Experience",
                "rating": "Rate yourself"
            }
        }];
    }
    public AddCategory(categoryId: any): void {
        var categoryName = this.psService.getSkillsMap()['skillCatNames'][categoryId];
        this.headers = [{
            "skillHeader": {
                "item": "Skill",
                "experience": "Years of Experience",
                "rating": "Rate yourself"
            }
        }];
        this.categoryList.push({
            "categoryName": categoryName,
            "categoryId": categoryId,
            "skillProficiencies": []
        });
        this.techSkillsCatwise['skillSets'] = this.categoryList;
        this.availableTechSkills = this.psService.getSkillsMap()['skills'][categoryId];
        this.categoryId = 9999;
    }
    public AddSkill(categoryIndex: number): void {
        this.headers = [{
            "skillHeader": {
                "item": "Skill",
                "experience": "Years of Experience",
                "rating": "Rate yourself"
            }
        }];
        var catId: any = this.techSkillsCatwise['skillSets'][categoryIndex]['categoryId'];
        var skills = this.psService.getSkillsMap()['skills'][catId];
        this.techSkillsCatwise['skillSets'][categoryIndex].skillProficiencies
            .push(
            {
                "skill": skills,
                "yearsOfExperience": 0,
                "rating": 0,
                "isNew": true
            }
            );
        this.skillProficiency = this.techSkillsCatwise['skillSets'][categoryIndex].skillProficiencies;
    }
    removeCategory(rowIndex: number): void {
        this.techSkillsCatwise['skillSets'].splice(rowIndex, 1);
    }
    deleteTool(rowIndex: number): void {
        // this.items.splice(rowIndex, 1);
    }
    deleteSkill(rowIndex: number): void {
        // this.technicalSkillsList.splice(rowIndex, 1);
    }
    @ViewChild('skillDetailsForm') public skillForm: any;
    ngOnDestroy() {
        //$('.sidebar-menu').height('100%');
    }
    ngAfterViewChecked() {
        //var contentHeight = $('.content-wrapper').height();
        //$('.sidebar-menu').height(contentHeight+15);
    }
    saveNext(techSkillsCatwise: any): void {
        var msg: string = this.validateSkillset(techSkillsCatwise.skillSets);
        if (msg) {
            this.dialogService.render(
                [{
                    title: 'Warning',
                    message: msg,
                    yesLabel: 'OK'
                }]);
            return;
        }
        this.psService.updateProspectSkillData(techSkillsCatwise);
        var prospectData = this.psService.getProspectData(), self = this;
        var mode = this.psService.mode;
        self.loaderService.showLoading();
        if (mode == 'edit') {
            this.psService.updateProspectData(prospectData, prospectData['id']).subscribe(data => {
                if (data.status == 200) {
                    self.successMessage = 'Profile updated successfully';
                    self.loaderService.hideLoading();
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]).subscribe(result => {
                                this.navigateToProfiles(); 
                        });
                }
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        } else if (mode == 'new') {
            if(prospectData['hiringRequestId'] == ''){
               prospectData['hiringRequestId'] = null;
            }
            if(prospectData['hiringRequestNeedId'] == ''){
               prospectData['hiringRequestNeedId'] = null;
            }
            this.psService.saveProspectData(prospectData).subscribe(data => {
                var profileId = data['_body'];
                if (profileId) {
                    self.successMessage = 'Profile added successfully';
                    self.loaderService.hideLoading();
                    //$('[name=myModal]').modal('show');
                    this.dialogService.render(
                        [{
                            title: 'Success',
                            message: self.successMessage,
                            yesLabel: 'OK'
                        }]).subscribe(result => {
                                this.navigateToProfiles(); 
                        });

                }
            }, error => {
                self.errorHandleService.handleErrors(error);
            });
        }
    }
    validateSkillset(skillSets: any) {
        var msg: string = '';
        skillSets.forEach(function (elem: any, ind: any) {
            var proficiencies: any = elem.skillProficiencies;
            proficiencies.forEach(function (elem: any, ind: any) {
                if (!elem.skillId || !elem.yearsOfExperience || !elem.rating) {
                    msg = 'Fill all mandatory fields Skill, Years of experience and Rating for a skill category';
                }
            });
        });
        return msg;
    }
    navigateToProfiles() {
        debugger;
        this.psService.ProspectData = null;
        this.router.navigate(['../hiring/profiles/search']);
    }
    navigateToPrevious() {
        var route = localStorage.getItem('previousRoute');
        route = (route) ? route : '/hiring/profiles/all';
        this.router.navigate([route]);
    }
}


