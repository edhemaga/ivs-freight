// Interfaces
import { ILoadModel, ILoadPageFilters } from '@pages/new-load/interfaces';
import { ITableColumn } from '@shared/components/new-table/interface';

// Models
import { ITableData } from '@shared/models';

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

    // Table
    tableColumns: ITableColumn[];
}
