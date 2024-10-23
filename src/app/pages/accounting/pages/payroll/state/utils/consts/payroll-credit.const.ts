import { TabOptions } from "@shared/components/ta-tab-switch/models/tab-options.model";
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { ITaInput } from "@shared/components/ta-input/config/ta-input.config";

export class PayrollCreditConst {
    static tabs: TabOptions[] = [
        {
            id: 1,
            name: PayrollStringEnum.DRIVER,
            checked: true,
        },
        {
            id: 2,
            name: PayrollStringEnum.TRUCK,
            checked: false,
        },
    ];

    static driverConfig(logoName: string, name: string): ITaInput {
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
            url: logoName,
            nameInitialsInsteadUrl: !logoName ? name : null,
            template: 'user',
        },
        isBlueDropdown: true,
        isRequired: true
        }
    }

    static truckConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Truck',
        isDropdown: true,
        dropdownWidthClass: 'w-col-456',
        isBlueDropdown: true,
        isRequired: true
    }

    static descriptionField: ITaInput = {
        name: 'Description',
        label: 'Description',
        type: 'text',
        minLength: 2,
        maxLength: 160,
        textTransform: 'capitalize',
        isRequired: true
    }

    static datepickerField: ITaInput = {
        name: 'datepicker',
        label: 'Date',
        type: 'text',
        isDropdown: true,
        placeholderIcon: 'date',
        isRequired: true,
        customClass: 'datetimeclass'
    }

    static ammountField: ITaInput = {
        name: 'Amount',
        label: 'Amount',
        type: 'text',
        minLength: 4,
        maxLength: 11,
        isRequired: true,
        thousandSeparator: true,
        placeholderIcon: 'dollar',
    }
}