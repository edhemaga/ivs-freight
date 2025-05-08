import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({ name: 'stopContainerClass', standalone: true })
export class StopContainerClassPipe implements PipeTransform {
    transform(form: FormGroup, isOpen: boolean): string {
        if (isOpen) {
            return 'h-34 background-black text-color-white background-hover-black-3';
        }

        const touchedOrDirty = form.touched || form.dirty;

        if (form.invalid && !touchedOrDirty) {
            return 'h-42 text-color-black background-bw2 background-hover-bw-9';
        }

        if (form.valid) {
            return 'h-42 text-color-black background-blue-16 background-hover-blue-17';
        }

        if (form.invalid && touchedOrDirty) {
            return 'h-42 text-color-black background-white-6 background-hover-red-15';
        }

        return 'h-42 text-color-black';
    }
}
