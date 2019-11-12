import { Component, Input } from '@angular/core';

@Component({
	selector: 'offer-confirmation-dialog',
       templateUrl: 'offer-confirmation.component.html'
})

export class OfferConfirmationDialog {
    @Input() title: string;
    headerTitle: string;
    display: boolean = false;
    ngOnInit() {
      this.headerTitle = 'Confirmation - ' + this.title + ' Offer';
    }
	showDialog(){
       this.display = true;
	}
	onAfterHide(){
       this.display = false;
	}
}