import { Tabs } from 'src/app/core/components/shared/model/modal-tabs';

export class SETTINGS_MODAL_CONSTANTS {
    static TABS: Tabs[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
            checked: false,
        },
        {
            id: 3,
            name: 'Payroll',
            checked: false,
        },
    ];

    static TABS_DIVISION: Tabs[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
            checked: false,
        },
    ];

    static PREFERED_LOAD_BTNS: Tabs[] = [
        {
            id: 1,
            name: 'FTL',
            checked: true,
        },
        {
            id: 2,
            name: 'LTL',
            checked: false,
        },
    ];

    static FLEET_TYPE_BTNS: Tabs[] = [
        {
            id: 1,
            name: 'Solo',
            checked: true,
        },
        {
            id: 2,
            name: 'Team',
            checked: false,
        },
        {
            id: 3,
            name: 'Combined',
            checked: false,
        },
    ];
}
