import { TestBed } from '@angular/core/testing';

import { MotherhoodSchedulerService } from './motherhood-scheduler.service';

describe('MotherhoodSchedulerService', () => {
  let service: MotherhoodSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotherhoodSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
