import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveadjustmentComponent } from './leaveadjustment.component';

xdescribe('LeaveadjustmentComponent', () => {
  let component: LeaveadjustmentComponent;
  let fixture: ComponentFixture<LeaveadjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveadjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveadjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
