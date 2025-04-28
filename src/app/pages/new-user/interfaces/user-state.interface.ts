// Interface
import { IMappedUser } from '@pages/new-user/interfaces';
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interfaces';
import { IStateFilters } from '@shared/interfaces';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// Models
import { ITableData } from '@shared/models';
import { DepartmentFilterResponse } from 'appcoretruckassist';

// Enums
import { eCommonElement, eStatusTab } from '@shared/enums';

export interface IUserState {
    users: IMappedUser[];
    departmentList: DepartmentFilterResponse[];
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

    // Hamburger menu options
    toolbarDropdownMenuOptions: IDropdownMenuItem[];
    isToolbarDropdownMenuColumnsActive: boolean;
}
