import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInfoComponent } from './financial-info.component';

describe('FinancialInfoComponent', () => {
  let component: FinancialInfoComponent;
  let fixture: ComponentFixture<FinancialInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
