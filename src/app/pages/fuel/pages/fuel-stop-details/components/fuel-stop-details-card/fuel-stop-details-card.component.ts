import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// components
import { FuelStopDetailsTitleCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-title-card/fuel-stop-details-title-card.component';
import { FuelStopDetailsLastFuelPriceCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-last-fuel-price-card/fuel-stop-details-last-fuel-price-card.component';
import { FuelStopDetailsFuelExpenseCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-fuel-expense-card/fuel-stop-details-fuel-expense-card.component';
import { FuelStopDetailsMapCoverCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-map-cover-card/fuel-stop-details-map-cover-card.component';

import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';

// models
import { FuelStopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-fuel-stop-details-card',
    templateUrl: './fuel-stop-details-card.component.html',
    styleUrl: './fuel-stop-details-card.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,

        // components
        FuelStopDetailsTitleCardComponent,
        FuelStopDetailsLastFuelPriceCardComponent,
        FuelStopDetailsFuelExpenseCardComponent,
        FuelStopDetailsMapCoverCardComponent,

        TaInputNoteComponent,
    ],
})
export class FuelStopDetailsCardComponent {
    @Input() set fuelStop(data: FuelStopResponse) {
        this._fuelStop = data;

        console.log('this._fuelStop', this._fuelStop);

        /*   this.getFuelStopsDropdownList(); */
    }

    public _fuelStop: FuelStopResponse;

    //////////////////////////////////////////////

    /*  public noteControl: UntypedFormControl = new UntypedFormControl(); */
}
