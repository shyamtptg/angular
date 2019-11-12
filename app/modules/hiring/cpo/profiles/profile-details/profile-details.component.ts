import { Component, ElementRef, ViewChild } from '@angular/core';
import { RemarksModal } from '../../../../../shared/remarks/remarks-modal/remarks-modal.component';

@Component({
	selector: 'profile-details-dialog',
	templateUrl: 'profile-details.component.html'
})

export class ProfileDetailsDialog {
    display: boolean = false;
    title:string = undefined;
    shortListTitle: string = "Shortlist Profile";
    rejectTitle: string = "Reject Profile";
    onHoldTitle: string = "Keep Profile On Hold";
    shortListId: string = "shortListProfile";
    rejectId: string = "rejectProfile";
    onHoldId: string = "onHoldProfile";
    @ViewChild('shortListModal') shortListModal:RemarksModal;
    @ViewChild('rejectModal') rejectModal:ElementRef;
    @ViewChild('onHoldModal') onHoldModal:ElementRef;
	showDialog(){
       this.display = true;
	}
	onAfterHide(){
       this.display = false;
	}
}