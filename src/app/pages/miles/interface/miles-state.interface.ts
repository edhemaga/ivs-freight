// Feature Enums
import { eActiveViewMode } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// Shared Models
import { ITableData } from '@shared/models';

// Interface
import { IStateFilters } from '@shared/interfaces';
import { ITableColumn } from '@shared/components/new-table/interface';

// External Services or Models
import {
    MilesByUnitPaginatedStopsResponse,
    MilesStateFilterResponse,
} from 'appcoretruckassist';
import { IMilesDetailsFilters, IMilesModel } from '@pages/miles/interface';
import { ITableConfig } from '@shared/components/new-table/interface';

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
    hasAllItemsSelected: boolean;

    // Is used for next, prev icons to navigate throught list
    details: MilesByUnitPaginatedStopsResponse;
    unitsPagination: IMilesDetailsFilters;
    tableSettings: ITableConfig;
}
