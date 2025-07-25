import { Subject, takeUntil } from 'rxjs';
import { Injectable } from '@angular/core';
import {
    AbstractControl,
    UntypedFormArray,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import validator from 'validator';

// services
import { NotificationService } from '@shared/services/notification.service';

@Injectable({
    providedIn: 'root',
})
export class TaInputService {
    constructor(public notificationService: NotificationService) { }

    /**
     * @param formGroup FormGroup - The form group to touch
     */
    public markInvalid(formGroup: UntypedFormGroup): boolean {
        if (formGroup?.invalid) {
            Object.keys(formGroup.controls).forEach((key: any) => {
                formGroup.get(key).markAsTouched();
                formGroup.get(key).updateValueAndValidity();

                if ((<UntypedFormArray>formGroup.get(key)).controls?.length) {
                    for (const nestedFormGroup of (<UntypedFormArray>(
                        formGroup.get(key)
                    )).controls) {
                        this.markInvalid(<UntypedFormGroup>nestedFormGroup);
                    }
                }
            });

            return false;
        }
    }

    /**
     *
     * @param inputName - which return valid pattern, look inputConfig
     * @returns
     */
    public getInputRegexPattern(inputName: string) {
        if (['business name', 'shop name', 'fuel stop'].includes(inputName)) {
            return /^[A-Za-z0-9!#'$&%()*+,./[:;=<>?çéâêîôûàèìòùëïü\s-]*$/g;
        } else if ('price-separator' === inputName) {
            return /^[0-9.]*$/;
        } else if (
            [
                'ein',
                'mc/ff',
                'phone',
                'phone-extension',
                'account-bank',
                'routing-bank',
                'ssn',
                'fuel-card',
                'empty-weight',
                'credit limit',
                'po box',
                'price',
                'trailer-volume',
                'repair-odometer',
                'usdot',
                'irp',
                'starting',
                'customer pay term',
                'customer credit',
                'default base',
                'each occurrence',
                'damage',
                'personal-adver-inj',
                'medical expenses',
                'bodily injury',
                'general aggregate',
                'products-comp-op-agg',
                'combined-single-limit',
                'single-conveyance',
                'deductable',
                'compreh-collision',
                'trailer-value-insurance-policy',
                'rent',
                'salary',
                'mileage',
                'months',
                'empty weight',
                'qty',
                'purchase price',
            ].includes(inputName)
        ) {
            return /^[0-9]*$/g;
        } else if ('email' === inputName) {
            return /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~@.-]*$/g;
        } else if ('invoice' === inputName) {
            return /^[A-Za-z0-9/-]*$/g;
        } else if (
            ['address-unit', 'department', 'vehicle-unit'].includes(inputName)
        ) {
            return /^[A-Za-z0-9]*$/;
        } else if ('first name' === inputName) {
            return /^[A-Za-z',\s.-]*$/;
        } else if ('last name' === inputName) {
            return /^[A-Za-z',\s.-]*$/;
        } else if ('bank name' === inputName) {
            return /^[A-Za-z0-9!#'$&%()*+,./:;=<>?-^[]*$/;
        } else if (
            ['vin-number', 'insurance-policy', 'ifta'].includes(inputName)
        ) {
            return /^[A-Za-z0-9-]*$/;
        } else if ('truck-trailer-model' === inputName) {
            return /^[A-Za-z0-9\s-]*$/;
        } else if ('year' === inputName) {
            return /^[0-9]$/;
        } else if ('license plate' === inputName) {
            return /^[A-Za-z0-9\s]*$/;
        } else if ('description' === inputName) {
            return /^[A-Za-z0-9-.,/\s]*$/;
        } else if ('dba name' === inputName) {
            return /^[A-Za-z0-9!#'$&%()*+,./:;=<>?^[-]*$/;
        } else if ('per mile' === inputName) {
            return /^[0-9.]*$/;
        } else if ('per stop' === inputName) {
            return /^[0-9]*$/;
        } else if (
            ['emergency name', 'relationship', 'scac'].includes(inputName)
        ) {
            return /^[A-Za-z',\s.-]*$/;
        } else if ('fuel store' === inputName) {
            return /^[A-Za-z0-9-]*$/;
        } else if ('hos' === inputName) {
            return /^[0-9]*$/;
        } else if (['full parking slot', 'parking slot'].includes(inputName)) {
            return /^[0-9,-]*$/;
        } else if ('cdl-number' === inputName) {
            return /^[A-Za-z0-9\s*-]*$/;
        } else if (
            ['username', 'nickname', 'terminal name', 'password'].includes(
                inputName
            )
        ) {
            return /^[A-Za-z0-9.,_!#^~[?/<`@$%*+=}{|:";>&'()-]*$/;
        } else if ('full name' === inputName) {
            return /^[A-Za-z0-9.,/!@#$%^&*()_+={}"':>?<;\s-]*$/;
        } else if ('tollvalidation' === inputName) {
            return /^[0-9-]*$/;
        } else if (['prefix', 'suffix', 'parking name'].includes(inputName)) {
            return /^[A-Za-z0-9]*$/;
        } else if ('file name' === inputName) {
            return /^[:*?"<>|/]*$/;
        } else if (
            ['producer name', 'insurer name', 'office name'].includes(inputName)
        ) {
            return /^[A-Za-z0-9!#'$&%()*+,./;:=<>?[^-]*$/;
        } else if (['full contact name'].includes(inputName)) {
            return /^[A-Za-z\s]+$/;
        }
    }

    /**
     * @param formControl
     * @param hasValidation
     * @param validators
     */
    public changeValidators(
        formControl: AbstractControl,
        hasValidation: boolean = true,
        validators: any[] = [],
        reset: boolean = true
    ): void {
        // Set validation
        if (hasValidation) {
            const validation = [Validators.required, ...validators];
            formControl.setValidators(validation);
        }
        // Reset validation
        else {
            if (formControl && formControl.hasValidator(Validators.required))
                formControl.clearValidators();

            if (reset && formControl)
                formControl.reset();
        }

        // Update Validity
        if (formControl)
            formControl.updateValueAndValidity();
    }

    /**
     *
     * @param formControl
     * @param hasValidation
     */
    public changeValidatorsCheck(
        formControl: AbstractControl,
        hasValidation: boolean = true
    ) {
        if (hasValidation) {
            formControl.setValidators(Validators.requiredTrue);
        } else {
            formControl.clearValidators();
        }

        if (formControl) {
            formControl.updateValueAndValidity();
        }
    }

    /**
     *
     * @param formControl
     * @param type
     * @param destroy$
     * @returns
     */
    public customInputValidator(
        formControl: AbstractControl,
        type: string,
        destroy$: Subject<void>
    ) {
        return formControl.valueChanges
            .pipe(takeUntil(destroy$))
            .subscribe((value) => {
                if (value) {
                    switch (type) {
                        case 'email': {
                            if (!validator.isEmail(value)) {
                                formControl.setErrors({ invalid: true });
                            } else {
                                formControl.setErrors(null);
                            }
                            break;
                        }
                        case 'url': {
                            if (!validator.isURL(value)) {
                                formControl.setErrors({ invalid: true });
                            } else {
                                formControl.setErrors(null);
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            });
    }
}
