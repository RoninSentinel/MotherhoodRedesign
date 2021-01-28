import { TestBed } from '@angular/core/testing';

import { ShiftTemplateService } from './shift-template.service';

describe('ShiftTemplateService', () => {
  let service: ShiftTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
