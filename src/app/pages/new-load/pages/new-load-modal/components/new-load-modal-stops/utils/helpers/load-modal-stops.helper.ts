import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';

// Enums
import { eLoadModalStopsForm } from '@pages/new-load/pages/new-load-modal/enums';

// Models
import { EnumValue } from 'appcoretruckassist';

export class LoadModalStopsHelper {
    static updateTimeValidators(group: FormGroup, tab: EnumValue): void {
        group.patchValue({ [eLoadModalStopsForm.TIME_TYPE]: tab.id });

        const timeFrom = group.get(eLoadModalStopsForm.TIME_FROM);
        const timeTo = group.get(eLoadModalStopsForm.TIME_TO);

        if (tab.id === 1) {
            timeFrom?.setValidators(Validators.required);
            timeTo?.setValidators(Validators.required);
        } else {
            timeFrom?.setValidators(Validators.required);
            timeTo?.clearValidators();
        }

        timeFrom?.updateValueAndValidity();
        timeTo?.updateValueAndValidity();
    }

    static addDateToControl(stopGroup: FormGroup): void {
        if (!stopGroup.contains(eLoadModalStopsForm.DATE_TO)) {
            stopGroup.addControl(
                eLoadModalStopsForm.DATE_TO,
                new FormControl(null, Validators.required)
            );
        }
    }

    static createStop(fb: FormBuilder, data: { stopType: number }): FormGroup {
        const group = fb.group({
            [eLoadModalStopsForm.STOP_TYPE]: [data.stopType],
            [eLoadModalStopsForm.SHIPPER_ID]: [null, Validators.required],
            [eLoadModalStopsForm.SHIPPER_CONTACT_ID]: [],
            [eLoadModalStopsForm.TIME_TO]: [null],
            [eLoadModalStopsForm.TIME_FROM]: [null],
            [eLoadModalStopsForm.DATE_FROM]: [null, Validators.required],
            [eLoadModalStopsForm.TIME_TYPE]: [],
            [eLoadModalStopsForm.ITEMS]: [],
        });

        // Apply initial validators
        this.updateTimeValidators(group, { id: 1 });

        return group;
    }

    // TODO: Maybe we will remove this and use backend value
    static tabs = [
        {
            id: 1,
            name: 'WORK HOURS',
            checked: true,
        },
        {
            id: 2,
            name: 'APPOINTMENT',
        },
    ];

    static stopTabs = [
        {
            id: 1,
            name: 'PICKUP',
            checked: true,
        },
        {
            id: 2,
            name: 'DELIVERY',
        },
    ];

    static minStopsValidator(min: number): ValidatorFn {
        return (formArray: AbstractControl): ValidationErrors | null => {
            const array = formArray as FormArray;
            return array.length >= min ? null : { minStops: true };
        };
    }
}
