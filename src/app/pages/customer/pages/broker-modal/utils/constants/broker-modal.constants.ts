import { AnimationOptions } from '@shared/models/animation-options.model';
import { Tabs } from '@shared/models/tabs.model';

export class BrokerModalConstants {
    static TABS: Tabs[] = [
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

    static ADDRESS_TABS: Tabs[] = [
        {
            id: 3,
            name: 'Physical Address',
            checked: true,
        },
        {
            id: 4,
            name: 'PO Box',
            checked: false,
        },
    ];

    static BILLING_TABS: Tabs[] = [
        {
            id: 5,
            name: 'Billing Address',
            checked: true,
        },
        {
            id: 6,
            name: 'PO Box',
            checked: false,
        },
    ];

    static BILLING_CREDIT_TABS: Tabs[] = [
        {
            id: 300,
            name: 'Unlimited',
            checked: true,
        },
        {
            id: 301,
            name: 'Custom',
            checked: false,
        },
    ];

    static ANIMATION_OBJECT: AnimationOptions = {
        value: 1,
        params: { height: '0px' },
    };
}
