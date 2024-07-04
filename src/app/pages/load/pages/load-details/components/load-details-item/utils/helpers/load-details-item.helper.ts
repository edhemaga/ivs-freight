import { KeyValue } from '@angular/common';

// models
import { StopItemsHeaderItem } from '@pages/load/pages/load-details/components/load-details-item/models/stop-items-header-item.model';

export class LoadDetailsItemHelper {
    static getStopHeaderItems(loadStatus: string): string[] {
        return [
            '#',
            'LOCATION, TYPE',
            'SHIPPER, ADDRESS',
            'CONTACT, PHONE',
            'DATE, TIME',
            loadStatus !== 'Pending' ? 'CHECK-IN' : null,
            'LEG',
        ].filter((headerItemText) => headerItemText);
    }

    static getStopItemsHeaderItems(): StopItemsHeaderItem[] {
        return [
            {
                title: '#',
            },
            {
                title: 'DESCRIPTION',
            },
            {
                title: 'QUANTITY',
            },
            {
                title: '°F',
                icon: 'assets/svg/common/load/ic_temperature.svg',
            },
            {
                title: 'lbs',
                icon: 'assets/svg/common/ic_weight.svg',
                iconMargin: '3px',
            },
            {
                title: 'ft',
                icon: 'assets/svg/common/load/ic_length.svg',
                iconMargin: '2px',
            },
            {
                title: 'ft',
                icon: 'assets/svg/common/load/ic_height.svg',
            },
            {
                title: 'ft',
                icon: 'assets/svg/common/load/ic_tarp.svg',
                iconMargin: '3px',
            },
            {
                icon: 'assets/svg/common/load/ic_stackable.svg',
            },
            {
                title: 'SECURE',
            },
            {
                title: 'BOL NO',
            },
            {
                title: 'PICKUP NO',
            },
            {
                title: 'SEAL NO',
            },
            {
                title: 'CODE ',
            },
        ];
    }

    static keepItemsOriginalOrder(
        a: KeyValue<string, any>,
        b: KeyValue<string, any>
    ): number {
        const keys = [
            'id',
            'description',
            'quantity',
            'tmp',
            'weight',
            'length',
            'height',
            'tarp',
            'stack',
            'secure',
            'bolNo',
            'pickupNo',
            'sealNo',
            'code',
        ];

        return keys.indexOf(a.key) - keys.indexOf(b.key);
    }

    static removeNumbersFromStatusString(statusString: string) {
        const regex = /\d+/g;

        return statusString.replace(regex, '');
    }

    static checkStopOrderOrder(statusId: number): string {
        if (statusId === 46 || statusId === 48 || statusId === 50)
            return '#56B4AC';

        if (statusId === 3) return '#259F94';

        if (statusId === 47 || statusId === 49) return '#E66767';

        if (statusId === 5) return '#DF3C3C';
    }
}
