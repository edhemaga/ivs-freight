// enums
import { ConstantStringEnum } from '../../enums/constant-string.enum';

// models
import { DashboardTab } from '../../models/dashboard-tab.model';

export class DashboardPerformanceConstants {
    static PERFORMANCE_TABS: DashboardTab[] = [
        {
            name: 'Today',
            checked: false,
        },
        {
            name: 'WTD',
            checked: false,
        },
        {
            name: 'MTD',
            checked: true,
        },
        {
            name: 'QTD',
            checked: false,
        },
        {
            name: 'YTD',
            checked: false,
        },
        {
            name: 'ALL',
            checked: false,
        },
        {
            name: 'Custom',
            checked: false,
            custom: true,
        },
    ];

    static TREND_LIST: string[] = [
        ConstantStringEnum.NET_INCOME,
        ConstantStringEnum.REVENUE_2,
        ConstantStringEnum.LOAD_2,
        ConstantStringEnum.MILES,
        ConstantStringEnum.ROADSIDE_INSP,
        ConstantStringEnum.DRIVER_2,
        ConstantStringEnum.TRUCK_2,
        ConstantStringEnum.TRAILER,
        ConstantStringEnum.OWNER_2,
        ConstantStringEnum.USER_2,
        ConstantStringEnum.REPAIR_SHOP_2,
        ConstantStringEnum.BROKER_2,
        ConstantStringEnum.SHIPPER_2,
    ];

    static TREND_LIST_2: string[] = [
        ConstantStringEnum.EXPENSES,
        ConstantStringEnum.FUEL_GALLON,
        ConstantStringEnum.FUEL_COST,
        ConstantStringEnum.REPAIR_COST,
        ConstantStringEnum.VIOALTION,
        ConstantStringEnum.ACCIDENT,
    ];
}
