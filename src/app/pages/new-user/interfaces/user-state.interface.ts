// Interface
import { IMappedUser } from '@pages/new-user/interfaces';

// Models
import { ITableData } from '@shared/models';

// Enums
import { eCommonElement, eStatusTab } from '@shared/enums';

export interface IUserState {
    users: IMappedUser[];

    toolbarTabs: ITableData[];
    selectedTab: eStatusTab;

    // Active table view CARD | TABLE
    activeViewMode: eCommonElement;
}
