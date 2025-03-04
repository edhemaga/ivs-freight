// Feature Enums
import { eActiveViewMode } from '@shared/enums';
import { eMileTabs } from "@pages/miles/enums";

// Shared Models
import { IStateFilters, ITableColumn, ITableData } from "@shared/models";

// External Services or Models
import { MilesStateFilterResponse } from "appcoretruckassist";
import { IMilesModel } from "./IMilesModel";

export interface IMilesState {
    items: IMilesModel[];
    loading: boolean;
    error: any;
    tableViewData: ITableData[];
    selectedTab: eMileTabs;
    activeViewMode: eActiveViewMode, 
    filters: IStateFilters,
    states: MilesStateFilterResponse[],
    selectedRows: number;
    columns: ITableColumn[];
    areAllItemsSelected: boolean;
}