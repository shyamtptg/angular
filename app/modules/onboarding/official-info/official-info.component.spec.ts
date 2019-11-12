import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialInfoComponent } from './official-info.component';

describe('OfficialInfoComponent', () => {
  let component: OfficialInfoComponent;
  let fixture: ComponentFixture<OfficialInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficialInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
