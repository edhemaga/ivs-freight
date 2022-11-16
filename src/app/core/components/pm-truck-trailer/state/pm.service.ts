import { Injectable } from '@angular/core';
import {
  PMTrailerListResponse,
  PMTrailerUnitListResponse,
  PMTruckListResponse,
  PMTruckUnitListResponse,
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

  // ------------------------  Truck --------------------------
  // Get PM Truck List
  public getPMTruckList(): Observable<PMTruckListResponse> {
    return this.repairService.apiRepairPmTruckListGet();
  }

  // Get Pm Truck Unit List
  public getPMTruckUnitList(
    truckId?: number,
    hideInactivePMs?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<PMTruckUnitListResponse> {
    return this.repairService.apiRepairPmTruckUnitListGet(
      truckId,
      hideInactivePMs,
      pageIndex,
      pageSize,
      companyId,
      sort,
      search,
      search1,
      search2
    );
  }

  // Get PM Truck Unit By Id
  public getPmTruckUnitIdModal(id: number): Observable<PMTruckListResponse> {
    return this.repairService.apiRepairPmTruckUnitIdModalGet(id);
  }

  // Update PM Truck List
  public addUpdatePMTruckList(
    data: UpdatePMTruckDefaultListCommand
  ): Observable<object> {
    return this.repairService.apiRepairPmTruckPut(data);
  }

  // Update PM Truck Unit
  public addUpdatePMTruckUnit(
    data: UpdatePMTruckUnitListCommand
  ): Observable<object> {
    return this.repairService.apiRepairPmTruckUnitPut(data);
  }

  // Delete PM Truck List
  public deletePMTruckById(id: number): Observable<object> {
    return this.repairService.apiRepairPmTruckIdDelete(id);
  }

  // ------------------------  Trailer --------------------------
  // Get Pm Trailer List
  public getPMTrailerList(
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<PMTrailerListResponse> {
    return this.repairService.apiRepairPmTrailerListGet(
      pageIndex,
      pageSize,
      companyId,
      sort,
      search,
      search1,
      search2
    );
  }

  // Get Pm Trailer Unit List
  public getPMTrailerUnitList(
    trailerId?: number,
    hideInactivePMs?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<PMTrailerUnitListResponse> {
    return this.repairService.apiRepairPmTrailerUnitListGet(
      trailerId,
      hideInactivePMs,
      pageIndex,
      pageSize,
      companyId,
      sort,
      search,
      search1,
      search2
    );
  }

  // Get PM TRailer Unit By Id
  public getPmTrailerUnitIdModal(
    id: number
  ): Observable<PMTrailerListResponse> {
    return this.repairService.apiRepairPmTrailerUnitIdModalGet(id);
  }

  // Update PM Trailer List
  public addUpdatePMTrailerList(
    data: UpdatePMTrailerListDefaultCommand
  ): Observable<object> {
    return this.repairService.apiRepairPmTrailerPut(data);
  }

  // Update PM Trailer Unit
  public addUpdatePMTrailerUnit(
    data: UpdatePMTrailerUnitListCommand
  ): Observable<object> {
    return this.repairService.apiRepairPmTrailerUnitPut(data);
  }

  // Delete Pm Trailer List
  public deletePMTrailerById(id: number): Observable<object> {
    return this.repairService.apiRepairPmTrailerIdDelete(id);
  }
}
