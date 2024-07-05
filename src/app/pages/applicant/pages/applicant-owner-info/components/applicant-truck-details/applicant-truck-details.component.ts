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
import { OwnerInfoFileType } from '@pages/applicant/pages/applicant-owner-info/enums/owner-info-file-type.enum';

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
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// configs
import { ApplicantTruckConfig } from '@pages/applicant/pages/applicant-owner-info/utils/configs/applicant-truck.config';

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
    @Input() selectedTruckType: TruckTypeResponse;
    @Input() selectedTruckMake: TruckMakeResponse;
    @Input() selectedTruckColor: ColorResponse;
    @Input() stepFeedbackValues;
    @Input() loadingTruckVinDecoder: boolean;
    @Input() dropdownOptions: ApplicantDropdownOptions;
    @Input() truckLicenceDocuments: any[] = [];
    @Input() truckLicenceDisplayDocumentsRequiredNote: boolean = false;
    @Input() truckFHWADocuments: any[] = [];
    @Input() truckFHWADisplayDocumentsRequiredNote: boolean = false;

    @Output() onFilesAction: EventEmitter<FileEvent> = new EventEmitter();
    @Output() onInputSelect: EventEmitter<{
        inputSelectEvent: SelectedItemEvent;
        action: string;
    }> = new EventEmitter();

    public inputSwitchActions = InputSwitchActions;
    public selectedModeEnum = SelectedMode;
    public ownerInfoFileType = OwnerInfoFileType;

    constructor() {}

    get truckTypeInputConfig(): ITaInput {
        return ApplicantTruckConfig.getTruckTypeConfig({
            selectedMode: this.selectedMode,
            selectedTruckType: this.selectedTruckType,
        });
    }

    get truckYearInputConfig(): ITaInput {
        return ApplicantTruckConfig.getTruckYearConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get truckVinInputConfig(): ITaInput {
        return ApplicantTruckConfig.getTruckVinConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
            loadingTruckVinDecoder: this.loadingTruckVinDecoder,
        });
    }

    get truckMakeInputConfig(): ITaInput {
        return ApplicantTruckConfig.getTruckMakeConfig({
            selectedMode: this.selectedMode,
            selectedTruckMake: this.selectedTruckMake,
        });
    }

    get truckModelInputConfig(): ITaInput {
        return ApplicantTruckConfig.getTruckModelConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get truckColorInputConfig(): ITaInput {
        return ApplicantTruckConfig.getTruckColorConfig({
            selectedMode: this.selectedMode,
            selectedTruckColor: this.selectedTruckColor,
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

    public emitOnFilesAction(event: FileEvent, type?: string): void {
        const extendedEvent = { ...event, type };

        this.onFilesAction.emit(extendedEvent);
    }
}
