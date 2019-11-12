import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { HiringComponent } from '../../../hiring.component';
import { OffersDataService } from '../../offers/offers.service';
import { LoaderService } from '../../../../../shared/services/loader.service';

var FileSaver = require('filesaver.js-npm');
@Component({
  templateUrl: 'offer-letter.component.html'
})
export class OfferLetterComponent {
  pdfSrc: any = '';
  password: any = '';
  pdfData: any;
  docName: any = '';
  page: number = 1;
  zoom: number = 1.3;
  originalSize: boolean = false;
  showAll: boolean = false;
  hidePasswordContainer:boolean = false;
  hidePdfContainer: boolean = true;
  hideErrorMsg: boolean = true;
  pdf: any;
  offerId: string;
  offerDetails: any;
  constructor(private offersDataService: OffersDataService,
     private HiringComponent: HiringComponent,
      private router: Router,
       private route: ActivatedRoute,
        private dialogService: DialogService,
         private loaderService: LoaderService) {
    //this.onScrollCallback = this.onLoadComplete.bind(this);
    HiringComponent.URLtitle = "Offers / Offer Letter";
  }
  incrementPage(amount: number) {
    this.page += amount;
  }
  incrementZoom(amount: number) {
    this.zoom += amount;
  }

  isIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    // other browser
    return false;
  }
}
