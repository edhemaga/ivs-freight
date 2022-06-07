import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  CreateTruckCommand,
  GetTruckModalResponse,
  TruckResponse,
  TruckService,
  UpdateTruckCommand,
} from 'appcoretruckassist';
import { CreateTruckResponse } from 'appcoretruckassist/model/createTruckResponse';

@Injectable({
  providedIn: 'root',
})
export class TruckModalService {
  constructor(private truckService: TruckService) {}

  public addTruck(data: CreateTruckCommand): Observable<CreateTruckResponse> {
    return this.truckService.apiTruckPost(data);
  }

  public updateTruck(data: UpdateTruckCommand): Observable<any> {
    return this.truckService.apiTruckPut(data);
  }

  public deleteTruckById(id: number): Observable<any> {
    return this.truckService.apiTruckIdDelete(id);
  }

  public getTruckById(id: number): Observable<TruckResponse> {
    return this.truckService.apiTruckIdGet(id);
  }

  public changeTruckStatus(id: number): Observable<any> {
    return this.truckService.apiTruckStatusIdPut(id, 'response');
  }

  public getTruckDropdowns(): Observable<GetTruckModalResponse> {
    return this.truckService.apiTruckModalGet();
  }
}
