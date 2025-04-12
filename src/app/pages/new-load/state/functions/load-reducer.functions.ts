// Interfaces
import { ILoadState } from '@pages/new-load/interfaces';

// Models
import { LoadListResponse } from 'appcoretruckassist';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement } from '@shared/enums';

// Helper
import { LoadHelper } from '@pages/new-load/utils/helpers';

export const getLoadByIdSuccessResult = function (
    state: ILoadState,
    a: LoadListResponse
): ILoadState {
    return {
        ...state,
        loads: a.pagination.data,
        toolbarTabs: LoadHelper.updateTabsCount(a, state.toolbarTabs),
    };
};

export const getLoadsPayloadOnTabTypeChange = function (
    state: ILoadState,
    selectedTabValue: eLoadStatusType
): ILoadState {
    return {
        ...state,
        selectedTabValue,
        selectedTab: LoadHelper.loadStatusTypeToStringMap[selectedTabValue],
    };
};

export const getViewModeChange = function (
    state: ILoadState,
    activeViewMode: eCommonElement
): ILoadState {
    return {
        ...state,
        activeViewMode,
    };
};
