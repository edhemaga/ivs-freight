// Store
import { createReducer, on } from '@ngrx/store';

// Actions
import * as LoadActions from '@pages/new-load/state/actions/load.actions';

// Functions
import * as Functions from '@pages/new-load/state/functions/load-reducer.functions';

// Interfaces
import { ILoadState } from '@pages/new-load/interfaces';

// Constants
import { LoadToolbarTabs } from '@pages/new-load/utils/constants/load-toolbar-tabs.constants';
import { LoadTableColumns } from '@pages/load/pages/load-table/utils/constants';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eCommonElement } from '@shared/enums';

export const initialState: ILoadState = {
    loads: [],

    toolbarTabs: LoadToolbarTabs,
    selectedTab: eLoadStatusStringType.ACTIVE,

    activeViewMode: eCommonElement.LIST,

    filtersDropdownList: {},

    tableColumns: LoadTableColumns,
};

export const loadReducer = createReducer(
    initialState,
    on(LoadActions.getLoadsPayloadSuccess, (state, { payload }) =>
        Functions.getLoadByIdSuccessResult(state, payload)
    ),

    on(LoadActions.getLoadsPayloadOnTabTypeChange, (state, { mode }) =>
        Functions.getLoadsPayloadOnTabTypeChange(state, mode)
    ),

    on(LoadActions.getViewModeChange, (state, { viewMode }) =>
        Functions.getViewModeChange(state, viewMode)
    )
);
