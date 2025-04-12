// Interfaces
import { ILoadModel } from '@pages/new-load/interfaces';

// Models
import { ITableData } from '@shared/models';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement } from '@shared/enums';

export interface ILoadState {
    loads: ILoadModel[];

    // Main tabs
    toolbarTabs: ITableData[];
    selectedTab: eLoadStatusStringType;
    selectedTabValue: eLoadStatusType;

    // Active table view
    activeViewMode: eCommonElement;
}
