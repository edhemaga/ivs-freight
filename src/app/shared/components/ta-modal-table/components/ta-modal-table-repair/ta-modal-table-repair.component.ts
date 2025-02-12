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
import { CaInputDropdownComponent, CaInputComponent } from 'ca-components';

// enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/';
import { EnumValue } from 'appcoretruckassist';
import { eFuelTransactionType } from '@pages/fuel/pages/fuel-table/enums';
import { FuelDataOptionsStringEnum } from '@pages/fuel/enums';

// models
import { ModalTableDropdownOption } from '@shared/models/pm-dropdown-options.model';
import { RepairSubtotal } from '@pages/repair/pages/repair-modals/repair-order-modal/models';

// svg routes
import { ModalTableSvgRoutes } from '@shared/components/ta-modal-table/utils/svg-routes';

@Component({
    selector: 'app-ta-modal-table-repair',
    templateUrl: './ta-modal-table-repair.component.html',
    styleUrls: ['./ta-modal-table-repair.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        ReactiveFormsModule,

        CaInputDropdownComponent,
        CaInputComponent,
    ],
})
export class TaModalTableRepairComponent {
    @Input() modalTableForm: UntypedFormGroup;
    @Input() arrayName: TaModalTableStringEnum;
    @Input() isInputHoverRows: boolean[][];
    @Input() isRepairOrderTable: boolean;
    @Input() subTotals: RepairSubtotal[];
    @Input() selectedTruckTrailerRepairPm: [] = [];
    @Input() truckTrailerRepairPmOptions: [] = [];
    @Input() isFuelTransactionTable: boolean;
    @Input() fuelItemsDropdown: EnumValue[];
    @Input() activeFuelItem: EnumValue[] = [];
    @Input() fuelTransactionType: eFuelTransactionType;
    @Input() fuelModalActionType: FuelDataOptionsStringEnum;

    @Output() onSelectDropdown: EventEmitter<{
        dropdownEvent: ModalTableDropdownOption;
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

    get formArray() {
        return this.modalTableForm?.get(this.arrayName) as UntypedFormArray;
    }

    get isFuelTransactionTableSingleItem() {
        return (
            this.isFuelTransactionTable && this.formArray.controls.length === 1
        );
    }

    public svgRoutes = ModalTableSvgRoutes;
    public fuelTransactionTypeEnum = eFuelTransactionType;
    public fuelDataOptionsStringEnum = FuelDataOptionsStringEnum;

    constructor() {}

    public emitDeleteFormArrayRowClick(index: number): void {
        if (this.isFuelTransactionTableSingleItem) return;

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

    public emitOnSelectDropdown(
        dropdownEvent: ModalTableDropdownOption,
        index?: number
    ): void {
        this.onSelectDropdown.emit({
            dropdownEvent,
            action: TaModalTableStringEnum.PM_TRUCK_TRAILER_REPAIR_TYPE,
            index,
        });
    }
}
