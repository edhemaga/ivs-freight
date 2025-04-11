// Interfaces
import { ILoadState } from '@pages/new-load/interfaces';
import { ITableData } from '@shared/models';
import { LoadListResponse } from 'appcoretruckassist';

const updateTabsCount = (
    listResponse: LoadListResponse,
    toolbarTabs: ITableData[]
): ITableData[] => {
    return [
        {
            ...toolbarTabs[0],
            length: listResponse.templateCount,
        },
        {
            ...toolbarTabs[1],
            length: listResponse.pendingCount,
        },
        {
            ...toolbarTabs[2],
            length: listResponse.activeCount,
        },
        {
            ...toolbarTabs[3],
            length: listResponse.closedCount,
        },
    ];
};

export const getLoadByIdSuccessResult = function (
    state: ILoadState,
    a: LoadListResponse
): ILoadState {
    return {
        ...state,
        loads: a.pagination.data,
        toolbarTabs: updateTabsCount(a, state.toolbarTabs),
    };
};
