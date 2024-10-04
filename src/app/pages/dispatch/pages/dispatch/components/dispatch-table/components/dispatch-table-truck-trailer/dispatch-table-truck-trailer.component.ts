import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

// components
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';

// services
import { ModalService } from '@shared/services/modal.service';

// enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';

// helpers
import { DispatchTableDragNDropHelper } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/helpers';

// config
import { DispatchConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs';

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
import {
    DispatchTrailerListItemModel,
    DispatchTruckListItemModel,
} from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';

@Component({
    selector: 'app-dispatch-table-truck-trailer',
    templateUrl: './dispatch-table-truck-trailer.component.html',
    styleUrls: ['./dispatch-table-truck-trailer.component.scss'],
})
export class DispatchTableTruckTrailerComponent implements OnChanges {
    @Input() set truckDropdownWidth(value: number) {
        this._truckDropdownWidth = Math.round(value - 2);
    }
    @Input() set trailerDropdownWidth(value: number) {
        this._trailerDropdownWidth = Math.round(value - 2);
    }
    @Input() set trailerList(values: TrailerDispatchModalResponse[]) {
        this.handleTruckTrailerList(values);
    }
    @Input() set truckList(values: TruckDispatchModalResponse[]) {
        this.handleTruckTrailerList(values);
    }
    @Input() set previousDragTrailerTypeId(value: number) {
        this.handleTrailerDrag(value);
    }

    @Input() isTrailerAddNewHidden: boolean;

    @Input() truck: TruckResponse;
    @Input() trailer: TrailerResponse;

    @Input() type: string;
    @Input() rowIndex: number;
    @Input() isDrag: boolean;
    @Input() isHoveringRow: boolean;
    @Input() isBoardLocked: boolean;
    @Input() isActiveLoad: boolean;
    @Input() isYearShown: boolean = true;

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

    public _trailerList: DispatchTrailerListItemModel[] = [];
    public _truckList: DispatchTruckListItemModel[] = [];

    public _truckDropdownWidth: number;
    public _trailerDropdownWidth: number;

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    public hasNoResultsTruck: boolean = false;
    public hasNoResultsTrailer: boolean = false;

    public truckIndex: number = -1;
    public trailerIndex: number = -1;

    public hasAddNew: boolean = false;

    public isTrailerDropAllowed: boolean = false;

    constructor(private modalService: ModalService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            this.type === DispatchTableStringEnum.TRUCK &&
            !changes?.truck?.currentValue
        )
            this.truckTrailerFormControl.reset();
    }

    get truckTrailerInputConfig(): ITaInput {
        return DispatchConfig.getTruckTrailerInputConfig({
            type: this.type,
            truckDropdownWidth: this._truckDropdownWidth,
            trailerDropdownWidth: this._trailerDropdownWidth,
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

    public handleTruckTrailerList(
        values: DispatchTruckListItemModel[] | TrailerDispatchModalResponse[]
    ): void {
        if (values) {
            this.type === DispatchTableStringEnum.TRUCK
                ? (this._truckList = [...values])
                : (this._trailerList = [...values]);
        }

        const findAllAssigned =
            this.type === DispatchTableStringEnum.TRUCK
                ? this._truckList.find((item) => item.id === 7656)
                : this._trailerList.find((item) => item.id === 7656);

        this.hasAddNew = !values?.length;

        if (!values?.length && !findAllAssigned) {
            this.type === DispatchTableStringEnum.TRUCK
                ? this._truckList.unshift({
                      id: 7656,
                      name: DispatchTableStringEnum.ALL_ASSIGNED,
                  })
                : this._trailerList.unshift({
                      id: 7656,
                      name: DispatchTableStringEnum.ALL_ASSIGNED,
                  });
        }
    }

    private handleTrailerDrag(trailerId: number): void {
        const allowedTruckIds =
            DispatchTableDragNDropHelper.getTrailerAllowedTruckIds(trailerId);

        this.isTrailerDropAllowed =
            allowedTruckIds.includes(this.truck?.truckType?.id) || !this.truck;
    }
}
