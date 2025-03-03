import { Injectable } from '@angular/core';

// rxjs
import { filter, Observable, take } from 'rxjs';

// store
import { select, Store } from '@ngrx/store';

// models
import { IContactsViewModelData } from '../pages/contacts-table/models/contacts-view-data.model';
import { ContactsBackFilter } from '../pages/contacts-table/models/contacts-back-filter.model';
import { ITableData } from '@shared/models/table-data.model';
import { Column, ITableColummn, ITableOptions } from '@shared/models';
import {
    CompanyContactModalResponse,
    ContactColorResponse,
    CreateCompanyContactCommand,
    UpdateCompanyContactCommand,
} from 'appcoretruckassist';

// selectors
import {
    activeViewModeSelector,
    columnsSelector,
    contactLabelsColorSelector,
    getSelector,
    modalDataSelector,
    tableDataSelector,
    tableOptionsSelector,
    viewDataSelector,
} from '@pages/contacts/state/selectors/contacts.selector';

// constants
import { ContactsStoreConstants } from '../utils/constants';

// enums
import { eActiveViewMode } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class ContactStoreService {
    constructor(private store: Store) {}

    public resolveInitialData$: Observable<any> = this.store.pipe(
        select(getSelector),
        filter((data) => !!data),
        take(1)
    );

    public viewData$: Observable<IContactsViewModelData[]> = this.store.pipe(
        select(viewDataSelector)
    );

    public tableData$: Observable<ITableData[]> = this.store.pipe(
        select(tableDataSelector)
    );

    public columns$: Observable<ITableColummn[]> = this.store.pipe(
        select(columnsSelector)
    );

    public activeViewMode$: Observable<string> = this.store.pipe(
        select(activeViewModeSelector)
    );

    public tableOptions$: Observable<ITableOptions> = this.store.pipe(
        select(tableOptionsSelector)
    );

    public modalData$: Observable<CompanyContactModalResponse> =
        this.store.pipe(select(modalDataSelector));

    public contactLabelsColor$: Observable<ContactColorResponse[]> =
        this.store.pipe(select(contactLabelsColorSelector));

    public dispatchInitialContactList(): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_GET_TABLE_COMPONENT_INITIAL_CONTACT_LIST,
        });
    }

    public dispatchGetContactList(
        onSearch?: ContactsBackFilter,
        showMore?: boolean
    ): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_GET_TABLE_COMPONENT_CONTACT_LIST,
            onSearch,
            showMore,
        });
    }

    public dispatchGetContactColorLabels(): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_GET_CONTACT_COLOR_LABELS_LIST,
        });
    }

    public dispatchDeleteContactById(id: number): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_DELETE_CONTACT_BY_ID,
            apiParam: id,
        });
    }

    public dispatchDeleteBulkContact(ids: number[]): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_DELETE_BULK_CONTACT,
            apiParam: ids,
        });
    }

    public dispatchSetActiveViewMode(activeViewMode: eActiveViewMode): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
            activeViewMode,
        });
    }

    public dispatchTableColumnToggled(column: Column): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_TABLE_COLUMN_TOGGLE,
            column,
        });
    }

    public dispatchTableColumnReset(): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_RESET_COLUMNS,
        });
    }

    public dispatchTableColumnResize(
        columns: ITableColummn[],
        width: number,
        index: number
    ): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_RESIZE_COLUMN,
            columns,
            width,
            index,
        });
    }

    public dispatchCreateContact(apiParam: CreateCompanyContactCommand): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_CREATE_CONTACT,
            apiParam,
        });
    }

    public dispatchUpdateContact(apiParam: UpdateCompanyContactCommand): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_UPDATE_CONTACT,
            apiParam,
        });
    }

    public dispatchGetCreateContactModalData(): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_GET_CREATE_CONTACT_MODAL_DATA,
        });
    }

    public dispatchGetContactModalData(isGetNewData?: boolean): void {
        this.store.dispatch({
            type: ContactsStoreConstants.ACTION_GET_CONTACT_MODAL_DATA,
            isGetNewData,
        });
    }
}
