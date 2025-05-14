// enums
import { eCardFlipViewMode, eCommonElement } from '@shared/enums';

// interfaces
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interfaces';
import { IMappedAccount } from '@pages/new-account/interfaces';
import { ICardValueData, IStateFilters } from '@shared/interfaces';

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

    // Cards
    cardFlipViewMode: eCardFlipViewMode;
    frontSideData: ICardValueData[];
    backSideData: ICardValueData[];
}
