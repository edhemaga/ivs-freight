import { eCommonElement } from '@shared/enums';

import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interfaces';

// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';
import { IStateFilters } from '@shared/interfaces';

export interface IAccountState {
    accountList: IMappedAccount[];
    isLoading: boolean;
    searchResultsCount: number;
    areAllUsersSelected: boolean;
    filters: IStateFilters;
    currentPage: number;
    tableColumns: ITableColumn[];
    tableSettings: ITableConfig;

    // Active table view CARD | TABLE
    activeViewMode: eCommonElement;

    // Hamburger menu options
    toolbarDropdownMenuOptions: IDropdownMenuItem[];
    isToolbarDropdownMenuColumnsActive: boolean;
}
