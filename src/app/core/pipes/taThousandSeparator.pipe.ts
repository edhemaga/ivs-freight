import { Pipe, PipeTransform } from '@angular/core';
import {
    convertNumberInThousandSep,
    convertThousanSepInNumber,
} from '../utils/methods.calculations';

@Pipe({
    name: 'taThousandSeparator',
    standalone: true
})
export class TaThousandSeparatorPipe implements PipeTransform {
    transform(value: any): any {
        return convertNumberInThousandSep(
            convertThousanSepInNumber(value ? value : '0')
        );
    }
}
