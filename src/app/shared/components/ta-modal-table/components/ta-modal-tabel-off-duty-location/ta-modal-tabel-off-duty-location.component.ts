import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormGroup,
} from '@angular/forms';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';

// enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/ta-modal-table-string.enum';

// models
import { AddressEntity } from 'appcoretruckassist';

// pipes
import { TrackByPropertyPipe } from '@shared/pipes/track-by-property.pipe';

@Component({
    selector: 'app-ta-modal-tabel-off-duty-location',
    templateUrl: './ta-modal-tabel-off-duty-location.component.html',
    styleUrls: ['./ta-modal-tabel-off-duty-location.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        ReactiveFormsModule,

        // components
        TaInputComponent,
        TaInputDropdownComponent,
        TaCheckboxComponent,
        TaInputAddressDropdownComponent,

        // pipes
        TrackByPropertyPipe,
    ],
})
export class TaModalTabelOffDutyLocationComponent {
    @Input() modalTableForm: UntypedFormGroup;
    @Input() arrayName: TaModalTableStringEnum;
    @Input() isInputHoverRows: boolean[][];
    @Input() selectedAddress: AddressEntity[] = [];

    @Output() onSelectAddress: EventEmitter<{
        address: {
            address: AddressEntity;
            valid: boolean;
        };
        index: number;
    }> = new EventEmitter();
    @Output() deleteFormArrayRowClick: EventEmitter<number> =
        new EventEmitter();
    @Output() onInputHover: EventEmitter<{
        isHovering: boolean;
        isInputHoverRowIndex: number;
        inputIndex: number;
    }> = new EventEmitter();

    get formArray() {
        return this.modalTableForm?.get(this.arrayName) as UntypedFormArray;
    }

    constructor() {}

    public emitDeleteFormArrayRowClick(index: number): void {
        this.deleteFormArrayRowClick.emit(index);
    }

    public emitOnInputHover(
        isHovering: boolean,
        isInputHoverRowIndex: number,
        inputIndex: number
    ): void {
        this.onInputHover.emit({
            isHovering,
            isInputHoverRowIndex,
            inputIndex,
        });
    }

    public emitOnSelectAddress(
        address: {
            address: AddressEntity;
            valid: boolean;
        },
        index: number
    ): void {
        this.onSelectAddress.emit({
            address,
            index,
        });
    }
}
