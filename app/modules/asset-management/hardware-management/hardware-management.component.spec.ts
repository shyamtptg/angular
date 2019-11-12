import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareManagementComponent } from './hardware-management.component';

describe('HardwareManagementComponent', () => {
  let component: HardwareManagementComponent;
  let fixture: ComponentFixture<HardwareManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
