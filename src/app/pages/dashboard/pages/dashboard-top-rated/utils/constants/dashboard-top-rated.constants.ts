// enums
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';

// models
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';
import { DropdownItem } from '@shared/models/dropdown-item.model';
import { DashboardTab } from '@pages/dashboard/models/dashboard-tab.model';
import { ITopRatedListItem } from '@pages/dashboard/pages/dashboard-top-rated/models';
import { DashboardTopReportType } from 'appcoretruckassist';

export class DashboardTopRatedConstants {
    static TOP_RATED_DROPDOWN_DATA: DropdownItem[] = [
        {
            name: DashboardStringEnum.DISPATCHER,
            isActive: false,
            tab1: DashboardStringEnum.LOAD,
            tab2: DashboardStringEnum.REVENUE,
        },
        {
            name: DashboardStringEnum.DRIVER,
            isActive: true,
            tab1: DashboardStringEnum.MILEAGE,
            tab2: DashboardStringEnum.REVENUE,
        },
        {
            name: DashboardStringEnum.TRUCK,
            isActive: false,
            tab1: DashboardStringEnum.MILEAGE,
            tab2: DashboardStringEnum.REVENUE,
        },
        {
            name: DashboardStringEnum.BROKER,
            isActive: false,
            tab1: DashboardStringEnum.LOAD,
            tab2: DashboardStringEnum.REVENUE,
        },
        {
            name: DashboardStringEnum.SHIPPER,
            isActive: false,
            tab1: null,
            tab2: null,
        },
        {
            name: DashboardStringEnum.OWNER,
            isActive: false,
            tab1: DashboardStringEnum.LOAD,
            tab2: DashboardStringEnum.REVENUE,
        },
        {
            name: DashboardStringEnum.REPAIR_SHOP,
            isActive: false,
            tab1: DashboardStringEnum.VISIT,
            tab2: DashboardStringEnum.COST,
        },
        {
            name: DashboardStringEnum.FUEL_STOP,
            isActive: false,
            tab1: DashboardStringEnum.VISIT,
            tab2: DashboardStringEnum.COST,
        },
    ];

    static TOP_RATED_TABS: DashboardTab[] = [
        {
            name: DashboardStringEnum.MILEAGE,
            checked: true,
        },
        {
            name: DashboardStringEnum.REVENUE,
            checked: false,
        },
    ];

    static MAIN_PERIOD_DROPDOWN_DATA: DropdownListItem[] = [
        {
            id: 1,
            name: DashboardStringEnum.TODAY,
        },
        {
            id: 2,
            name: DashboardStringEnum.WEEK_TO_DATE,
        },
        {
            id: 3,
            name: DashboardStringEnum.MONTH_TO_DATE,
        },
        {
            id: 4,
            name: DashboardStringEnum.QUARTAL_TO_DATE,
        },
        {
            id: 5,
            name: DashboardStringEnum.YEAR_TO_DATE,
        },
        {
            id: 6,
            name: DashboardStringEnum.ALL_TIME,
        },
        {
            id: 7,
            name: DashboardStringEnum.CUSTOM,
        },
    ];

    static SUB_PERIOD_DROPDOWN_DATA: DropdownListItem[] = [
        {
            id: 1,
            name: DashboardStringEnum.HOURLY,
        },
        {
            id: 2,
            name: DashboardStringEnum.THREE_HOURS,
        },
        {
            id: 3,
            name: DashboardStringEnum.SIX_HOURS,
        },
        {
            id: 4,
            name: DashboardStringEnum.SEMI_DAILY,
        },
        {
            id: 5,
            name: DashboardStringEnum.DAILY,
        },
        {
            id: 6,
            name: DashboardStringEnum.WEEKLY,
        },
        {
            id: 7,
            name: DashboardStringEnum.BI_WEEKLY,
        },
        {
            id: 8,
            name: DashboardStringEnum.SEMI_MONTHLY,
        },
        {
            id: 9,
            name: DashboardStringEnum.MONTHLY,
        },
        {
            id: 10,
            name: DashboardStringEnum.QUARTERLY,
        },
        {
            id: 11,
            name: DashboardStringEnum.YEARLY,
        },
    ];

    static TOP_RATED_LIST_ITEM: ITopRatedListItem = {
        id: null,
        name: null,
        value: null,
        percent: null,
        isSelected: false,
    };

    static REPORT_TYPE_MAP: Record<DashboardTopReportType, string> = {
        Cost: 'cost',
        Visit: 'visitCount',
        Load: 'LoadCount',
        Revenue: 'Revenue',
        Mileage: 'Mileage',
    };
}
