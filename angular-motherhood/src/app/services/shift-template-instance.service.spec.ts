import { TestBed } from '@angular/core/testing';

import { ShiftTemplateInstanceService } from './shift-template-instance.service';

describe('ShiftTemplateInstanceService', () => {
  let service: ShiftTemplateInstanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftTemplateInstanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
