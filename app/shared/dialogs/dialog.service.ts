import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationComponent } from './confirmation/confirmation.component';

/* * * * * * * * * * * *
* Interface for Dialog
* * * * * * * * * * * */
interface DialogObject {
    title: string;                  // Header text of the dialog
    message: string;                // Body text of the dialog
    yesLabel: string;               // Yes button label
    noLabel?: string;               // No button label, button won't be displayed when nothing is assigned
    hasRequiredInput?: boolean;     // If modal has an input for comment, pass it as true
}

@Injectable()
export class DialogService {
    defaults: DialogObject[] = [
        {
            title: 'Header',
            message: 'Message',
            yesLabel: 'OK',
            noLabel: 'CANCEL',
            hasRequiredInput: false
        }
    ];

    constructor(
        private matDialog: MatDialog
    ) {}

    /*
    * Method which renders the dialog
    * @param data: data used for rendering the dialog
    * @param width: width of the dialog, default is 300px
    * @param disableClose: flag whether to render close button on or not, default disable is true
    * @returns a Observable, which on subscritpion returns true/false/input text
    */
    render(
        data: DialogObject[] = this.defaults,
        width: string =  '350px',
        disableClose: boolean = true
    ) {
        const confirmDialog = this.matDialog.open(ConfirmationComponent, {
            width: width,
            disableClose: disableClose,
            data: data[0]
        });

        return confirmDialog.afterClosed();
    }
}
