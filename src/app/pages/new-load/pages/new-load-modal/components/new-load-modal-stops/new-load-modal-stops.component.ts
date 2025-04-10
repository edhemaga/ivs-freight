import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';

// Enums
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

@Component({
    selector: 'app-new-load-modal-stops',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,

        CaCustomCardComponent,
        CaTabSwitchComponent,
        CaInputDropdownTestComponent,
        CaInputDatetimePickerComponent,
    ],
    templateUrl: './new-load-modal-stops.component.html',
    styleUrl: './new-load-modal-stops.component.scss',
})
export class NewLoadModalStopsComponent implements OnInit {
    public LoadModalConfig = LoadModalConfig;

    // Each stop will have it's own tabs
    public tabs = LoadModalStopsHelper.tabs;

    public stopsForm: UntypedFormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.createForm();
    }

    public createForm(): void {
        this.stopsForm = this.fb.group({
            stops: this.fb.array([
                LoadModalStopsHelper.createStop(this.fb, {
                    stopType: 'PICKUP',
                    shipperId: 101,
                }),
                LoadModalStopsHelper.createStop(this.fb, {
                    stopType: 'DELIVERY',
                    shipperId: 102,
                }),
            ]),
        });
    }

    get stops(): FormArray {
        return this.stopsForm.get('stops') as FormArray;
    }
}
