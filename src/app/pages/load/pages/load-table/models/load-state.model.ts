// models
import { ILoadGridItem, ILoadTemplateGridItem } from "@pages/load/pages/load-table/models/index"
import {  LoadModalResponse } from "appcoretruckassist";
import { DispatcherFilter } from '@shared/models/filters';

// enums
import { eActiveViewMode, eLoadStatusType } from "@pages/load/pages/load-table/enums/index"

export interface ILoadState {
    data: ILoadGridItem[] | ILoadTemplateGridItem[], // list entity data

    modal: LoadModalResponse, // static modal data

    pendingCount: number,
    activeCount: number,
    closedCount: number,
    templateCount: number,

    canDeleteSelectedDataRows: boolean,
    selectedTab: eLoadStatusType,
    activeViewMode: eActiveViewMode, 

    dispatcherList: DispatcherFilter[];
    statusList: DispatcherFilter[];
}