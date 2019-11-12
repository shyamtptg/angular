import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkfromhomeComponent } from './workfromhome.component';

xdescribe('WorkfromhomeComponent', () => {
  let component: WorkfromhomeComponent;
  let fixture: ComponentFixture<WorkfromhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkfromhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkfromhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
