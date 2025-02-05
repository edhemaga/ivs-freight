import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// config
import { DispatchConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs';

// models
import { AddressEntity } from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { DispatchBoardParking } from '@pages/dispatch/models/dispatch-parking.model';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

// services
import { AddressService } from '@shared/services/address.service';

@Component({
    selector: 'app-dispatch-table-last-location',
    templateUrl: './dispatch-table-last-location.component.html',
    styleUrls: ['./dispatch-table-last-location.component.scss'],
})
export class DispatchTableLastLocationComponentComponent extends AddressMixin(
    class { addressService!: AddressService; }
) {
    @Input() set parkingList(value: DispatchBoardParking[]) {
        if (this.address) this.checkParkingLocation(value);
    }

    @Input() address?: AddressEntity = null;
    @Input() rowIndex: number = 0;
    @Input() showAddAddressField: number = 0;
    @Input() isHoveringRow: boolean;
    @Input() isDisplayingAddressInput: boolean;

    @Input() set locationDropdownWidth(value: number) {
        this._locationDropdownWidth = Math.round(value - 2);
    }

    @Output() updateLastLocationEmit: EventEmitter<AddressEntity> =
        new EventEmitter<AddressEntity>();
    @Output() isDropdownHidden: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    public truckAddressControl: UntypedFormControl = new UntypedFormControl(
        null
    );

    public isDisplayParkingIcon: boolean = false;

    public _locationDropdownWidth: number;

    constructor(public addressService: AddressService) {
        super();
    }

    get lastLocationAddressConfig(): ITaInput {
        return DispatchConfig.getDispatchAddressConfig(
            this._locationDropdownWidth
        );
    }

    public handleInputSelect(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        if (event.valid) this.updateLastLocationEmit.emit(event.address);

        if (!this.truckAddressControl.value) this.isDropdownHidden.emit(true);
    }

    public onHideDropdown(): void {
        if (!this.truckAddressControl.value) this.isDropdownHidden.emit(true);
    }

    public checkParkingLocation(parkings: DispatchBoardParking[]): void {
        this.isDisplayParkingIcon = parkings.some(
            (parking) => parking.address.county === this.address.county
        );
    }
}
