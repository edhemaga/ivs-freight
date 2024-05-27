import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { InputSwitchActions } from '@pages/applicant/enums/input-switch-actions.enum';

// components
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';

// models
import { ApplicantDropdownOptions } from '@pages/applicant/pages/applicant-owner-info/models/dropdown-options.model';
import {
    ColorResponse,
    TruckMakeResponse,
    TruckTypeResponse,
} from 'appcoretruckassist';
import { FileEvent } from '@shared/models/file-event.model';
import { SelectedItemEvent } from '@pages/applicant/pages/applicant-owner-info/models/selected-item-event.model';

@Component({
    selector: 'app-applicant-truck-details',
    templateUrl: './applicant-truck-details.component.html',
    styleUrls: ['./applicant-truck-details.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // components
        TaInputAddressDropdownComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaUploadFilesComponent,
    ],
})
export class ApplicantTruckDetailsComponent {
    @Input() formGroup: UntypedFormGroup;
    @Input() selectedMode: string;
    @Input() selectedTruckType: TruckTypeResponse = null;
    @Input() selectedTruckMake: TruckMakeResponse = null;
    @Input() selectedTruckColor: ColorResponse = null;
    @Input() stepFeedbackValues;
    @Input() loadingTruckVinDecoder: boolean;
    @Input() dropdownOptions: ApplicantDropdownOptions;
    @Input() documents: any[] = [];
    @Input() displayDocumentsRequiredNote: boolean = false;

    @Output() onFilesAction: EventEmitter<FileEvent> = new EventEmitter();
    @Output() onInputSelect: EventEmitter<{
        inputSelectEvent: SelectedItemEvent;
        action: string;
    }> = new EventEmitter();

    inputSwitchActions = InputSwitchActions;
    selectedModeEnum = SelectedMode;

    constructor() {}

    get truckTypeInputConfig() {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Type',
            isRequired: true,
            isDropdown: true,
            isDisabled: this.selectedMode !== SelectedMode.APPLICANT,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: this.selectedTruckType?.logoName,
                template: 'truck',
                class: this.selectedTruckType?.name
                    ?.trim()
                    .replace(' ', '')
                    .toLowerCase(),
            },
            dropdownWidthClass: 'w-col-364',
            customClass: 'truck-trailer-dropdown',
        };
    }

    get truckYearInputConfig() {
        return {
            name: 'Year',
            type: 'text',
            label: 'Year',
            isDisabled:
                this.selectedMode === SelectedMode.REVIEW ||
                (this.selectedMode === SelectedMode.FEEDBACK &&
                    this.stepFeedbackValues?.isTruckYearValid),
            isRequired: true,
            minLength: 4,
            maxLength: 4,
            incorrectInput: this.selectedMode === SelectedMode.REVIEW,
        };
    }

    get truckVinInputConfig() {
        return {
            name: 'vin-number',
            type: 'text',
            label: 'VIN',
            isRequired: true,
            isDisabled:
                this.selectedMode === SelectedMode.REVIEW ||
                (this.selectedMode === SelectedMode.FEEDBACK &&
                    this.stepFeedbackValues?.isTruckVinValid),
            textTransform: 'uppercase',
            maxLength: 17,
            minLength: 5,
            loadingSpinner: {
                size: 'small',
                color: 'white',
                isLoading: this.loadingTruckVinDecoder,
            },
            incorrectInput: this.selectedMode === SelectedMode.REVIEW,
        };
    }

    get truckMakeInputConfig() {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Make',
            isRequired: true,
            isDropdown: true,
            isDisabled: this.selectedMode !== SelectedMode.APPLICANT,
            dropdownImageInput: {
                withText: false,
                svg: true,
                image: false,
                url: this.selectedTruckMake?.logoName,
            },
            dropdownWidthClass: 'w-col-210',
        };
    }

    get truckModelInputConfig() {
        return {
            name: 'truck-trailer-model',
            type: 'text',
            label: 'Model',
            isRequired: true,
            isDisabled:
                this.selectedMode === SelectedMode.REVIEW ||
                (this.selectedMode === SelectedMode.FEEDBACK &&
                    this.stepFeedbackValues?.isTruckModelValid),
            textTransform: 'uppercase',
            minLength: 1,
            maxLength: 50,
            incorrectInput: this.selectedMode === SelectedMode.REVIEW,
        };
    }

    get truckColorInputConfig() {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Color',
            isDropdown: true,
            isDisabled: this.selectedMode !== SelectedMode.APPLICANT,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: this.selectedTruckColor?.code ? 'ic_color.svg' : null,
                template: 'color',
                color: this.selectedTruckColor?.code,
            },
            dropdownWidthClass: 'w-col-116',
        };
    }

    public emitInputSelect(
        inputSelectEvent: SelectedItemEvent,
        action: string
    ): void {
        this.onInputSelect.emit({
            inputSelectEvent,
            action,
        });
    }

    public emitOnFilesAction(event: FileEvent): void {
        this.onFilesAction.emit(event);
    }
}
