import { Injectable } from '@angular/core';
import {
    InspectionResponse,
    InspectionService,
    RegistrationResponse,
    RegistrationService,
    TitleResponse,
    TitleService,
    RegistrationModalResponse,
    TitleModalResponse,
    TruckResponse,
    TrailerResponse,
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
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

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
        private tadl: TrailerDetailsListStore,
        private formDataService: FormDataService
    ) {}

    // Registration
    public addRegistration(data: any, tabSelected?: string): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.registrationService.apiRegistrationPost().pipe(
            tap((res: any) => {
                // Truck Add Registration
                if (data.truckId) {
                    const subTruck = this.truckService
                        .getTruckById(data.truckId)
                        .subscribe({
                            next: (truck: any) => {
                                // if (tabSelected === 'active') {
                                //     this.truckActiveStore.remove(
                                //         ({ id }) => id === data.truckId
                                //     );
                                //     this.truckActiveStore.add(truck);
                                // } else if (tabSelected === 'inactive') {
                                //     this.truckInactiveStore.remove(
                                //         ({ id }) => id === data.truckId
                                //     );
                                //     this.truckInactiveStore.add(truck);
                                // }
                                // this.tdlStore.update(truck.id, {
                                //     registrations: truck.registrations,
                                // });
                                // this.tableService.sendActionAnimation({
                                //     animation: 'update',
                                //     data: truck,
                                //     id: truck.id,
                                // });
                                // subTruck.unsubscribe();
                            },
                        });
                }
                // Trailer Add Registration
                else if (data.trailerId) {
                    const subTrailer = this.trailerService
                        .getTrailerById(data.trailerId)
                        .subscribe({
                            next: (trailer: any) => {
                                // if (tabSelected === 'active') {
                                //     this.trailerActiveStore.remove(
                                //         ({ id }) => id === data.trailerId
                                //     );
                                //     this.trailerActiveStore.add(trailer);
                                // } else if (tabSelected === 'inactive') {
                                //     this.trailerInactiveStore.remove(
                                //         ({ id }) => id === data.trailerId
                                //     );
                                //     this.trailerInactiveStore.add(trailer);
                                // }
                                // this.tadl.update(trailer.id, {
                                //     registrations: trailer.registrations,
                                // });
                                // this.tableService.sendActionAnimation({
                                //     animation: 'update',
                                //     data: trailer,
                                //     id: trailer.id,
                                // });
                                // subTrailer.unsubscribe();
                            },
                        });
                }
            })
        );
    }

    public updateRegistration(
        data: any,
        tabSelected?: string
    ): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.registrationService.apiRegistrationPut().pipe(
            tap((res: any) => {
                this.updateDataAnimation(
                    tabSelected,
                    'registration',
                    res['id']
                );
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
                this.updateDataAnimation(tabSelected, 'deleteRegistration', id);
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
                this.updateDataAnimation(tabSelected, 'deleteInspection', id);
            })
        );
    }

    public getInspectionById(id: number): Observable<InspectionResponse> {
        return this.inspectionService.apiInspectionIdGet(id);
    }

    public addInspection(data: any, tabSelected?: string): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.inspectionService.apiInspectionPost().pipe(
            tap((res: any) => {
                // Truck Add Inspection
                if (data.truckId) {
                    const subTruck = this.truckService
                        .getTruckById(data.truckId)
                        .subscribe({
                            next: (truck: any) => {
                                // if (tabSelected === 'active') {
                                //     this.truckActiveStore.remove(
                                //         ({ id }) => id === data.truckId
                                //     );
                                //     this.truckActiveStore.add(truck);
                                // } else if (tabSelected === 'inactive') {
                                //     this.truckInactiveStore.remove(
                                //         ({ id }) => id === data.truckId
                                //     );
                                //     this.truckInactiveStore.add(truck);
                                // }
                                // this.tdlStore.update(truck.id, {
                                //     inspections: truck.inspections,
                                // });
                                // this.tableService.sendActionAnimation({
                                //     animation: 'update',
                                //     data: truck,
                                //     id: truck.id,
                                // });
                                // subTruck.unsubscribe();
                            },
                        });
                } else if (data.trailerId) {
                    const subTrailer = this.trailerService
                        .getTrailerById(data.trailerId)
                        .subscribe({
                            next: (trailer: any) => {
                                // if (tabSelected === 'active') {
                                //     this.trailerActiveStore.remove(
                                //         ({ id }) => id === data.trailerId
                                //     );
                                //     this.trailerActiveStore.add(trailer);
                                // } else if (tabSelected === 'inactive') {
                                //     this.trailerInactiveStore.remove(
                                //         ({ id }) => id === data.trailerId
                                //     );
                                //     this.trailerInactiveStore.add(trailer);
                                // }
                                // this.tadl.update(trailer.id, {
                                //     inspections: trailer.inspections,
                                // });
                                // this.tableService.sendActionAnimation({
                                //     animation: 'update',
                                //     data: trailer,
                                //     id: trailer.id,
                                // });
                                // subTrailer.unsubscribe();
                            },
                        });
                }
            })
        );
    }

    public updateInspection(
        data: any,
        tabSelected?: string
    ): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.inspectionService.apiInspectionPut().pipe(
            tap(() => {
                this.updateDataAnimation(tabSelected, 'inspection', data.id);
            })
        );
    }

    // Title
    public deleteTitleById(id: number, tabSelected?: string): Observable<any> {
        return this.titleService.apiTitleIdDelete(id).pipe(
            tap(() => {
                this.updateDataAnimation(tabSelected, 'deleteTitle', id);
            })
        );
    }

    public getTitleById(id: number): Observable<TitleResponse> {
        return this.titleService.apiTitleIdGet(id);
    }

    public addTitle(data: any, tabSelected?: string): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.titleService.apiTitlePost().pipe(
            tap((res: any) => {
                // Truck Add Inspection
                if (data.truckId) {
                    let newTitleId = res?.id;
                    const tr = this.truckItemStore.getValue();
                    const truckData = JSON.parse(JSON.stringify(tr.entities));
                    let newData = truckData[data.truckId];

                    let titleApi = this.trailerService
                        .getTrailerTitleByTitleId(newTitleId)
                        .subscribe({
                            next: (resp: any) => {
                                newData.titles.push(resp);
                                this.tableService.sendActionAnimation({
                                    animation: 'update',
                                    data: newData,
                                    id: newData.id,
                                });
                                this.tdlStore.add(newData);
                                this.truckItemStore.set([newData]);
                                titleApi.unsubscribe();
                            },
                        });
                } else if (data.trailerId) {
                    const subTrailer = this.trailerService
                        .getTrailerById(data.trailerId)
                        .subscribe({
                            next: (trailer: any) => {
                                // if (tabSelected === 'active') {
                                //     this.trailerActiveStore.remove(
                                //         ({ id }) => id === data.trailerId
                                //     );
                                //     this.trailerActiveStore.add(trailer);
                                // } else if (tabSelected === 'inactive') {
                                //     this.trailerInactiveStore.remove(
                                //         ({ id }) => id === data.trailerId
                                //     );
                                //     this.trailerInactiveStore.add(trailer);
                                // }
                                // this.tadl.update(trailer.id, {
                                //     titles: trailer.titles,
                                // });
                                // this.tableService.sendActionAnimation({
                                //     animation: 'update',
                                //     data: trailer,
                                //     id: trailer.id,
                                // });
                                // subTrailer.unsubscribe();
                            },
                        });
                }
            })
        );
    }

    public updateTitle(data: any, tabSelected?: string): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.titleService.apiTitlePut().pipe(
            tap(() => {
                this.updateDataAnimation(tabSelected, 'title', data.id);
            })
        );
    }

    public getTitleModalDropdowns(): Observable<TitleModalResponse> {
        return this.titleService.apiTitleModalGet();
    }

    public updateDataAnimation(
        tabSelected?: string,
        cardUpdated?: string,
        cardId?: any
    ) {
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
            const tr = this.truckItemStore.getValue();
            const truckData = JSON.parse(JSON.stringify(tr.entities));
            let newData = truckData[truckId];

            if ( cardUpdated == 'registration' ) {

                let regApi = this.truckService.getTruckRegistrationByRegistrationId(cardId).subscribe({
                    next: (res: any) => {
                        newData.registrations.map((reg: any, index: any) => {
                            if ( reg.id == res.id ) {
                                newData.registrations[index] = res;  
                            }
                        })

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });

                        this.tdlStore.add(newData);
                        this.truckItemStore.set([newData]);
                        regApi.unsubscribe();
                       
                    },
                });
            }   else if ( cardUpdated == 'deleteRegistration' ) {

                let indexNum;
                newData.registrations.map((reg: any, index: any) => {
                    if ( reg.id == cardId ) {
                        indexNum = index;
                    }
                })
               
                newData.registrations.splice(indexNum, 1);
                
                this.tableService.sendActionAnimation({
                    animation: 'update',
                    data: newData,
                    id: newData.id,
                });
                this.tdlStore.add(newData);
                this.truckItemStore.set([newData]);

            } else if ( cardUpdated == 'inspection' ) {
                let inspectionApi = this.trailerService.getTrailerInspectionByInspectionId(cardId).subscribe({
                    next: (res: any) => {
                        newData.inspections.map((insp: any, index: any) => {
                            if ( insp.id == res.id ) {
                                newData.inspections[index] = res;  
                            }
                        })

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });
                        this.tdlStore.add(newData);
                        this.truckItemStore.set([newData]);
                        inspectionApi.unsubscribe();
                       
                    },
                });
            } else if ( cardUpdated == 'deleteInspection' ) {

                let indexNum;
                newData.inspections.map((reg: any, index: any) => {
                    if ( reg.id == cardId ) {
                        indexNum = index;
                    }
                })
               
                newData.inspections.splice(indexNum, 1);
                
                this.tableService.sendActionAnimation({
                    animation: 'update',
                    data: newData,
                    id: newData.id,
                });
                this.tdlStore.add(newData);
                this.truckItemStore.set([newData]);

            } else if ( cardUpdated == 'title' ) {
                let titleApi = this.trailerService.getTrailerTitleByTitleId(cardId).subscribe({
                    next: (res: any) => {
                        newData.titles.map((insp: any, index: any) => {
                            if ( insp.id == res.id ) {
                                newData.titles[index] = res;  
                            }
                        })

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });
                        this.tdlStore.add(newData);
                        this.truckItemStore.set([newData]);
                        titleApi.unsubscribe();
                       
                    },
                });
            } else if ( cardUpdated == 'deleteTitle' ) {
                let indexNum;
                newData.titles.map((reg: any, index: any) => {
                    if ( reg.id == cardId ) {
                        indexNum = index;
                    }
                })
               
                newData.titles.splice(indexNum, 1);
                
                this.tableService.sendActionAnimation({
                    animation: 'update',
                    data: newData,
                    id: newData.id,
                });
                this.tdlStore.add(newData);
                this.truckItemStore.set([newData]);
            }
        }
        if (trailerId) {
            const tr = this.trailerItemStore.getValue();
            const trailerData = JSON.parse(JSON.stringify(tr.entities));
            let newData = trailerData[trailerId];
            if (cardUpdated == 'registration') {
                let regApi = this.trailerService
                    .getTrailerRegistrationByRegistrationId(cardId)
                    .subscribe({
                        next: (res: any) => {
                            newData.registrations.map(
                                (reg: any, index: any) => {
                                    if (reg.id == res.id) {
                                        newData.registrations[index] = res;
                                    }
                                }
                            );
                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });
                        this.tadl.add(newData);
                        this.trailerItemStore.set([newData]);
                        regApi.unsubscribe();
                       
                    },
                });
                
            } else if ( cardUpdated == 'deleteRegistration' ) {
                
                let indexNum;
                newData.registrations.map((reg: any, index: any) => {
                    if ( reg.id == cardId ) {
                        indexNum = index;
                    }
                })
               
                newData.registrations.splice(indexNum, 1);
                
                this.tableService.sendActionAnimation({
                    animation: 'update',
                    data: newData,
                    id: newData.id,
                });
                this.tadl.add(newData);
                this.trailerItemStore.set([newData]);
                

            } else if ( cardUpdated == 'inspection' ){
                let inspectionApi = this.trailerService.getTrailerInspectionByInspectionId(cardId).subscribe({
                    next: (res: any) => {
                        newData.inspections.map((insp: any, index: any) => {
                            if ( insp.id == res.id ) {
                                newData.inspections[index] = res;  
                            }
                        })

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });
                        this.tadl.add(newData);
                        this.trailerItemStore.set([newData]);
                        inspectionApi.unsubscribe();
                       
                    },
                });
            } else if ( cardUpdated == 'deleteInspection' ) {

                let indexNum;
                newData.inspections.map((reg: any, index: any) => {
                    if ( reg.id == cardId ) {
                        indexNum = index;
                    }
                })
               
                newData.inspections.splice(indexNum, 1);
                
                this.tableService.sendActionAnimation({
                    animation: 'update',
                    data: newData,
                    id: newData.id,
                });
                this.tadl.add(newData);
                this.trailerItemStore.set([newData]);

            } else if ( cardUpdated == 'title' ) {
                let titleApi = this.trailerService.getTrailerTitleByTitleId(cardId).subscribe({
                    next: (res: any) => {
                        newData.titles.map((insp: any, index: any) => {
                            if ( insp.id == res.id ) {
                                newData.titles[index] = res;  
                            }
                        })

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });
                        this.tadl.add(newData);
                        this.trailerItemStore.set([newData]);
                        titleApi.unsubscribe();
                       
                    },
                });
            } else if ( cardUpdated == 'deleteTitle' ) {
                let indexNum;
                newData.titles.map((reg: any, index: any) => {
                    if ( reg.id == cardId ) {
                        indexNum = index;
                    }
                })
               
                newData.titles.splice(indexNum, 1);
                
                this.tableService.sendActionAnimation({
                    animation: 'update',
                    data: newData,
                    id: newData.id,
                });
                this.tadl.add(newData);
                this.trailerItemStore.set([newData]);
            }
        }
    }
}
