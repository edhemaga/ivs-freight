import { Tabs } from '@shared/models';

export class FuelStopDetailsCardConstants {
    static FUEL_EXPENSES_CHART_TABS: Tabs[] = [
        {
            id: 221,
            name: '1M',
            checked: true,
        },
        {
            id: 511,
            name: '3M',
        },
        {
            id: 416,
            name: '6M',
        },
        {
            id: 511,
            name: '1Y',
        },
        {
            id: 1224,
            name: 'YTD',
        },
        {
            id: 1902,
            name: 'ALL',
        },
    ];

    static MAP_LOCATION_COVER_TABS: Tabs[] = [
        {
            id: 1,
            name: 'Location',
            checked: true,
        },

        { id: 2, name: 'Cover Photo', checked: false },
    ];
}
