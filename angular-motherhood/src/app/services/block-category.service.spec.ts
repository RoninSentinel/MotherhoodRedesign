import { TestBed } from '@angular/core/testing';

import { BlockCategoryService } from './block-category.service';

describe('BlockCategoryService', () => {
  let service: BlockCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
