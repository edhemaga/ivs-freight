// models
import {
    ILoadGridItem,
    ILoadTemplateGridItem,
} from '@pages/load/pages/load-table/models/index';
import {
    LoadModalResponse,
    LoadPossibleStatusesResponse,
    LoadResponse,
} from 'appcoretruckassist';
import { IActiveLoadModalData } from '@pages/load/models/active-load-modal-data.model';
import { IFilterDropdownList } from 'ca-components';

// enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';
import { eActiveViewMode } from '@shared/enums';

export interface ILoadState {
    data: ILoadGridItem[] | ILoadTemplateGridItem[]; // list entity data

    modal: LoadModalResponse; // static modal data
    activeModalData: IActiveLoadModalData;
    activeModalPossibleStatuses: LoadPossibleStatusesResponse;

    pendingCount: number;
    activeCount: number;
    closedCount: number;
    templateCount: number;

    canDeleteSelectedDataRows: boolean;
    selectedTab: eLoadStatusType;
    activeViewMode: eActiveViewMode;

    dispatcherList: IFilterDropdownList[];
    statusList: IFilterDropdownList[];

    details: LoadResponse;
    isLoadDetailsLoaded: boolean;

    selectLoadCount: number;
    selectLoadRateSum: number;
    totalLoadSum: number;
    hasAllLoadsSelected: boolean;
}
