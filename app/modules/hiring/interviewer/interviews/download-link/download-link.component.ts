import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';
import { InterviewDataService } from '../interviews.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

var FileSaver = require('filesaver.js-npm');
@Component({
    templateUrl: './download-link.component.html'
})
export class DownloadLink implements ICellRendererAngularComp {
    public params: any;
    public hidden: boolean = true;
    constructor(
        private interviewDataService: InterviewDataService,
        private dialogService: DialogService,
        private errorHandleService: ErrorHandleService
    ){}
    agInit(params: any): void {
        this.params = params;
        if (params.data.prospect && params.data.prospect.documents.length > 0) {
            this.hidden = false;
        } else {
            this.hidden = true;
        }
    }
    public onLinkClick() {
        var prospect = this.params.data.prospect;
        this.downloadResume(prospect.id, prospect.documents);
    }
    downloadResume(prospectId: string, documents: any) {
        if (documents.length > 0) {
            var documentId = documents[0]['documentId'],
            title = documents[0]['title'];
            this.interviewDataService.downloadResume(prospectId, documentId).subscribe(data => {
                var blob = new Blob([data['_body']], { type: "application/octet-stream" });
                title = (title) ? title : 'Resume.doc';
                FileSaver.saveAs(blob, title);
            }, error => {
                this.errorHandleService.handleErrors(error);
            });
        }
    }
    refresh(): boolean {
        return false;
    }
}