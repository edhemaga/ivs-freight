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
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';

// enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/';

// models
import { AddressEntity } from 'appcoretruckassist';

// pipes
import { TrackByPropertyPipe } from '@shared/pipes/track-by-property.pipe';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';

// svg routes
import { ModalTableSvgRoutes } from '@shared/components/ta-modal-table/utils/svg-routes';

@Component({
    selector: 'app-ta-modal-table-off-duty-location',
    templateUrl: './ta-modal-table-off-duty-location.component.html',
    styleUrls: ['./ta-modal-table-off-duty-location.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        ReactiveFormsModule,

        // components
        TaInputComponent,
        TaInputAddressDropdownComponent,
        TaInputDropdownComponent,

        // pipes
        TrackByPropertyPipe,
    ],
})
export class TaModalTableOffDutyLocationComponent {
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

    public svgRoutes = ModalTableSvgRoutes;

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
