import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerwfhComponent } from './managerwfh.component';

xdescribe('ManagerwfhComponent', () => {
  let component: ManagerwfhComponent;
  let fixture: ComponentFixture<ManagerwfhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerwfhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerwfhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
