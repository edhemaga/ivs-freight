import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/utils/helpers/dispatch-parking-svg-routes';

// Config
import { AssignDispatchLoadConfig } from '@pages/dispatch/pages/dispatch/utils/config/assign-dispatch-load.config';
import { LoadModalDragAndDrop } from '@pages/load/pages/load-modal/utils/constants/load-modal-draganddrop-config';

// Enum
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums/load-modal-string.enum';
import { LoadDetailsItemStringEnum } from '@pages/load/pages/load-details/components/load-details-item/enums/load-details-item-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Models
import {
    AssignedLoadListResponse,
    AssignedLoadResponse,
    AssignLoadModalResponse,
    DispatchLoadModalResponse,
    LoadResponse,
    LoadStopResponse,
    ReorderDispatchLoadsCommand,
} from '../../../../../../../../../../../appcoretruckassist';
import { StopRoutes } from '@shared/models/stop-routes.model';
import { MapRoute } from '@shared/models/map-route.model';

// Services
import { LoadService } from '@shared/services/load.service';
import { ModalService } from '@shared/services/modal.service';
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

// Components
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

@Component({
    selector: 'app-dispatch-assign-load-modal',
    templateUrl: './dispatch-assign-load-modal.component.html',
    styleUrls: ['./dispatch-assign-load-modal.component.scss'],
    providers: [
        { provide: CDK_DRAG_CONFIG, useValue: LoadModalDragAndDrop.Config },
    ],
})
export class DispatchAssignLoadModalComponent implements OnInit, OnDestroy {
    // Svg
    public svgIcons = DispatchParkingSvgRoutes;

    // Destroy
    private destroy$ = new Subject<void>();

    @Input() editData: { dispatchId: number };

    // Form
    public assignLoadForm: UntypedFormGroup;

    public loadDispatchesTTDInputConfig =
        AssignDispatchLoadConfig.truckTrailerDriver;

    public loadModalSize: string = LoadModalStringEnum.MODAL_SIZE;

    // Reordering
    public showReorderButton: boolean = true;
    public showFinishReordering: boolean = false;
    public isAdditonalViewOpened: boolean;
    public selectedLoad: LoadResponse;

    public isAssignLoadCardOpen: boolean = true;
    public isUnAssignLoadCardOpen: boolean = true;

    // Additional load
    public isAssignedLoad: boolean = false;

    public loadStopRoutes: MapRoute[] = [];
    public unassignedLoads: AssignedLoadResponse[] = [];
    public assignedLoads: AssignedLoadResponse[] = [];
    public labelsDispatches: any;
    public mappedDispatches: any;
    public selectedDispatches: any = null;
    public isMapLoaderVisible: boolean = false;
    constructor(
        private formBuilder: FormBuilder,
        private loadService: LoadService,
        private modalService: ModalService,
        private dispatchService: DispatcherService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.loadModalData();
    }

    private initializeForm(): void {
        this.assignLoadForm = this.formBuilder.group({
            dispatchId: [null],
        });
    }

    private loadModalData(): void {
        if (this.showFinishReordering) {
            // reset reordering
            this.onReorderAction({
                action: LoadModalStringEnum.REORDERING,
            });
        }

        this.loadService
            .getDispatchModalData()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: AssignLoadModalResponse) => {
                this.unassignedLoads = res.unassignedLoads;
                this.isUnAssignLoadCardOpen = !!res.unassignedLoads.length;

                this.mapDispatchers(res.dispatches);
                if (this.editData?.dispatchId) {
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
                }
            });
    }

    public selectNewDispatcher(event: { id: number }) {
        this.editData.dispatchId = event?.id ?? null;
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

    public onDispatchChange(dispach: any) {
        this.selectedDispatches = {
            ...dispach,
            name: dispach?.truck?.name
                ?.concat(
                    LoadModalStringEnum.EMPTY_SPACE_STRING,
                    dispach?.trailer?.name
                )
                .concat(
                    LoadModalStringEnum.EMPTY_SPACE_STRING,
                    dispach?.driver?.name
                ),
        };

        this.loadDispatchesTTDInputConfig = {
            ...this.loadDispatchesTTDInputConfig,
            multipleLabel: {
                labels: [
                    LoadModalStringEnum.TRUCK,
                    LoadModalStringEnum.TRAILER,
                    LoadModalStringEnum.DRIVER,
                    dispach?.payType ? LoadModalStringEnum.DRIVER_PAY : null,
                ],
                customClass: LoadModalStringEnum.LOAD_DISPATCHES_TTD,
            },
            multipleInputValues: {
                options: [
                    {
                        id: dispach?.truck?.id,
                        value: dispach?.truck?.name,
                        logoName: dispach?.truck?.logoName,
                        isImg: false,
                        isSvg: true,
                        folder: LoadModalStringEnum.COMMON,
                        subFolder: LoadModalStringEnum.TRUCKS,
                        logoType: dispach?.truck?.logoType,
                    },
                    {
                        value: dispach?.trailer?.name,
                        logoName: dispach?.trailer?.logoName,
                        isImg: false,
                        isSvg: true,
                        folder: LoadModalStringEnum.COMMON,
                        subFolder: LoadModalStringEnum.TRAILERS,
                        logoType: dispach?.trailer?.logoType,
                    },
                    {
                        value: dispach?.driver?.name,
                        logoName: dispach?.driver?.logoName
                            ? dispach?.driver?.logoName
                            : LoadModalStringEnum.NO_URL,
                        isImg: true,
                        isSvg: false,
                        folder: null,
                        subFolder: null,
                        isOwner: dispach?.driver?.owner,
                        logoType: null,
                    },
                    {
                        value: dispach?.payType,
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
            .subscribe({
                next: () => {
                    if (closeModal) this.ngbActiveModal.close();
                },
            });
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case LoadModalStringEnum.DISPATCH_LOAD_SAVE_AND_ASSIGN_NEW:
                this.saveLoads(false);
                break;
            case LoadModalStringEnum.DISPATCH_LOAD_CREATE_LOAD:
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
        this.isAssignedLoad = isAssigned;
        this.fetchLoadById(loadId, (load) => {
            this.selectedLoad = load;
            this.getLoadStopRoutes(load.stops);

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
        } else {
            const loadIndex = this.assignedLoads.findIndex(
                (load) => load.id === loadId
            );
            const [movedLoad] = this.unassignedLoads.splice(loadIndex, 1);
            this.assignedLoads.push(movedLoad);
        }

        if (isIconClick || loadId === this.selectedLoad?.id) {
            this.isAssignedLoad = !isAssignedList;
        }

        this.drawAssignedLoadRoutes();
    }

    private getLoadsForDispatchId(dispatchId: number) {
        this.loadService
            .apiLoadListAssignedIdGet(dispatchId)
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

        if (this.isAdditonalViewOpened && !this.selectedLoad) {
            this.drawAssignedLoadRoutes();
        }

        if (!event.isOpen) {
            this.loadStopRoutes = [];
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
            this.showFinishReordering = false;
            this.showReorderButton = true;
        } else {
            this.showFinishReordering = true;
            this.showReorderButton = false;
            this.isUnAssignLoadCardOpen = false;
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

    public get isModalValid(): boolean {
        return !!this.selectedDispatches && !this.showFinishReordering;
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

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
