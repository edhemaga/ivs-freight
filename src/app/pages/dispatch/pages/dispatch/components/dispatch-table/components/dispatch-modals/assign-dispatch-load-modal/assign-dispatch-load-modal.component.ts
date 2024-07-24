import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import {
    CDK_DRAG_CONFIG,
    CdkDragDrop,
    moveItemInArray,
} from '@angular/cdk/drag-drop';

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
    DriverDispatchResponse,
    LoadResponse,
    LoadStopResponse,
    TrailerMinimalResponse,
    TruckMinimalResponse,
} from 'appcoretruckassist';
import { StopRoutes } from '@shared/models/stop-routes.model';
import { MapRoute } from '@shared/models/map-route.model';

// Services
import { LoadService } from '@shared/services/load.service';
import { ModalService } from '@shared/services/modal.service';

// Components
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

@Component({
    selector: 'app-assign-dispatch-load-modal',
    templateUrl: './assign-dispatch-load-modal.component.html',
    styleUrls: ['./assign-dispatch-load-modal.component.scss'],
    providers: [
        { provide: CDK_DRAG_CONFIG, useValue: LoadModalDragAndDrop.Config },
    ],
})
export class AssignDispatchLoadModalComponent implements OnInit, OnDestroy {
    // Svg
    public svgIcons = DispatchParkingSvgRoutes;

    // Destroy
    private destroy$ = new Subject<void>();

    @Input() editData: {
        data: AssignedLoadListResponse;
        driver: DriverDispatchResponse;
        truck: TruckMinimalResponse;
        trailer: TrailerMinimalResponse;
    };

    // Form
    public assingLoadForm: UntypedFormGroup;

    public loadDispatchesTTDInputConfig =
        AssignDispatchLoadConfig.truckTrailerDriver;

    public loadModalSize: string = LoadModalStringEnum.MODAL_SIZE;

    // Reordering
    public showReorderButton: boolean = true;
    public showFinishReordering: boolean = false;
    public isAdditonalViewOpened: boolean;
    public selectedLoad: LoadResponse;

    // Additional load
    public isAssignedLoad: boolean = false;

    public loadStopRoutes: MapRoute[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private loadService: LoadService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.createForm();
        this.drawAssignedLoadRoutes();
    }

    private createForm() {
        this.assingLoadForm = this.formBuilder.group({
            dispatchId: [null],
        });
    }

    public trackByIdentity(id: number): number {
        return id;
    }

    public additionalPartVisibility(event: {
        action: string;
        isOpen: boolean;
    }): void {
        this.loadModalSize = event.isOpen
            ? LoadModalStringEnum.MODAL_CONTAINER_LOAD
            : LoadModalStringEnum.MODAL_SIZE;
        this.isAdditonalViewOpened = event.isOpen;
    }

    public dropAssigned(event: CdkDragDrop<string[]>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }
        moveItemInArray(
            this.editData.data.assignedLoads,
            event.previousIndex,
            event.currentIndex
        );
    }

    public onReorderAction(data: { action: string }): void {
        if (data.action === LoadModalStringEnum.REORDERING) {
            this.showFinishReordering = false;
            this.showReorderButton = true;
        } else {
            this.showFinishReordering = true;
            this.showReorderButton = false;
        }
    }

    public changeLoadList(loadIndex: number, isAssignedList: boolean) {
        if (isAssignedList) {
            const [movedLoad] = this.editData.data.assignedLoads.splice(
                loadIndex,
                1
            );
            this.editData.data.unassignedLoads.push(movedLoad);
        } else {
            const [movedLoad] = this.editData.data.unassignedLoads.splice(
                loadIndex,
                1
            );
            this.editData.data.assignedLoads.push(movedLoad);
        }
    }

    public selectLoad(loadId: number, isAssigned: boolean) {
        this.isAssignedLoad = isAssigned;
        this.fetchLoadById(loadId, (load) => {
            this.selectedLoad = load;
            this.getLoadStopRoutes(load.stops);
        });
    }

    private getLoadStopRoutes(stops: LoadStopResponse[]): void {
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

    private drawAssignedLoadRoutes() {
        this.editData.data.assignedLoads.forEach((load) => {
            this.fetchLoadById(load.id, (loadResponse) => {
                this.getLoadStopRoutes(loadResponse.stops);
            });
        });
    }

    public editLoad() {
        this.fetchLoadById(this.selectedLoad.id, (load) => {
            const editData = {
                data: {
                    ...load,
                },
                type: TableStringEnum.EDIT,
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

    private fetchLoadById(
        loadId: number,
        callback: (load: LoadResponse) => void
    ): void {
        this.loadService
            .getLoadById(loadId)
            .pipe(takeUntil(this.destroy$), tap(callback))
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
