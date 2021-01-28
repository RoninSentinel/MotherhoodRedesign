import { TestBed } from '@angular/core/testing';

import { DataAPIManagerService } from './data-apimanager.service';

describe('DataAPIManagerService', () => {
  let service: DataAPIManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataAPIManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
