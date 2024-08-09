import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';

import { catchError, of, Subject, takeUntil, tap } from 'rxjs';

// animations
import { dispatchBackgroundAnimation } from '@shared/animations/dispatch-background.animation';

// modules
import { moveItemInArray } from '@angular/cdk/drag-drop';

// pipes
import { ColorFinderPipe } from '@shared/pipes/color-finder.pipe';

// services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

// constants
import { DispatchTableConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants/dispatch-table.constants';

// enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-table-string.enum';

// models
import {
    CreateDispatchCommand,
    DispatchBoardResponse,
    DispatchStatus,
    ParkingDispatchModalResponse,
    ParkingService,
    SwitchDispatchCommand,
    UpdateDispatchCommand,
    DispatchModalResponse,
    DriverListResponse,
    TrailerListResponse,
    TrailerMinimalResponse,
    TruckListResponse,
    TruckMinimalResponse,
    DriverMinimalResponse,
    DispatchResponse,
} from 'appcoretruckassist';
import { DispatchBoardParkingEmiter } from '@pages/dispatch/models/dispatch-parking-emmiter.model';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

@Component({
    selector: 'app-dispatch-table',
    templateUrl: './dispatch-table.component.html',
    styleUrls: ['./dispatch-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ColorFinderPipe],
    animations: [dispatchBackgroundAnimation()],
})
export class DispatchTableComponent implements OnInit, OnDestroy {
    @Input() set dispatchTableData(data: DispatchBoardResponse) {
        this.initDispatchData(data);

        this.handleTruckTrailerAdditionalFields();

        this.handleHoursOfService();
    }

    @Input() set shortLists(lists: DispatchModalResponse) {
        this.handleTruckTrailerDriverLists(lists);
    }

    @Input() set isBoardLocked(isLocked: boolean) {
        this.isDispatchBoardLocked = isLocked;
    }

    @Input() toolbarWidth: number = 0;

    @Input() isAllBoardsList: boolean;

    @Output() onTableUnlockEmitter: EventEmitter<{ action: string }> =
        new EventEmitter();

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    private destroy$ = new Subject<void>();

    public isDrag: boolean = false;

    public checkForEmpty: string;

    public dispatchTableHeaderItems: { title?: string; icon?: string }[] = [];

    public dispatchData: DispatchBoardResponse;

    public isDispatchBoardLocked: boolean = true;
    public isDispatchBoardChangeInProgress: boolean = false;

    public isHoveringRowIndex: number = -1;

    public hasAdditionalFieldTruck: boolean = false;
    public hasAdditionalFieldTrailer: boolean = false;
    public hasLargeFieldParking: boolean = false;

    public truckList: TruckListResponse[];
    public trailerList: TrailerListResponse[];
    public driverList: DriverListResponse[];
    public parkingList: ParkingDispatchModalResponse[];

    public addNewTruckData: TruckMinimalResponse;

    public showAddAddressFieldIndex: number = -1;

    public parkingCount: number = 0;

    /////////////////////////////////////////// UPDATE

    testTimeout: any;
    startIndexTrailer: number;
    startIndexDriver: number;
    draggingType: string = '';

    openedDriverDropdown: number = -1;
    openedHosData = [];

    constructor(
        private cdRef: ChangeDetectorRef,

        // Pipes
        private colorFinderPipe: ColorFinderPipe,

        // Services
        private dispatcherService: DispatcherService,
        private parkingService: ParkingService
    ) {}

    set checkEmptySet(value: string) {
        setTimeout(() => {
            this.checkForEmpty = value;

            this.cdRef.detectChanges();
        }, 300);
    }

    ngOnInit(): void {
        this.getConstantData();

        this.getMainBoardColumnWidths();
    }

    public trackByIdentity = (index: number): number => index;

    private initDispatchData(data: DispatchBoardResponse): void {
        this.dispatchData = JSON.parse(JSON.stringify(data));

        this.parkingCount = this.dispatchData?.dispatches?.filter(
            (item) => item.parkingSlot
        )?.length;
    }

    private getConstantData(): void {
        this.dispatchTableHeaderItems = DispatchTableConstants.HEADER_ITEMS;
    }

    private handleTruckTrailerDriverLists(lists: DispatchModalResponse): void {
        const { trucks, trailers, drivers, parkings } = lists;

        const trucksList = JSON.parse(JSON.stringify(trucks));
        const trailersList = JSON.parse(JSON.stringify(trailers));
        const driversList = JSON.parse(JSON.stringify(drivers));

        this.truckList = trucksList.map((truck) => {
            return {
                ...truck,
                name: truck.truckNumber,
                class: this.colorFinderPipe.transform(
                    truck.truckType.id,
                    DispatchTableStringEnum.TRUCK
                ),
                folder: DispatchTableStringEnum.COMMON,
                subFolder: DispatchTableStringEnum.COLORS,
                logoName: DispatchTableStringEnum.CIRCLE_ROUTE,
            };
        });

        this.trailerList = trailersList.map((trailer) => {
            return {
                ...trailer,
                name: trailer.trailerNumber,
                class: this.colorFinderPipe.transform(
                    trailer.trailerType.id,
                    DispatchTableStringEnum.TRAILER
                ),
                folder: DispatchTableStringEnum.COMMON,
                subFolder: DispatchTableStringEnum.COLORS,
                logoName: DispatchTableStringEnum.CIRCLE_ROUTE,
            };
        });

        this.driverList = driversList.map((driver) => {
            return {
                ...driver,
                name: `${driver.firstName} ${driver.lastName}`,
                svg: driver.owner
                    ? DispatchTableStringEnum.OWNER_STATUS_ROUTE
                    : null,
                folder: DispatchTableStringEnum.COMMON,
            };
        });

        this.parkingList = JSON.parse(JSON.stringify(parkings));

        this.hasLargeFieldParking = this.parkingList?.length > 1;

        if (this.dispatchData?.teamBoard) {
            this.dispatcherService.updateMainBoardColumnWidths(
                this.hasAdditionalFieldTruck,
                this.hasAdditionalFieldTrailer,
                this.hasLargeFieldParking
            );
        }
    }

    private handleTruckTrailerAdditionalFields(): void {
        this.hasAdditionalFieldTruck = this.dispatchData.dispatches.some(
            (dispatch) => !!dispatch?.truck?.year
        );
        this.hasAdditionalFieldTrailer = this.dispatchData.dispatches.some(
            (dispatch) => !!dispatch?.trailer?.year
        );

        if (this.dispatchData?.teamBoard) {
            this.dispatcherService.updateMainBoardColumnWidths(
                this.hasAdditionalFieldTruck,
                this.hasAdditionalFieldTrailer,
                this.parkingList?.length > 1
            );
        }
    }

    public handleAddTruckTrailerClick(eventParam: {
        type: string;
        event: TruckMinimalResponse | TrailerMinimalResponse;
        index: number;
    }): void {
        const { type, event, index } = eventParam;

        if (type === DispatchTableStringEnum.TRUCK) {
            if (index) {
                this.dispatchData = {
                    ...this.dispatchData,
                    dispatches: this.dispatchData.dispatches.map(
                        (dispatch, i) =>
                            i === index
                                ? { ...dispatch, truck: event }
                                : dispatch
                    ),
                };

                this.parkingCount = this.dispatchData?.dispatches?.filter(
                    (item) => item.parkingSlot
                )?.length;

                this.showAddAddressFieldIndex = index;
            } else {
                this.addNewTruckData = event;

                this.showAddAddressFieldIndex = -2;
            }
        } else {
            this.updateOrAddDispatchBoardAndSend(
                DispatchTableStringEnum.TRAILER_ID,
                event.id,
                index
            );
        }
    }

    public handleRemoveTruckTrailerClick(event: {
        type: string;
        index: number;
    }) {
        const { type, index } = event;

        if (
            !this.dispatchData.dispatches[index].truck &&
            !this.dispatchData.dispatches[index].driver
        ) {
            const id = this.dispatchData.dispatches[index].id;

            this.isDispatchBoardChangeInProgress = true;
            this.checkEmptySet = DispatchTableStringEnum.TRAILER_ID;

            this.deleteDispatchBoardById(id);
        } else {
            this.updateOrAddDispatchBoardAndSend(type, null, index);
        }
    }

    public handleUpdateLastLocationEmit(event: string): void {
        this.updateOrAddDispatchBoardAndSend(
            DispatchTableStringEnum.LOCATION,
            event,
            this.showAddAddressFieldIndex
        );
    }

    private handleHoursOfService() {
        const mappedDispatches = this.dispatchData.dispatches.map(
            (dispatch) => {
                dispatch.hoursOfService = dispatch.hoursOfService ?? [];
                const hoursOfService = dispatch?.hoursOfService
                    .sort((a, b) => a.id - b.id)
                    .map((dispatch, index) => ({ ...dispatch, index }));
                return {
                    ...dispatch,
                    hoursOfService,
                };
            }
        );

        this.dispatchData = {
            ...this.dispatchData,
            dispatches: mappedDispatches,
        };

        this.parkingCount = this.dispatchData?.dispatches?.filter(
            (item) => item.parkingSlot
        )?.length;
    }

    public onHideDropdown(): void {
        setTimeout(() => {
            if (this.showAddAddressFieldIndex !== -2) {
                this.dispatchData.dispatches[
                    this.showAddAddressFieldIndex
                ].truck = this.addNewTruckData;
            }

            this.showAddAddressFieldIndex = -1;

            this.addNewTruckData = null;

            this.cdRef.detectChanges();
        }, 3000);
    }

    private setCreateUpdateOptionalProperties<T>(
        id: number,
        key: string,
        value: T
    ): CreateDispatchCommand | UpdateDispatchCommand {
        return {
            ...(id &&
                key === DispatchTableStringEnum.TRUCK_ID &&
                !value && { location: null }),
            ...(!id && { dispatchBoardId: this.dispatchData.id }),
            ...(!id &&
                key === DispatchTableStringEnum.LOCATION && {
                    truckId: this.addNewTruckData.id,
                }),
        };
    }

    public updateOrAddDispatchBoardAndSend<T>(
        key: string,
        value: T,
        index: number
    ): void {
        const previousData = this.dispatchData.dispatches[index]
            ? JSON.parse(JSON.stringify(this.dispatchData.dispatches[index]))
            : {};

        const {
            id,
            status,
            order,
            truck,
            trailer,
            driver,
            coDriver,
            location,
            note,
            parkingSlot,
        } = previousData;

        const updatedPreviousData:
            | CreateDispatchCommand
            | UpdateDispatchCommand = {
            id,
            status: status
                ? (status.statusValue.name as DispatchStatus)
                : DispatchTableStringEnum.OFF,
            order,
            truckId: truck?.id ?? null,
            trailerId: trailer?.id ?? null,
            driverId: driver?.id ?? null,
            coDriverId: coDriver?.id ?? null,
            location,
            note,
            loadIds: [],
            hoursOfService: null,
            parkingSlotId: parkingSlot?.id ?? null,
        };

        const newData: CreateDispatchCommand | UpdateDispatchCommand = {
            ...updatedPreviousData,
            [key]: value,
            ...this.setCreateUpdateOptionalProperties(
                updatedPreviousData.id,
                key,
                value
            ),
        };

        this.isDispatchBoardChangeInProgress = true;

        this.checkForEmpty = key;

        if (updatedPreviousData.id) {
            this.dispatcherService
                .updateDispatchBoard(newData, this.dispatchData.id)
                .pipe(
                    takeUntil(this.destroy$),
                    catchError(() => {
                        this.isDispatchBoardChangeInProgress = false;
                        this.checkEmptySet = '';

                        return of(null);
                    })
                )
                .subscribe(() => {
                    this.dispatcherService.updateCountList(
                        this.dispatchData.id,
                        key,
                        value
                    );
                    this.dispatcherService.updateModalList();

                    this.isDispatchBoardChangeInProgress = false;
                    this.checkEmptySet = '';
                });
        } else {
            this.dispatcherService
                .createDispatchBoard(newData, this.dispatchData.id)
                .pipe(
                    takeUntil(this.destroy$),
                    catchError(() => {
                        this.isDispatchBoardChangeInProgress = false;
                        this.checkEmptySet = '';

                        return of(null);
                    })
                )
                .subscribe(() => {
                    this.dispatcherService.updateCountList(
                        this.dispatchData.id,
                        key,
                        value
                    );
                    this.dispatcherService.updateModalList();

                    this.isDispatchBoardChangeInProgress = false;
                    this.checkEmptySet = '';
                });
        }
    }

    private deleteDispatchBoardById(id: number): void {
        this.dispatcherService
            .deleteDispatchboard(id)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => {
                    this.isDispatchBoardChangeInProgress = false;
                    this.checkEmptySet = '';
                })
            )
            .subscribe();
    }

    public updateParking(
        parkingSlot: DispatchBoardParkingEmiter,
        id: number
    ): void {
        this.isDispatchBoardChangeInProgress = true;

        this.parkingService
            .apiParkingParkingslotPut({
                id: parkingSlot.parking,
                trailerId: parkingSlot.trailerId,
                truckId: parkingSlot.truckId,
                dispatchId: id,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.dispatcherService
                    .updateDispatchboardRowById(id, this.dispatchData.id)
                    .subscribe(() => {
                        this.dispatcherService.updateModalList();
                        this.checkEmptySet = '';
                        this.isDispatchBoardChangeInProgress = false;
                    });
            });
    }

    public handleAddDriverClick(eventParam: {
        event: DriverMinimalResponse;
        index: number;
    }): void {
        const { event, index } = eventParam;

        const driverOrCoDriver = !this.dispatchData.dispatches[
            this.openedDriverDropdown
        ]?.driver
            ? DispatchTableStringEnum.DRIVER_ID
            : DispatchTableStringEnum.CO_DRIVER_ID;

        this.updateOrAddDispatchBoardAndSend(driverOrCoDriver, event.id, index);
    }

    public handleRemoveDriverClick(event: { index: number }) {
        const { index } = event;

        if (
            !this.dispatchData.dispatches[index].truck &&
            !this.dispatchData.dispatches[index].trailer
        ) {
            const id = this.dispatchData.dispatches[index].id;

            this.isDispatchBoardChangeInProgress = true;
            this.checkEmptySet = DispatchTableStringEnum.DRIVER_ID;

            this.deleteDispatchBoardById(id);
        } else {
            this.updateOrAddDispatchBoardAndSend(
                DispatchTableStringEnum.DRIVER_ID,
                null,
                index
            );
        }
    }

    saveHosData(hos, indx) {
        this.openedHosData = this.openedHosData.map((item) => {
            item.flag = item.flag?.name ? item.flag.name : item.flag;
            return item;
        });

        this.updateOrAddDispatchBoardAndSend(
            'hoursOfService',
            this.openedHosData,
            indx
        );
    }

    userChangeEnd(event, item) {
        const index = item.indx;
        const nextHos = index + 1;
        if (this.openedHosData[nextHos]) {
            clearTimeout(this.testTimeout);
            this.testTimeout = setTimeout(() => {
                this.changeHosDataPositions(event, index);
            }, 0);
        }
    }

    changeHosDataPositions(event, index) {
        const nextHos = index + 1;
        if (this.openedHosData[nextHos]) {
            this.openedHosData[nextHos].start = this.openedHosData[index].end;
        }
    }

    addHOS(hosType) {
        this.openedHosData = [...this.openedHosData];
        this.openedHosData.push({
            start: this.openedHosData[this.openedHosData.length - 1].end,
            end: new Date().getHours() * 60 + new Date().getMinutes(),
            flag: { name: hosType },
            indx: this.openedHosData.length,
        });
    }

    removeHos(item) {
        this.openedHosData = this.openedHosData.filter(
            (it) => it.indx !== item.indx
        );
    }

    saveNoteValue(item: any) {
        this.updateOrAddDispatchBoardAndSend(
            'note',
            item.note,
            item.dispatchIndex
        );
    }

    public changeDriverVacation(data: DispatchResponse): void {
        this.isDispatchBoardChangeInProgress = true;
        this.dispatcherService
            .changeDriverVacation(data.driver.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.dispatcherService
                    .updateDispatchboardRowById(data.id, this.dispatchData.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.isDispatchBoardChangeInProgress = false;
                    });
            });
    }

    removeDriver(indx) {
        this.updateOrAddDispatchBoardAndSend('driverId', null, indx);
    }

    // CDL DRAG AND DROP

    dropList(event) {
        this.isDispatchBoardChangeInProgress = true;

        this.dispatcherService
            .reorderDispatchboard({
                dispatchBoardId: this.dispatchData.id,
                dispatches: [
                    {
                        id: this.dispatchData.dispatches[event.currentIndex].id,
                        order: this.dispatchData.dispatches[event.previousIndex]
                            .order,
                    },
                    {
                        id: this.dispatchData.dispatches[event.previousIndex]
                            .id,
                        order: this.dispatchData.dispatches[event.currentIndex]
                            .order,
                    },
                ],
            })
            .pipe(
                catchError(() => {
                    this.checkEmptySet = '';
                    this.isDispatchBoardChangeInProgress = false;
                    return of([]);
                })
            )
            .subscribe(() => {
                this.dispatchData.dispatches[event.currentIndex].order =
                    this.dispatchData.dispatches[event.previousIndex].order;
                this.dispatchData.dispatches[event.previousIndex].order =
                    this.dispatchData.dispatches[event.currentIndex].order;
                this.isDispatchBoardChangeInProgress = false;
                this.cdRef.detectChanges();
            });

        moveItemInArray(
            this.dispatchData.dispatches,
            event.previousIndex,
            event.currentIndex
        );
    }

    dropTrailer(event, finalIndx) {
        if (finalIndx === this.startIndexTrailer) return;
        if (finalIndx == -1) return; // TODO
        const finalIndexData = this.getDataForUpdate(
            this.dispatchData.dispatches[finalIndx]
        );
        const startingIndexData = this.getDataForUpdate(
            this.dispatchData.dispatches[this.startIndexTrailer]
        );

        this.isDispatchBoardChangeInProgress = true;
        this.dispatcherService
            .switchDispathboard({
                dispatchBoardId: this.dispatchData.id,
                firstDispatch: {
                    ...startingIndexData,
                    id: this.dispatchData.dispatches[this.startIndexTrailer].id,
                    trailerId:
                        this.dispatchData.dispatches[finalIndx]?.trailer?.id,
                },
                secondDispatch: {
                    ...finalIndexData,
                    id: this.dispatchData.dispatches[finalIndx].id,
                    trailerId:
                        this.dispatchData.dispatches[this.startIndexTrailer]
                            ?.trailer?.id,
                },
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.dispatcherService
                    .updateDispatchboardRowById(
                        this.dispatchData.dispatches[this.startIndexTrailer].id,
                        this.dispatchData.id
                    )
                    .subscribe(() => {
                        this.isDispatchBoardChangeInProgress = false;
                    });
                this.dispatcherService
                    .updateDispatchboardRowById(
                        this.dispatchData.dispatches[finalIndx].id,
                        this.dispatchData.id
                    )
                    .subscribe(() => {
                        this.isDispatchBoardChangeInProgress = false;
                    });
            });
    }

    dropDriver(event, finalIndx) {
        if (finalIndx === this.startIndexDriver) return;
        if (finalIndx == -1) return; // Todo
        const finalIndexData = this.getDataForUpdate(
            this.dispatchData.dispatches[finalIndx]
        );
        const startingIndexData = this.getDataForUpdate(
            this.dispatchData.dispatches[this.startIndexDriver]
        );

        this.isDispatchBoardChangeInProgress = true;
        this.dispatcherService
            .switchDispathboard({
                dispatchBoardId: this.dispatchData.id,
                firstDispatch: {
                    ...startingIndexData,
                    id: this.dispatchData.dispatches[this.startIndexDriver].id,
                    driverId:
                        this.dispatchData.dispatches[finalIndx]?.driver?.id,
                },
                secondDispatch: {
                    ...finalIndexData,
                    id: this.dispatchData.dispatches[finalIndx].id,
                    driverId:
                        this.dispatchData.dispatches[this.startIndexDriver]
                            ?.driver?.id,
                },
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.dispatcherService
                    .updateDispatchboardRowById(
                        this.dispatchData.dispatches[this.startIndexDriver].id,
                        this.dispatchData.id
                    )
                    .subscribe(() => {
                        this.isDispatchBoardChangeInProgress = false;
                    });
                this.dispatcherService
                    .updateDispatchboardRowById(
                        this.dispatchData.dispatches[finalIndx].id,
                        this.dispatchData.id
                    )
                    .subscribe(() => {
                        this.isDispatchBoardChangeInProgress = false;
                    });
            });
    }

    getDataForUpdate(oldData): SwitchDispatchCommand {
        return {
            truckId: oldData.truck ? oldData.truck?.id : null,
            trailerId: oldData.trailer ? oldData.trailer?.id : null,
            driverId: oldData.driver ? oldData.driver?.id : null,
            coDriverId: oldData.coDriver ? oldData.coDriver?.id : null,
            location: oldData.location?.address ? oldData.location : null,
        };
    }

    cdkDragStartedTrailer(event, indx) {
        this.startIndexTrailer = indx;
        this.isDrag = true;
        this.draggingType = DispatchTableStringEnum.TRUCK;
    }

    cdkDragStartedDriver(event, indx) {
        this.startIndexDriver = indx;
        this.isDrag = true;
        this.draggingType = 'driver';
    }

    dragEnd() {
        this.isDrag = false;
        this.draggingType = '';
    }

    showPickupDelivery(popup: any) {
        popup.open();
    }

    // USE ARROW FUNCTION NOTATION TO ACCESS COMPONENT "THIS"
    trailerPositionPrediction = () => {
        return true;
    };

    public unlockTable(): void {
        this.onTableUnlockEmitter.emit({
            action: DispatchTableStringEnum.TOGGLE_LOCKED,
        });
    }

    public getMainBoardColumnWidths(): void {
        this.dispatcherService.mainBoardColumnsExpanded$.subscribe((res) => {
            if (
                res &&
                !this.dispatchData?.teamBoard &&
                !this.dispatchData?.dispatches?.length
            ) {
                this.hasAdditionalFieldTruck = res.isTruckExpanded;
                this.hasAdditionalFieldTrailer = res.isTrailerExpanded;
                this.hasLargeFieldParking = res.isParkingExpanded;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
