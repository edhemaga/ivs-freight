import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    TrailerLengthResponse,
    TrailerMakeResponse,
    TrailerTypeResponse,
} from 'appcoretruckassist';
import { FileEvent } from '@shared/models/file-event.model';
import { SelectedItemEvent } from '@pages/applicant/pages/applicant-owner-info/models/selected-item-event.model';

@Component({
    selector: 'app-applicant-trailer-details',
    templateUrl: './applicant-trailer-details.component.html',
    styleUrls: ['./applicant-trailer-details.component.scss'],
    standalone: true,
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
export class ApplicantTrailerDetailsComponent {
    @Input() formGroup: UntypedFormGroup;
    @Input() selectedMode: string;
    @Input() selectedTrailerType: TrailerTypeResponse = null;
    @Input() selectedTrailerMake: TrailerMakeResponse = null;
    @Input() selectedTrailerLength: TrailerLengthResponse = null;
    @Input() selectedTrailerColor: ColorResponse = null;
    @Input() stepFeedbackValues;
    @Input() loadingTrailerVinDecoder: boolean;
    @Input() dropdownOptions: ApplicantDropdownOptions;
    @Input() documents: any[] = [];
    @Input() displayDocumentsRequiredNote: boolean = false;
    @Input() isAddTrailerSelected: boolean;

    @Output() onFilesAction: EventEmitter<FileEvent> = new EventEmitter();
    @Output() onInputSelect: EventEmitter<{
        inputSelectEvent: SelectedItemEvent;
        action: string;
    }> = new EventEmitter();

    inputSwitchActions = InputSwitchActions;
    selectedModeEnum = SelectedMode;

    constructor() {}

    get trailerTypeInputConfig() {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Type',
            isDropdown: true,
            isDisabled:
                this.selectedMode !== SelectedMode.APPLICANT ||
                (this.selectedMode === SelectedMode.APPLICANT &&
                    !this.isAddTrailerSelected),
            isRequired: this.isAddTrailerSelected,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: this.selectedTrailerType?.logoName,
                template: 'trailer',
                class: ['Tanker', 'Tanker Pneumatic'].includes(
                    this.selectedTrailerType?.name
                )
                    ? 'tanker'
                    : this.selectedTrailerType?.name
                          ?.toLowerCase()
                          ?.includes('rgn')
                    ? 'low-boy-rgn'
                    : this.selectedTrailerType?.name
                          ?.trim()
                          .replace(' ', '')
                          .toLowerCase(),
            },
            dropdownWidthClass: 'w-col-364',
            customClass: 'truck-trailer-dropdown',
        };
    }

    get trailerVinInputConfig() {
        return {
            name: 'vin-number',
            type: 'text',
            label: 'VIN',
            textTransform: 'uppercase',
            maxLength: 17,
            minLength: 5,
            isDisabled:
                this.selectedMode === SelectedMode.REVIEW ||
                (this.selectedMode === SelectedMode.APPLICANT &&
                    !this.isAddTrailerSelected) ||
                (this.selectedMode === SelectedMode.FEEDBACK &&
                    this.stepFeedbackValues?.isTrailerVinValid),
            isRequired: this.isAddTrailerSelected,
            loadingSpinner: {
                size: 'small',
                color: 'white',
                isLoading: this.loadingTrailerVinDecoder,
            },
            incorrectInput: this.selectedMode === SelectedMode.REVIEW,
        };
    }

    get trailerMakeInputConfig() {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Make',
            isDropdown: true,
            isDisabled:
                this.selectedMode !== SelectedMode.APPLICANT ||
                (this.selectedMode === SelectedMode.APPLICANT &&
                    !this.isAddTrailerSelected),
            isRequired: this.isAddTrailerSelected,
            dropdownImageInput: {
                withText: false,
                svg: true,
                image: false,
                url: this.selectedTrailerMake?.logoName,
            },
            placeholder: this.selectedTrailerMake?.name,
            dropdownWidthClass: 'w-col-302',
        };
    }

    get trailerModelInputConfig() {
        return {
            name: 'truck-trailer-model',
            type: 'text',
            label: 'Model',
            isDisabled:
                this.selectedMode === SelectedMode.REVIEW ||
                (this.selectedMode === SelectedMode.APPLICANT &&
                    !this.isAddTrailerSelected) ||
                (this.selectedMode === SelectedMode.FEEDBACK &&
                    this.stepFeedbackValues?.isTrailerModelValid),
            textTransform: 'uppercase',
            minLength: 1,
            maxLength: 50,
            incorrectInput: this.selectedMode === SelectedMode.REVIEW,
        };
    }

    get trailerYearInputConfig() {
        return {
            name: 'Year',
            type: 'text',
            label: 'Year',
            isDisabled:
                this.selectedMode === SelectedMode.REVIEW ||
                (this.selectedMode === SelectedMode.APPLICANT &&
                    !this.isAddTrailerSelected) ||
                (this.selectedMode === SelectedMode.FEEDBACK &&
                    this.stepFeedbackValues?.isTrailerYearValid),
            isRequired: this.isAddTrailerSelected,
            minLength: 4,
            maxLength: 4,
            incorrectInput: this.selectedMode === SelectedMode.REVIEW,
        };
    }

    get trailerColorInputConfig() {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Color',
            isDropdown: true,
            isDisabled:
                this.selectedMode !== SelectedMode.APPLICANT ||
                (this.selectedMode === SelectedMode.APPLICANT &&
                    !this.isAddTrailerSelected),
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: this.selectedTrailerColor?.code ? 'ic_color.svg' : null,
                template: 'color',
                color: this.selectedTrailerColor?.code,
            },
            dropdownWidthClass: 'w-col-216',
        };
    }

    get trailerLengthInputConfig() {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Length',
            isDropdown: true,
            isDisabled:
                this.selectedMode !== SelectedMode.APPLICANT ||
                (this.selectedMode === SelectedMode.APPLICANT &&
                    !this.isAddTrailerSelected),
            isRequired: this.isAddTrailerSelected,
            dropdownWidthClass: 'w-col-216',
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
