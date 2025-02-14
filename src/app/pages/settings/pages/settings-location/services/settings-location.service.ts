import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

//Models
import {
    CompanyOfficeModalResponse,
    CompanyOfficeResponse,
    CompanyOfficeService as CompanyTOfficeService,
    CreateCompanyOfficeCommand,
    CreateParkingCommand,
    CreateResponse,
    CreateTerminalCommand,
    ParkingResponse,
    ParkingService,
    ParkingListResponse,
    TerminalResponse,
    TerminalService,
    UpdateCompanyOfficeCommand,
    UpdateParkingCommand,
    UpdateTerminalCommand,
} from 'appcoretruckassist';
import { TerminalListResponse } from 'appcoretruckassist';

//Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { CompanyParkingService } from '@pages/settings/services/company-parking.service';
import { CompanyTerminalService } from '@pages/settings/services/company-terminal.service';
import { CompanyOfficeService } from '@shared/services/company-office.service';

//Components
import { SettingsOfficeModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-parking-modal/settings-parking-modal.component';
import { SettingsTerminalModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-terminal-modal/settings-terminal-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';

//Stores
import { ParkingStore } from '@pages/settings/state/parking-state/company-parking.store';
import { OfficeStore } from '@pages/settings/state/setting-ofice-state/company-office.store';
import { TerminalStore } from '@pages/settings/state/settings-terminal-state/company-terminal.store';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { eGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class SettingsLocationService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private modalService: ModalService,
        private companyOfficeService: CompanyTOfficeService,
        private companyParkingService: ParkingService,
        private parkingService: CompanyParkingService,
        private companyTerminalService: TerminalService,
        private tableService: TruckassistTableService,
        private parkingStore: ParkingStore,
        private officeStore: OfficeStore,
        private officeService: CompanyOfficeService,
        private terminalStore: TerminalStore,
        private terminalService: CompanyTerminalService
    ) {}

    /**
     * Open Modal
     * @param type - payload
     * @param modalName - modal name
     */
    public onModalAction(
        data: { modalName: string; type?: any; id?: any },
        id?: any,
        companyOwned?: boolean
    ) {
        switch (data.modalName) {
            case 'parking': {
                this.modalService.openModal(
                    SettingsParkingModalComponent,
                    {
                        size: 'small',
                    },
                    { ...data.type }
                );
                break;
            }
            case 'office': {
                this.modalService.openModal(
                    SettingsOfficeModalComponent,
                    {
                        size: 'small',
                    },
                    { ...data.type }
                );
                break;
            }
            case 'repairshop': {
                this.modalService.openModal(
                    RepairShopModalComponent,
                    { size: TableStringEnum.SMALL },
                    { id, companyOwned: true }
                );
                break;
            }
            case 'terminal': {
                this.modalService.openModal(
                    SettingsTerminalModalComponent,
                    {
                        size: 'small',
                    },
                    { ...data.type }
                );
                break;
            }
            default:
                break;
        }
    }

    // Location Parking
    public deleteCompanyParkingById(parkingId: number): Observable<any> {
        return this.companyParkingService.apiParkingIdDelete(parkingId).pipe(
            tap(() => {
                const parkingSub = this.parkingService
                    .getParkingList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (parking: ParkingResponse | any) => {
                            this.parkingStore.remove(
                                ({ id }) => id === parkingId
                            );
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.DELETE,
                                data: parking,
                                id: parkingId,
                            });

                            parkingSub.unsubscribe();
                        },
                    });
            })
        );
    }

    public getCompanyParkingById(id: number): Observable<ParkingResponse> {
        return this.companyParkingService.apiParkingIdGet(id);
    }

    public addCompanyParking(
        data: CreateParkingCommand
    ): Observable<CreateResponse | any> {
        return this.companyParkingService.apiParkingPost(data).pipe(
            tap(() => {
                const parkingSub = this.parkingService
                    .getParkingList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (parking: ParkingListResponse | any) => {
                            this.parkingStore.add(parking.pagination.data);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.ADD,
                                data: parking,
                                id: parking.id,
                            });

                            parkingSub.unsubscribe();
                        },
                    });
            })
        );
    }

    public updateCompanyParking(data: UpdateParkingCommand): Observable<any> {
        return this.companyParkingService.apiParkingPut(data).pipe(
            tap(() => {
                const parkingSub = this.parkingService
                    .getParkingList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (parking: ParkingResponse | any) => {
                            this.parkingStore.remove(
                                ({ id }) => id === data.id
                            );

                            this.parkingStore.add(parking);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.UPDATE,
                                data: parking,
                                id: parking.id,
                            });

                            parkingSub.unsubscribe();
                        },
                    });
            })
        );
    }

    // Location Office
    public deleteCompanyOfficeById(officeId: number): Observable<any> {
        return this.companyOfficeService
            .apiCompanyofficeIdDelete(officeId)
            .pipe(
                tap(() => {
                    const officeSub = this.officeService
                        .getOfficeList(1, 25)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (office: CompanyOfficeResponse | any) => {
                                this.officeStore.remove(
                                    ({ id }) => id === officeId
                                );

                                this.tableService.sendActionAnimation({
                                    animation: eGeneralActions.DELETE,
                                    data: office,
                                    id: office.id,
                                });

                                officeSub.unsubscribe();
                            },
                        });
                })
            );
    }

    public getCompanyOfficeById(id: number): Observable<CompanyOfficeResponse> {
        return this.companyOfficeService.apiCompanyofficeIdGet(id);
    }

    public getModalDropdowns(): Observable<CompanyOfficeModalResponse> {
        return this.companyOfficeService.apiCompanyofficeModalGet();
    }

    public addCompanyOffice(
        data: CreateCompanyOfficeCommand
    ): Observable<CreateResponse> {
        return this.companyOfficeService.apiCompanyofficePost(data).pipe(
            tap(() => {
                const officeSub = this.officeService
                    .getOfficeList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (office: CompanyOfficeResponse | any) => {
                            this.officeStore.add(office.pagination.data);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.ADD,
                                data: office,
                                id: office.id,
                            });

                            officeSub.unsubscribe();
                        },
                    });
            })
        );
    }

    public updateCompanyOffice(
        data: UpdateCompanyOfficeCommand
    ): Observable<any> {
        return this.companyOfficeService.apiCompanyofficePut(data).pipe(
            tap((res: CreateResponse) => {
                const officeSub = this.officeService
                    .getOfficeList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (office: CompanyOfficeResponse | any) => {
                            this.officeStore.remove(({ id }) => id === res.id);

                            this.officeStore.add(office);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.UPDATE,
                                data: office,
                                id: office.id,
                            });

                            officeSub.unsubscribe();
                        },
                    });
            })
        );
    }

    // Location Terminal
    public deleteCompanyTerminalById(terminalId: number): Observable<any> {
        return this.companyTerminalService.apiTerminalIdDelete(terminalId).pipe(
            tap(() => {
                const terminalSub = this.terminalService
                    .getTerminalList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (terminal: TerminalListResponse | any) => {
                            this.terminalStore.remove(
                                ({ id }) => id === terminalId
                            );
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.DELETE,
                                data: terminal,
                                id: terminalId,
                            });

                            terminalSub.unsubscribe();
                        },
                    });
            })
        );
    }

    public getCompanyTerminalById(id: number): Observable<TerminalResponse> {
        return this.companyTerminalService.apiTerminalIdGet(id);
    }

    public addCompanyTerminal(
        data: CreateTerminalCommand
    ): Observable<CreateResponse> {
        return this.companyTerminalService.apiTerminalPost(data).pipe(
            tap((res: CreateResponse) => {
                const terminalSub = this.terminalService
                    .getTerminalList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (terminal: TerminalListResponse | any) => {
                            this.terminalStore.add(terminal.pagination.data);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.ADD,
                                data: terminal,
                                id: res.id,
                            });

                            terminalSub.unsubscribe();
                        },
                    });
            })
        );
    }

    public updateCompanyTerminal(data: UpdateTerminalCommand): Observable<any> {
        return this.companyTerminalService.apiTerminalPut(data).pipe(
            tap((res: CreateResponse) => {
                const terminalSub = this.terminalService
                    .getTerminalList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (terminal: TerminalListResponse | any) => {
                            this.terminalStore.add(terminal);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.UPDATE,
                                data: terminal,
                                id: res.id,
                            });

                            terminalSub.unsubscribe();
                        },
                    });
            })
        );
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
