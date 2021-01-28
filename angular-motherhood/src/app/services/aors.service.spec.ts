import { TestBed } from '@angular/core/testing';

import { AORsService } from './aors.service';

describe('AORsService', () => {
  let service: AORsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AORsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
