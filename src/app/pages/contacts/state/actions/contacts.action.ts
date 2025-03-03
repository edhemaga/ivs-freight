import { createAction, props } from '@ngrx/store';

// models
import {
    CompanyContactModalResponse,
    CompanyContactResponse,
    ContactColorResponse,
    CreateCompanyContactCommand,
    UpdateCompanyContactCommand,
} from 'appcoretruckassist';
import { Column, ICurrentSearchTableData, ITableColummn } from '@shared/models';

// constants
import { ContactsStoreConstants } from '@pages/contacts/utils/constants';

// enums
import { eActiveViewMode } from '@shared/enums';
import { ContactsBackFilter } from '@pages/contacts/pages/contacts-table/models/contacts-back-filter.model';


// #region contactList
export const getContactsPayload = createAction(
    ContactsStoreConstants.ACTION_GET_TABLE_COMPONENT_CONTACT_LIST,
    props<{ onSearch?: ContactsBackFilter; showMore?: boolean }>()
);

export const getContactsPayloadSuccess = createAction(
    ContactsStoreConstants.ACTION_GET_TABLE_COMPONENT_CONTACT_LIST_SUCCESS,
    props<{
        data: CompanyContactResponse[];
        tableCount: number;
        showMore?: boolean;
    }>()
);

export const getContactsPayloadError = createAction(
    ContactsStoreConstants.ACTION_GET_TABLE_COMPONENT_CONTACT_LIST_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region contactListInitial
export const getInitialContacts = createAction(
    ContactsStoreConstants.ACTION_GET_TABLE_COMPONENT_INITIAL_CONTACT_LIST,
    props<{ showMore?: boolean; onSearch?: ICurrentSearchTableData }>()
);

export const getInitialContactsSuccess = createAction(
    ContactsStoreConstants.ACTION_GET_TABLE_COMPONENT_INITIAL_CONTACT_LIST_SUCCESS,
    props<{
        data: CompanyContactResponse[];
        contactColors: ContactColorResponse[];
        contactLabels: CompanyContactModalResponse;
        tableCount: number;
        showMore?: boolean;
    }>()
);

export const getInitialContactsError = createAction(
    ContactsStoreConstants.ACTION_GET_TABLE_COMPONENT_INITIAL_CONTACT_LIST_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getContactColorLabelsList
export const getContactColorLabelsList = createAction(
    ContactsStoreConstants.ACTION_GET_CONTACT_COLOR_LABELS_LIST
);

export const getContactColorLabelsListSuccess = createAction(
    ContactsStoreConstants.ACTION_GET_CONTACT_COLOR_LABELS_LIST_SUCCESS,
    props<{
        contactColors: ContactColorResponse[];
    }>()
);

export const getContactColorLabelsListError = createAction(
    ContactsStoreConstants.ACTION_GET_TABLE_COMPONENT_INITIAL_CONTACT_LIST_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getCreateContactModalData
export const getCreateContactModalData = createAction(
    ContactsStoreConstants.ACTION_GET_CREATE_CONTACT_MODAL_DATA
);

export const getCreateContactModalDataSuccess = createAction(
    ContactsStoreConstants.ACTION_GET_CREATE_CONTACT_MODAL_DATA_SUCCESS,
    props<{ modal: CompanyContactModalResponse }>()
);

export const getCreateContactModalDataError = createAction(
    ContactsStoreConstants.ACTION_GET_CREATE_CONTACT_MODAL_DATA_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region getContactModalData
export const getContactModalData = createAction(
    ContactsStoreConstants.ACTION_GET_CONTACT_MODAL_DATA,
    props<{ isGetNewData?: boolean }>()
);

export const getContactModalDataSuccess = createAction(
    ContactsStoreConstants.ACTION_GET_CONTACT_MODAL_DATA_SUCCESS,
    props<{ modal: CompanyContactModalResponse }>()
);

export const getContactModalDataError = createAction(
    ContactsStoreConstants.ACTION_GET_CONTACT_MODAL_DATA_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region tableColumnToggle
export const tableColumnToggle = createAction(
    ContactsStoreConstants.ACTION_TABLE_COLUMN_TOGGLE,
    props<{ column: Column }>()
);
// #endregion

// // #region tableColumnResize
export const tableColumnResize = createAction(
    ContactsStoreConstants.ACTION_RESIZE_COLUMN,
    props<{ columns: ITableColummn[]; width: number; index: number }>()
);
// // #endregion

// // #region tableColumnReset
export const tableColumnReset = createAction(
    ContactsStoreConstants.ACTION_RESET_COLUMNS
);
// // #endregion

// #region setActiveViewMode
export const setActiveViewMode = createAction(
    ContactsStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
    props<{ activeViewMode: eActiveViewMode }>()
);
// #endregion

// #region createContact
export const createContact = createAction(
    ContactsStoreConstants.ACTION_CREATE_CONTACT,
    props<{ apiParam: CreateCompanyContactCommand }>()
);

export const createContactSuccess = createAction(
    ContactsStoreConstants.ACTION_CREATE_CONTACT_SUCCESS,
    props<{ contact: CompanyContactResponse }>()
);

export const createContactError = createAction(
    ContactsStoreConstants.ACTION_CREATE_CONTACT_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region updateContact
export const updateContact = createAction(
    ContactsStoreConstants.ACTION_UPDATE_CONTACT,
    props<{ apiParam: UpdateCompanyContactCommand }>()
);

export const updateContactSuccess = createAction(
    ContactsStoreConstants.ACTION_UPDATE_CONTACT_SUCCESS,
    props<{ contact: CompanyContactResponse }>()
);

export const updateContactError = createAction(
    ContactsStoreConstants.ACTION_UPDATE_CONTACT_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region deleteContactById
export const deleteContactById = createAction(
    ContactsStoreConstants.ACTION_DELETE_CONTACT_BY_ID,
    props<{ apiParam: number }>()
);

export const deleteContactByIdSuccess = createAction(
    ContactsStoreConstants.ACTION_DELETE_CONTACT_BY_ID_SUCCESS,
    props<{ contactId: number }>()
);

export const deleteContactByIdError = createAction(
    ContactsStoreConstants.ACTION_DELETE_CONTACT_BY_ID_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region deleteBulkContact
export const deleteBulkContact = createAction(
    ContactsStoreConstants.ACTION_DELETE_BULK_CONTACT,
    props<{ apiParam: number[] }>()
);

export const deleteBulkContactSuccess = createAction(
    ContactsStoreConstants.ACTION_DELETE_BULK_CONTACT_SUCCESS,
    props<{ ids: number[] }>()
);

export const deleteBulkContactError = createAction(
    ContactsStoreConstants.ACTION_DELETE_BULK_CONTACT_ERROR,
    props<{ error: Error }>()
);
// #endregion
