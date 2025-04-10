// Feature Enums
import { eActiveViewMode, eCardFlipViewMode } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// Shared Models
import { ITableData } from '@shared/models';

// Interface
import { IStateFilters } from '@shared/interfaces';
import { ITableColumn } from '@shared/components/new-table/interface';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// External Services or Models
import {
    MilesByUnitPaginatedStopsResponse,
    MilesStateFilterResponse,
    RoutingResponse,
} from 'appcoretruckassist';
import {
    IMilesDetailsFilters,
    IMilesModel,
    IMilesTabResults,
} from '@pages/miles/interface';
import { ITableConfig } from '@shared/components/new-table/interface';
import { ICaMapProps } from 'ca-components';

export interface IMilesState {
    items: IMilesModel[];
    loading: boolean;
    tableViewData: ITableData[];
    selectedTab: eMileTabs;
    activeViewMode: eActiveViewMode;
    filters: IStateFilters;
    states: MilesStateFilterResponse[];
    columns: ITableColumn[];
    cardFlipViewMode: eCardFlipViewMode;
    toolbarDropdownMenuOptions: IDropdownMenuItem[];
    isToolbarDropdownMenuColumnsActive: boolean;
    page: number;

    tabResults: IMilesTabResults;

    // Is used for next, prev icons to navigate throught list
    details: MilesByUnitPaginatedStopsResponse;
    unitsPagination: IMilesDetailsFilters;
    tableSettings: ITableConfig;
    unitMapRoutes: RoutingResponse;
    unitMapData: ICaMapProps;
}
