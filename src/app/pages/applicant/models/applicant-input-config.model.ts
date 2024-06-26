import { AbstractControl, UntypedFormGroup } from '@angular/forms';

export interface ApplicantConfigParams {
    selectedMode: string;
    stepFeedbackValues?: any;
    selectedVehicleType?: any;
    isEditing?: boolean;
    licenseForm?: UntypedFormGroup;
    currentEmploymentFormControl?: AbstractControl;
}
