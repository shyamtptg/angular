import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDialogComponent } from './manager-dialog.component';

describe('ManagerDialogComponent', () => {
  let component: ManagerDialogComponent;
  let fixture: ComponentFixture<ManagerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
