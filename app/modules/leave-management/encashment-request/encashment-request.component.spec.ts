import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncashmentRequestComponent } from './encashment-request.component';

xdescribe('EncashmentRequestComponent', () => {
  let component: EncashmentRequestComponent;
  let fixture: ComponentFixture<EncashmentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncashmentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncashmentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
