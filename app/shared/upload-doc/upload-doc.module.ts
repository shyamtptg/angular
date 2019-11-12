import { NgModule } from '@angular/core';
import { UploadComponent } from './upload-doc.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

@NgModule({    
    imports: [FormsModule,CommonModule],
    declarations: [UploadComponent],
    exports: [UploadComponent]
})
export class UploadDocModule { }