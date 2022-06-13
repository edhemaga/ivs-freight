import { Injectable } from '@angular/core';
import {
  CreateInspectionCommand,
  CreateRegistrationCommand,
  CreateTitleCommand,
  InspectionResponse,
  InspectionService,
  RegistrationResponse,
  RegistrationService,
  TitleResponse,
  TitleService,
  TruckResponse,
  TruckService,
  UpdateInspectionCommand,
  UpdateRegistrationCommand,
  UpdateTitleCommand,
} from 'appcoretruckassist';
import { CreateInspectionResponse } from 'appcoretruckassist/model/createInspectionResponse';
import { CreateRegistrationResponse } from 'appcoretruckassist/model/createRegistrationResponse';
import { CreateTitleResponse } from 'appcoretruckassist/model/createTitleResponse';
import { Observable, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TruckQuery } from '../../truck/state/truck.query';
import { TruckTService } from '../../truck/state/truck.service';
import { TruckStore } from '../../truck/state/truck.store';

@Injectable({
  providedIn: 'root',
})
export class CommonTruckTrailerService {
  constructor(
    private registrationService: RegistrationService,
    private inspectionService: InspectionService,
    private titleService: TitleService,
    private truckStore: TruckStore,
    private truckService: TruckTService,
    private truckQuery: TruckQuery,
    private tableService: TruckassistTableService
  ) {}

  // Registration
  public addRegistration(
    data: CreateRegistrationCommand
  ): Observable<CreateRegistrationResponse> {
    return this.registrationService.apiRegistrationPost(data).pipe(
      tap(() => {
        /* Truck Add Registration */
        if(data.truckId){
          const subTruck = this.truckService.getTruckById(data.truckId).subscribe({
            next: (truck: TruckResponse | any) => {
              this.truckStore.remove(({ id }) => id === truck.id);
  
              this.truckStore.add(truck);
  
              this.tableService.sendActionAnimation({
                animation: 'update',
                data: truck,
                id: truck.id,
              });
  
              subTruck.unsubscribe();
            },
          });
        }
      })
    );
  }

  public updateRegistration(
    data: UpdateRegistrationCommand
  ): Observable<object> {
    return this.registrationService.apiRegistrationPut(data);
  }

  public getRegistrationById(id: number): Observable<RegistrationResponse> {
    return this.registrationService.apiRegistrationIdGet(id);
  }

  public deleteRegistrationById(id: number): Observable<any> {
    return this.registrationService.apiRegistrationIdDelete(id);
  }

  // Inspection
  public deleteInspectionById(id: number): Observable<any> {
    return this.inspectionService.apiInspectionIdDelete(id);
  }

  public getInspectionById(id: number): Observable<InspectionResponse> {
    return this.inspectionService.apiInspectionIdGet(id);
  }

  public addInspection(
    data: CreateInspectionCommand
  ): Observable<CreateInspectionResponse> {
    return this.inspectionService.apiInspectionPost(data).pipe(
      tap(() => {
        /* Truck Add Inspection */
        if(data.truckId){
          const subTruck = this.truckService.getTruckById(data.truckId).subscribe({
            next: (truck: TruckResponse | any) => {
              this.truckStore.remove(({ id }) => id === truck.id);
  
              this.truckStore.add(truck);
  
              this.tableService.sendActionAnimation({
                animation: 'update',
                data: truck,
                id: truck.id,
              });
  
              subTruck.unsubscribe();
            },
          });
        }
      })
    );;
  }

  public updateInspection(data: UpdateInspectionCommand): Observable<object> {
    return this.inspectionService.apiInspectionPut(data);
  }

  // Title
  public deleteTitleById(id: number): Observable<any> {
    return this.titleService.apiTitleIdDelete(id);
  }

  public getTitleById(id: number): Observable<TitleResponse> {
    return this.titleService.apiTitleIdGet(id);
  }

  public addTitle(data: CreateTitleCommand): Observable<CreateTitleResponse> {
    return this.titleService.apiTitlePost(data);
  }

  public updateITitle(data: UpdateTitleCommand): Observable<object> {
    return this.titleService.apiTitlePut(data);
  }
}
