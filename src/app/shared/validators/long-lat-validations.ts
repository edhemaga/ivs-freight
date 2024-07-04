import { AbstractControl, ValidatorFn } from '@angular/forms';

export function latitudeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const value = parseFloat(control.value);
        if (isNaN(value) || value < -90 || value > 90) {
            return { invalidLatitude: true };
        }
        const regex = /^-?\d{1,2}\.\d{1,6}$/;
        return regex.test(control.value)
            ? null
            : { invalidLatitudeFormat: true };
    };
}

export function longitudeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const value = parseFloat(control.value);
        if (isNaN(value) || value < -180 || value > 180) {
            return { invalidLongitude: true };
        }
        const regex = /^-?\d{1,3}\.\d{1,6}$/;
        return regex.test(control.value)
            ? null
            : { invalidLongitudeFormat: true };
    };
}
