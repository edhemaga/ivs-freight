import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';

// NgbModule
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Constants
import { LoadModalConfig } from '@pages/load/pages/load-modal/utils/constants';

// Helpers
import { LoadModalStopsHelper } from '@pages/new-load/pages/new-load-modal/components/new-load-modal-stops/utils/helpers/load-modal-stops.helper';

// Components
import {
    CaCustomCardComponent,
    CaInputDatetimePickerComponent,
    CaInputDropdownTestComponent,
    CaTabSwitchComponent,
    eColor,
} from 'ca-components';
import { LoadModalStopComponent } from './components/load-modal-stop/load-modal-stop.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Enum
import { eLoadModalStopsForm } from '@pages/new-load/pages/new-load-modal/enums';

// Pipes
import { LoadStopInputConfigPipe } from '@pages/new-load/pages/new-load-modal/pipes/load-stop-input-config.pipe';

// Models
import {
    EnumValue,
    RoutingResponse,
    ShipperContactGroupResponse,
    ShipperLoadModalResponse,
} from 'appcoretruckassist';
import { Tabs } from '@shared/models';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-new-load-modal-stops',
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        ReactiveFormsModule,
        NgbModule,

        // Components
        CaCustomCardComponent,
        CaTabSwitchComponent,
        CaInputDropdownTestComponent,
        CaInputDatetimePickerComponent,
        LoadModalStopComponent,
        SvgIconComponent,
        TaAppTooltipV2Component,

        // Pipes
        LoadStopInputConfigPipe,
    ],
    templateUrl: './new-load-modal-stops.component.html',
    styleUrl: './new-load-modal-stops.component.scss',
})
export class NewLoadModalStopsComponent {
    @Input() routing: RoutingResponse = {};
    @Input() shippers: ShipperLoadModalResponse[] = [];
    @Input() shipperContacts: ShipperContactGroupResponse[] = [];
    @Output() onShipperSelection = new EventEmitter<{
        shipper: ShipperLoadModalResponse;
        index: number;
    }>();
    public LoadModalConfig = LoadModalConfig;
    // Enums
    public eLoadModalStopsForm = eLoadModalStopsForm;
    public eColor = eColor;

    // Icon routes
    public svgRoutes = SharedSvgRoutes;

    // Each stop will have it's own tabs
    public tabs = LoadModalStopsHelper.tabs;
    public stopTabs = LoadModalStopsHelper.stopTabs;

    @Input() loadForm: UntypedFormGroup;

    public activeCardIndex: number = -1;

    get stopsFormArray(): FormArray {
        return this.loadForm.get('stops') as FormArray;
    }

    constructor(private fb: FormBuilder) {}

    public onAddDateTo(index: number, isAppointment: boolean): void {
        if (isAppointment) return;

        const stop = this.stopsFormArray.at(index) as FormGroup;
        LoadModalStopsHelper.addDateToControl(stop);
    }

    public onTabChange(tab: EnumValue, i: number): void {
        const stop = this.stopsFormArray.at(i) as FormGroup;
        LoadModalStopsHelper.updateTimeValidators(stop, tab);
        LoadModalStopsHelper.removeDateToControl(stop);
    }

    public onAddNewStop(): void {
        const newStop = LoadModalStopsHelper.createStop(this.fb, {
            stopType: 1,
        });

        const index = Math.max(this.stopsFormArray.length - 1, 0);
        this.stopsFormArray.insert(index, newStop);
    }

    public onCardOpened(opened: boolean, index: number): void {
        this.activeCardIndex = opened ? index : -1;
    }

    public onShipperChange(
        shipper: ShipperLoadModalResponse,
        index: number
    ): void {
        const stop = this.stopsFormArray.at(index) as FormGroup;
        LoadModalStopsHelper.setTimeBasedOnShipperWorkingTime(shipper, stop);
        this.emitShipperChange(shipper, index);
    }

    public emitShipperChange(
        shipper: ShipperLoadModalResponse,
        index: number
    ): void {
        this.onShipperSelection.emit({
            index,
            shipper,
        });
    }

    public onStopTypeChange(tab: Tabs, index: number): void {
        const stop = this.stopsFormArray.at(index) as FormGroup;
        stop.get(eLoadModalStopsForm.STOP_TYPE).patchValue(tab.id);
    }

    public onActionEventEmit(actionEvent: {
        check: boolean;
        action: string;
    }): void {
        const { action } = actionEvent;
        if (action === 'plus-action') {
            this.onAddNewStop();
        }
    }
}
