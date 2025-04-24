// Feature Enums
import { eActiveViewMode, eCardFlipViewMode } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// Shared Models
import { ITableData } from '@shared/models';

// Interfaces
import {
    ICardValueData,
    IMinimalListFilters,
    IStateFilters,
} from '@shared/interfaces';
import { ITableColumn } from '@shared/components/new-table/interfaces';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { ITableConfig } from '@shared/components/new-table/interfaces';

// External Services or Models
import { MilesStateFilterResponse, RoutingResponse } from 'appcoretruckassist';
import {
    IMilesModel,
    IMilesTabResults,
    IMinimalListState,
    IMinimalStopsState,
} from '@pages/miles/interface';
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

    details: IMinimalStopsState;
    isDetailsLoading: boolean;
    tableSettings: ITableConfig;
    minimalList: IMinimalListState;
    minimalListFilters: IMinimalListFilters;
    unitMapRoutes: RoutingResponse;
    unitMapData: ICaMapProps;
    frontSideData: ICardValueData[];
    backSideData: ICardValueData[];
}
