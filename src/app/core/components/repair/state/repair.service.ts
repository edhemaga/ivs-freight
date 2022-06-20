import { RepairModalResponse } from './../../../../../../appcoretruckassist/model/repairModalResponse';

import { Injectable } from '@angular/core';
import { RepairService } from 'appcoretruckassist/api/repair.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepairTService {
  constructor(private repairService: RepairService) {}

  public getRepairModalDropdowns(): Observable<RepairModalResponse> {
    return this.repairService.apiRepairModalGet();
  }
}
