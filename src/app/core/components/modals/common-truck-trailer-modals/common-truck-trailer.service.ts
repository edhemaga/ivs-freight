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
   TrailerResponse,
   UpdateInspectionCommand,
   UpdateRegistrationCommand,
   UpdateTitleCommand,
   RegistrationModalResponse,
   TitleModalResponse,
} from 'appcoretruckassist';

import { Observable, tap } from 'rxjs';
import { TruckTService } from '../../truck/state/truck.service';
import { TrailerTService } from '../../trailer/state/trailer.service';
import { TruckActiveStore } from '../../truck/state/truck-active-state/truck-active.store';
import { TruckInactiveStore } from '../../truck/state/truck-inactive-state/truck-inactive.store';
import { TrailerInactiveStore } from '../../trailer/state/trailer-inactive-state/trailer-inactive.store';
import { TrailerActiveStore } from '../../trailer/state/trailer-active-state/trailer-active.store';
import { TruckItemStore } from '../../truck/state/truck-details-state/truck.details.store';
import { TrailerItemStore } from '../../trailer/state/trailer-details-state/trailer-details.store';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { TrucksDetailsListStore } from '../../truck/state/truck-details-list-state/truck-details-list.store';
import { TrailerDetailsListStore } from '../../trailer/state/trailer-details-list-state/trailer-details-list.store';

@Injectable({
   providedIn: 'root',
})
export class CommonTruckTrailerService {
   constructor(
      private registrationService: RegistrationService,
      private inspectionService: InspectionService,
      private truckActiveStore: TruckActiveStore,
      private truckInactiveStore: TruckInactiveStore,
      private trailerInactiveStore: TrailerInactiveStore,
      private trailerActiveStore: TrailerActiveStore,
      private titleService: TitleService,
      private truckService: TruckTService,
      private tableService: TruckassistTableService,
      private trailerService: TrailerTService,
      private truckItemStore: TruckItemStore,
      private trailerItemStore: TrailerItemStore,
      private tdlStore: TrucksDetailsListStore,
      private tadl: TrailerDetailsListStore
   ) {}

