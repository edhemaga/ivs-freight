import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormGroup,
} from '@angular/forms';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/';

// components
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';

// models
import { DriverModalFuelCardResponse } from 'appcoretruckassist';

// svg routes
import { ModalTableSvgRoutes } from '@shared/components/ta-modal-table/utils/svg-routes';

@Component({
    selector: 'app-ta-modal-table-fuel-card',
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // components
        TaInputComponent,
        TaInputDropdownComponent,
    ],
    templateUrl: './ta-modal-table-fuel-card.component.html',
    styleUrls: ['./ta-modal-table-fuel-card.component.scss'],
    standalone: true,
})
export class TaModalTableFuelCardComponent {
    @Input() modalTableForm: UntypedFormGroup;
    @Input() arrayName: TaModalTableStringEnum;
    @Input() isInputHoverRows: boolean[][];
    @Input() selectedFuelCard: DriverModalFuelCardResponse[] = [];
    @Input() fuelCardOptions: DriverModalFuelCardResponse[] = [];

    @Output() onSelectDropdown: EventEmitter<{
        dropdownEvent: DriverModalFuelCardResponse;
        action: string;
        index?: number;
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

    public emitOnSelectDropdown(
        dropdownEvent: DriverModalFuelCardResponse,
        index: number
    ): void {
        this.onSelectDropdown.emit({
            dropdownEvent,
            action: TaModalTableStringEnum.FUEL_CARD_TYPE,
            index,
        });
    }

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
}
