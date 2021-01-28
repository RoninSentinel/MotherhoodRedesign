import { TestBed } from '@angular/core/testing';

import { FlightOrderService } from './flight-order.service';

describe('FlightOrderService', () => {
  let service: FlightOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
