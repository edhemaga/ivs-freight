import { Pipe, PipeTransform } from '@angular/core';

// helpers
import { convertThousandToShortFormat } from '../../core/utils/methods.calculations';

@Pipe({
    name: 'thousandToShortFormatPipe',
    standalone: true,
})
export class ThousandToShortFormatPipe implements PipeTransform {
    transform(value: any): any {
        return convertThousandToShortFormat(value ? value : '0');
    }
}
