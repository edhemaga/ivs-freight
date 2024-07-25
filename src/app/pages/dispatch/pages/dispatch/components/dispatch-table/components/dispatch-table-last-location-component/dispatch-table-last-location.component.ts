import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';

// component
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';

//config
import { DispatchConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs/dispatch.config';

//models
import { AddressEntity } from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { DispatchBoardParking } from '@pages/dispatch/models/dispatch-parking.model';

@Component({
    selector: 'app-dispatch-table-last-location',
    templateUrl: './dispatch-table-last-location.component.html',
    styleUrls: ['./dispatch-table-last-location.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        //components
        TaInputAddressDropdownComponent,
        TaInputDropdownComponent,
    ],
})
export class DispatchTableLastLocationComponentComponent {
    @Input() address?: AddressEntity = null;
    @Input() rowIndex: number = 0;
    @Input() showAddAddressField: number = 0;
    @Input() set parkingList(value: DispatchBoardParking[]) {
        if (this.address) {
            this.checkParkingLocation(value);
        }
    }
    @Output() updateLastLocationEmit: EventEmitter<AddressEntity> =
        new EventEmitter<AddressEntity>();
    @Output() isDropdownHidden: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    public isDisplayParkingIcon: boolean = false;
    public truckAddressControl: UntypedFormControl = new UntypedFormControl(
        null
    );

    constructor() {}

    get LastLocationAddressConfig(): ITaInput {
        return DispatchConfig.getDispatchAddressConfig();
    }

    public handleInputSelect(event): void {
        if (event.valid) {
            this.updateLastLocationEmit.emit(event.address);
        }
    }

    public onHideDropdown(): void {
        this.isDropdownHidden.emit(true);
    }

    public checkParkingLocation(parkings): void {
        this.isDisplayParkingIcon = parkings.some(
            (parking) => parking.address.county === this.address.county
        );
    }
}
