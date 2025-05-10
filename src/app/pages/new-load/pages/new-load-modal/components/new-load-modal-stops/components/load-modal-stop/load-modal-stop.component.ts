import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

// enums
import { eDateTimeFormat } from '@shared/enums';
import { eLoadModalStopsForm } from '@pages/new-load/pages/new-load-modal/enums';

// models
import { ShipperLoadModalResponse } from 'appcoretruckassist';

// pipes
import {
    LoadDatetimeRangePipe,
    LoadTimeTypePipe,
} from '@pages/load/pages/load-modal/pipes';
import { StopContainerClassPipe } from '@pages/new-load/pages/new-load-modal/components/new-load-modal-stops/pipes';

@Component({
    selector: 'app-load-modal-stop',
    templateUrl: './load-modal-stop.component.html',
    styleUrl: './load-modal-stop.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,

        // pipes
        LoadTimeTypePipe,
        LoadDatetimeRangePipe,
        StopContainerClassPipe,
    ],
})
export class LoadModalStopComponent {
    @Input() set stopFormGroup(value: UntypedFormGroup) {
        this._stopFormGroup = value;
    }
    @Input() shippers: ShipperLoadModalResponse[] = [];

    @Input() set selectedShipperId(shipperId: number) {
        this.setShipper(shipperId);
    }
    @Input() isOpen: boolean = false;
    @Input() isLast: boolean;
    @Input() index: number;

    public _stopFormGroup!: UntypedFormGroup;

    public shipper: ShipperLoadModalResponse;

    public eDateTimeFormat = eDateTimeFormat;
    public eLoadModalStopsForm = eLoadModalStopsForm;

    private setShipper(shipperId: number): void {
        this.shipper =
            this.shippers.find((shipper) => shipper.id === shipperId) ?? null;
    }
}
