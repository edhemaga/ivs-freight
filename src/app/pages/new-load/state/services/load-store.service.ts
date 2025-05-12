import { Injectable } from '@angular/core';

// Store
import { select, Store } from '@ngrx/store';

// rxjs
import { Observable } from 'rxjs';

// Interfaces
import {
    ILoadDetails,
    ILoadDetailsLoadMinimalList,
    IMappedLoad,
    ILoadPageFilters,
    ILoadDeleteModal,
    ILoadPickupDeliveryData,
} from '@pages/new-load/interfaces';
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';
import {
    ITableColumn,
    ITableConfig,
    ITableReorderAction,
    ITableResizeAction,
    ITableTagAction,
} from '@shared/components/new-table/interfaces';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { IFilterAction, IComment } from 'ca-components';

// Selectors
import * as LoadSelectors from '@pages/new-load/state/selectors/load.selectors';

// Const
import { LoadStoreConstants } from '@pages/new-load/utils/constants';

// Models
import { ITableData } from '@shared/models';
import {
    CommentResponse,
    FileResponse,
    LoadPossibleStatusesResponse,
    LoadStatusResponse,
} from 'appcoretruckassist';

// Enums
import {
    eLoadModalActions,
    eLoadStatusStringType,
} from '@pages/new-load/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement, TableStringEnum } from '@shared/enums';

// Services
import { ModalService } from '@shared/services';

// Components
import { LoadDeleteModalComponent } from '@pages/new-load/pages/load-modal/load-delete-modal/load-delete-modal.component';

@Injectable({
    providedIn: 'root',
})
export class LoadStoreService {
    constructor(
        private store: Store,
        private modalService: ModalService
    ) {}

    public loadsSelector$: Observable<IMappedLoad[]> = this.store.pipe(
        select(LoadSelectors.selectLoads)
    );

    public selectedLoadsSelector$: Observable<IMappedLoad[]> = this.store.pipe(
        select(LoadSelectors.selectedLoadsSelector)
    );

    public toolbarTabsSelector$: Observable<ITableData[]> = this.store.pipe(
        select(LoadSelectors.toolbarTabsSelector)
    );

    public selectedTabSelector$: Observable<eLoadStatusStringType> =
        this.store.pipe(select(LoadSelectors.selectedTabSelector));

    public selectedTabCountSelector$: Observable<number> = this.store.pipe(
        select(LoadSelectors.selectedTabCountSelector)
    );

    public activeViewModeSelector$: Observable<string> = this.store.pipe(
        select(LoadSelectors.activeViewModeSelector)
    );

    public filtersDropdownListSelector$: Observable<ILoadPageFilters> =
        this.store.pipe(select(LoadSelectors.filtersDropdownListSelector));

    public tableColumnsSelector$: Observable<ITableColumn[]> = this.store.pipe(
        select(LoadSelectors.tableColumnsSelector)
    );

    public isTypeColumnCheckedSelector$: Observable<boolean> = this.store.pipe(
        select(LoadSelectors.isTypeColumnCheckedSelector)
    );

    public getSortableColumnSelector$: Observable<ITableColumn[]> =
        this.store.pipe(select(LoadSelectors.getSortableColumn));

    public loadDetailsSelector$: Observable<ILoadDetails> = this.store.pipe(
        select(LoadSelectors.loadDetailsSelector)
    );

    public loadDetailsCommentSelector$: Observable<CommentResponse[]> =
        this.store.pipe(select(LoadSelectors.loadDetailsCommentsSelector));

    public minimalListSelector$: Observable<ILoadDetailsLoadMinimalList> =
        this.store.pipe(select(LoadSelectors.minimalListSelector));

    public selectedCountSelector$: Observable<number> = this.store.pipe(
        select(LoadSelectors.selectedCountSelector)
    );

    public totalSumSelector$: Observable<number> = this.store.pipe(
        select(LoadSelectors.totalSumSelector)
    );

    public searchStringsSelector$: Observable<string[]> = this.store.pipe(
        select(LoadSelectors.searchStringsSelector)
    );

    // TODO: WAIT FOR BACKEND TO CREATE THIS, THIS WE BE REMOVED THEN!!!
    public closedLoadStatusSelector$: Observable<any> = this.store.pipe(
        select(LoadSelectors.closedLoadStatusSelector)
    );

    public toolbarDropdownMenuOptionsSelector$: Observable<
        IDropdownMenuItem[]
    > = this.store.pipe(
        select(LoadSelectors.toolbarDropdownMenuOptionsSelector)
    );

    public tableSettingsSelector$: Observable<ITableConfig> = this.store.pipe(
        select(LoadSelectors.tableSettingsSelector)
    );

    public changeDropdownpossibleStatusesSelector$: Observable<LoadPossibleStatusesResponse> =
        this.store.pipe(
            select(LoadSelectors.changeDropdownpossibleStatusesSelector)
        );

    public cardFlipViewModeSelector$: Observable<string> = this.store.pipe(
        select(LoadSelectors.cardFlipViewModeSelector)
    );

    public loadPickupDeliveryDataSelector$: Observable<ILoadPickupDeliveryData> =
        this.store.pipe(select(LoadSelectors.loadPickupDeliveryDataSelector));

