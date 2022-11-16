import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'inputError',
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
      }
      return errorMessageValue;
   }
}