   // Registration
   public addRegistration(
      data: CreateRegistrationCommand,
      tabSelected?: string
   ): Observable<any> {
      return this.registrationService.apiRegistrationPost(data).pipe(
         tap(() => {
            // Truck Add Registration
            if (data.truckId) {
               const subTruck = this.truckService
                  .getTruckById(data.truckId)
                  .subscribe({
                     next: (truck: TruckResponse | any) => {
                        if (tabSelected === 'active') {
                           this.truckActiveStore.remove(
                              ({ id }) => id === data.truckId
                           );

                           this.truckActiveStore.add(truck);
                        } else if (tabSelected === 'inactive') {
                           this.truckInactiveStore.remove(
                              ({ id }) => id === data.truckId
                           );

                           this.truckInactiveStore.add(truck);
                        }
                        this.tdlStore.update(truck.id, {
                           registrations: truck.registrations,
                        });

                        this.tableService.sendActionAnimation({
                           animation: 'update',
                           data: truck,
                           id: truck.id,
                        });

                        subTruck.unsubscribe();
                     },
                  });
            }
            // Trailer Add Registration
            else if (data.trailerId) {
               const subTrailer = this.trailerService
                  .getTrailerById(data.trailerId)
                  .subscribe({
                     next: (trailer: TrailerResponse | any) => {
                        if (tabSelected === 'active') {
                           this.trailerActiveStore.remove(
                              ({ id }) => id === data.trailerId
                           );

                           this.trailerActiveStore.add(trailer);
                        } else if (tabSelected === 'inactive') {
                           this.trailerInactiveStore.remove(
                              ({ id }) => id === data.trailerId
                           );

                           this.trailerInactiveStore.add(trailer);
                        }
                        this.tadl.update(trailer.id, {
                           registrations: trailer.registrations,
                        });
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
      data: UpdateRegistrationCommand,
      tabSelected?: string
   ): Observable<object> {
      return this.registrationService.apiRegistrationPut(data).pipe(
         tap(() => {
            this.updateDataAnimation(tabSelected);
         })
      );
   }

   public getRegistrationById(id: number): Observable<RegistrationResponse> {
      return this.registrationService.apiRegistrationIdGet(id);
   }

   public deleteRegistrationById(
      id: number,
      tabSelected?: string
   ): Observable<any> {
      return this.registrationService.apiRegistrationIdDelete(id).pipe(
         tap(() => {
            this.updateDataAnimation(tabSelected);
         })
      );
   }

   public getRegistrationModalDropdowns(): Observable<RegistrationModalResponse> {
      return this.registrationService.apiRegistrationModalGet();
   }

   // Inspection
   public deleteInspectionById(
      id: number,
      tabSelected?: string
   ): Observable<any> {
      return this.inspectionService.apiInspectionIdDelete(id).pipe(
         tap(() => {
            this.updateDataAnimation(tabSelected);
         })
      );
   }

   public getInspectionById(id: number): Observable<InspectionResponse> {
      return this.inspectionService.apiInspectionIdGet(id);
   }

   public addInspection(
      data: CreateInspectionCommand,
      tabSelected?: string
   ): Observable<any> {
      return this.inspectionService.apiInspectionPost(data).pipe(
         tap(() => {
            // Truck Add Inspection
            if (data.truckId) {
               const subTruck = this.truckService
                  .getTruckById(data.truckId)
                  .subscribe({
                     next: (truck: TruckResponse | any) => {
                        if (tabSelected === 'active') {
                           this.truckActiveStore.remove(
                              ({ id }) => id === data.truckId
                           );

                           this.truckActiveStore.add(truck);
                        } else if (tabSelected === 'inactive') {
                           this.truckInactiveStore.remove(
                              ({ id }) => id === data.truckId
                           );

                           this.truckInactiveStore.add(truck);
                        }
                        this.tdlStore.update(truck.id, {
                           inspections: truck.inspections,
                        });
                        this.tableService.sendActionAnimation({
                           animation: 'update',
                           data: truck,
                           id: truck.id,
                        });

                        subTruck.unsubscribe();
                     },
                  });
            } else if (data.trailerId) {
               const subTrailer = this.trailerService
                  .getTrailerById(data.trailerId)
                  .subscribe({
                     next: (trailer: TrailerResponse | any) => {
                        if (tabSelected === 'active') {
                           this.trailerActiveStore.remove(
                              ({ id }) => id === data.trailerId
                           );

                           this.trailerActiveStore.add(trailer);
                        } else if (tabSelected === 'inactive') {
                           this.trailerInactiveStore.remove(
                              ({ id }) => id === data.trailerId
                           );

                           this.trailerInactiveStore.add(trailer);
                        }
                        this.tadl.update(trailer.id, {
                           inspections: trailer.inspections,
                        });
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

   public updateInspection(
      data: UpdateInspectionCommand,
      tabSelected?: string
   ): Observable<object> {
      return this.inspectionService.apiInspectionPut(data).pipe(
         tap(() => {
            this.updateDataAnimation(tabSelected);
         })
      );
   }

   // Title
   public deleteTitleById(id: number, tabSelected?: string): Observable<any> {
      return this.titleService.apiTitleIdDelete(id).pipe(
         tap(() => {
            this.updateDataAnimation(tabSelected);
         })
      );
   }

   public getTitleById(id: number): Observable<TitleResponse> {
      return this.titleService.apiTitleIdGet(id);
   }

   public addTitle(
      data: CreateTitleCommand,
      tabSelected?: string
   ): Observable<any> {
      return this.titleService.apiTitlePost(data).pipe(
         tap(() => {
            // Truck Add Inspection
            if (data.truckId) {
               const subTruck = this.truckService
                  .getTruckById(data.truckId)
                  .subscribe({
                     next: (truck: TruckResponse | any) => {
                        if (tabSelected === 'active') {
                           this.truckActiveStore.remove(
                              ({ id }) => id === data.truckId
                           );

                           this.truckActiveStore.add(truck);
                        } else if (tabSelected === 'inactive') {
                           this.truckInactiveStore.remove(
                              ({ id }) => id === data.truckId
                           );

                           this.truckInactiveStore.add(truck);
                        }
                        this.tdlStore.update(truck.id, {
                           titles: truck.titles,
                        });
                        this.tableService.sendActionAnimation({
                           animation: 'update',
                           data: truck,
                           id: truck.id,
                        });

                        subTruck.unsubscribe();
                     },
                  });
            } else if (data.trailerId) {
               const subTrailer = this.trailerService
                  .getTrailerById(data.trailerId)
                  .subscribe({
                     next: (trailer: TrailerResponse | any) => {
                        if (tabSelected === 'active') {
                           this.trailerActiveStore.remove(
                              ({ id }) => id === data.trailerId
                           );

                           this.trailerActiveStore.add(trailer);
                        } else if (tabSelected === 'inactive') {
                           this.trailerInactiveStore.remove(
                              ({ id }) => id === data.trailerId
                           );

                           this.trailerInactiveStore.add(trailer);
                        }
                        this.tadl.update(trailer.id, {
                           titles: trailer.titles,
                        });
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

   public updateTitle(
      data: UpdateTitleCommand,
      tabSelected?: string
   ): Observable<object> {
      return this.titleService.apiTitlePut(data).pipe(
         tap(() => {
            this.updateDataAnimation(tabSelected);
         })
      );
   }

   public getTitleModalDropdowns(): Observable<TitleModalResponse> {
      return this.titleService.apiTitleModalGet();
   }

   public updateDataAnimation(tabSelected?: string) {
      let val = window.location.pathname.includes('truck');
      let truckId;
      let trailerId;
      // Truck Add Inspection
      if (val == true) {
         truckId = this.truckItemStore.getValue().ids[0];
      } else {
         trailerId = this.trailerItemStore.getValue().ids[0];
      }
      if (truckId) {
         const subTruck = this.truckService.getTruckById(truckId).subscribe({
            next: (truck: TruckResponse | any) => {
               if (tabSelected === 'active') {
                  this.truckActiveStore.remove(({ id }) => id === truckId);

                  this.truckActiveStore.add(truck);
               } else if (tabSelected === 'inactive') {
                  this.truckInactiveStore.remove(({ id }) => id === truckId);

                  this.truckInactiveStore.add(truck);
               }
               this.tdlStore.update(truck.id, { titles: truck.titles });
               this.tdlStore.update(truck.id, {
                  registrations: truck.registrations,
               });
               this.tdlStore.update(truck.id, {
                  inspections: truck.inspections,
               });
               this.tableService.sendActionAnimation({
                  animation: 'update',
                  data: truck,
                  id: truck.id,
               });

               subTruck.unsubscribe();
            },
         });
      }
      if (trailerId) {
         const subTrailer = this.trailerService
            .getTrailerById(trailerId)
            .subscribe({
               next: (trailer: TrailerResponse | any) => {
                  if (tabSelected === 'active') {
                     this.trailerActiveStore.remove(
                        ({ id }) => id === trailerId
                     );

                     this.trailerActiveStore.add(trailer);
                  } else if (tabSelected === 'inactive') {
                     this.trailerInactiveStore.remove(
                        ({ id }) => id === trailerId
                     );

                     this.trailerInactiveStore.add(trailer);
                  }
                  this.tadl.update(trailer.id, {
                     titles: trailer.titles,
                  });
                  this.tadl.update(trailer.id, {
                     registrations: trailer.registrations,
                  });
                  this.tadl.update(trailer.id, {
                     inspections: trailer.inspections,
                  });
                  this.tableService.sendActionAnimation({
                     animation: 'update',
                     data: trailer,
                     id: trailer.id,
                  });

                  subTrailer.unsubscribe();
               },
            });
      }
   }
}
