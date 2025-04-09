// Feature Enums
import { eActiveViewMode, eCardFlipViewMode } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// Shared Models
import { ITableData } from '@shared/models';

// Interface
import { IMinimalListFilters, IStateFilters } from '@shared/interfaces';
import { ITableColumn } from '@shared/components/new-table/interface';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { ITableConfig } from '@shared/components/new-table/interface';

// External Services or Models
import { MilesStateFilterResponse } from 'appcoretruckassist';
import {
    IMilesModel,
    IMilesTabResults,
    IMinimalListState,
    IMinimalStopsState,
} from '@pages/miles/interface';

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
}
