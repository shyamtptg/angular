import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';
import { SearchService } from '../search.service';
import { ErrorHandleService } from '../../../../../../shared/services/errorhandle.service';
var FileSaver = require('filesaver.js-npm');
@Component({
    templateUrl: './download-link.component.html'
})
export class DownloadLink implements ICellRendererAngularComp {
    public params: any;
    public hidden: boolean = true;
    constructor(
        private searchService: SearchService,
        private errorHandleService: ErrorHandleService
    ) { }
    agInit(params: any): void {
        this.params = params;
        var prospect = params.data;
        if ((prospect.documentId && prospect.documentName) || (prospect.resumeId && prospect.resumeName)) {
            this.hidden = false;
        } else {
            this.hidden = true;
        }
    }
    public onLinkClick() {
        var prospect = this.params.data;
        if (prospect.resumeId && prospect.resumeName) {
            this.downloadResume(prospect.id, prospect.resumeId, prospect.resumeName);
        } else {
            this.downloadResume(prospect.id, prospect.documentId, prospect.documentName);
        }
    }
    downloadResume(prospectId: string, documentId: string, documentName: string) {
        if (documentId) {
            var documentId = documentId;
            documentName = (documentName) ? documentName : 'Resume';
            this.searchService.downloadResume(prospectId, documentId).subscribe(data => {
                var blob = new Blob([data['_body']], { type: "application/octet-stream" });
                FileSaver.saveAs(blob, documentName);
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
    refresh(): boolean {
        return false;
    }
}
