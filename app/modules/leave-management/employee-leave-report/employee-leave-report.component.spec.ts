import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { CommonService } from '../../../shared/services/common.service';
import { LeaveManagementService } from '../leave-management.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

import {
  MockErrorHandleService, MockCommonService, MockLeaveManagementService, MockDialogService
} from './../../../../mock/mock.service';
import { EmployeeLeaveReportComponent } from './employee-leave-report.component';

xdescribe('EmployeeLeaveReportComponent', () => {
  let component: EmployeeLeaveReportComponent;
  let fixture: ComponentFixture<EmployeeLeaveReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeLeaveReportComponent
      ],
      imports: [ CalendarModule, FormsModule ],
      providers: [
        { provide: ErrorHandleService, useClass: MockErrorHandleService },
        { provide: CommonService, useClass: MockCommonService },
        { provide: LeaveManagementService, useClass: MockLeaveManagementService },
        { provide: DialogService, useClass: MockDialogService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeaveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
