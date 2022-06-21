import { RepairModalResponse } from './../../../../../../appcoretruckassist/model/repairModalResponse';

import { Injectable } from '@angular/core';
import { RepairService } from 'appcoretruckassist/api/repair.service';
import { Observable } from 'rxjs';
import {
  CreateRepairCommand,
  CreateResponse,
  RepairResponse,
  UpdateRepairCommand,
} from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class RepairTService {
  constructor(private repairService: RepairService) {}

  public getRepairModalDropdowns(): Observable<RepairModalResponse> {
    return this.repairService.apiRepairModalGet();
  }

  public addRepair(data: CreateRepairCommand): Observable<CreateResponse> {
    return this.repairService.apiRepairPost(data);
  }

  public updateRepair(data: UpdateRepairCommand): Observable<object> {
    return this.repairService.apiRepairPut(data);
  }

  public getRepairById(id: number): Observable<RepairResponse> {
    return this.repairService.apiRepairIdGet(id);
  }

  public deleteRepairById(id: number): Observable<object> {
    return this.repairService.apiRepairIdDelete(id);
  }
}
