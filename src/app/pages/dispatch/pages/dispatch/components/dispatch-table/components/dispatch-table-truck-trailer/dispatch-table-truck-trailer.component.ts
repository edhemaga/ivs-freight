import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
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

@Component({
    selector: 'app-dispatch-table-truck-trailer',
    templateUrl: './dispatch-table-truck-trailer.component.html',
    styleUrls: ['./dispatch-table-truck-trailer.component.scss'],
})
export class DispatchTableTruckTrailerComponent implements OnInit, OnChanges {
    @Input() type: string;

    @Input() hasAdditionalFieldTruck: boolean = false;
    @Input() hasAdditionalFieldTrailer: boolean = false;

    @Input() truck: any;
    @Input() trailer: any;

    @Input() truckList: any[];
    @Input() trailerList: any[];

    @Input() rowIndex: number;

    @Input() isBoardLocked: boolean;
    @Input() isDrag: boolean;
    @Input() isActiveLoad: boolean;

    @Output() removeTruckTrailerEmitter = new EventEmitter<{
        type: string;
        index: number;
    }>();

    truckTrailerFormControl: UntypedFormControl = new UntypedFormControl();

    openedTruckDropdown: number = -1;
    openedTrailerDropdown: number = -1;

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    constructor(private modalService: ModalService) {}

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {}

    showTruckDropdown(ind: number) {
        this.openedTruckDropdown = ind;
    }

    showTrailerDropdown(ind: number) {
        this.openedTrailerDropdown = ind;
    }

    addTruck(e) {
        if (e) {
            if (e.canOpenModal) {
                this.modalService.setProjectionModal({
                    action: 'open',
                    payload: {
                        key: 'truck-modal',
                        value: null,
                    },
                    component: TruckModalComponent,
                    size: 'small',
                });
            } else {
                /*  if (this.openedTruckDropdown == -2) this.savedTruckId = e;

                else this.dData.dispatches[this.openedTruckDropdown].truck = e;
                this.showAddAddressField = this.openedTruckDropdown; */
            }
        }

        this.openedTruckDropdown = -1;
    }

    addTrailer(e) {
        if (e) {
            if (e.canOpenModal) {
                this.modalService.setProjectionModal({
                    action: 'open',
                    payload: {
                        key: 'truck-modal',
                        value: null,
                    },
                    component: TrailerModalComponent,
                    size: 'small',
                });
            } else {
                /*  this.updateOrAddDispatchBoardAndSend(
                    'trailerId',
                    e.id,
                    this.openedTrailerDropdown
                ); */
            }
        }

        this.openedTrailerDropdown = -1;
    }

    removeTruck(index) {
        if (this.isActiveLoad) return;

        this.removeTruckTrailerEmitter.emit({ type: 'truckId', index });
        /*  this.updateOrAddDispatchBoardAndSend('truckId', null, indx); */
    }

    removeTrailer(index) {
        if (this.isActiveLoad) return;

        this.removeTruckTrailerEmitter.emit({ type: 'trailerId', index });

        /*  this.updateOrAddDispatchBoardAndSend('trailerId', null, indx); */
    }

    public handleAddClick(isClicked: boolean): void {
        if (this.type === 'truck') {
            this.showTruckDropdown(this.rowIndex);
        } else {
            this.showTrailerDropdown(this.rowIndex);
        }
    }
}
