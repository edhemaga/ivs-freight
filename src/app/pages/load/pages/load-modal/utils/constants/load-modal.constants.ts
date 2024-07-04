import { LoadBilling } from '@pages/load/pages/load-modal/models/load-billing.model';
import { LoadModalTab } from '@pages/load/pages/load-modal/models/load-modal-tab.model';
import { LoadPayment } from '@pages/load/pages/load-modal/models/load-payment.model';

export class LoadModalConstants {
    static LOAD_MODAL_TABS: LoadModalTab[] = [
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

    static TYPE_OF_EXTRA_STOPS: LoadModalTab[][] = [
        [
            {
                id: 3000,
                name: 'Pickup',
                checked: true,
                color: '26A690',
            },
            {
                id: 4000,
                name: 'Delivery',
                checked: false,
                color: 'EF5350',
            },
        ],
    ];

    static STOP_TIME_TABS_PICKUP: LoadModalTab[] = [
        {
            id: 5,
            name: 'WORK HOURS',
            checked: true,
        },
        {
            id: 6,
            name: 'APPOINTMENT',
            checked: false,
        },
    ];

    static STOP_TIME_TABS_DELIVERY: LoadModalTab[] = [
        {
            id: 7,
            name: 'WORK HOURS',
            checked: true,
            color: '3074D3',
        },
        {
            id: 8,
            name: 'APPOINTMENT',
            checked: false,
            color: '3074D3',
        },
    ];

    static STOP_TIME_TABS_EXTRA_STOPS: LoadModalTab[][] = [
        [
            {
                id: 7900,
                name: 'WORK HOURS',
                checked: true,
                color: '3074D3',
            },
            {
                id: 9000,
                name: 'APPOINTMENT',
                checked: false,
                color: '3074D3',
            },
        ],
    ];

    static LOAD_MODAL_BILL: LoadBilling = {
        baseRate: 0,
        layover: 0,
        lumper: 0,
        fuelSurcharge: 0,
        escort: 0,
        detention: 0
    };

    static LOAD_MODAL_PAYMENT: LoadPayment = {
        advance: 0,
        paidInFull: 0,
        shortPaid: 0,
    };

    static ANIMATION_MARGIN_PARAMS: {
        marginTop: string;
        marginBottom: string;
    } = {
        marginTop: '12px',
        marginBottom: '4px',
    };
}
