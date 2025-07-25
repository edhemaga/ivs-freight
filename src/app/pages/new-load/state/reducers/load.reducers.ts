// Store
import { createReducer, on } from '@ngrx/store';

// Actions
import * as LoadActions from '@pages/new-load/state/actions/load.actions';

// Functions
import * as Functions from '@pages/new-load/state/functions/load-reducer.functions';

// Interfaces
import { ILoadState, IMappedLoad } from '@pages/new-load/interfaces';
import { CommentResponse } from 'appcoretruckassist';

// Constants
import { LoadToolbarTabs } from '@pages/new-load/utils/constants';

// Config
import { LoadTableColumnsConfig } from '@pages/new-load/utils/config';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eCardFlipViewMode, eCommonElement } from '@shared/enums';

// Helpers
import { DropdownMenuToolbarContentHelper } from '@shared/utils/helpers/dropdown-menu-helpers';
import { IComment } from 'ca-components';

export const initialState: ILoadState = {
    loads: [],
    areAllLoadsSelected: false,
    searchResultsCount: 0,

    toolbarTabs: LoadToolbarTabs,
    selectedTab: eLoadStatusStringType.ACTIVE,

    activeViewMode: eCommonElement.LIST,

    filtersDropdownList: {
        dispatcherFilters: [],
        statusFilters: [],
    },
    filters: {},
    currentPage: 1,

    tableColumns: LoadTableColumnsConfig.getLoadTableColumns(
        eLoadStatusStringType.ACTIVE
    ),

    details: {
        data: {},
        isLoading: true,
        isMapOpen: true,
        stopCount: 0,
        extraStopCount: 0,
        reveresedHistory: [],
        mapRoutes: {},
    },

    minimalList: {
        pagination: {},
        groupedByStatusTypeList: {},
    },

    cardFlipViewMode: eCardFlipViewMode.FRONT,
    isToolbarDropdownMenuColumnsActive: false,

    toolbarDropdownMenuOptions:
        DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
            eCommonElement.LIST,
            true,
            eCardFlipViewMode.FRONT,
            false
        ),

    tableSettings: {
        isTableLocked: true,
        sortKey: null,
        sortDirection: null,
        label: '',
    },

    possibleStatuses: null,
    loadIdLoadStatusChange: null,

    loadPickupDeliveryData: null,
};

