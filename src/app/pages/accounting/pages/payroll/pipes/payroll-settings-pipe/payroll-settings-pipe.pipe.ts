import { Pipe, PipeTransform } from '@angular/core';

// Config
import { ICaInput } from '@ca-shared/components/ca-input-test/config';

@Pipe({
    name: 'payrollSettings',
    standalone: true,
})
export class PayrollSettingsPipe implements PipeTransform {
    transform(
        svgRoutes: {
            iconDecrementSvgRoute: string;
            iconIncrementSvgRoute: string;
        },
        isDisabled: boolean
    ): ICaInput {
        return {
            id: 'No. of Payments',
            name: 'numberOfPayments',
            type: 'text',
            label: 'No. of Payments',
            minLength: 1,
            maxLength: 10,
            placeholderText: 'payments',
            thousandSeparator: true,
            isDisabled,
            isRequired: !isDisabled,
            commands: {
                active: true,
                type: 'months',
                blueCommands: true,
                firstCommand: {
                    name: 'minus',
                    svg: svgRoutes.iconDecrementSvgRoute,
                },
                secondCommand: {
                    name: 'plus',
                    svg: svgRoutes.iconIncrementSvgRoute,
                },
            },
        };
    }
}