    public dispatchLoadList(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DISPATCH_LOAD_LIST,
        });
    }

    public dispatchLoadTypeChange(mode: eLoadStatusType): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DISPATCH_LOAD_TYPE_CHANGE,
            mode,
        });
    }

    public getNewPage(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_NEW_PAGE_RESULTS,
        });
    }

    public dispatchViewModeChange(viewMode: eCommonElement): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
            viewMode,
        });
    }

    public onOpenModal(modal: ILoadModal): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_OPEN_LOAD_MODAL,
            modal,
        });
    }

    public dispatchGetEditLoadOrTemplateModalData(
        id: number,
        selectedLoadTab: eLoadStatusType
    ): void {
        const modal: ILoadModal = {
            isEdit: true,
            isTemplate: selectedLoadTab === eLoadStatusType.Template,
            id,
        };
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_OPEN_LOAD_MODAL,
            modal,
        });
    }

    public dispatchGetConvertToLoadOrTemplateModalData(
        id: number,
        selectedLoadTab: eLoadStatusType,
        type: string
    ): void {
        const modal: ILoadModal = {
            isEdit: true,
            isTemplate: selectedLoadTab === eLoadStatusType.Template,
            id,
            type:
                type === TableStringEnum.CONVERT_TO_TEMPLATE
                    ? eLoadModalActions.CREATE_TEMPLATE_FROM_LOAD
                    : eLoadModalActions.CREATE_LOAD_FROM_TEMPLATE,
        };
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_OPEN_LOAD_MODAL,
            modal,
        });
    }

    public navigateToLoadDetails(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GO_TO_LOAD_DETAILS,
            id,
        });
    }

    public onSelectLoad(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_ON_ONE_LOAD_SELECT,
            id,
        });
    }

    public onSelectAll(action: string): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_ON_SELECT_LOAD_ALL,
            action,
        });
    }

    public dispatchFiltersChange(filters: IFilterAction): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_FILTER_CHANGED,
            filters,
        });
    }

    public dispatchSearchChange(query: string[]): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
            query,
        });
    }

    public dispatchGetLoadDetails(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_BY_ID,
            id,
        });
    }

    public toggleMap(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TOGGLE_MAP,
        });
    }

    public onDeleteLoadsFromList(modalData: ILoadDeleteModal): void {
        this.modalService
            .openModalNew(LoadDeleteModalComponent, modalData)
            .closed.subscribe((value) => {
                if (value) {
                    const action = {
                        type: LoadStoreConstants.ACTION_ON_DELETE_LOAD_LIST,
                        count: modalData.loads.length,
                        isTemplate: modalData.isTemplate,
                        selectedIds: modalData.loads.map((load) => load.id),
                    };

                    this.store.dispatch(action);

                    if (modalData.ngbActiveModal)
                        modalData.ngbActiveModal.close();
                }
            });
    }

    public onDeleteLoadFromDropdown(modalData: ILoadDeleteModal): void {
        this.modalService
            .openModalNew(LoadDeleteModalComponent, modalData)
            .closed.subscribe((value) => {
                if (value) {
                    const action = {
                        type: LoadStoreConstants.ACTION_ON_DELETE_LOAD,
                        isTemplate: modalData.isTemplate,
                        id: modalData.loads[0].id,
                        isDetailsPage: modalData.isDetailsPage,
                    };

                    this.store.dispatch(action);
                }
            });
    }

    public dispatchSetToolbarDropdownMenuColumnsActive(
        isActive: boolean
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
            isActive,
        });
    }

    public dispatchToggleColumnsVisiblity(
        columnKey: string,
        isActive: boolean
    ) {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
            columnKey,
            isActive,
        });
    }

    public dispatchTableUnlockToggle(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TABLE_UNLOCK_TOGGLE,
        });
    }

    public dispatchTableColumnReset(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_RESET_COLUMNS,
        });
    }

    public dispatchToggleCardFlipViewMode(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TOGGLE_CARD_FLIP_VIEW_MODE,
        });
    }

    public dispatchUpdateLoadStatus(status: LoadStatusResponse): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS,
            status,
        });
    }

    public dispatchRevertLoadStatus(status: LoadStatusResponse): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_REVERT_LOAD_STATUS,
            status,
        });
    }

    public dispatchOpenChangeStatusDropdown(loadId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_OPEN_CHANGE_STATUS_DROPDOWN,
            loadId,
        });
    }

    public dispatchSortingChange(column: ITableColumn): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SORTING_CHANGE,
            column,
        });
    }

    public dispatchColumnPinnedAction(column: ITableColumn): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TOGGLE_PIN_TABLE_COLUMN,
            column,
        });
    }

    public dispatchResizeColumn(resizeAction: ITableResizeAction): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_RESIZE_CHANGE,
            resizeAction,
        });
    }

    public dispatchReorderColumn(reorderAction: ITableReorderAction): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_REORDER_CHANGE,
            reorderAction,
        });
    }

    public dispatchGetLoadFiles(files: FileResponse[], loadId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_FILES,
            files,
            loadId,
        });
    }

    public dispatchFilterLoadFilesByTag(tagAction: ITableTagAction): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_FILTER_LOAD_FILES,
            tagAction,
        });
    }

    public dispatchGetLoadStops(load: IMappedLoad): void {
        const { id, loadStops } = load;

        if (loadStops) {
            const totalMiles = load.milesTotal.value;
            const stopsData = {
                loadStops,
                totalMiles,
            };

            this.store.dispatch({
                type: LoadStoreConstants.ACTION_GET_LOAD_STOPS_LIST_SUCCESS,
                loadId: id,
                stopsData,
            });
        } else
            this.store.dispatch({
                type: LoadStoreConstants.ACTION_GET_LOAD_STOPS_LIST,
                id,
            });
    }

    //#region Comments
    public dispatchAddComment(comment: IComment, loadId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_ON_COMMENT_ADD,
            comment,
            loadId,
        });
    }

    public dispatchDeleteComment(id: number, loadId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_ON_COMMENT_DELETE,
            id,
            loadId,
        });
    }

    public dispatchEditComment(comment: IComment, loadId: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_ON_COMMENT_EDIT,
            comment,
            loadId,
        });
    }
    //#endregion
}
