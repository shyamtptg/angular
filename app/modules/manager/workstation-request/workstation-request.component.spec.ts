import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationRequestComponent } from './workstation-request.component';

describe('WorkstationRequestComponent', () => {
  let component: WorkstationRequestComponent;
  let fixture: ComponentFixture<WorkstationRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkstationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkstationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
