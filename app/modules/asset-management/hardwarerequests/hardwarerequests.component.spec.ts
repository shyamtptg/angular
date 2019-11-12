import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwarerequestsComponent } from './hardwarerequests.component';

describe('HardwarerequestsComponent', () => {
  let component: HardwarerequestsComponent;
  let fixture: ComponentFixture<HardwarerequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwarerequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwarerequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
