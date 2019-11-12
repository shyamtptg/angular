import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveManagementService } from '../leave-management.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { DialogService } from './../../../shared/dialogs/dialog.service';
import {
  MockLeaveManagementService,
  MockErrorHandleService,
  MockLoaderService,
  MockDialogService
} from './../../../../mock/mock.service';
import { CancelrequestComponent } from './cancelrequest.component';

xdescribe('CancelrequestComponent', () => {
  let component: CancelrequestComponent;
  let fixture: ComponentFixture<CancelrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelrequestComponent ],
      providers: [
        { provide: LeaveManagementService, useClass: MockLeaveManagementService },
        { provide: ErrorHandleService, useClass: MockErrorHandleService },
        { provide: LoaderService, useClass: MockLoaderService },
        { provide: DialogService, useClass: MockDialogService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
