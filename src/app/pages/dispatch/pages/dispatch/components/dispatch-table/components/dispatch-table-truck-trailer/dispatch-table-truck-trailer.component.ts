import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

// components
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';

// services
import { ModalService } from '@shared/services/modal.service';

// enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-table-string.enum';

// config
import { DispatchConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs/dispatch.config';

// models
import {
    TrailerDispatchModalResponse,
    TrailerMinimalResponse,
    TrailerResponse,
    TruckDispatchModalResponse,
    TruckMinimalResponse,
    TruckResponse,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { OpenModal } from '@shared/models/open-modal.model';

@Component({
    selector: 'app-dispatch-table-truck-trailer',
    templateUrl: './dispatch-table-truck-trailer.component.html',
    styleUrls: ['./dispatch-table-truck-trailer.component.scss'],
})
export class DispatchTableTruckTrailerComponent {
    @Input() set hasAdditionalFieldTruck(hasAdditionalField: boolean) {
        this._hasAdditionalFieldTruck = hasAdditionalField;
    }
    @Input() set hasAdditionalFieldTrailer(hasAdditionalField: boolean) {
        this._hasAdditionalFieldTrailer = hasAdditionalField;
    }

    @Input() type: string;

    @Input() truck: TruckResponse;
    @Input() trailer: TrailerResponse;

    @Input() truckList: TruckDispatchModalResponse[];
    @Input() trailerList: TrailerDispatchModalResponse[];

    @Input() rowIndex: number;

    @Input() isBoardLocked: boolean;
    @Input() isDrag: boolean;
    @Input() isActiveLoad: boolean;
    @Input() showYear: boolean = true;

    @Input() isHoveringRow: boolean;

    @Output() addTruckTrailerEmitter = new EventEmitter<{
        type: string;
        event: TruckMinimalResponse | TrailerMinimalResponse;
        index: number;
    }>();
    @Output() removeTruckTrailerEmitter = new EventEmitter<{
        type: string;
        index: number;
    }>();

    public truckTrailerFormControl: UntypedFormControl =
        new UntypedFormControl();

    public _hasAdditionalFieldTruck: boolean = false;
    public _hasAdditionalFieldTrailer: boolean = false;

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    public hasNoResultsTruck: boolean = false;
    public hasNoResultsTrailer: boolean = false;

    public truckIndex: number = -1;
    public trailerIndex: number = -1;

    constructor(private modalService: ModalService) {}

    get truckTrailerInputConfig(): ITaInput {
        return DispatchConfig.getTruckTrailerInputConfig({
            type: this.type,
            hasAdditionalFieldTruck: this._hasAdditionalFieldTruck,
            hasAdditionalFieldTrailer: this._hasAdditionalFieldTrailer,
        });
    }

    public handleTruckTrailerIndex(type: string, index: number): void {
        type === DispatchTableStringEnum.TRUCK
            ? (this.truckIndex = index)
            : (this.trailerIndex = index);
    }

    public handleAddClick(isClicked: boolean): void {
        if (isClicked) this.handleTruckTrailerIndex(this.type, this.rowIndex);
    }

    public addTruck<T extends OpenModal>(event: T): void {
        if (event) {
            if (event.canOpenModal) {
                this.modalService.openModal(
                    TruckModalComponent,
                    {
                        size: DispatchTableStringEnum.SMALL,
                    },
                    {
                        isDispatchCall: true,
                    }
                );
            } else {
                this.addTruckTrailerEmitter.emit({
                    type: DispatchTableStringEnum.TRUCK,
                    event: event as TruckMinimalResponse,
                    index: this.truckIndex,
                });
            }
        }

        this.truckIndex = -1;
    }

    public addTrailer<T extends OpenModal>(event: T): void {
        if (event) {
            if (event.canOpenModal) {
                this.modalService.openModal(
                    TrailerModalComponent,
                    {
                        size: DispatchTableStringEnum.SMALL,
                    },
                    {
                        isDispatchCall: true,
                    }
                );
            } else {
                this.addTruckTrailerEmitter.emit({
                    type: DispatchTableStringEnum.TRAILER,
                    event: event as TrailerMinimalResponse,
                    index: this.trailerIndex,
                });
            }
        }

        this.trailerIndex = -1;
    }

    public removeTruck(index: number): void {
        if (this.isActiveLoad) return;

        this.removeTruckTrailerEmitter.emit({
            type: DispatchTableStringEnum.TRUCK_ID,
            index,
        });
    }

    public removeTrailer(index: number): void {
        if (this.isActiveLoad) return;

        this.removeTruckTrailerEmitter.emit({
            type: DispatchTableStringEnum.TRAILER_ID,
            index,
        });
    }
}
