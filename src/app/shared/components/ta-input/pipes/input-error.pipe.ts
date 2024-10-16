import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'inputError',
    standalone: true,
})
export class InputErrorPipe implements PipeTransform {
    transform(value: any, inputName?: string): string {
        let errorMessageValue: string = '';

        if (value !== null) {
            if (value['required']) {
                errorMessageValue = 'Required';
            }

            if (value['invalid']) {
                errorMessageValue = 'Invalid';
            }

            if (value['minlength']) {
                errorMessageValue = `${value['minlength'].requiredLength} Characters Min`;
            }

            if (value['maxlength']) {
                errorMessageValue = `${value['maxlength'].requiredLength} Characters Max`;
            }

            if (value['min']) {
                const min = value['min'] && typeof value['min'] === 'object' ? value['min'].min : value['min'];
                errorMessageValue = `${min} Is Minimum Value`;
            }

            if (value['max']) {
                const max = value['max'] && typeof value['max'] === 'object' ? value['max'].max : value['max'];
                errorMessageValue = `${max} Is Maximum Value`;
            }

            if (value['passwordDontMatch']) {
                errorMessageValue = "Passwords don't match.";
            }

            if (value['fuelStore']) {
                errorMessageValue = 'Store already added.';
            }

            if (value['fuelStoreCommonMessage']) {
                errorMessageValue = 'Already in use by other fuel stop.';
            }

            if (value['pattern']?.requiredPattern) {
                switch (inputName.toLowerCase()) {
                    case 'phone': {
                        errorMessageValue = 'Invalid';
                        break;
                    }
                    case 'ssn': {
                        errorMessageValue = 'Invalid';
                        break;
                    }
                    case 'ein': {
                        errorMessageValue = 'Invalid';
                        break;
                    }
                    default: {
                        errorMessageValue = `Invalid`;
                        break;
                    }
                }
            }

            if (value['userDoesntExist']) {
                errorMessageValue = "This user doesn't exist";
            }

            if (value['userAlreadyRegistered']) {
                errorMessageValue = 'This user is already registered';
            }

            if (value['wrongPassword']) {
                errorMessageValue = 'Wrong password, try again';
            }

            if (
                value['einAlreadyExist'] ||
                value['phoneAlreadyExist'] ||
                value['emailAlreadyExist'] ||
                value['ssnAlreadyExist']
            ) {
                errorMessageValue = 'Already in use';
            }

            if (value['incorrectVinNumber']) {
                errorMessageValue = '13 or 17 characters';
            }
        }
        return errorMessageValue;
    }
}
