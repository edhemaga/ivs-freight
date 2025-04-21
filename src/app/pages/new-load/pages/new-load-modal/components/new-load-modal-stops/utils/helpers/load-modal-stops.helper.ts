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
import { eLoadModalStopsForm } from '@pages/new-load/pages/new-load-modal/enums';

export class LoadModalStopsHelper {
    static updateTimeValidators(group: FormGroup): void {
        const tabType = group.get('tabType')?.value;

        const timeFrom = group.get(eLoadModalStopsForm.TIME_FROM);
        const timeTo = group.get(eLoadModalStopsForm.TIME_TO);

        if (tabType === 1) {
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

    static createStop(
        fb: FormBuilder,
        data: { stopType: string; shipperId: number }
    ): FormGroup {
        const group = fb.group({
            stopType: [data.stopType],
            [eLoadModalStopsForm.SHIPPER]: [
                data.shipperId,
                Validators.required,
            ],
            [eLoadModalStopsForm.BROKER_CONTACT]: [1],
            [eLoadModalStopsForm.TIME_TO]: [null],
            [eLoadModalStopsForm.TIME_FROM]: [null],
            [eLoadModalStopsForm.DATE_FROM]: [null, Validators.required],
            tabType: [1],
            items: [],
        });

        // Apply initial validators
        this.updateTimeValidators(group);

        return group;
    }

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

    static minStopsValidator(min: number): ValidatorFn {
        return (formArray: AbstractControl): ValidationErrors | null => {
            const array = formArray as FormArray;
            return array.length >= min ? null : { minStops: true };
        };
    }
}
