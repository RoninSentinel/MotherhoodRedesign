import { TestBed } from '@angular/core/testing';

import { LineTemplateService } from './line-template.service';

describe('LineTemplateService', () => {
  let service: LineTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
