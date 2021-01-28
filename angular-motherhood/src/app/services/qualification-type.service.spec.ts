import { TestBed } from '@angular/core/testing';

import { QualificationTypeService } from './qualification-type.service';

describe('QualificationTypeService', () => {
  let service: QualificationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualificationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
