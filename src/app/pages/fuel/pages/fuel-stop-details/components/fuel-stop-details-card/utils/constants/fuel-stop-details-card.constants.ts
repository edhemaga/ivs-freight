import { Tabs } from '@shared/models';

export class FuelStopDetailsCardConstants {
    static LAST_FUEL_PRICE_COLORS: string[] = [
        '#56B4AC',
        '#77BF56',
        '#FAB15C',
        '#FF906D',
        '#E66767',
    ];

    static FUEL_EXPENSES_CHART_TABS: Tabs[] = [
        {
            id: 221,
            name: '1M',
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
}
