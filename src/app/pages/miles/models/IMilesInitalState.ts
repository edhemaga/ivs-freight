// Feature Enums
import { eActiveViewMode } from "@pages/load/pages/load-table/enums";
import { eMileTabs } from "@pages/miles/enums";

// Shared Models
import { IStateFilters, ITableColumn, ITableData } from "@shared/models";

// External Services or Models
import { MilesByUnitResponse, MilesStateFilterResponse } from "appcoretruckassist";


export interface IMilesState {
    items: MilesByUnitResponse[];
    loading: boolean;
    error: any;
    tableViewData: ITableData[];
    selectedTab: eMileTabs;
    activeViewMode: eActiveViewMode, 
    filters: IStateFilters,
    states: MilesStateFilterResponse[],
    selectedRows: number;
    columns: ITableColumn[];
}