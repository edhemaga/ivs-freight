// enums
import { ConstantStringEnum } from '../../enums/constant-string.enum';

// models
import { DropdownListItem } from '../../models/dropdown-list-item.model';
import { DropdownItem } from '../../models/dropdown-item.model';
import { DashboardTab } from '../../models/dashboard-tab.model';

export class DashboardTopRatedConstants {
    static TOP_RATED_DROPDOWN_DATA: DropdownItem[] = [
        {
            name: ConstantStringEnum.DISPATCHER,
            isActive: false,
            tab1: ConstantStringEnum.LOAD,
            tab2: ConstantStringEnum.REVENUE,
        },
        {
            name: ConstantStringEnum.DRIVER,
            isActive: true,
            tab1: ConstantStringEnum.MILEAGE,
            tab2: ConstantStringEnum.REVENUE,
        },
        {
            name: ConstantStringEnum.TRUCK,
            isActive: false,
            tab1: ConstantStringEnum.MILEAGE,
            tab2: ConstantStringEnum.REVENUE,
        },
        {
            name: ConstantStringEnum.BROKER,
            isActive: false,
            tab1: ConstantStringEnum.LOAD,
            tab2: ConstantStringEnum.REVENUE,
        },
        {
            name: ConstantStringEnum.SHIPPER,
            isActive: false,
            tab1: null,
            tab2: null,
        },
        {
            name: ConstantStringEnum.OWNER,
            isActive: false,
            tab1: ConstantStringEnum.LOAD,
            tab2: ConstantStringEnum.REVENUE,
        },
        {
            name: ConstantStringEnum.REPAIR_SHOP,
            isActive: false,
            tab1: ConstantStringEnum.VISIT,
            tab2: ConstantStringEnum.COST,
        },
        {
            name: ConstantStringEnum.FUEL_STOP,
            isActive: false,
            tab1: ConstantStringEnum.VISIT,
            tab2: ConstantStringEnum.COST,
        },
    ];

    static TOP_RATED_TABS: DashboardTab[] = [
        {
            name: ConstantStringEnum.MILEAGE,
            checked: true,
        },
        {
            name: ConstantStringEnum.REVENUE,
            checked: false,
        },
    ];

    static MAIN_PERIOD_DROPDOWN_DATA: DropdownListItem[] = [
        {
            id: 1,
            name: ConstantStringEnum.TODAY,
        },
        {
            id: 2,
            name: ConstantStringEnum.WEEK_TO_DATE,
        },
        {
            id: 3,
            name: ConstantStringEnum.MONTH_TO_DATE,
        },
        {
            id: 4,
            name: ConstantStringEnum.QUARTAL_TO_DATE,
        },
        {
            id: 5,
            name: ConstantStringEnum.YEAR_TO_DATE,
        },
        {
            id: 6,
            name: ConstantStringEnum.ALL_TIME,
        },
        {
            id: 7,
            name: ConstantStringEnum.CUSTOM,
        },
    ];

    static SUB_PERIOD_DROPDOWN_DATA: DropdownListItem[] = [
        {
            id: 1,
            name: ConstantStringEnum.HOURLY,
        },
        {
            id: 2,
            name: ConstantStringEnum.THREE_HOURS,
        },
        {
            id: 3,
            name: ConstantStringEnum.SIX_HOURS,
        },
        {
            id: 4,
            name: ConstantStringEnum.SEMI_DAILY,
        },
        {
            id: 5,
            name: ConstantStringEnum.DAILY,
        },
        {
            id: 6,
            name: ConstantStringEnum.WEEKLY,
        },
        {
            id: 7,
            name: ConstantStringEnum.BI_WEEKLY,
        },
        {
            id: 8,
            name: ConstantStringEnum.SEMI_MONTHLY,
        },
        {
            id: 9,
            name: ConstantStringEnum.MONTHLY,
        },
        {
            id: 10,
            name: ConstantStringEnum.QUARTERLY,
        },
        {
            id: 11,
            name: ConstantStringEnum.YEARLY,
        },
    ];

    static TOP_RATED_LIST_ITEM = {
        id: null,
        name: null,
        value: null,
        percent: null,
        isSelected: false,
    };
}
