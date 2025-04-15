// Interfaces
import {
    ILoadDetails,
    ILoadDetailsLoadMinimalList,
    IMappedLoad,
    ILoadPageFilters,
} from '@pages/new-load/interfaces';
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interface';
import { IStateFilters } from '@shared/interfaces';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// Models
import { ITableData } from '@shared/models';
import { LoadPossibleStatusesResponse } from 'appcoretruckassist';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eCardFlipViewMode, eCommonElement } from '@shared/enums';

export interface ILoadState {
    loads: IMappedLoad[];
    areAllLoadsSelected: boolean;

    // Main tabs
    toolbarTabs: ITableData[];
    selectedTab: eLoadStatusStringType;

    // Active table view CARD | TABLE
    activeViewMode: eCommonElement;

    // Filters
    filtersDropdownList: ILoadPageFilters;
    filters: IStateFilters;

    // Table
    tableColumns: ITableColumn[];
    tableSettings: ITableConfig;

    // Load details
    details: ILoadDetails;

    // Minimal list
    minimalList: ILoadDetailsLoadMinimalList;

    // Hamburger menu options
    toolbarDropdownMenuOptions: IDropdownMenuItem[];
    cardFlipViewMode: eCardFlipViewMode;
    isToolbarDropdownMenuColumnsActive: boolean;

    // Change status dropdown
    possibleStatuses: LoadPossibleStatusesResponse;
    loadIdLoadStatusChange: number;
}
