import { Injectable } from '@angular/core';
import { PMTruckListResponse, RepairService } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PmTService {
  constructor(private repairService: RepairService) {}

  public getPMTruckList(): Observable<PMTruckListResponse> {
    return this.repairService.apiRepairPmTruckListGet();
  }
}
