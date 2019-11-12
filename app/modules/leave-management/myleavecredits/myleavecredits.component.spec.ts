import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyleavecreditsComponent } from './myleavecredits.component';

xdescribe('MyleavecreditsComponent', () => {
  let component: MyleavecreditsComponent;
  let fixture: ComponentFixture<MyleavecreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyleavecreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyleavecreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
