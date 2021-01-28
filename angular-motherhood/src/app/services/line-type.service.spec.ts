import { TestBed } from '@angular/core/testing';

import { LineTypeService } from './line-type.service';

describe('LineTypeService', () => {
  let service: LineTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
