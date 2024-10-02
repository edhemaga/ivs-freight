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
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';

//enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/ta-modal-table-string.enum';

//models
import { ModalTableDropdownOption } from '@shared/models/pm-dropdown-options.model';
import { DepartmentResponse } from 'appcoretruckassist';

// Const
import { ModalTableFieldsConstants } from '@shared/components/ta-modal-table/utils/constants/';

// Svg routes
import { TaModalTableSvgRoutes } from '@shared/components/ta-modal-table/utils/svg.routes';

@Component({
    selector: 'app-ta-modal-table-department',
    templateUrl: './ta-modal-table-department.component.html',
    styleUrls: ['./ta-modal-table-department.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        ReactiveFormsModule,

        // components
        TaInputComponent,
        TaInputDropdownComponent,
    ],
})
export class TaModalTableDepartmentComponent {

    public svgRoutes = TaModalTableSvgRoutes;

    @Input() modalTableForm: UntypedFormGroup;
    @Input() arrayName: TaModalTableStringEnum;
    @Input() isInputHoverRows: boolean[][];
    @Input() departments: DepartmentResponse[]; 

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

    // Fields
    public departmentField = ModalTableFieldsConstants.getDepartmentField();
    public phoneField = ModalTableFieldsConstants.getPhoneField();
    public phoneExtField = ModalTableFieldsConstants.getPhoneExtField();
    public emailField = ModalTableFieldsConstants.getEmailField();

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
            action: TaModalTableStringEnum.CONTACT_EMAIL_TYPE,
            index,
        });
    }
}
