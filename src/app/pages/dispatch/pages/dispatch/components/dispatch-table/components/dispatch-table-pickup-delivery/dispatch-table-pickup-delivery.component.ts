import { Component, Input } from '@angular/core';

// Models
import {
    DispatchGroupedLoadsResponse,
    DispatchResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-dispatch-table-pickup-delivery',
    templateUrl: './dispatch-table-pickup-delivery.component.html',
    styleUrls: ['./dispatch-table-pickup-delivery.component.scss'],
})
export class DispatchTablePickupDeliveryComponent {
    @Input() set columnWidth(value: number) {
        this._columnWidth = value - 10;
    }

    @Input() public dispatchResponse: DispatchResponse;
    @Input() public isHoveringRowIndex: number;
    @Input() public rowIndex: number;
    @Input() public isDispatchBoardLocked: boolean;
    @Input() public dispatchLoads: DispatchGroupedLoadsResponse;

    public _columnWidth = 340;

    constructor() {}
}
