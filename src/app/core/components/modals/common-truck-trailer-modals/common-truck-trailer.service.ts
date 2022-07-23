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
  TrailerResponse,
  UpdateInspectionCommand,
  UpdateRegistrationCommand,
  UpdateTitleCommand,
} from 'appcoretruckassist';
/* import { CreateInspectionResponse } from 'appcoretruckassist/model/createInspectionResponse';
import { CreateRegistrationResponse } from 'appcoretruckassist/model/createRegistrationResponse';
import { CreateTitleResponse } from 'appcoretruckassist/model/createTitleResponse'; */
import { Observable, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TruckTService } from '../../truck/state/truck.service';
import { TrailerTService } from '../../trailer/state/trailer.service';
import { TrailerStore } from '../../trailer/state/trailer.store';

@Injectable({
  providedIn: 'root',
})
export class CommonTruckTrailerService {
  constructor(
    private registrationService: RegistrationService,
    private inspectionService: InspectionService,
    private titleService: TitleService,
    private truckService: TruckTService,
    private tableService: TruckassistTableService,
    private trailerStore: TrailerStore,
    private trailerService: TrailerTService
  ) {}

  /* Observable<CreateRegistrationResponse> */
  // Registration
  public addRegistration(
    data: CreateRegistrationCommand
  ): Observable<any> {
    return this.registrationService.apiRegistrationPost(data).pipe(
      tap(() => {
        /* Truck Add Registration */
        if(data.truckId){
          const subTruck = this.truckService.getTruckById(data.truckId).subscribe({
            next: (truck: TruckResponse | any) => {
              // TODO
             /*  this.truckStore.remove(({ id }) => id === truck.id);
  
              this.truckStore.add(truck); */
  
              this.tableService.sendActionAnimation({
                animation: 'update',
                data: truck,
                id: truck.id,
              });
  
              subTruck.unsubscribe();
            },
          });
        }else if(data.trailerId){
          const subTrailer = this.trailerService.getTrailerById(data.trailerId).subscribe({
            next: (trailer: TrailerResponse | any) => {
              this.trailerStore.remove(({ id }) => id === trailer.id);
               
              this.trailerStore.add(trailer);
  
              this.tableService.sendActionAnimation({
                animation: 'update',
                data: trailer,
                id: trailer.id,
              });
  
              subTrailer.unsubscribe();
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

  /* Observable<CreateInspectionResponse> */
  public addInspection(
    data: CreateInspectionCommand
  ): Observable<any> {
    return this.inspectionService.apiInspectionPost(data).pipe(
      tap(() => {
        /* Truck Add Inspection */
        if(data.truckId){
          const subTruck = this.truckService.getTruckById(data.truckId).subscribe({
            next: (truck: TruckResponse | any) => {
              // TODO
             /*  this.truckStore.remove(({ id }) => id === truck.id);
  
              this.truckStore.add(truck); */
  
              this.tableService.sendActionAnimation({
                animation: 'update',
                data: truck,
                id: truck.id,
              });
  
              subTruck.unsubscribe();
            },
          });
        }else if(data.trailerId){
          const subTrailer = this.trailerService.getTrailerById(data.trailerId).subscribe({
            next: (trailer: TrailerResponse | any) => {
              this.trailerStore.remove(({ id }) => id === trailer.id);
               
              this.trailerStore.add(trailer);
  
              this.tableService.sendActionAnimation({
                animation: 'update',
                data: trailer,
                id: trailer.id,
              });
  
              subTrailer.unsubscribe();
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

  /*  Observable<CreateTitleResponse> */
  public addTitle(data: CreateTitleCommand): Observable<any> {
    return this.titleService.apiTitlePost(data);
  }

  public updateITitle(data: UpdateTitleCommand): Observable<object> {
    return this.titleService.apiTitlePut(data);
  }
}
