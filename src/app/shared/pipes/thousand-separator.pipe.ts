import { Pipe, PipeTransform } from '@angular/core';

// helpers
import {
    convertNumberInThousandSep,
    convertThousanSepInNumber,
} from '../../core/utils/methods.calculations';

@Pipe({
    name: 'thousandSeparator',
    standalone: true,
})
export class ThousandSeparatorPipe implements PipeTransform {
    transform(value: any): any {
        return convertNumberInThousandSep(
            convertThousanSepInNumber(value ? value : '0')
        );
    }
}
