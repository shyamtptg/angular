import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable()
export class AppConstants {
    private constants = {
        uiSkills: [ 'Angular JS', 'Angular 2', 'React', 'Native Script', 'NodeJS', 'Grunt', 'Webpack', 'Bower'],
        uiTools: [ 'UI Tool1', 'UI Tool2', 'UI Tool3', 'UI Tool4'],
        destinationURL: environment.serviceUrl,
        prospectQueryBasePath: '/api/q/prospectivehires',
        prospectCommandBasePath: '/api/c/prospectivehires',
        hiringQueryBasePath: '/api/q/recruitment',
        hiringCommandBasePath: '/api/c/recruitment',
        myspacenxApiUrl: environment.serviceUrl,
        myspacenxDocUrl: 'https://innomindssw.sharepoint.com/sites/InnomindsUniversity/MySpaceNx/SitePages/Home.aspx'
    };
    private host = {
       'hostname': 'localhost',
       'port': '8080',
       'baseUrl': 'localhost:8080'
    };
    getConstants() {
        return this.constants;
    }
    getHost() {
        return this.host;
    }
}
