import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// config
import { DispatchConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs';

// models
import { AddressEntity } from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { DispatchBoardParking } from '@pages/dispatch/models/dispatch-parking.model';

@Component({
    selector: 'app-dispatch-table-last-location',
    templateUrl: './dispatch-table-last-location.component.html',
    styleUrls: ['./dispatch-table-last-location.component.scss'],
})
export class DispatchTableLastLocationComponentComponent {
    @Input() set parkingList(value: DispatchBoardParking[]) {
        if (this.address) this.checkParkingLocation(value);
    }
    @Input() address?: AddressEntity = null;
    @Input() rowIndex: number = 0;
    @Input() showAddAddressField: number = 0;
    @Input() isHoveringRow: boolean;
    @Input() isDisplayingAddressInput: boolean;

    @Output() updateLastLocationEmit: EventEmitter<AddressEntity> =
        new EventEmitter<AddressEntity>();
    @Output() isDropdownHidden: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    public truckAddressControl: UntypedFormControl = new UntypedFormControl(
        null
    );

    public isDisplayParkingIcon: boolean = false;

    constructor() {}

    get lastLocationAddressConfig(): ITaInput {
        return DispatchConfig.getDispatchAddressConfig();
    }

    public handleInputSelect(event): void {
        if (event.valid) {
            this.updateLastLocationEmit.emit(event.address);

            this.isDisplayingAddressInput = false;
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
