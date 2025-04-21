import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';

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
} from 'ca-components';

// Enum
import { eLoadModalStopsForm } from '@pages/new-load/pages/new-load-modal/enums';

// Pipes
import { LoadStopInputConfigPipe } from '@pages/new-load/pages/new-load-modal/pipes/load-stop-input-config.pipe';

// Models
import {
    ShipperContactGroupResponse,
    ShipperLoadModalResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-new-load-modal-stops',
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        ReactiveFormsModule,

        // Components
        CaCustomCardComponent,
        CaTabSwitchComponent,
        CaInputDropdownTestComponent,
        CaInputDatetimePickerComponent,

        // Pipes
        LoadStopInputConfigPipe,
    ],
    templateUrl: './new-load-modal-stops.component.html',
    styleUrl: './new-load-modal-stops.component.scss',
})
export class NewLoadModalStopsComponent implements OnInit {
    @Input() shippers: ShipperLoadModalResponse[] = [];
    @Input() shipperContacts: ShipperContactGroupResponse[] = [];
    public LoadModalConfig = LoadModalConfig;
    // Enums
    public eLoadModalStopsForm = eLoadModalStopsForm;

    // Each stop will have it's own tabs
    public tabs = LoadModalStopsHelper.tabs;

    public stopsForm: UntypedFormGroup;

    get stopsFormArray(): FormArray {
        return this.stopsForm.get('stops') as FormArray;
    }

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.createForm();
    }

    public createForm(): void {
        const stopsArray = this.fb.array(
            [
                LoadModalStopsHelper.createStop(this.fb, {
                    stopType: 'PICKUP',
                    shipperId: 101,
                }),
                LoadModalStopsHelper.createStop(this.fb, {
                    stopType: 'DELIVERY',
                    shipperId: 102,
                }),
            ],
            [LoadModalStopsHelper.minStopsValidator(2)]
        );

        this.stopsForm = this.fb.group({
            stops: stopsArray,
        });
    }

    public onAddDateTo(index: number): void {
        const stopGroup = this.stopsFormArray.at(index) as FormGroup;
        LoadModalStopsHelper.addDateToControl(stopGroup);
    }

    public onTabChange(e: any, i: number): void {
        const group = this.stopsFormArray.at(i) as FormGroup;

        group.patchValue({ tabType: e.id });

        LoadModalStopsHelper.updateTimeValidators(group);
    }
}
