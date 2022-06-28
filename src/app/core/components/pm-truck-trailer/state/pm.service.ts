import { Injectable } from '@angular/core';
import {
  PMTrailerListResponse,
  PMTruckListResponse,
  RepairService,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PmTService {
  constructor(private repairService: RepairService) {}

  public getPMTruckList(): Observable<PMTruckListResponse> {
    return this.repairService.apiRepairPmTruckListGet();
  }

  public getPMTrailerList(): Observable<PMTrailerListResponse> {
    return this.repairService.apiRepairPmTrailerListGet();
  }

  public getPmTruckUnitIdModal(id: number): Observable<PMTruckListResponse> {
    return this.repairService.apiRepairPmTruckUnitIdModalGet(id);
  }

  public getPmTrailerUnitIdModal(
    id: number
  ): Observable<PMTrailerListResponse> {
    return this.repairService.apiRepairPmTrailerUnitIdModalGet(id);
  }
}
