// Interface
import { IMappedUser } from '@pages/new-user/interfaces';
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interface';
import { IStateFilters } from '@shared/interfaces';

// Models
import { ITableData } from '@shared/models';

// Enums
import { eCommonElement, eStatusTab } from '@shared/enums';

export interface IUserState {
    users: IMappedUser[];
    searchResultsCount: number;
    areAllUsersSelected: boolean;

    // Fiters
    filters: IStateFilters;
    currentPage: number;

    toolbarTabs: ITableData[];
    tableSettings: ITableConfig;
    selectedTab: eStatusTab;

    // Active table view CARD | TABLE
    activeViewMode: eCommonElement;

    // Table
    tableColumns: ITableColumn[];
}
