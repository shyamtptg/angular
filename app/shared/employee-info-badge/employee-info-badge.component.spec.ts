import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoBadgeComponent } from './employee-info-badge.component';

describe('EmployeeInfoBadgeComponent', () => {
  let component: EmployeeInfoBadgeComponent;
  let fixture: ComponentFixture<EmployeeInfoBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeInfoBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeInfoBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
