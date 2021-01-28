import { TestBed } from '@angular/core/testing';

import { ShiftLineTimeBlockService } from './shift-line-time-block.service';

describe('ShiftLineTimeBlockService', () => {
  let service: ShiftLineTimeBlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftLineTimeBlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
