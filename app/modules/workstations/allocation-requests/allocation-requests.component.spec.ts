import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationRequestsComponent } from './allocation-requests.component';

describe('AllocationRequestsComponent', () => {
  let component: AllocationRequestsComponent;
  let fixture: ComponentFixture<AllocationRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocationRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
