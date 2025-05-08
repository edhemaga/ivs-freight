import { Injectable } from '@angular/core';

// NgBootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Selectors
import * as UserSelector from '@pages/new-user/state/selectors/user.selector';
// Const
import { UserStoreConstants } from '@pages/new-user/utils/constants';
import {
    CompanyUserResponse,
    DepartmentFilterResponse,
} from 'appcoretruckassist';
// rxjs
import { Observable } from 'rxjs';

// Enums
import { eCommonElement, eStatusTab } from '@shared/enums';

// Services
import { ModalService } from '@shared/services';

import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { DeactivateUserComponent } from '@pages/new-user/modals/deactivate-user/deactivate-user.component';
// Components
import { DeleteUserComponent } from '@pages/new-user/modals/delete-user/delete-user.component';
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interfaces';
import { IFilterAction } from 'ca-components';

// Models
import { ITableData } from '@shared/models';

// Interface
import { IMappedUser, IUserDeleteModal } from '@pages/new-user/interfaces';

// Store
import { select, Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root',
})
export class UserStoreService {
    public activeViewModeSelector$: Observable<string> = this.store.pipe(
        select(UserSelector.activeViewModeSelector)
    );
    public departmentListSelector$: Observable<DepartmentFilterResponse[]> =
        this.store.pipe(select(UserSelector.departmentListSelector));
    public searchStringsSelector$: Observable<string[]> = this.store.pipe(
        select(UserSelector.searchStringsSelector)
    );
    public selectedCountSelector$: Observable<number> = this.store.pipe(
        select(UserSelector.selectedCountSelector)
    );
    public selectedTabCountSelector$: Observable<number> = this.store.pipe(
        select(UserSelector.selectedTabCountSelector)
    );
    public selectedTabSelector$: Observable<eStatusTab> = this.store.pipe(
        select(UserSelector.selectedTabSelector)
    );
    public selectedUserSelector$: Observable<IMappedUser[]> = this.store.pipe(
        select(UserSelector.selectedUserSelector)
    );
    public tableColumnsSelector$: Observable<ITableColumn[]> = this.store.pipe(
        select(UserSelector.tableColumnsSelector)
    );
    public tableSettingsSelector$: Observable<ITableConfig> = this.store.pipe(
        select(UserSelector.tableSettingsSelector)
    );
    public toolbarDropdownMenuOptionsSelector$: Observable<
        IDropdownMenuItem[]
    > = this.store.pipe(
        select(UserSelector.toolbarDropdownMenuOptionsSelector)
    );
    public toolbarTabsSelector$: Observable<ITableData[]> = this.store.pipe(
        select(UserSelector.toolbarTabsSelector)
    );
    public userListSelector$: Observable<IMappedUser[]> = this.store.pipe(
        select(UserSelector.userListSelector)
    );
    public tableDropdownMenuOptionsSelector$: Observable<IDropdownMenuItem[]> =
        this.store.pipe(select(UserSelector.tableDropdownMenuOptionsSelector));

    constructor(
        private store: Store,
        private modalService: ModalService
    ) {}

    public dispatchCreateNewUser(user: CompanyUserResponse): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_CREATE_USER,
            user,
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

                    ngbActiveModal.close();
                }
            });
    }

    public dispatchFiltersChange(filters: IFilterAction): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_FILTER_CHANGED,
            filters,
        });
    }

    public dispatchLoadInitialList(): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_LOAD_USER_LIST,
        });
    }

    public dispatchOpenUserModal(isEdit: boolean, id: number): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_OPEN_USER_MODAL,
            isEdit,
            id,
        });
    }

    public dispatchSearchChange(query: string[]): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
            query,
        });
    }

    public dispatchSelectAll(action: string): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_ON_SELECT_ALL,
            action,
        });
    }

    public dispatchSelectUser(id: number): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_ON_USER_SELECTION,
            id,
        });
    }

    public dispatchSetToolbarDropdownMenuColumnsActive(
        isActive: boolean
    ): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
            isActive,
        });
    }

    public dispatchSortingChange(column: ITableColumn): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_SORTING_CHANGE,
            column,
        });
    }

    public dispatchToggleColumnsVisibility(
        columnKey: string,
        isActive: boolean
    ) {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
            columnKey,
            isActive,
        });
    }

    public dispatchTypeChange(mode: eStatusTab): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_USER_TYPE_CHANGE,
            mode,
        });
    }

    public dispatchUpdateUser(user: CompanyUserResponse): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_UPDATE_USER,
            user,
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
                    ngbActiveModal.close();
                }
            });
    }

    public dispatchViewModeChange(viewMode: eCommonElement): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
            viewMode,
        });
    }

    public getNewPage(): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_GET_NEW_PAGE_RESULTS,
        });
    }

    public dispatchResetPassword(email: string): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_RESET_PASSWORD,
            email,
        });
    }

    public dispatchResendInvitation(id: number): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_RESEND_INVITATION,
            id,
        });
    }

    public dispatchSetTableDropdownMenuOptions(user: IMappedUser): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_SET_TABLE_DROPDOWN_MENU_OPTIONS,
            user,
        });
    }
}
