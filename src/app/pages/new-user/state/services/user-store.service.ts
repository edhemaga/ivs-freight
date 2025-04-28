import { Injectable } from '@angular/core';

// NgBootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Store
import { select, Store } from '@ngrx/store';

// rxjs
import { Observable } from 'rxjs';

// Selectors
import * as UserSelector from '@pages/new-user/state/selectors/user.selector';

// Models
import { ITableData } from '@shared/models';
import { DepartmentFilterResponse } from 'appcoretruckassist';

// Const
import { UserStoreConstants } from '@pages/new-user/utils/constants';

// Enums
import { eCommonElement, eStatusTab } from '@shared/enums';

// Interface
import { IMappedUser, IUserDeleteModal } from '@pages/new-user/interfaces';
import { ITableColumn, ITableConfig } from '@shared/components/new-table/interfaces';

import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// Services
import { ModalService } from '@shared/services';

// Components
import { DeleteUserComponent } from '@pages/new-user/modals/delete-user/delete-user.component';
import { DeactivateUserComponent } from '@pages/new-user/modals/deactivate-user/deactivate-user.component';
import { IFilterAction } from 'ca-components';

@Injectable({
    providedIn: 'root',
})
export class UserStoreService {
    constructor(
        private store: Store,
        private modalService: ModalService
    ) {}

    public userListSelector$: Observable<IMappedUser[]> = this.store.pipe(
        select(UserSelector.userListSelector)
    );
    public toolbarDropdownMenuOptionsSelector$: Observable<
        IDropdownMenuItem[]
    > = this.store.pipe(
        select(UserSelector.toolbarDropdownMenuOptionsSelector)
    );

    public departmentListSelector$: Observable<DepartmentFilterResponse[]> =
        this.store.pipe(select(UserSelector.departmentListSelector));

    public selectedUserSelector$: Observable<IMappedUser[]> = this.store.pipe(
        select(UserSelector.selectedUserSelector)
    );

    public toolbarTabsSelector$: Observable<ITableData[]> = this.store.pipe(
        select(UserSelector.toolbarTabsSelector)
    );

    public selectedTabSelector$: Observable<eStatusTab> = this.store.pipe(
        select(UserSelector.selectedTabSelector)
    );

    public activeViewModeSelector$: Observable<string> = this.store.pipe(
        select(UserSelector.activeViewModeSelector)
    );

    public tableColumnsSelector$: Observable<ITableColumn[]> = this.store.pipe(
        select(UserSelector.tableColumnsSelector)
    );

    public tableSettingsSelector$: Observable<ITableConfig> = this.store.pipe(
        select(UserSelector.tableSettingsSelector)
    );

    public selectedCountSelector$: Observable<number> = this.store.pipe(
        select(UserSelector.selectedCountSelector)
    );

    public selectedTabCountSelector$: Observable<number> = this.store.pipe(
        select(UserSelector.selectedTabCountSelector)
    );

    public searchStringsSelector$: Observable<string[]> = this.store.pipe(
        select(UserSelector.searchStringsSelector)
    );

    public dispatchSetToolbarDropdownMenuColumnsActive(
        isActive: boolean
    ): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
            isActive,
        });
    }

    public dispatchToggleColumnsVisiblity(
        columnKey: string,
        isActive: boolean
    ) {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
            columnKey,
            isActive,
        });
    }

    public dispatchLoadInitialList(): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_LOAD_USER_LIST,
        });
    }

    public dispatchTypeChange(mode: eStatusTab): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_USER_TYPE_CHANGE,
            mode,
        });
    }

    public dispatchViewModeChange(viewMode: eCommonElement): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
            viewMode,
        });
    }

    public dispatchSelectUser(id: number): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_ON_USER_SELECTION,
            id,
        });
    }

    public dispatchSortingChange(column: ITableColumn): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_SORTING_CHANGE,
            column,
        });
    }

    public dispatchSelectAll(action: string): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_ON_SELECT_ALL,
            action,
        });
    }

    public getNewPage(): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_GET_NEW_PAGE_RESULTS,
        });
    }

    public dispatchSearchChange(query: string[]): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
            query,
        });
    }

    public dispatchDeleteUsers(
        modalData: IUserDeleteModal,
        ngbActiveModal: NgbActiveModal
    ): void {
        this.modalService
            .openModalNew(DeleteUserComponent, modalData)
            .closed.subscribe((value) => {
                if (value) {
                    this.store.dispatch({
                        type: UserStoreConstants.ACTION_DISPATCH_DELETE_USERS,
                        users: modalData.users,
                    });
                }

                ngbActiveModal.close();
            });
    }

    public dispatchUserStatusChange(
        modalData: IUserDeleteModal,
        ngbActiveModal: NgbActiveModal
    ): void {
        this.modalService
            .openModalNew(DeactivateUserComponent, modalData)
            .closed.subscribe((value) => {
                if (value) {
                    this.store.dispatch({
                        type: UserStoreConstants.ACTION_DISPATCH_USER_STATUS_CHANGE,
                        users: modalData.users,
                    });
                }

                ngbActiveModal.close();
            });
    }

    public dispatchFiltersChange(filters: IFilterAction): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_FILTER_CHANGED,
            filters,
        });
    }
}
