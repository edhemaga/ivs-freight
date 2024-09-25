import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { catchError, of, Subject, takeUntil, tap } from 'rxjs';

// animations
import { dispatchBackgroundAnimation } from '@shared/animations/dispatch-background.animation';

// modules
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

// pipes
import { DispatchColorFinderPipe } from '@pages/dispatch/pages/dispatch/components/dispatch-table/pipes/dispatch-color-finder.pipe';

// services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

// constants
import { DispatchTableConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants';

// enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

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
    TruckMinimalResponse,
    DriverMinimalResponse,
    DispatchResponse,
    DispatchGroupedLoadsResponse,
    TruckDispatchModalResponse,
    TrailerDispatchModalResponse,
} from 'appcoretruckassist';
import { DispatchBoardParkingEmiter } from '@pages/dispatch/models/dispatch-parking-emmiter.model';
import {
    DispatchColumn,
    DispatchTableHeaderItems,
    DispatchTableUnlock,
} from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';
import { DispatchProgressBarData } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/dispatch-progress-bar-data.model';

@Component({
    selector: 'app-dispatch-table',
    templateUrl: './dispatch-table.component.html',
    styleUrls: ['./dispatch-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DispatchColorFinderPipe],
    animations: [dispatchBackgroundAnimation()],
})
export class DispatchTableComponent implements OnInit, OnDestroy {
    @ViewChildren('columnField') columnFieldElements: QueryList<ElementRef>;

    @Input() set dispatchTableData(data: DispatchBoardResponse) {
        this.initDispatchData(data);

        this.handleHoursOfService();
    }

    @Input() set shortLists(lists: DispatchModalResponse) {
        this.handleTruckTrailerDriverParkingLists(lists);
    }

    @Input() set isBoardLocked(isLocked: boolean) {
        this.isDispatchBoardLocked = isLocked;

        this.setColumnsWidth();
    }

    @Input() set isNoteExpanded(value: boolean) {
        this._isNoteExpanded = value;
    }

    @Input() set columns(value: DispatchColumn[] | null) {
        if (value) {
            this.columnsToShow = value;

            this.shownFields = value
                .slice(10, 15)
                .filter((item) => item.hidden === false);

            this.isDriverEndorsementActive = !this.columnsToShow[6].hidden;

            this.handleTruckTrailerAdditionalFields();
        }
    }

    @Input() toolbarWidth: number = 0;
    @Input() isAllBoardsList: boolean;

    @Input() sortBy: string;
    @Input() sortDirection: string;

    @Output() onTableUnlockEmitter: EventEmitter<DispatchTableUnlock> =
        new EventEmitter();

    @Output() onToggleNoteEmitter: EventEmitter<boolean> = new EventEmitter();

    private destroy$ = new Subject<void>();

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    public columnsToShow: DispatchColumn[];

    public isDrag: boolean = false;

    public checkForEmpty: string;

    public dispatchTableHeaderItems: DispatchTableHeaderItems[] = [];

    public dispatchData: DispatchBoardResponse;

    public isDispatchBoardLocked: boolean = true;
    public isDispatchBoardChangeInProgress: boolean = false;

    public isHoveringRowIndex: number = -1;

    public hasAdditionalFieldTruck: boolean = false;
    public hasAdditionalFieldTrailer: boolean = false;
    public hasLargeFieldParking: boolean = false;

    public isTrailerAddNewHidden = false;

    public truckList: TruckDispatchModalResponse[];
    public trailerList: TrailerDispatchModalResponse[];
    public driverList: DriverListResponse[];
    public parkingList: ParkingDispatchModalResponse[];

    public addNewTruckData: TruckMinimalResponse;

    public showAddAddressFieldIndex: number = -1;
    public isDisplayingAddressInput: boolean = true;

    public _isNoteExpanded: boolean = true;
    public parkingCount: number = 0;
    public openedDriverDropdown: number = -1;

    public columnSpecifications: { [key: string]: number } = {};

    public columnFields = DispatchTableConstants.COLUMN_FIELDS;

    public currentDispatchGroupedLoadsResponse: DispatchGroupedLoadsResponse;

    public shownFields;

    public isDriverEndorsementActive: boolean = false;

    public noteWidth: number = 205;

    /////////////////////////////////////////// UPDATE

    public draggingType: string;

    public resizedColumnsWidth = {
        truckNumber: null,
        trailerNumber: null,
        firstName: null,
        city: null,
        status: null,
        pickup_delivery: null,
        progress: null,
        slotNumber: null,
        dispatcher: null,
        note: null,
    };

    public progressBarData: DispatchProgressBarData[] = [];

    startIndexTrailer: number;
    startIndexDriver: number;

    openedHosData = [];

    constructor(
        private cdRef: ChangeDetectorRef,

        // Pipes
        private dispatchColorFinderPipe: DispatchColorFinderPipe,
        public datePipe: DatePipe,

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

    public getLoadInformationForSignleDispatchResponse(item: DispatchResponse) {
        this.dispatcherService
            .getDispatchAssignedloadsId(item.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.currentDispatchGroupedLoadsResponse = response;
                    this.cdRef.detectChanges();
                },
            });
    }

    public trackByIdentity = (index: number): number => index;

    private initDispatchData(data: DispatchBoardResponse): void {
        this.dispatchData = JSON.parse(JSON.stringify(data));

        this.parkingCount = this.dispatchData?.dispatches?.filter(
            (item) => item.parkingSlot
        )?.length;

        this.getProgressBarData();
    }

    private getConstantData(): void {
        this.dispatchTableHeaderItems = DispatchTableConstants.HEADER_ITEMS;
    }

    private handleTruckTrailerDriverParkingLists(
        lists: DispatchModalResponse
    ): void {
        const { trucks, trailers, drivers, parkings } = lists;

        const trucksList = JSON.parse(JSON.stringify(trucks));
        const trailersList = JSON.parse(JSON.stringify(trailers));
        const driversList = JSON.parse(JSON.stringify(drivers));

        this.truckList = trucksList.map((truck) => {
            return {
                ...truck,
                name: truck.truckNumber,
                class: this.dispatchColorFinderPipe.transform(
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
                class: this.dispatchColorFinderPipe.transform(
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

        if (this.hasLargeFieldParking) {
            const currentAdditionalFieldValues = {
                ...this.dispatcherService.mainBoardColumnExpandedWidths.getValue(),
            };

            this.dispatcherService.updateMainBoardColumnWidths(
                currentAdditionalFieldValues.isTruckExpanded,
                currentAdditionalFieldValues.isTrailerExpanded,
                true
            );
        }
    }

    private handleTruckTrailerAdditionalFields(): void {
        this.hasAdditionalFieldTruck = !this.columnsToShow[1].hidden;

        this.hasAdditionalFieldTrailer = !this.columnsToShow[3].hidden;

        if (this.hasAdditionalFieldTruck || this.hasAdditionalFieldTrailer) {
            const currentAdditionalFieldValues = {
                ...this.dispatcherService.mainBoardColumnExpandedWidths.getValue(),
            };

            const hasAdditionalTruck =
                this.hasAdditionalFieldTruck ||
                currentAdditionalFieldValues.isTruckExpanded;
            const hasAdditionalTrailer =
                this.hasAdditionalFieldTrailer ||
                currentAdditionalFieldValues.isTrailerExpanded;

            this.dispatcherService.updateMainBoardColumnWidths(
                hasAdditionalTruck,
                hasAdditionalTrailer,
                currentAdditionalFieldValues.isParkingExpanded
            );
        }
    }

    public handleAddTruckTrailerClick(eventParam: {
        type: string;
        event: TruckDispatchModalResponse | TrailerDispatchModalResponse;
        index: number;
    }): void {
        const { type, event, index } = eventParam;

        this.isDisplayingAddressInput = true;

        if (type === DispatchTableStringEnum.TRUCK) {
            const allowedTrailerIds = (event as TruckDispatchModalResponse)
                .allowedTrailerIds;

            this.isTrailerAddNewHidden = !allowedTrailerIds;

            if (index >= 0) {
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

        if (!this.dispatchData?.dispatches[index]) {
            this.addNewTruckData = null;

            this.isTrailerAddNewHidden = false;
            this.isDisplayingAddressInput = false;

            return;
        }

        if (
            ((type === DispatchTableStringEnum.TRAILER_ID &&
                !this.dispatchData.dispatches[index].truck) ||
                (type === DispatchTableStringEnum.TRUCK_ID &&
                    !this.dispatchData.dispatches[index].trailer)) &&
            !this.dispatchData.dispatches[index].driver
        ) {
            const id = this.dispatchData.dispatches[index].id;

            this.isDispatchBoardChangeInProgress = true;
            this.checkEmptySet = type;

            this.deleteDispatchBoardById(id, type);
        } else {
            this.updateOrAddDispatchBoardAndSend(type, null, index);
        }
    }

    private handleHoursOfService(): void {
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

    public handleUpdateLastLocationEmit(address: string): void {
        this.isDisplayingAddressInput = false;

        this.updateOrAddDispatchBoardAndSend(
            DispatchTableStringEnum.LOCATION,
            address,
            this.showAddAddressFieldIndex
        );
    }

    public handleLastLocationDropdownClose(): void {
        if (this.showAddAddressFieldIndex !== -2)
            this.dispatchData.dispatches[this.showAddAddressFieldIndex].truck =
                this.addNewTruckData;

        this.showAddAddressFieldIndex = -1;

        this.addNewTruckData = null;

        this.isTrailerAddNewHidden = false;
        this.isDisplayingAddressInput = false;

        this.cdRef.detectChanges();
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
            location: location?.address ? location : null,
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
                        this.checkEmptySet =
                            DispatchTableStringEnum.EMPTY_STRING;

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
                    this.checkEmptySet = DispatchTableStringEnum.EMPTY_STRING;
                });
        } else {
            this.dispatcherService
                .createDispatchBoard(newData, this.dispatchData.id)
                .pipe(
                    takeUntil(this.destroy$),
                    catchError(() => {
                        this.isDispatchBoardChangeInProgress = false;
                        this.checkEmptySet =
                            DispatchTableStringEnum.EMPTY_STRING;

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
                    this.checkEmptySet = DispatchTableStringEnum.EMPTY_STRING;
                });
        }
    }

    private deleteDispatchBoardById(id: number, deleteItemType?: string): void {
        this.dispatcherService
            .deleteDispatchboard(id)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => {
                    this.isDispatchBoardChangeInProgress = false;
                    this.checkEmptySet = DispatchTableStringEnum.EMPTY_STRING;

                    if (deleteItemType) {
                        this.dispatcherService.updateCountList(
                            this.dispatchData.id,
                            deleteItemType,
                            null
                        );
                    }

                    this.dispatcherService.updateModalList();
                })
            )
            .subscribe();
    }

    public updateParking(
        parkingSlot: DispatchBoardParkingEmiter,
        id: number
    ): void {
        const data = {
            id: parkingSlot.parking,
            trailerId: parkingSlot.trailerId,
            truckId: parkingSlot.truckId,
            dispatchId: id,
        };

        this.isDispatchBoardChangeInProgress = true;

        this.parkingService
            .apiParkingParkingslotPut(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.dispatcherService
                    .updateDispatchboardRowById(id, this.dispatchData.id)
                    .subscribe(() => {
                        this.dispatcherService.updateModalList();

                        this.checkEmptySet =
                            DispatchTableStringEnum.EMPTY_STRING;
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

            this.deleteDispatchBoardById(id, DispatchTableStringEnum.DRIVER_ID);
        } else {
            this.updateOrAddDispatchBoardAndSend(
                DispatchTableStringEnum.DRIVER_ID,
                null,
                index
            );
        }
    }

    public saveHosData(indx: number): void {
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

    dropList<T>(event: CdkDragDrop<T>): void {
        const { currentIndex, previousIndex } = event;

        const dispatchBoardId = this.dispatchData.id;
        const dispatchDataDispatches = this.dispatchData.dispatches;

        const dispatches = [
            {
                id: dispatchDataDispatches[currentIndex].id,
                order: dispatchDataDispatches[previousIndex].order,
            },
            {
                id: dispatchDataDispatches[previousIndex].id,
                order: dispatchDataDispatches[currentIndex].order,
            },
        ];

        const data = {
            dispatchBoardId,
            dispatches,
        };

        this.isDispatchBoardChangeInProgress = true;

        this.dispatcherService
            .reorderDispatchboard(data)
            .pipe(
                takeUntil(this.destroy$),
                catchError(() => {
                    this.checkEmptySet = DispatchTableStringEnum.EMPTY_STRING;
                    this.isDispatchBoardChangeInProgress = false;

                    return of([]);
                })
            )
            .subscribe(() => {
                [
                    dispatchDataDispatches[currentIndex].order,
                    dispatchDataDispatches[previousIndex].order,
                ] = [
                    dispatchDataDispatches[previousIndex].order,
                    dispatchDataDispatches[currentIndex].order,
                ];

                moveItemInArray(
                    dispatchDataDispatches,
                    previousIndex,
                    currentIndex
                );

                this.isDispatchBoardChangeInProgress = false;

                this.cdRef.detectChanges();
            });

        /*  this.isDispatchBoardChangeInProgress = true;

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
                    this.checkEmptySet = DispatchTableStringEnum.EMPTY_STRING;
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
        ); */
    }

    dropTrailer(event, finalIndx): void {
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

    dropDriver(event, finalIndx): void {
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

    cdkDragStartedRow(event, indx) {
        this.isDrag = true;
    }

    cdkDragStartedTrailer(event, indx) {
        this.startIndexTrailer = indx;
        this.isDrag = true;
        /*  this.draggingType = DispatchTableStringEnum.TRUCK; */
        this.draggingType = 'trailer';
    }

    cdkDragStartedDriver(event, indx) {
        this.startIndexDriver = indx;
        this.isDrag = true;
        this.draggingType = 'driver';
    }

    dragEnd() {
        this.isDrag = false;
        this.draggingType = DispatchTableStringEnum.EMPTY_STRING;
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
        this.dispatcherService.mainBoardColumnsExpanded$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res && this.isAllBoardsList) {
                    this.hasAdditionalFieldTruck = res.isTruckExpanded;
                    this.hasAdditionalFieldTrailer = res.isTrailerExpanded;
                    this.hasLargeFieldParking = res.isParkingExpanded;
                }
            });
    }

    private setColumnsWidth(): void {
        const processedClasses = new Set<string>();

        setTimeout(() => {
            this.columnFieldElements.forEach((fieldElement) => {
                const element = fieldElement.nativeElement;

                const className = Array.from(element.classList).find(
                    (classItem) =>
                        this.columnFields.some(
                            (field) => field.className === classItem
                        )
                );

                if (
                    typeof className === 'string' &&
                    !processedClasses.has(className)
                ) {
                    const field = this.columnFields.find(
                        (fieldItem) => fieldItem.className === className
                    );
                    if (field) {
                        const width = element.getBoundingClientRect().width;
                        this.columnSpecifications[field.key] = width;
                        processedClasses.add(className);
                    }
                }
            });

            this.cdRef.detectChanges();
        }, 1000);
    }

    public handleTableHeadClick(action: string, sortBy: string): void {
        if (action === 'columnToggle') {
            this.onTableUnlockEmitter.emit({
                action: 'columnToggle',
                column: sortBy,
            });
        } else {
            this.onTableUnlockEmitter.emit({
                action: 'sort',
                column: action,
                sortBy: sortBy,
                list: this.dispatchData,
            });
        }
    }

    public handleHeaderClick(title: string, isSort: boolean): void {
        if (isSort) {
            switch (title) {
                case DispatchTableStringEnum.NOTE:
                    this._isNoteExpanded = !this._isNoteExpanded;
                    this.onToggleNoteEmitter.emit(this._isNoteExpanded);
                    break;
                case DispatchTableStringEnum.TRUCK_1:
                    this.handleTableHeadClick(
                        this.columnsToShow[0].sortName,
                        this.columnsToShow[0].field
                    );
                    break;
                case DispatchTableStringEnum.TRAILER_1:
                    this.handleTableHeadClick(
                        this.columnsToShow[2].sortName,
                        this.columnsToShow[2].field
                    );
                    break;
                case DispatchTableStringEnum.DRIVER_1:
                    this.handleTableHeadClick(
                        this.columnsToShow[4].sortName,
                        this.columnsToShow[4].field
                    );
                    break;
                case DispatchTableStringEnum.LAST_LOCATION:
                    this.handleTableHeadClick(
                        this.columnsToShow[11].sortName,
                        this.columnsToShow[11].field
                    );
                    break;
                case DispatchTableStringEnum.PARKING_1:
                    this.handleTableHeadClick(
                        this.columnsToShow[15].sortName,
                        this.columnsToShow[15].field
                    );
                    break;
                default:
                    break;
            }
        } else {
            switch (title) {
                case DispatchTableStringEnum.NOTE:
                    this.handleTableHeadClick(
                        'columnToggle',
                        this.columnsToShow[17].field
                    );
                    break;
                case DispatchTableStringEnum.DISPATCHER_1:
                    this.handleTableHeadClick(
                        'columnToggle',
                        this.columnsToShow[16].field
                    );
                    break;
                case DispatchTableStringEnum.PROGRESS:
                    this.handleTableHeadClick(
                        'columnToggle',
                        this.columnsToShow[14].field
                    );
                    break;
                case DispatchTableStringEnum.INSPECTION:
                    this.handleTableHeadClick(
                        'columnToggle',
                        this.columnsToShow[10].field
                    );
                    break;
                case DispatchTableStringEnum.PARKING_1:
                    this.handleTableHeadClick(
                        'columnToggle',
                        this.columnsToShow[15].field
                    );
                    break;
            }
        }
    }

    public changeDriverDropdownIndex(index: number): void {
        this.openedDriverDropdown = index;
    }

    public onResizeAction(event: {
        width: number;
        column: DispatchColumn;
    }): void {
        const columnFieldName =
            event.column.field === DispatchTableStringEnum.PICKUP_DELIVERY_2
                ? DispatchTableStringEnum.PICKUP_DELIVERY_3
                : event.column.field === DispatchTableStringEnum.PROGRESS_2
                ? DispatchTableStringEnum.PROGRESS_3
                : event.column.field === DispatchTableStringEnum.DISPATCHER_2
                ? DispatchTableStringEnum.DISPATCHER
                : event.column.field === DispatchTableStringEnum.NOTE_2
                ? DispatchTableStringEnum.NOTE_3
                : event.column.field;

        this.resizedColumnsWidth[columnFieldName] = event.width + 11;

        if (event.column.title === DispatchTableStringEnum.NOTE_2)
            this.noteWidth = event.width;
        else this.setColumnsWidth();
    }

    public getProgressBarData(): void {
        this.dispatchData.dispatches.forEach((dispatch, index) => {
            this.progressBarData.push(null);

            if (dispatch.loadProgress?.activeLoadProgressBar) {
                const dispatchLoadProgress: any =
                    this.dispatchData.dispatches[index].loadProgress
                        .activeLoadProgressBar;

                const dispatchStopData = dispatchLoadProgress.loadStops.map(
                    (stop) => {
                        return {
                            type: stop.stopType?.name.toLowerCase(),
                            heading: stop.title,
                            position:
                                stop.progressBarPercentage > 100
                                    ? 100
                                    : stop.progressBarPercentage,
                            location: [
                                stop.address?.city,
                                stop.address?.stateShortName,
                            ].join(', '),
                            mileage: stop.isVisited
                                ? (
                                      dispatchLoadProgress.truckPositionMileage -
                                      stop.cumulativeTotalLegMiles
                                  ).toFixed(1) + ' mi ago'
                                : 'in ' +
                                  (
                                      stop.cumulativeTotalLegMiles -
                                      dispatchLoadProgress.truckPositionMileage
                                  ).toFixed(1) +
                                  ' mi',
                            time: this.datePipe.transform(
                                stop.departedFrom ?? stop.expectedAt,
                                'MM/dd/yy hh:mm a'
                            ),
                            latitude: stop.latitude,
                            longitude: stop.longitude,
                            legMiles: stop.totalLegMiles,
                            stopNumber: stop.stopLoadOrder,
                        };
                    }
                );

                const formattedProgressData: DispatchProgressBarData = {
                    currentPosition:
                        dispatchLoadProgress.truckPositionPercentage ?? 0,
                    mileageInfo:
                        dispatchLoadProgress.milesLeftToDeliveryLoad + ' mi',
                    gpsTitle: dispatchLoadProgress.truckPositionMileage + ' mi',
                    mileagesPercent:
                        dispatchLoadProgress.truckPositionPercentage + '%',
                    totalMiles: dispatchLoadProgress.totalMiles,
                    gpsProgress: dispatchStopData,
                    gpsInfo: {
                        gpsheading: 'NO GPS DEVICE',
                        //gpsTime: '3:47',
                        gpsheadingColor: '#AAAAAA',
                    },
                    gpsIcon: 'assets/ca-components/svg/map/no_gps_status.svg',
                };

                this.progressBarData[index] = formattedProgressData;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
