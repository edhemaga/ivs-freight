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
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { CaInputComponent } from 'ca-components';

//enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/';

//models
import { ModalTableDropdownOption } from '@shared/models/pm-dropdown-options.model';
import { DepartmentResponse } from 'appcoretruckassist';

// svg routes
import { ModalTableSvgRoutes } from '@shared/components/ta-modal-table/utils/svg-routes';

@Component({
    selector: 'app-ta-modal-table-contact',
    templateUrl: './ta-modal-table-contact.component.html',
    styleUrls: ['./ta-modal-table-contact.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        ReactiveFormsModule,

        // components
        TaInputDropdownComponent,
        CaInputComponent,
    ],
})
export class TaModalTableContactComponent {
    @Input() modalTableForm: UntypedFormGroup;
    @Input() arrayName: TaModalTableStringEnum;
    @Input() isInputHoverRows: boolean[][];
    @Input() departmentOptions: DepartmentResponse[] = [];
    @Input() selectedDepartment: DepartmentResponse[] = [];

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

    public emitOnSelectDropdown(
        dropdownEvent: ModalTableDropdownOption,
        index?: number
    ): void {
        this.onSelectDropdown.emit({
            dropdownEvent,
            action: TaModalTableStringEnum.CONTACT_DEPARTMENT_TYPE,
            index,
        });
    }
}
