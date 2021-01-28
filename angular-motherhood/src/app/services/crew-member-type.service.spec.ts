import { TestBed } from '@angular/core/testing';

import { CrewMemberTypeService } from './crew-member-type.service';

describe('CrewMemberTypeService', () => {
  let service: CrewMemberTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrewMemberTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
