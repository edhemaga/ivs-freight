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
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// configs
import { ApplicantTrailerConfig } from '@pages/applicant/pages/applicant-owner-info/utils/configs/applicant-trailer.config';

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
    @Input() selectedTrailerType: TrailerTypeResponse;
    @Input() selectedTrailerMake: TrailerMakeResponse;
    @Input() selectedTrailerLength: TrailerLengthResponse;
    @Input() selectedTrailerColor: ColorResponse;
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

    public inputSwitchActions = InputSwitchActions;
    public selectedModeEnum = SelectedMode;

    constructor() {}

    get trailerTypeInputConfig(): ITaInput {
        return ApplicantTrailerConfig.getTrailerTypeConfig({
            selectedMode: this.selectedMode,
            isAddTrailerSelected: this.isAddTrailerSelected,
            selectedTrailerType: this.selectedTrailerType,
        });
    }

    get trailerVinInputConfig(): ITaInput {
        return ApplicantTrailerConfig.getTrailerVinConfig({
            selectedMode: this.selectedMode,
            isAddTrailerSelected: this.isAddTrailerSelected,
            stepFeedbackValues: this.stepFeedbackValues,
            loadingTrailerVinDecoder: this.loadingTrailerVinDecoder,
        });
    }

    get trailerMakeInputConfig(): ITaInput {
        return ApplicantTrailerConfig.getTrailerMakeConfig({
            selectedMode: this.selectedMode,
            isAddTrailerSelected: this.isAddTrailerSelected,
            selectedTrailerMake: this.selectedTrailerMake,
        });
    }

    get trailerModelInputConfig(): ITaInput {
        return ApplicantTrailerConfig.getTrailerModelConfig({
            selectedMode: this.selectedMode,
            isAddTrailerSelected: this.isAddTrailerSelected,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get trailerYearInputConfig(): ITaInput {
        return ApplicantTrailerConfig.getTrailerYearConfig({
            selectedMode: this.selectedMode,
            isAddTrailerSelected: this.isAddTrailerSelected,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get trailerColorInputConfig(): ITaInput {
        return ApplicantTrailerConfig.getTrailerColorConfig({
            selectedMode: this.selectedMode,
            isAddTrailerSelected: this.isAddTrailerSelected,
            stepFeedbackValues: this.stepFeedbackValues,
            selectedTrailerColor: this.selectedTrailerColor,
        });
    }

    get trailerLengthInputConfig(): ITaInput {
        return ApplicantTrailerConfig.getTrailerLengthConfig({
            selectedMode: this.selectedMode,
            isAddTrailerSelected: this.isAddTrailerSelected,
        });
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
