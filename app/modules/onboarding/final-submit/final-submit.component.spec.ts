import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSubmitComponent } from './final-submit.component';

describe('FinalSubmitComponent', () => {
  let component: FinalSubmitComponent;
  let fixture: ComponentFixture<FinalSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
