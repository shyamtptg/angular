import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {
  MockLeaveManagementService
} from './../../../../mock/mock.service';
import { ActionButtonsComponent } from './action-buttons.component';

class MockBsModalService {
  test: string = 'test';
}
class MockBsModalRef {
  test: string = 'test';
}

xdescribe('ActionButtonsComponent', () => {
  let component: ActionButtonsComponent;
  let fixture: ComponentFixture<ActionButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActionButtonsComponent
      ],
      providers: [
        { provide: BsModalService, useClass: MockBsModalService },
        { provide: BsModalRef, useClass: MockBsModalRef },
        { provide: LeaveManagementService, useClass: MockLeaveManagementService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
