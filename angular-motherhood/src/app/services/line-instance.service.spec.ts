import { TestBed } from '@angular/core/testing';

import { LineInstanceService } from './line-instance.service';

describe('LineInstanceService', () => {
  let service: LineInstanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineInstanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
