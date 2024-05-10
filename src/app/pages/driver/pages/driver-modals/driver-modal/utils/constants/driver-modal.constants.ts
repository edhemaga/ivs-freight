import { Tabs } from '@shared/models/tabs.model';
import { Options } from '@angular-slider/ngx-slider';

export class DriverModalConstants {
    static MAIN_TABS: Tabs[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
        },
    ];

    static OWNER_TABS: Tabs[] = [
        {
            id: 1,
            name: 'Sole Proprietor',
            checked: true,
        },
        {
            id: 2,
            name: 'Company',
            checked: false,
        },
    ];

    static PAYROLL_TABS: Tabs[] = [
        {
            id: 1,
            name: 'Company Driver',
            checked: true,
        },
        {
            id: 2,
            name: '3rd Party Driver',
            checked: false,
        },
    ];

    static SLIDER_OPTIONS: Options = {
        floor: 10,
        ceil: 50,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
    };
}
