import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// enums
import { eColor, eDateTimeFormat, eSharedString } from '@shared/enums';
import { eLoadModalStopsForm } from '@pages/new-load/pages/new-load-modal/enums';

// models
import { ShipperLoadModalResponse } from 'appcoretruckassist';

// components
import { SvgIconComponent } from 'angular-svg-icon';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// pipes
import {
    LoadDatetimeRangePipe,
    LoadTimeTypePipe,
} from '@pages/load/pages/load-modal/pipes';
import { StopContainerClassPipe } from '@pages/new-load/pages/new-load-modal/components/new-load-modal-stops/pipes';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-load-modal-stop',
    templateUrl: './load-modal-stop.component.html',
    styleUrl: './load-modal-stop.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,

        // components
        SvgIconComponent,
        TaAppTooltipV2Component,

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
    @Input() hasDelete: boolean = false;
    @Output() onDeleteActionIndex = new EventEmitter<number>();

    public _stopFormGroup!: UntypedFormGroup;

    public shipper: ShipperLoadModalResponse;

    public isStopHovered: boolean = false;

    // enums
    public eDateTimeFormat = eDateTimeFormat;
    public eLoadModalStopsForm = eLoadModalStopsForm;
    public eColor = eColor;
    public eSharedString = eSharedString;

    // icon routes
    public svgRoutes = SharedSvgRoutes;

    public onDeleteIconClick(event: MouseEvent): void {
        event.stopPropagation();
        this.onDeleteActionIndex.emit(this.index);
    }

    private setShipper(shipperId: number): void {
        this.shipper =
            this.shippers.find((shipper) => shipper.id === shipperId) ?? null;
    }
}
