import { Injectable } from '@angular/core';
import {
  PMTrailerListResponse,
  PMTruckListResponse,
  RepairService,
  UpdatePMTrailerListDefaultCommand,
  UpdatePMTrailerUnitListCommand,
  UpdatePMTruckDefaultListCommand,
  UpdatePMTruckUnitListCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PmTService {
  constructor(private repairService: RepairService) {}

  // PM LISTS
  public getPMTruckList(): Observable<PMTruckListResponse> {
    return this.repairService.apiRepairPmTruckListGet();
  }

  public getPMTrailerList(): Observable<PMTrailerListResponse> {
    return this.repairService.apiRepairPmTrailerListGet();
  }

  public addUpdatePMTruckList(
    data: UpdatePMTruckDefaultListCommand
  ): Observable<object> {
    return this.repairService.apiRepairPmTruckPut(data);
  }

  public addUpdatePMTrailerList(
    data: UpdatePMTrailerListDefaultCommand
  ): Observable<object> {
    return this.repairService.apiRepairPmTrailerPut(data);
  }

  // PM UNITS
  public getPmTruckUnitIdModal(id: number): Observable<PMTruckListResponse> {
    return this.repairService.apiRepairPmTruckUnitIdModalGet(id);
  }

  public getPmTrailerUnitIdModal(
    id: number
  ): Observable<PMTrailerListResponse> {
    return this.repairService.apiRepairPmTrailerUnitIdModalGet(id);
  }

  public addUpdatePMTruckUnit(
    data: UpdatePMTruckUnitListCommand
  ): Observable<object> {
    return this.repairService.apiRepairPmTruckUnitPut(data);
  }

  public addUpdatePMTrailerUnit(
    data: UpdatePMTrailerUnitListCommand
  ): Observable<object> {
    return this.repairService.apiRepairPmTrailerUnitPut(data);
  }
}
