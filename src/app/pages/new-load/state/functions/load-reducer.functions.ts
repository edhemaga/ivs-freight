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
    loadResponse: LoadListResponse
): ILoadState {
    console.log('getLoadByIdSuccessResult');
    return {
        ...state,
        loads: LoadHelper.loadMapper(loadResponse.pagination.data),
        toolbarTabs: LoadHelper.updateTabsCount(
            loadResponse,
            state.toolbarTabs
        ),
    };
};

export const getLoadsPayloadOnTabTypeChange = function (
    state: ILoadState,
    selectedTabValue: eLoadStatusType
): ILoadState {
    console.log('getLoadsPayloadOnTabTypeChange');
    return {
        ...state,
        selectedTab: LoadHelper.loadStatusTypeToStringMap[selectedTabValue],
    };
};

export const getViewModeChange = function (
    state: ILoadState,
    activeViewMode: eCommonElement
): ILoadState {
    console.log('getViewModeChange');
    return {
        ...state,
        activeViewMode,
    };
};
