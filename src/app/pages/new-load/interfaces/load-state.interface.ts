// Interfaces
import {
    ILoadDetails,
    ILoadModel,
    ILoadPageFilters,
} from '@pages/new-load/interfaces';
import { ITableColumn } from '@shared/components/new-table/interface';
import { IStateFilters } from '@shared/interfaces';

// Models
import { ITableData } from '@shared/models';
import { LoadMinimalListResponse } from 'appcoretruckassist';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eCommonElement } from '@shared/enums';

export interface ILoadState {
    loads: ILoadModel[];

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

    // Load details
    details: ILoadDetails;

    // Minimal list
    minimalList: LoadMinimalListResponse;
}
