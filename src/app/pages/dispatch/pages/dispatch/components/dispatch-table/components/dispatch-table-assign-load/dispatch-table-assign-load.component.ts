import { Component, Input, OnDestroy, OnInit } from '@angular/core';

// RXJS
import { Subject, takeUntil } from 'rxjs';

// Models
import {
    DriverDispatchResponse,
    TruckMinimalResponse,
    TrailerMinimalResponse,
    LoadShortResponse,
    LoadService,
} from 'appcoretruckassist';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Services
import { ModalService } from '@shared/services/modal.service';

// Components
import { AssignDispatchLoadModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/assign-dispatch-load-modal/assign-dispatch-load-modal.component';

// Svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

@Component({
    selector: 'app-dispatch-table-assign-load',
    templateUrl: './dispatch-table-assign-load.component.html',
    styleUrls: ['./dispatch-table-assign-load.component.scss'],
})
export class DispatchTableAssignLoadComponent implements OnInit, OnDestroy {
    @Input() driver: DriverDispatchResponse;
    @Input() truck: TruckMinimalResponse;
    @Input() trailer: TrailerMinimalResponse;
    @Input() isActiveLoad: LoadShortResponse;
    @Input() dispatchId: number;

    public svgRoutes = DispatchTableSvgRoutes;

    private destroy$ = new Subject<void>();

    constructor(
        private modalService: ModalService,
        private loadService: LoadService
    ) {}

    ngOnInit(): void {}

    public get isButtonDisabled(): boolean {
        if (!this.driver) return true;

        if (!this.truck) return true;

        // TODO: Add check for this trucks once they are added
        // if truck is, Reefer Truck, , Cement Truck, Dump Truck, Garbage Truck, also fix truck and trailer column dropdown
        // https://ivanjeboss.atlassian.net/browse/CAR-612

        // Cargo Van
        // Box Truck
        // Car Hauler then we don't need trailer
        const truckDoesntRequireTrailerIds = [2, 4, 5].includes(
            this.truck.truckType.id
        );

        if (truckDoesntRequireTrailerIds) return;

        if (!this.trailer) return true;

        return;
    }

    public onLoadIconClick(): void {
        this.loadService
            .apiLoadListAssignedIdGet(this.dispatchId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                // for(let i = 0; i < 15; i++) {
                //     response.assignedLoads.push(response.assignedLoads[0]);
                //     // response.unassignedLoads.push(response.unassignedLoads[0]);
                // }
                this.modalService.openModal(
                    AssignDispatchLoadModalComponent,
                    {
                        size: TableStringEnum.SMALL,
                    },
                    {
                        data: response,
                        truck: this.truck,
                        driver: this.driver,
                        trailer: this.trailer,
                    }
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
