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
import {
    EnumValue,
    LoadStopResponse,
    ShipperLoadModalResponse,
} from 'appcoretruckassist';

export class LoadModalStopsHelper {
    static isStopAppointment(stopFormControl: FormGroup): boolean {
        return stopFormControl.get(eLoadModalStopsForm.TIME_TYPE).value === 2;
    }

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
            timeTo.patchValue(null);
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

    static removeDateToControl(stopGroup: FormGroup): void {
        if (stopGroup.contains(eLoadModalStopsForm.DATE_TO)) {
            stopGroup.removeControl(eLoadModalStopsForm.DATE_TO);
        }
    }

    static setTimeBasedOnShipperWorkingTime(
        shipper: ShipperLoadModalResponse,
        stop: FormGroup
    ) {
        const { TIME_FROM, TIME_TO } = eLoadModalStopsForm;
        const timeFromControl = stop.get(TIME_FROM);
        const timeToControl = stop.get(TIME_TO);
        const isAppointment = LoadModalStopsHelper.isStopAppointment(stop);

        if (!timeFromControl || !timeToControl) return;

        if (shipper?.shippingOpenTwentyFourHours) {
            timeFromControl.patchValue('00:00');
            if (!isAppointment) timeToControl.patchValue('00:00');
            return;
        }

        if (shipper?.receivingFrom) {
            timeFromControl.patchValue(shipper.receivingFrom);
            if (!isAppointment) timeToControl.patchValue(shipper.receivingTo);
        }
    }

    static createStop(fb: FormBuilder, data?: LoadStopResponse): FormGroup {
        const group = fb.group({
            [eLoadModalStopsForm.STOP_TYPE]: [data?.stopType?.id],
            [eLoadModalStopsForm.SHIPPER_ID]: [
                data?.shipper?.id ?? null,
                Validators.required,
            ],
            [eLoadModalStopsForm.SHIPPER_CONTACT_ID]: [
                data?.shipperContact?.id ?? null,
            ],
            [eLoadModalStopsForm.TIME_TO]: [data?.timeTo ?? null],
            [eLoadModalStopsForm.TIME_FROM]: [data?.timeFrom ?? null],
            [eLoadModalStopsForm.DATE_FROM]: [
                data?.dateFrom ?? null,
                Validators.required,
            ],
            [eLoadModalStopsForm.DATE_TO]: [data?.dateTo ?? null],
            [eLoadModalStopsForm.TIME_TYPE]: [data?.timeType ?? null],
            [eLoadModalStopsForm.ITEMS]: [data?.items || []],

            [eLoadModalStopsForm.LEG_HOURS]: [data?.legHours ?? null],
            [eLoadModalStopsForm.LEG_MILES]: [data?.legMiles ?? null],
            [eLoadModalStopsForm.LEG_MINUTES]: [data?.legMinutes ?? null],
            [eLoadModalStopsForm.SHAPE]: [data?.shape ?? null],

            [eLoadModalStopsForm.STOP_ORDER]: [data?.stopOrder ?? null],
            [eLoadModalStopsForm.STOP_LOAD_ORDER]: [
                data?.stopLoadOrder ?? null,
            ],
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
