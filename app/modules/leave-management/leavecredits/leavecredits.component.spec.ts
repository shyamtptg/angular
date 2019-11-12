import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavecreditsComponent } from './leavecredits.component';

xdescribe('LeavecreditsComponent', () => {
  let component: LeavecreditsComponent;
  let fixture: ComponentFixture<LeavecreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavecreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavecreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
