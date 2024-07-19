import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';

// component
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';

//config
import { DispatchConfig } from '../../utils/configs/dispatch.config';

//models
import { AddressEntity } from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

@Component({
    selector: 'app-last-location-component',
    templateUrl: './last-location-component.component.html',
    styleUrls: ['./last-location-component.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TaInputDropdownComponent,
        TaInputAddressDropdownComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class LastLocationComponentComponent implements OnInit {
    @Input() item: AddressEntity;
    @Input() rowIndex: number = 0;
    @Input() showAddAddressField: number = 0;
    @Input() set _parkings(value) {
        this.checkParkingLocation(value);
    }
    @Output() updateDispatchBoard: EventEmitter<AddressEntity> =
        new EventEmitter<AddressEntity>();
    @Output() hideDropdown: EventEmitter<boolean> = new EventEmitter<boolean>();

    public show: boolean = false;
    public truckAddress: UntypedFormControl = new UntypedFormControl(null);

    constructor() {}

    public handleInputSelect(e): void {
        if (e.valid) {
            this.updateDispatchBoard.emit(e.address);
        }
    }

    public onHideDropdown(): void {
        this.hideDropdown.emit(true);
    }

    get LastLocationAddressConfig(): ITaInput {
        return DispatchConfig.getDispatchAddressConfig();
    }

    ngOnInit(): void {}

    public checkParkingLocation(parkings): void {
        this.show = parkings.some(
            (parking) => parking.address.county === this.item.county
        );
    }
}
