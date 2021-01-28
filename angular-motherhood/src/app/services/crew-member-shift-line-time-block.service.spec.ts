import { TestBed } from '@angular/core/testing';

import { CrewMemberShiftLineTimeBlockService } from './crew-member-shift-line-time-block.service';

describe('CrewMemberShiftLineTimeBlockService', () => {
  let service: CrewMemberShiftLineTimeBlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrewMemberShiftLineTimeBlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
