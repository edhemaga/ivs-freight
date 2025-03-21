// Feature Enums
import { eActiveViewMode } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// Shared Models
import { ITableColumn, ITableData } from '@shared/models';
import { IStateFilters } from '@shared/interfaces';

// External Services or Models
import {
    MilesByUnitPaginatedStopsResponse,
    MilesStateFilterResponse,
} from 'appcoretruckassist';
import { IMilesModel } from '@pages/miles/interface';

export interface IMilesState {
    items: IMilesModel[];
    loading: boolean;
    tableViewData: ITableData[];
    selectedTab: eMileTabs;
    activeViewMode: eActiveViewMode;
    filters: IStateFilters;
    states: MilesStateFilterResponse[];
    selectedRows: number;
    columns: ITableColumn[];
    areAllItemsSelected: boolean;

    // Is used for next, prev icons to navigate throught list
    actionUnitIndex: number;
    details: MilesByUnitPaginatedStopsResponse;
}
