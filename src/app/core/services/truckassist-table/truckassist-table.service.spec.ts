import { TestBed } from '@angular/core/testing';

import { TruckassistTableService } from './truckassist-table.service';

describe('TruckassistTableService', () => {
  let service: TruckassistTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckassistTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
