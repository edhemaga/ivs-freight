import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import { ePayrollString } from '@pages/accounting/pages/payroll/state/enums';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { PayrollDeductionRecurringType } from 'appcoretruckassist';
import { ICaInput } from '@ca-shared/components/ca-input-test/config';

export class PayrollCreditConst {
    static tabs: TabOptions[] = [
        {
            id: 1,
            name: ePayrollString.DRIVER,
            checked: true,
        },
        {
            id: 2,
            name: ePayrollString.TRUCK,
            checked: false,
        },
    ];

    static periodTabs: TabOptions[] = [
        {
            value: PayrollDeductionRecurringType.Weekly,
            name: 'WEEKLY',
            checked: false,
            id: 1,
        },
        {
            id: 2,
            value: PayrollDeductionRecurringType.Monthly,
            name: 'MONTHLY',
            checked: false,
        },
    ];

    static driverConfig(logoName: string, name: string): ICaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Driver',
            isDropdown: true,
            dropdownWidthClass: 'w-col-456',
            dropdownImageInput: {
                withText: true,
                svg: false,
                image: true,
                iconsPath: '',
                activeItemIconKey: 'logoName',
                url: logoName,
                nameInitialsInsteadUrl: !logoName ? name : null,
                template: 'user',
            },
            isBlueDropdown: true,
            isRequired: true,
        };
    }

    static truckConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Truck',
        isDropdown: true,
        dropdownWidthClass: 'w-col-456',
        isBlueDropdown: true,
        isRequired: true,
    };

    static descriptionField: ITaInput = {
        name: 'Description',
        label: 'Description',
        type: 'text',
        minLength: 2,
        maxLength: 160,
        textTransform: 'capitalize',
        isRequired: true,
    };

    static datepickerField: ITaInput = {
        name: 'datepicker',
        label: 'Date',
        type: 'text',
        isDropdown: true,
        placeholderIcon: 'date',

        isRequired: true,
        customClass: 'datetimeclass',
    };

    static ammountField: ITaInput = {
        label: 'Amount',
        name: 'Ammout',
        type: 'text',
        isRequired: true,
        priceSeparator: true,
        priceSeparatorLimitation: 6,
        placeholderIcon: 'dollar',
        placeholderIconColor: 'blue',
    };

    static limitedAmountField(isDisabled: boolean): ITaInput {
        return {
            isDisabled,
            name: 'Pay Amount',
            label: 'Pay Amount',
            type: 'text',
            minLength: 4,
            maxLength: 11,
            isRequired: true,
            thousandSeparator: true,
            placeholderIcon: 'dollar',
        };
    }

    static limitedNumberField(
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
            minValue: 1,
            minLength: 1,
            maxLength: 10,
            placeholderText: 'payments',
            thousandSeparator: true,
            isDisabled,
            isRequired: !isDisabled,
            commands: {
                active: true,
                type: 'increment-decrement',
                blueCommands: true,
                firstCommand: {
                    name: 'decrement',
                    svg: svgRoutes.iconDecrementSvgRoute,
                },
                secondCommand: {
                    name: 'increment',
                    svg: svgRoutes.iconIncrementSvgRoute,
                },
            },
        };
    }
}
