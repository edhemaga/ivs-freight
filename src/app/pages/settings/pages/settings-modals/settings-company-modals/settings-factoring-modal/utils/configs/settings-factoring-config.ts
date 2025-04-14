import { Tabs } from '@shared/models';
import { ICaInput } from 'ca-components';

export class SettingsFactoringConfig {
    static addressTabs: Tabs[] = [
        {
            id: 1,
            name: 'Physical Address',
            checked: true,
        },
        {
            id: 2,
            name: 'PO Box',
            checked: false,
        },
    ];

    static addressInputConfig: ICaInput = {
        name: 'address',
        type: 'text',
        label: 'Address, City, State Zip',
        placeholderIcon: 'address',
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-376',
        isRequired: true,
        minLength: 6,
        maxLength: 256,
    };

    static addressPoBoxInputConfig: ICaInput = {
        name: 'address',
        type: 'text',
        label: 'City, State Zip',
        placeholderIcon: 'address',
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-268',
        isRequired: true,
        minLength: 6,
        maxLength: 256,
    };

    static addressUnitInputConfig: ICaInput = {
        name: 'addressUnit',
        type: 'text',
        label: 'Unit #',
        textTransform: 'uppercase',
        minLength: 1,
        maxLength: 10,
    };

    static poBoxInputConfig: ICaInput = {
        name: 'poBox',
        type: 'text',
        label: 'PO Box #',
        textTransform: 'uppercase',
        isRequired: true,
        minLength: 1,
        maxLength: 10,
    };
}
