import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveManagementService } from '../leave-management.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CommonService } from '../../../shared/services/common.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { CalendarModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import {
  MockLoaderService, MockCommonService, MockDialogService, MockErrorHandleService, MockLeaveManagementService
} from './../../../../mock/mock.service';
import { CompoffComponent } from './compoff.component';

xdescribe('CompoffComponent', () => {
  let component: CompoffComponent;
  let fixture: ComponentFixture<CompoffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoffComponent ],
      imports: [ CalendarModule, AutoCompleteModule, FormsModule, PaginatorModule, AgGridModule ],
      providers: [
        { provide: LoaderService, useClass: MockLoaderService },
        { provide: LeaveManagementService, useClass: MockLeaveManagementService},
        { provide: DialogService, useClass: MockDialogService},
        { provide: CommonService, useClass: MockCommonService},
        { provide: ErrorHandleService, useClass: MockErrorHandleService}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
