import { Pipe, PipeTransform } from '@angular/core';

// helpers
import { MethodsCalculationsHelper } from '../utils/helpers/methods-calculations.helper';

@Pipe({
    name: 'thousandToShortFormatPipe',
    standalone: true,
})
export class ThousandToShortFormatPipe implements PipeTransform {
    transform(value: number): string {
        return MethodsCalculationsHelper.convertThousandToShortFormat(
            value ?? 0
        );
    }
}
