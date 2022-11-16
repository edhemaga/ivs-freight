import { ParkingListResponse } from './../../../../../../../appcoretruckassist/model/parkingListResponse';
import { Injectable, OnDestroy } from '@angular/core';
import {
    CompanyOfficeModalResponse,
    CompanyOfficeResponse,
    CompanyOfficeService,
    CreateCompanyOfficeCommand,
    CreateParkingCommand,
    CreateResponse,
    CreateTerminalCommand,
    ParkingResponse,
    ParkingService,
    TerminalResponse,
    TerminalService,
    UpdateCompanyOfficeCommand,
    UpdateParkingCommand,
    UpdateTerminalCommand,
} from 'appcoretruckassist';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { SettingsOfficeModalComponent } from '../../settings-location/location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from '../../settings-location/location-modals/settings-parking-modal/settings-parking-modal.component';
import { SettingsRepairshopModalComponent } from '../../settings-location/location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsTerminalModalComponent } from '../../settings-location/location-modals/settings-terminal-modal/settings-terminal-modal.component';
import { CompanyParkingService } from '../../settings-location/settings-parking/parking-state/company-parking.service';
import { ParkingStore } from '../../settings-location/settings-parking/parking-state/company-parking.store';
import { OfficeStore } from '../../settings-location/settings-office/state/company-office.store';
import { CompanyTOfficeService } from '../../settings-location/settings-office/state/company-office.service';
import { TerminalStore } from '../../settings-location/settings-terminal/state/company-terminal.store';
import { CompanyTerminalService } from '../../settings-location/settings-terminal/state/company-terminal.service';
import { TerminalListResponse } from '../../../../../../../appcoretruckassist/model/terminalListResponse';

@Injectable({
    providedIn: 'root',
})
export class SettingsLocationService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private modalService: ModalService,
        private companyOfficeService: CompanyOfficeService,
        private companyParkingService: ParkingService,
        private parkingService: CompanyParkingService,
        private companyTerminalService: TerminalService,
        private tableService: TruckassistTableService,
        private parkingStore: ParkingStore,
        private officeStore: OfficeStore,
        private officeService: CompanyTOfficeService,
        private terminalStore: TerminalStore,
        private terminalService: CompanyTerminalService
    ) {}

    /**
     * Open Modal
     * @param type - payload
     * @param modalName - modal name
     */
    public onModalAction(data: { modalName: string; type?: any }) {
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
                    SettingsRepairshopModalComponent,
                    {
                        size: 'small',
                    },
                    { ...data.type }
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
            tap((res: CreateResponse) => {
                const parkingSub = this.parkingService
                    .getParkingList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (parking: ParkingResponse | any) => {
                            this.parkingStore.remove(
                                ({ id }) => id === parkingId
                            );
                            this.tableService.sendActionAnimation({
                                animation: 'delete',
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
            tap((res: CreateResponse) => {
                const parkingSub = this.parkingService
                    .getParkingList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (parking: ParkingListResponse | any) => {
                            this.parkingStore.add(parking.pagination.data);
                            this.tableService.sendActionAnimation({
                                animation: 'add',
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
            tap((res: CreateResponse) => {
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
                                animation: 'update',
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
                tap((res: CreateResponse) => {
                    const officeSub = this.officeService
                        .getOfficeList(1, 25)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (office: CompanyOfficeResponse | any) => {
                                this.officeStore.remove(
                                    ({ id }) => id === officeId
                                );

                                this.tableService.sendActionAnimation({
                                    animation: 'delete',
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
            tap((res: CreateResponse) => {
                const officeSub = this.officeService
                    .getOfficeList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (office: CompanyOfficeResponse | any) => {
                            this.officeStore.add(office.pagination.data);
                            this.tableService.sendActionAnimation({
                                animation: 'add',
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
                                animation: 'update',
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
            tap((res: CreateResponse) => {
                const terminalSub = this.terminalService
                    .getTerminalList(1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (terminal: TerminalListResponse | any) => {
                            this.terminalStore.remove(
                                ({ id }) => id === terminalId
                            );
                            this.tableService.sendActionAnimation({
                                animation: 'delete',
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
                                animation: 'add',
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
                                animation: 'update',
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
