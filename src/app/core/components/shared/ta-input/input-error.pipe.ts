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
                errorMessageValue = `${value['minlength'].requiredLength} Characters Minimum`;
            }

            if (value['maxlength']) {
                errorMessageValue = `${value['maxlength'].requiredLength} Characters Maximum`;
            }

            if (value['min']) {
                errorMessageValue = `${value['min']} Is Minimum Value`;
            }

            if (value['max']) {
                errorMessageValue = `${value['max']} Is Maximum Value`;
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
                value['emailAlreadyExist']
            ) {
                errorMessageValue = 'Already in use';
            }
        }
        return errorMessageValue;
    }
}
