import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';
import { OffersDataService } from '../offers/offers.service';

var FileSaver = require('filesaver.js-npm');
@Component({
    templateUrl: './download-offer.component.html'
})
export class DownloadOffer implements ICellRendererAngularComp {
    public params: any;
    public hidden: boolean = true;
    constructor(private offersDataService: OffersDataService) { }
    agInit(params: any): void {
        this.params = params;
        if (params.data.documentId) {
            this.hidden = false;
        } else {
            this.hidden = true;
        }
    }
    public onLinkClick() {
        var response = this.params.data;
        var offerId = response.offerId,
            documentId = response.documentId,
            documentName = response.documentName;
        this.downloadOffer(offerId, documentId, documentName);
    }
    downloadOffer(offerId: string, documentId: string, documentName: string) {
        if (offerId && documentId) {
            this.offersDataService.downloadOffer(offerId, documentId).subscribe(data => {
                var blob = new Blob([data['_body']], { type: "application/octet-stream" });
                FileSaver.saveAs(blob, documentName);
            });
        }
    }
    refresh(): boolean {
        return false;
    }
}