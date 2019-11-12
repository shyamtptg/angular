import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationExperienceComponent } from './education-experience.component';

describe('EducationExperienceComponent', () => {
  let component: EducationExperienceComponent;
  let fixture: ComponentFixture<EducationExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
