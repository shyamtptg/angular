import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationAllocationComponent } from './workstation-allocation.component';

describe('WorkstationAllocationComponent', () => {
  let component: WorkstationAllocationComponent;
  let fixture: ComponentFixture<WorkstationAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkstationAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkstationAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