export const loadReducer = createReducer(
    initialState,

    on(LoadActions.getLoadsPayloadSuccess, (state, { payload }) =>
        Functions.getLoadByIdSuccessResult(state, payload)
    ),

    on(LoadActions.getLoadsOnPageChange, (state) => state),

    on(LoadActions.getLoadsPagePayloadSuccess, (state, { payload }) =>
        Functions.onPageChanges(state, payload)
    ),

    //#region Toolbar tabs
    on(LoadActions.getLoadsPayloadOnTabTypeChange, (state, { mode }) =>
        Functions.getLoadsPayloadOnTabTypeChange(state, mode)
    ),

    on(LoadActions.getViewModeChange, (state, { viewMode }) =>
        Functions.getViewModeChange(state, viewMode)
    ),
    //#endregion

    //#region Filters
    on(LoadActions.onFiltersChange, (state, { filters }) =>
        Functions.onFiltersChange(state, filters)
    ),

    on(
        LoadActions.setFilterDropdownList,
        (state, { dispatcherFilters, statusFilters }) =>
            Functions.setFilterDropdownList(
                state,
                dispatcherFilters,
                statusFilters
            )
    ),

    on(LoadActions.onSeachFilterChange, (state, { query }) =>
        Functions.onSeachFilterChange(state, query)
    ),
    //#endregion

    //#region Details
    on(LoadActions.onGetLoadById, (state) => Functions.onGetLoadById(state)),

    on(
        LoadActions.onGetLoadByIdSuccess,
        (state, { load, minimalList, mapRoutes }) =>
            Functions.onGetLoadByIdSuccess(state, load, minimalList, mapRoutes)
    ),

    on(LoadActions.onGetLoadByIdError, (state) =>
        Functions.onGetLoadByIdError(state)
    ),

    on(LoadActions.onMapVisibilityToggle, (state) =>
        Functions.onMapVisibilityToggle(state)
    ),
    //#endregion

    //#region List
    on(LoadActions.onSelectLoad, (state, { id }) =>
        Functions.onSelectLoad(state, id)
    ),

    on(LoadActions.onSelectAllLoads, (state, { action }) =>
        Functions.onSelectAllLoads(state, action)
    ),
    //#endregion

    //#region Delete actions
    on(LoadActions.onDeleteLoadListSuccess, (state, { selectedIds }) =>
        Functions.onDeleteLoadListSuccess(state, selectedIds)
    ),

    on(LoadActions.onDeleteLoad, (state, { id }) =>
        Functions.onDeleteLoad(state, id)
    ),
    //#endregion

    //#region Toolbar hamburger menu
    on(LoadActions.setToolbarDropdownMenuColumnsActive, (state, { isActive }) =>
        Functions.setToolbarDropdownMenuColumnsActive(state, isActive)
    ),
    on(LoadActions.toggleColumnVisibility, (state, { columnKey, isActive }) =>
        Functions.toggleColumnVisibility(state, columnKey, isActive)
    ),
    on(LoadActions.tableUnlockToggle, (state) =>
        Functions.toggleTableLockingStatus(state)
    ),
    on(LoadActions.tableColumnReset, (state) => ({ ...state })),
    on(LoadActions.toggleCardFlipViewMode, (state) =>
        Functions.toggleCardFlipViewMode(state)
    ),
    //#endregion

    // #region table header
    on(LoadActions.tableSortingChange, (state, { column }) =>
        Functions.onTableSortingChange(state, column)
    ),
    on(LoadActions.pinTableColumn, (state, { column }) =>
        Functions.pinTableColumn(state, column)
    ),
    on(LoadActions.tableResizeChange, (state, { resizeAction }) =>
        Functions.tableResizeChange(state, resizeAction)
    ),
    on(LoadActions.tableReorderChange, (state, { reorderAction }) =>
        Functions.tableReorderChange(state, reorderAction)
    ),

    //#endregion

    //#region Change dropdown status
    on(LoadActions.openChangeStatusDropdown, (state) => ({ ...state })),
    on(
        LoadActions.openChangeStatusDropdownSuccess,
        (state, { possibleStatuses, loadId }) =>
            Functions.openChangeStatusDropdownSuccessResult(
                state,
                possibleStatuses,
                loadId
            )
    ),
    on(LoadActions.openChangeStatusDropdownError, (state) => ({ ...state })),

    on(LoadActions.updateLoadStatus, (state) => ({ ...state })),
    on(LoadActions.updateLoadStatusSuccess, (state, { status, load }) =>
        Functions.updateLoadStatusSuccessResult(state, status, load)
    ),
    on(LoadActions.updateLoadStatusError, (state) => ({ ...state })),

    on(LoadActions.revertLoadStatus, (state) => ({ ...state })),
    on(LoadActions.revertLoadStatusSuccess, (state, { status, load }) =>
        Functions.updateLoadStatusSuccessResult(state, status, load)
    ),
    on(LoadActions.revertLoadStatusError, (state) => ({ ...state })),

    //#endregion

    //#region Files
    on(LoadActions.onGetLoadFiles, (state, { files, loadId }) =>
        Functions.setLoadFiles(state, files, loadId)
    ),
    on(LoadActions.onFilterLoadFiles, (state, { tagAction }) =>
        Functions.filterLoadFiles(state, tagAction)
    ),
    //#endregion Files

    //#region Comments
    on(LoadActions.onAddLoadComment, (state) => ({ ...state })),
    on(LoadActions.onAddLoadCommentSuccess, (state, { comment, loadId }) => {
        const commentResponse: CommentResponse = {
            ...comment,
        };
        const modifiedState: ILoadState = {
            ...state,
            loads: [
                ...state.loads.map((load: IMappedLoad) => {
                    if (load?.id !== loadId) return load;
                    const modifiedLoad: IMappedLoad = {
                        ...load,
                        comments: [...load?.comments, { ...comment }],
                    };
                    return modifiedLoad;
                }),
            ],
            details: {
                ...state.details,
                data: {
                    ...state.details?.data,
                    comments: [
                        ...state.details?.data?.comments,
                        { ...commentResponse },
                    ],
                },
            },
        };
        return modifiedState;
    }),
    on(LoadActions.onAddLoadCommentError, (state) => ({ ...state })),

    on(LoadActions.onDeleteLoadComment, (state) => ({ ...state })),
    on(LoadActions.onDeleteLoadCommentSuccess, (state, { id, loadId }) => {
        const modifiedState: ILoadState = {
            ...state,
            loads: [
                ...state.loads.map((load: IMappedLoad) => {
                    if (load?.id !== loadId) return load;

                    const modifiedLoad: IMappedLoad = {
                        ...load,
                        comments: load?.comments?.filter(
                            (comment: IComment) => comment?.id !== id
                        ),
                    };
                    return modifiedLoad;
                }),
            ],
            details: {
                ...state.details,
                data: {
                    ...state.details?.data,
                    comments: [
                        ...state.details?.data?.comments?.filter(
                            (comment: CommentResponse) => comment?.id !== id
                        ),
                    ],
                },
            },
        };
        return modifiedState;
    }),
    on(LoadActions.onDeleteLoadCommentError, (state) => ({
        ...state,
    })),

    on(LoadActions.onEditLoadComment, (state) => ({ ...state })),
    on(LoadActions.onEditLoadCommentSuccess, (state, { comment, loadId }) => {
        const modifiedState: ILoadState = {
            ...state,
            loads: [
                ...state.loads.map((load: IMappedLoad) => {
                    if (load?.id !== loadId) return load;

                    const modifiedComments: IComment[] = load.comments.map(
                        (_comment: IComment) => {
                            if (_comment?.id !== comment?.id) return _comment;
                            return {
                                ...comment,
                            };
                        }
                    );

                    const modifiedLoad: IMappedLoad = {
                        ...load,
                        comments: modifiedComments,
                    };
                    return modifiedLoad;
                }),
            ],
            details: {
                ...state.details,
                data: {
                    ...state.details?.data,
                    comments: [
                        ...state.details?.data?.comments?.map(
                            (_comment: CommentResponse) => {
                                if (_comment?.id !== comment?.id)
                                    return _comment;
                                const commentFound: CommentResponse = {
                                    ...comment,
                                };
                                return commentFound;
                            }
                        ),
                    ],
                },
            },
        };
        return modifiedState;
    }),
    on(LoadActions.onEditLoadCommentError, (state) => ({ ...state })),

    //#endregion

    //#region Get Load Stops
    on(LoadActions.onGetLoadStopsByIdSuccess, (state, { loadId, stopsData }) =>
        Functions.setLoadPickupDeliveryStopsData(state, loadId, stopsData)
    )
    //#endregion
);
