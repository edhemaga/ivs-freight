import { ITableData } from "@shared/models";
import { MilesByUnitListResponse } from "appcoretruckassist";

export interface IMilesInitalState{
    tableTabs: ITableData;
    items: MilesByUnitListResponse;
}