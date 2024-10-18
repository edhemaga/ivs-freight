import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import {
    CDK_DRAG_CONFIG,
    CdkDragDrop,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// RXJS
import { Subject, takeUntil, tap } from 'rxjs';

// Svg routes
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-parking-svg-routes';

// Config
import { DispatchAssignLoadModalConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs';
import { LoadModalDragAndDrop } from '@pages/load/pages/load-modal/utils/constants';

// Enum
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';
import { LoadDetailsItemStringEnum } from '@pages/load/pages/load-details/components/load-details-item/enums/load-details-item-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums/load-filter-string.enum';

// Models
import {
    AssignedLoadListResponse,
    AssignedLoadResponse,
    AssignLoadModalResponse,
    DispatchLoadModalResponse,
    EnumValue,
    LoadResponse,
    LoadStopResponse,
    ReorderDispatchLoadsCommand,
} from 'appcoretruckassist';
import { StopRoutes } from '@shared/models/stop-routes.model';
import { MapRoute } from '@shared/models/map-route.model';
import { DispatchBoardAssignLoadFilterOptions } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/dispatch-board-assign-load-filter-options.model.ts';

// Services
import { LoadService } from '@shared/services/load.service';
import { ModalService } from '@shared/services/modal.service';
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// Components
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';
import { TaResizerComponent } from '@shared/components/ta-resizer/ta-resizer.component';

// Helpers
import { RepairTableDateFormaterHelper } from '@pages/repair/pages/repair-table/utils/helpers/repair-table-date-formater.helper';
import { DispatchAssignLoadModalHelper } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/helpers';

// Consts
import { DispatchAssignLoadModalConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants/dispatch-assign-load-modal.constants';
@Component({
    selector: 'app-dispatch-assign-load-modal',
    templateUrl: './dispatch-assign-load-modal.component.html',
    styleUrls: ['./dispatch-assign-load-modal.component.scss'],
    providers: [
        { provide: CDK_DRAG_CONFIG, useValue: LoadModalDragAndDrop.Config },
    ],
})
export class DispatchAssignLoadModalComponent implements OnInit, OnDestroy {
    @ViewChild('resizerComponent') resizerComponent: TaResizerComponent;

    // Svg
    public svgIcons = DispatchParkingSvgRoutes;

    // Destroy
    private destroy$ = new Subject<void>();

    @Input() editData: { dispatchId: number };

    // Form
    public assignLoadForm: UntypedFormGroup;

    public loadDispatchesTTDInputConfig =
        DispatchAssignLoadModalConfig.truckTrailerDriver;

    public loadModalSize: string = LoadModalStringEnum.MODAL_SIZE;

    // Reordering
    public showReorderButton: boolean = true;
    public isReorderingActive: boolean = false;
    public isAdditonalViewOpened: boolean;
    public selectedLoad: LoadResponse;

    public isAssignLoadCardOpen: boolean = false;
    public isUnAssignLoadCardOpen: boolean = true;

    // Additional load
    public isAssignedLoad: boolean = false;

    public loadStopRoutes: MapRoute[] = [];
    public unassignedLoads: AssignedLoadResponse[] = [];
    public assignedLoads: AssignedLoadResponse[] = [];

    // TODO: Create component and use if inside load modal also
    public labelsDispatches: any;
    public mappedDispatches: any;
    public selectedDispatches: any = null;
    public isMapLoaderVisible: boolean = false;

    public backLoadFilterQuery: DispatchBoardAssignLoadFilterOptions;

    public tableHeaderItems =
        DispatchAssignLoadModalHelper.getTableHeaderItems();
    public dispatchFutureTimes: EnumValue[];
    public isLoading: boolean;
    public originalLoads: AssignedLoadResponse[] = null;

    public firstElementHeight!: number;
    public secondElementHeight!: number;
    public _initialSecondElementHeight: number = 400;
    public _initialFirstElementHeight: number = 400;

    constructor(
        private formBuilder: FormBuilder,

        // services
        private loadService: LoadService,
        private modalService: ModalService,
        private dispatchService: DispatcherService,
        private ngbActiveModal: NgbActiveModal,
        private tableService: TruckassistTableService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.loadModalData();
    }

    public get isModalValid(): boolean {
        return !!this.selectedDispatches && !this.isReorderingActive;
    }

    public get extraStopsCount(): string {
        // Remove deadhead
        const stops = this.selectedLoad?.stops.filter((stop) => stop.id !== 0);
        return stops.length - 2
            ? stops.length - 2 + TableStringEnum.LOAD_EXTRA_STOPS
            : null;
    }

    private initializeForm(): void {
        this.backLoadFilterQuery = {
            ...DispatchAssignLoadModalConstants.BACK_FILTER,
        };
        this.assignLoadForm = this.formBuilder.group({
            dispatchId: [null],
        });
    }

    private loadModalData(): void {
        if (this.isReorderingActive) {
            // reset reordering
            this.onReorderAction({
                action: LoadModalStringEnum.REORDERING,
            });
        }

        const {
            dispatchFutureTime,
            truckType,
            trailerType,
            _long,
            lat,
            distance,
            dispatchersId,
            dateFrom,
            dateTo,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2,
        } = this.backLoadFilterQuery;

        this.loadService
            .getDispatchModalData(
                false,
                dispatchFutureTime,
                truckType,
                trailerType,
                _long,
                lat,
                distance,
                dispatchersId,
                dateFrom,
                dateTo,
                pageIndex,
                pageSize,
                companyId,
                sort,
                search,
                search1,
                search2
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: AssignLoadModalResponse) => {
                if (!this.originalLoads) {
                    this.originalLoads = res.unassignedLoads;
                    this.updateFilters();

                    this.tableService.sendActionAnimation({
                        animation: LoadFilterStringEnum.DISPATCH_DATA_UPDATE,
                        data: res.dispatchers,
                        id: null,
                    });
                }

                this.unassignedLoads = res.unassignedLoads;

                if (this.selectedDispatches) {
                    this.isUnAssignLoadCardOpen = !!res.unassignedLoads.length;
                } else {
                    this.isUnAssignLoadCardOpen = true;
                }

                this.dispatchFutureTimes = res.dispatchFutureTimes;

                this.mapDispatchers(res.dispatches);

                if (this.editData?.dispatchId) {
                    this.resetHeight();

                    const dispatchIndex = this.labelsDispatches.find(
                        (dispatch) => dispatch.id === this.editData.dispatchId
                    );

                    if (dispatchIndex) {
                        this.onDispatchChange(dispatchIndex);
                        this.getLoadsForDispatchId(this.editData.dispatchId);
                    }
                } else {
                    this.clearInputValue();
                    this.assignedLoads = [];
                    this.closeLoadDetails();
                    this._initialSecondElementHeight = 400;
                }
            });
    }

    private resetHeight(): void {
        this._initialFirstElementHeight = 220;
        this._initialSecondElementHeight = 220;
    }

    public selectNewDispatcher(event: { id: number }) {
        this.editData.dispatchId = event?.id ?? null;

        this.resetHeight();

        this.loadModalData();
        this.closeLoadDetails();
    }

    public closeLoadDetails() {
        this.additionalPartVisibility({ action: '', isOpen: false });

        this.selectedLoad = null;
    }

    private clearInputValue() {
        this.loadDispatchesTTDInputConfig = {
            ...this.loadDispatchesTTDInputConfig,
            multipleLabel: {
                labels: [
                    LoadModalStringEnum.TRUCK,
                    LoadModalStringEnum.TRAILER,
                    LoadModalStringEnum.DRIVER,
                    LoadModalStringEnum.DRIVER_PAY,
                ],
                customClass: LoadModalStringEnum.LOAD_DISPATCHES_TTD,
            },
            multipleInputValues: null,
        };

        this.selectedDispatches = null;
        this.isUnAssignLoadCardOpen = true;
        this.isAssignLoadCardOpen = false;
        this.showReorderButton = false;
    }

    private mapLoadsForRequest(): ReorderDispatchLoadsCommand {
        const loads = this.assignedLoads.map((load, index) => {
            return {
                id: load.id,
                order: index + 1,
            };
        });

        return {
            dispatchId: this.selectedDispatches.id,
            loads,
        };
    }

    private mapDispatchers(dispatches: DispatchLoadModalResponse[]): void {
        this.labelsDispatches = dispatches.map((item, index) => {
            return {
                ...item,
                driver: {
                    ...item.driver,
                    name: item.driver?.firstName?.concat(
                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                        item.driver?.lastName
                    ),
                    logoName: item.driver?.avatarFile?.url,
                    owner: !!item.driver?.owner,
                },
                coDriver: {
                    ...item.coDriver,
                    name: item.coDriver?.firstName?.concat(
                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                        item.coDriver?.lastName
                    ),
                },
                truck: {
                    ...item.truck,
                    name: item.truck?.truckNumber,
                    logoType: item.truck?.truckType?.name,
                    logoName: item.truck?.truckType?.logoName,
                    folder: LoadModalStringEnum.COMMON,
                    subFolder: LoadModalStringEnum.TRUCKS,
                },
                trailer: {
                    ...item.trailer,
                    name: item.trailer?.trailerNumber,
                    logoType: item.trailer?.trailerType?.name,
                    logoName: item.trailer?.trailerType?.logoName,
                    folder: LoadModalStringEnum.COMMON,
                    subFolder: LoadModalStringEnum.TRAILERS,
                },
                itemIndex: index,
                fullName: item.truck?.truckNumber
                    .concat(
                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                        item.trailer?.trailerNumber
                    )
                    .concat(
                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                        item.driver?.firstName.concat(
                            LoadModalStringEnum.EMPTY_SPACE_STRING,
                            item.driver?.lastName
                        )
                    ),
            };
        });
    }

    public onDispatchChange(dispatch: any): void {
        this.selectedDispatches = {
            ...dispatch,
            name: dispatch?.truck?.name
                ?.concat(
                    LoadModalStringEnum.EMPTY_SPACE_STRING,
                    dispatch?.trailer?.name
                )
                .concat(
                    LoadModalStringEnum.EMPTY_SPACE_STRING,
                    dispatch?.driver?.name
                ),
        };

        this.loadDispatchesTTDInputConfig = {
            ...this.loadDispatchesTTDInputConfig,
            multipleLabel: {
                labels: [
                    LoadModalStringEnum.TRUCK,
                    LoadModalStringEnum.TRAILER,
                    LoadModalStringEnum.DRIVER,
                    dispatch?.payType ? LoadModalStringEnum.DRIVER_PAY : null,
                ],
                customClass: LoadModalStringEnum.LOAD_DISPATCHES_TTD,
            },
            multipleInputValues: {
                options: [
                    {
                        id: dispatch?.truck?.id,
                        value: dispatch?.truck?.name,
                        logoName:
                            dispatch?.truck?.logoName &&
                            LoadModalStringEnum.TRUCKS_SVG_ROUTE +
                                dispatch?.truck?.logoName,
                        isImg: false,
                        isSvg: true,
                        folder: LoadModalStringEnum.COMMON,
                        subFolder: LoadModalStringEnum.TRUCKS,
                        logoType: dispatch?.truck?.logoType,
                    },
                    {
                        value: dispatch?.trailer?.name,
                        logoName:
                            dispatch?.trailer?.logoName &&
                            LoadModalStringEnum.TRAILERS_SVG_ROUTE +
                                dispatch?.trailer?.logoName,
                        isImg: false,
                        isSvg: true,
                        folder: LoadModalStringEnum.COMMON,
                        subFolder: LoadModalStringEnum.TRAILERS,
                        logoType: dispatch?.trailer?.logoType,
                    },
                    {
                        value: dispatch?.driver?.name,
                        logoName: dispatch?.driver?.logoName
                            ? dispatch?.driver?.logoName
                            : LoadModalStringEnum.NO_URL,
                        isImg: true,
                        isSvg: false,
                        folder: null,
                        subFolder: null,
                        isOwner: dispatch?.driver?.owner,
                        logoType: null,
                    },
                    {
                        value: dispatch?.payType,
                        logoName: null,
                        isImg: false,
                        isSvg: false,
                        folder: null,
                        subFolder: null,
                        logoType: null,
                    },
                ],
                customClass: LoadModalStringEnum.LOAD_DISPATCHES_TTD,
            },
        };
    }

    public trackByIdentity(id: number): number {
        return id;
    }

    public saveLoads(closeModal: boolean) {
        this.dispatchService
            .saveDispatchLoads(this.mapLoadsForRequest())
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (closeModal) this.ngbActiveModal.close();
            });
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case LoadModalStringEnum.DISPATCH_LOAD_SAVE_AND_ASSIGN_NEW:
                this.saveLoads(false);

                break;
            case LoadModalStringEnum.DISPATCH_LOAD_CREATE_LOAD:
                if (this.isReorderingActive) {
                    return;
                }
                this.ngbActiveModal.close();

                this.createNewLoad();
                break;
            case LoadModalStringEnum.DISPATCH_LOAD_SAVE_CHANGES:
                this.saveLoads(true);

                break;
            default:
                break;
        }
    }

    private createNewLoad(): void {
        this.modalService.openModal(LoadModalComponent, {
            size: TableStringEnum.LOAD,
        });
    }

    private getLoadStopRoutes(stops: LoadStopResponse[]): void {
        this.loadStopRoutes = [];

        const routes: StopRoutes[] = stops.map((stop, index) => {
            const { shipper, stopType } = stop;

            return {
                longitude: shipper.longitude,
                latitude: shipper.latitude,
                pickup: stopType.name === LoadDetailsItemStringEnum.PICKUP,
                delivery: stopType.name === LoadDetailsItemStringEnum.DELIVERY,
                stopNumber: index,
            };
        });

        this.loadStopRoutes.push({
            routeColor: LoadDetailsItemStringEnum.COLOR_1,
            stops: routes.map((route, index) => {
                return {
                    lat: route.latitude,
                    long: route.longitude,
                    stopColor: route.pickup
                        ? LoadDetailsItemStringEnum.COLOR_2
                        : route.delivery
                        ? LoadDetailsItemStringEnum.COLOR_3
                        : LoadDetailsItemStringEnum.COLOR_1,
                    stopNumber: route?.stopNumber?.toString(),
                    zIndex: 99 + index,
                };
            }),
        });
    }

    public selectLoad(loadId: number, isAssigned: boolean) {
        if (!this.isAdditonalViewOpened) return;
        this.isLoading = true;

        this.isAssignedLoad = isAssigned;
        this.selectedLoad = null;

        this.fetchLoadById(loadId, (load) => {
            this.selectedLoad = { ...load };
            this.getLoadStopRoutes(load.stops);
            this.isLoading = false;

            // Hide right side of modal
            this.additionalPartVisibility({ action: '', isOpen: true });
        });
    }

    private fetchLoadById(
        loadId: number,
        callback: (load: LoadResponse) => void
    ): void {
        this.loadService
            .getLoadById(loadId)
            .pipe(takeUntil(this.destroy$), tap(callback))
            .subscribe();
    }

    public changeLoadList(
        loadId: number,
        isAssignedList: boolean,
        isIconClick?: boolean
    ) {
        if (isAssignedList) {
            const loadIndex = this.assignedLoads.findIndex(
                (load) => load.id === loadId
            );

            const [movedLoad] = this.assignedLoads.splice(loadIndex, 1);

            this.unassignedLoads.push(movedLoad);
            this.isUnAssignLoadCardOpen = true;
        } else {
            const loadIndex = this.unassignedLoads.findIndex(
                (load) => load.id === loadId
            );

            const [movedLoad] = this.unassignedLoads.splice(loadIndex, 1);

            this.assignedLoads.push(movedLoad);
            this.isAssignLoadCardOpen = true;
        }

        if (isIconClick || loadId === this.selectedLoad?.id)
            this.isAssignedLoad = !isAssignedList;

        this.drawAssignedLoadRoutes();
        this.updateFilters();
    }

    private updateFilters(): void {
        this.tableService.sendActionAnimation({
            animation: 'load-list-update',
            data: this.originalLoads,
        });
    }

    private getLoadsForDispatchId(dispatchId: number) {
        const {
            truckType,
            trailerType,
            _long,
            lat,
            distance,
            dispatchersId,
            dateFrom,
            dateTo,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2,
        } = this.backLoadFilterQuery;

        this.loadService
            .getDispatchModalData(
                true,
                dispatchId,
                truckType,
                trailerType,
                _long,
                lat,
                distance,
                dispatchersId,
                dateFrom,
                dateTo,
                pageIndex,
                pageSize,
                companyId,
                sort,
                search,
                search1,
                search2
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: AssignedLoadListResponse) => {
                this.assignedLoads = res.assignedLoads;

                this.isAssignLoadCardOpen = !!this.assignedLoads.length;
            });
    }

    public additionalPartVisibility(event: {
        action: string;
        isOpen: boolean;
    }): void {
        this.loadModalSize = event.isOpen
            ? LoadModalStringEnum.MODAL_CONTAINER_LOAD
            : LoadModalStringEnum.MODAL_SIZE;

        this.isAdditonalViewOpened = event.isOpen;

        if (this.isAdditonalViewOpened && !this.selectedLoad)
            this.drawAssignedLoadRoutes();

        if (!event.isOpen) {
            this.loadStopRoutes = [];
            this.selectedLoad = null;
        }
    }

    public dropAssigned(event: CdkDragDrop<string[]>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }

        moveItemInArray(
            this.assignedLoads,
            event.previousIndex,
            event.currentIndex
        );

        this.drawAssignedLoadRoutes();
    }

    public onReorderAction(data: { action: string }): void {
        if (data.action === LoadModalStringEnum.REORDERING) {
            this.isReorderingActive = false;
            this.showReorderButton = true;
            this.isUnAssignLoadCardOpen = false;
        } else {
            this.isReorderingActive = true;
            this.showReorderButton = false;
            this.isUnAssignLoadCardOpen = false;
            setTimeout(() => {
                this.resizerComponent.setHeights(440, 45);
            }, 10);
        }
    }

    public editLoad() {
        this.fetchLoadById(this.selectedLoad.id, (load) => {
            const editData = {
                data: {
                    ...load,
                },
                type: TableStringEnum.EDIT,
                selectedTab: TableStringEnum.PENDING,
            };

            this.modalService.openModal(
                LoadModalComponent,
                { size: TableStringEnum.LOAD },
                {
                    ...editData,
                    disableButton: false,
                }
            );
        });
    }

    private drawAssignedLoadRoutes() {
        if (this.assignedLoads.length) {
            this.isMapLoaderVisible = true;
        } else {
            this.loadStopRoutes = [];
        }

        this.assignedLoads.forEach((load, index) => {
            this.fetchLoadById(load.id, (loadResponse) => {
                this.getLoadStopRoutes(loadResponse.stops);

                if (index === this.assignedLoads.length - 1)
                    this.isMapLoaderVisible = false;
            });
        });
    }

    public setFilter(data): void {
        switch (data?.filterType) {
            case LoadFilterStringEnum.DISPATCHER_FILTER:
                this.backLoadFilterQuery.dispatchersId = data.queryParams
                    ? data.queryParams
                    : null;
                break;
            case LoadFilterStringEnum.TIME_FILTER:
                const selectedTime = this.dispatchFutureTimes.find(
                    (futureTimes) =>
                        futureTimes.name.toLowerCase() ===
                        data.queryParams?.timeSelected.toLowerCase()
                )?.id;
                if (selectedTime === 15) {
                    const { fromDate, toDate } =
                        RepairTableDateFormaterHelper.getDateRange(
                            data.queryParams?.timeSelected,
                            data.queryParams.year ?? null
                        );
                    this.backLoadFilterQuery.dateTo = toDate;
                    this.backLoadFilterQuery.dateFrom = fromDate;
                } else {
                    this.backLoadFilterQuery.dateTo = null;
                    this.backLoadFilterQuery.dateFrom = null;
                }
                this.backLoadFilterQuery.dispatchFutureTime = selectedTime;
                break;
            case LoadFilterStringEnum.LOCATION_FILTER:
                this.backLoadFilterQuery._long =
                    data.queryParams?.longValue ?? null;
                this.backLoadFilterQuery.lat =
                    data.queryParams?.latValue ?? null;
                this.backLoadFilterQuery.distance =
                    data.queryParams?.rangeValue ?? null;
                break;
            case LoadFilterStringEnum.TRUCK_TYPE_FILTER:
                this.backLoadFilterQuery.truckType = data.queryParams
                    ? data.queryParams
                    : null;
                break;
            case LoadFilterStringEnum.TRAILER_TYPE_FILTER:
                this.backLoadFilterQuery.trailerType = data.queryParams
                    ? data.queryParams
                    : null;
                break;
            default:
                break;
        }

        this.loadModalData();
    }

    public toggleUnAssignedList(): void {
        this.isUnAssignLoadCardOpen = !this.isUnAssignLoadCardOpen;
        this.setUnAssignCardFullHeight();
    }

    public toggleAssignList(): void {
        this.isAssignLoadCardOpen = !this.isAssignLoadCardOpen;
        this.setUnAssignCardFullHeight();
    }

    private setUnAssignCardFullHeight(): void {
        if (this.isUnAssignLoadCardOpen && !this.isAssignLoadCardOpen) {
            this._initialSecondElementHeight = 400;
        }
    }

    public onFirstElementHeightChange(height: number): void {
        this.firstElementHeight = height;
    }

    public onSecondElementHeightChange(height: number): void {
        this.secondElementHeight = height;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
