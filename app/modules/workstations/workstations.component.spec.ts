import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonService } from './../../shared/services/common.service';

import { MockCommonService } from '../../../mock/mock.service';
import { WorkstationsComponent } from './workstations.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('WorkstationsComponent', () => {
  let component: WorkstationsComponent;
  let fixture: ComponentFixture<WorkstationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkstationsComponent
      ],
      providers: [
        {provide: CommonService, useClass: MockCommonService}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkstationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
