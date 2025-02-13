import { Pipe, PipeTransform } from '@angular/core';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

@Pipe({
    name: 'thousandSeparator',
    standalone: true,
})
export class ThousandSeparatorPipe implements PipeTransform {
    transform(value: any): any {
        return MethodsCalculationsHelper.convertNumberInThousandSep(
            MethodsCalculationsHelper.convertThousandSepInNumber(
                value ? value : '0'
            )
        );
    }
}
