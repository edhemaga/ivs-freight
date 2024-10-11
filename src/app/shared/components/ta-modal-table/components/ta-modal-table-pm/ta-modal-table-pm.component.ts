import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormGroup,
} from '@angular/forms';

//modules
import { AngularSvgIconModule } from 'angular-svg-icon';

//components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';

//enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/';

//models
import { ModalTableDropdownOption } from '@shared/models/pm-dropdown-options.model';

// svg routes
import { ModalTableSvgRoutes } from '@shared/components/ta-modal-table/utils/svg-routes';

@Component({
    selector: 'app-ta-modal-table-pm',
    templateUrl: './ta-modal-table-pm.component.html',
    styleUrls: ['./ta-modal-table-pm.component.scss'],
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
    ],
})
export class TaModalTablePmComponent {
    @Input() modalTableForm: UntypedFormGroup;
    @Input() arrayName: TaModalTableStringEnum;
    @Input() isInputHoverRows: boolean[][];
    @Input() isPMTruckTable: boolean;
    @Input() isPMTrailerTable: boolean;
    @Input() isEdit?: boolean = false;
    @Input() pmTruckOptions: ModalTableDropdownOption[] = [];
    @Input() pmTrailerOptions: ModalTableDropdownOption[] = [];
    @Input() activePmDropdownItem: ModalTableDropdownOption[] = [];

    @Output() onSelectDropdown: EventEmitter<{
        dropdownEvent: ModalTableDropdownOption;
        action: string;
        index?: number;
    }> = new EventEmitter();
    @Output() deleteFormArrayRowClick: EventEmitter<number> =
        new EventEmitter();

    public svgRoutes = ModalTableSvgRoutes;

    get formArray() {
        return this.modalTableForm?.get(this.arrayName) as UntypedFormArray;
    }

    constructor() {}

    public emitDeleteFormArrayRowClick(index: number): void {
        this.deleteFormArrayRowClick.emit(index);
    }

    public emitOnSelectDropdown(
        dropdownEvent: ModalTableDropdownOption,
        index?: number
    ): void {
        this.onSelectDropdown.emit({
            dropdownEvent,
            action: this.isPMTruckTable
                ? TaModalTableStringEnum.PM_TRUCK_TYPE
                : TaModalTableStringEnum.PM_TRAILER_TYPE,
            index,
        });
    }
}
