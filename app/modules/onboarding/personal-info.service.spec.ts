import { TestBed } from '@angular/core/testing';

import { PersonalInfoService } from './personal-info.service';

describe('BasicInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonalInfoService = TestBed.get(PersonalInfoService);
    expect(service).toBeTruthy();
  });
});
