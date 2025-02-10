import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

// models
import {
    InspectionResponse,
    InspectionService,
    RegistrationResponse,
    RegistrationService,
    TitleResponse,
    TitleService,
    RegistrationModalResponse,
    TitleModalResponse,
} from 'appcoretruckassist';

// services
import { TruckService } from '@shared/services/truck.service';
import { TrailerService } from '@shared/services/trailer.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';

// store
import { TruckItemStore } from '@pages/truck/state/truck-details-state/truck.details.store';
import { TrailerItemStore } from '@pages/trailer/state/trailer-details-state/trailer-details.store';
import { TrucksDetailsListStore } from '@pages/truck/state/truck-details-list-state/truck-details-list.store';
import { TrailerDetailsListStore } from '@pages/trailer/state/trailer-details-list-state/trailer-details-list.store';
import { TruckActiveStore } from '@pages/truck/state/truck-active-state/truck-active.store';
import { TruckInactiveStore } from '@pages/truck/state/truck-inactive-state/truck-inactive.store';
import { TrailerActiveStore } from '@pages/trailer/state/trailer-active-state/trailer-active.store';
import { TrailerInactiveStore } from '@pages/trailer/state/trailer-inactive-state/trailer-inactive.store';

// enums
import { EGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class TruckTrailerService {
    constructor(
        private registrationService: RegistrationService,
        private inspectionService: InspectionService,
        private titleService: TitleService,
        private truckService: TruckService,
        private tableService: TruckassistTableService,
        private trailerService: TrailerService,
        private truckItemStore: TruckItemStore,
        private trailerItemStore: TrailerItemStore,
        private tdlStore: TrucksDetailsListStore,
        private tadl: TrailerDetailsListStore,
        private formDataService: FormDataService,
        private truckActiveStore: TruckActiveStore,
        private truckInactiveStore: TruckInactiveStore,
        private trailerActiveStore: TrailerActiveStore,
        private trailerInactiveStore: TrailerInactiveStore
    ) {}

    // Registration
    public addRegistration(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.registrationService.apiRegistrationPost().pipe(
            tap((res) => {
                // Truck Add Registration
                if (data.truckId) {
                    const newTitleId = res.id;
                    const tr = this.truckItemStore.getValue();
                    const truckData = JSON.parse(JSON.stringify(tr.entities));
                    let newData = truckData[data.truckId];

                    let truckById = this.truckService
                        .getTruckRegistrationByRegistrationId(res.id)
                        .subscribe({
                            next: (registration: any) => {
                                newData.registrations.push(registration);
                                this.tdlStore.add(newData);
                                this.truckItemStore.set([newData]);
                                this.tableService.sendActionAnimation({
                                    animation: EGeneralActions.UPDATE,
                                    data: newData,
                                    id: newData.id,
                                });
                            },
                        });
                }
                // Trailer Add Registration
                else if (data.trailerId) {
                    let trailerById = this.trailerService
                        .getTrailerById(data.trailerId)
                        .subscribe({
                            next: (trailer: any) => {
                                // Update Trailer Store
                                if (data.tabSelected === 'active') {
                                    this.trailerActiveStore.remove(
                                        ({ id }) => id === data.driverId
                                    );
                                    this.trailerActiveStore.add(trailer);
                                } else if (data.tabSelected === 'inactive') {
                                    this.trailerInactiveStore.remove(
                                        ({ id }) => id === data.driverId
                                    );
                                    this.trailerInactiveStore.add(trailer);
                                }
                                // Send Update Data To Table
                                this.tableService.sendActionAnimation({
                                    animation: EGeneralActions.UPDATE,
                                    data: trailer,
                                    id: trailer.id,
                                });
                                trailerById.unsubscribe();
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
                    const newTitleId = res.id;
                    const tr = this.truckItemStore.getValue();
                    const truckData = JSON.parse(JSON.stringify(tr.entities));
                    const newData = truckData[data.truckId];

                    let truckById = this.truckService
                        .getTruckInspectionByInspectionId(res.id)
                        .subscribe({
                            next: (inspection: any) => {
                                newData.inspections.push(inspection);
                                this.tdlStore.add(newData);
                                this.truckItemStore.set([newData]);

                                this.tableService.sendActionAnimation({
                                    animation: EGeneralActions.UPDATE,
                                    data: newData,
                                    id: newData.id,
                                });
                            },
                        });
                } else if (data.trailerId) {
                    let trailerById = this.trailerService
                        .getTrailerById(data.trailerId)
                        .subscribe({
                            next: (trailer: any) => {
                                // Send Update Data To Table
                                this.tableService.sendActionAnimation({
                                    animation: EGeneralActions.UPDATE,
                                    data: trailer,
                                    id: trailer.id,
                                });
                                trailerById.unsubscribe();
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

    public addTitle(data: any): Observable<any> {
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
                                    animation: EGeneralActions.UPDATE,
                                    data: newData,
                                    id: newData.id,
                                });
                                this.tdlStore.add(newData);
                                this.truckItemStore.set([newData]);
                                titleApi.unsubscribe();
                            },
                        });
                } else if (data.trailerId) {
                    let newTitleId = res?.id;
                    const tr = this.trailerItemStore.getValue();
                    const trailerData = JSON.parse(JSON.stringify(tr.entities));
                    let newData = trailerData[data.trailerId];

                    let titleApi = this.trailerService
                        .getTrailerTitleByTitleId(newTitleId)
                        .subscribe({
                            next: (resp: any) => {
                                newData.titles.push(resp);
                                this.tableService.sendActionAnimation({
                                    animation: EGeneralActions.UPDATE,
                                    data: newData,
                                    id: newData.id,
                                });
                                this.tadl.add(newData);
                                this.trailerItemStore.set([newData]);
                                titleApi.unsubscribe();
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

            if (cardUpdated == 'registration') {
                let regApi = this.truckService
                    .getTruckRegistrationByRegistrationId(cardId)
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
                                animation: EGeneralActions.UPDATE,
                                data: newData,
                                id: newData.id,
                            });

                            this.tdlStore.add(newData);
                            this.truckItemStore.set([newData]);
                            regApi.unsubscribe();
                        },
                    });
            } else if (cardUpdated == 'deleteRegistration') {
                let indexNum;
                newData.registrations.map((reg: any, index: any) => {
                    if (reg.id == cardId) {
                        indexNum = index;
                    }
                });

                newData.registrations.splice(indexNum, 1);

                this.tableService.sendActionAnimation({
                    animation: EGeneralActions.UPDATE,
                    data: newData,
                    id: newData.id,
                });
                this.tdlStore.add(newData);
                this.truckItemStore.set([newData]);
            } else if (cardUpdated == 'inspection') {
                let inspectionApi = this.trailerService
                    .getTrailerInspectionByInspectionId(cardId)
                    .subscribe({
                        next: (res: any) => {
                            newData.inspections.map((insp: any, index: any) => {
                                if (insp.id == res.id) {
                                    newData.inspections[index] = res;
                                }
                            });

                            this.tableService.sendActionAnimation({
                                animation: EGeneralActions.UPDATE,
                                data: newData,
                                id: newData.id,
                            });
                            this.tdlStore.add(newData);
                            this.truckItemStore.set([newData]);
                            inspectionApi.unsubscribe();
                        },
                    });
            } else if (cardUpdated == 'deleteInspection') {
                let indexNum;
                newData.inspections.map((reg: any, index: any) => {
                    if (reg.id == cardId) {
                        indexNum = index;
                    }
                });

                newData.inspections.splice(indexNum, 1);

                this.tableService.sendActionAnimation({
                    animation: EGeneralActions.UPDATE,
                    data: newData,
                    id: newData.id,
                });
                this.tdlStore.add(newData);
                this.truckItemStore.set([newData]);
            } else if (cardUpdated == 'title') {
                let titleApi = this.trailerService
                    .getTrailerTitleByTitleId(cardId)
                    .subscribe({
                        next: (res: any) => {
                            newData.titles.map((insp: any, index: any) => {
                                if (insp.id == res.id) {
                                    newData.titles[index] = res;
                                }
                            });

                            this.tableService.sendActionAnimation({
                                animation: EGeneralActions.UPDATE,
                                data: newData,
                                id: newData.id,
                            });
                            this.tdlStore.add(newData);
                            this.truckItemStore.set([newData]);
                            titleApi.unsubscribe();
                        },
                    });
            } else if (cardUpdated == 'deleteTitle') {
                let indexNum;
                newData.titles.map((reg: any, index: any) => {
                    if (reg.id == cardId) {
                        indexNum = index;
                    }
                });

                newData.titles.splice(indexNum, 1);

                this.tableService.sendActionAnimation({
                    animation: EGeneralActions.UPDATE,
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
                                animation: EGeneralActions.UPDATE,
                                data: newData,
                                id: newData.id,
                            });
                            this.tadl.add(newData);
                            this.trailerItemStore.set([newData]);
                            regApi.unsubscribe();
                        },
                    });
            } else if (cardUpdated == 'deleteRegistration') {
                let indexNum;
                newData.registrations.map((reg: any, index: any) => {
                    if (reg.id == cardId) {
                        indexNum = index;
                    }
                });

                newData.registrations.splice(indexNum, 1);

                this.tableService.sendActionAnimation({
                    animation: EGeneralActions.UPDATE,
                    data: newData,
                    id: newData.id,
                });
                this.tadl.add(newData);
                this.trailerItemStore.set([newData]);
            } else if (cardUpdated == 'inspection') {
                let inspectionApi = this.trailerService
                    .getTrailerInspectionByInspectionId(cardId)
                    .subscribe({
                        next: (res: any) => {
                            newData.inspections.map((insp: any, index: any) => {
                                if (insp.id == res.id) {
                                    newData.inspections[index] = res;
                                }
                            });

                            this.tableService.sendActionAnimation({
                                animation: EGeneralActions.UPDATE,
                                data: newData,
                                id: newData.id,
                            });
                            this.tadl.add(newData);
                            this.trailerItemStore.set([newData]);
                            inspectionApi.unsubscribe();
                        },
                    });
            } else if (cardUpdated == 'deleteInspection') {
                let indexNum;
                newData.inspections.map((reg: any, index: any) => {
                    if (reg.id == cardId) {
                        indexNum = index;
                    }
                });

                newData.inspections.splice(indexNum, 1);

                this.tableService.sendActionAnimation({
                    animation: EGeneralActions.UPDATE,
                    data: newData,
                    id: newData.id,
                });
                this.tadl.add(newData);
                this.trailerItemStore.set([newData]);
            } else if (cardUpdated == 'title') {
                let titleApi = this.trailerService
                    .getTrailerTitleByTitleId(cardId)
                    .subscribe({
                        next: (res: any) => {
                            newData.titles.map((insp: any, index: any) => {
                                if (insp.id == res.id) {
                                    newData.titles[index] = res;
                                }
                            });

                            this.tableService.sendActionAnimation({
                                animation: EGeneralActions.UPDATE,
                                data: newData,
                                id: newData.id,
                            });
                            this.tadl.add(newData);
                            this.trailerItemStore.set([newData]);
                            titleApi.unsubscribe();
                        },
                    });
            } else if (cardUpdated == 'deleteTitle') {
                let indexNum;
                newData.titles.map((reg: any, index: any) => {
                    if (reg.id == cardId) {
                        indexNum = index;
                    }
                });

                newData.titles.splice(indexNum, 1);

                this.tableService.sendActionAnimation({
                    animation: EGeneralActions.UPDATE,
                    data: newData,
                    id: newData.id,
                });
                this.tadl.add(newData);
                this.trailerItemStore.set([newData]);
            }
        }
    }
}
