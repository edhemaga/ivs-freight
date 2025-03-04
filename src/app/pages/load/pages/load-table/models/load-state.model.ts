// models
import { ILoadGridItem, ILoadTemplateGridItem } from "@pages/load/pages/load-table/models/index"
import { DispatcherFilter } from '@shared/models/filters';
import { LoadModalResponse } from "appcoretruckassist";
import { IActiveLoadModalData } from "@pages/load/models/active-load-modal-data.model";

// enums
import { eLoadStatusType } from "@pages/load/pages/load-table/enums/index"
import { eActiveViewMode } from "@shared/enums";

export interface ILoadState {
    data: ILoadGridItem[] | ILoadTemplateGridItem[], // list entity data

    modal: LoadModalResponse, // static modal data
    activeModalData: IActiveLoadModalData,

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