import { Component } from '@angular/core';
// import { CpoComponent } from '../../cpo.component';
@Component({
  templateUrl: './offer-history.component.html'
})
export class OfferHistoryComponent {
	constructor(/*private CpoComponent: CpoComponent*/){
		// CpoComponent.URLtitle = "Dashboard / Offer History";
		$('.offer-letter-details .notification').height(1102);
	}
}