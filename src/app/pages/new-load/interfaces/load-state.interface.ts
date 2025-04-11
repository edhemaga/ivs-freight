// Interfaces
import { ILoadModel } from '@pages/new-load/interfaces';

// Models
import { ITableData } from '@shared/models';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eActiveViewMode } from '@shared/enums';

export interface ILoadState {
    loads: ILoadModel[];

    // Main tabs
    toolbarTabs: ITableData[];
    selectedTab: eLoadStatusStringType;

    // Active table view
    activeViewMode: string;
}
