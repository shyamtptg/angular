import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeStatisticComponent } from './employee-statistic.component';

describe('EmployeeStatisticComponent', () => {
  let component: EmployeeStatisticComponent;
  let fixture: ComponentFixture<EmployeeStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
