import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';

@Pipe({
    name: 'formControl',
    standalone: true
})
export class FormControlPipe implements PipeTransform {
    transform(value: AbstractControl): UntypedFormControl {
        return value as UntypedFormControl;
    }
}
