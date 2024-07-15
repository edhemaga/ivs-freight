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

// services
import { ModalService } from '@shared/services/modal.service';

@Component({
    selector: 'app-dispatch-table-truck-trailer',
    templateUrl: './dispatch-table-truck-trailer.component.html',
    styleUrls: ['./dispatch-table-truck-trailer.component.scss'],
})
export class DispatchTableTruckTrailerComponent implements OnInit, OnChanges {
    @Input() truck: any;
    @Input() truckList: any[];
    @Input() rowIndex: number;
    @Input() isBoardLocked: boolean;
    @Input() isDrag: boolean;

    @Output() removeTruckEmitter = new EventEmitter<{
        type: string;
        index: number;
    }>();

    truckFormControll: UntypedFormControl = new UntypedFormControl();

    openedTruckDropdown: number = -1;

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    constructor(private modalService: ModalService) {}

    ngOnInit(): void {
        console.log('truckList', this.truckList);
        console.log('truck', this.truck);
    }

    ngOnChanges(changes: SimpleChanges): void {}

    showTruckDropdown(ind: number) {
        this.openedTruckDropdown = ind;

        console.log(' this.openedTruckDropdown', this.openedTruckDropdown);
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

    removeTruck(index) {
        this.removeTruckEmitter.emit({ type: 'truckId', index });
        /*  this.updateOrAddDispatchBoardAndSend('truckId', null, indx); */
    }
}
