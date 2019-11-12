import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
    title: string;
    userName: string;
    userDetails: any;
    helpDocUrl: string;
    div: any;
    employeeObject: any;
    constructor(
        private commonService: CommonService
    ) {
        this.userDetails = this.commonService.getItem('currentUserInfo');
        this.userName = (this.userDetails) ? this.userDetails['displayName'] : '';
        this.title = 'Onboarding';
        this.helpDocUrl = 'https://innomindssw.sharepoint.com/sites/InnomindsUniversity/MySpaceNx/SitePages/Employee.aspx';
        this.employeeObject = {
            info: [
                {
                    attr: 'Joining Date',
                    val: '10/06/2018',
                    cols: 2
                },
                {
                    attr: 'Practice',
                    val: 'UI',
                    cols: 2
                },
                {
                    attr: 'Competency',
                    val: 'Angular',
                    cols: 2
                },
                {
                    attr: 'Designation',
                    val: 'Senior Engineer',
                    cols: 2
                },
                {
                    attr: 'Experience',
                    val: '1 yrs 3 mons',
                    cols: 2
                },
                {
                    attr: 'Onboarding Status',
                    val: 'Not Started',
                    cols: 2
                }
            ],
            name: 'Charan Kumar Marasani',
            id: 123,
            image_path: 'test',
            cols: 17
        };
    }

    ngOnInit() {}
}
