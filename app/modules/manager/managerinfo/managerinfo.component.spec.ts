import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerinfoComponent } from './managerinfo.component';

describe('ManagerinfoComponent', () => {
  let component: ManagerinfoComponent;
  let fixture: ComponentFixture<ManagerinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
