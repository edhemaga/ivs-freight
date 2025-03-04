// store
import { createReducer, on } from '@ngrx/store';

// models
import { IContactState } from '@pages/contacts/pages/contacts-table/interfaces/contact-state.interface';

// actions
import * as ContactActions from '@pages/contacts/state/actions/contacts.action';

// enums
import { eActiveViewMode, TableStringEnum } from '@shared/enums';

// functions
import * as Functions from '@pages/contacts/utils/functions/contact-reducer.functions';

// #region initialState
export const initialState: IContactState = {
    data: null,
    colors: null,
    modal: null,

    tableCount: 0,

    selectedTab: TableStringEnum.ACTIVE,
    activeViewMode: eActiveViewMode.List
};
// #endregion

export const contactReducer = createReducer(
    initialState,

// #region GET
    on(ContactActions.getContactsPayload, (state) => ({ ...state })),
    on(ContactActions.getContactsPayloadSuccess, (state, { data, tableCount, isShowMore }) => Functions.getContactsPayloadSuccessResult(state, data, tableCount, isShowMore)),
    on(ContactActions.getContactsPayloadError, (state) => ({ ...state })),

    on(ContactActions.getInitialContacts, (state) => ({ ...state })),
    on(ContactActions.getInitialContactsSuccess, (state, { inititalContactsData }) => Functions.getInitialContactsPayloadSuccessResult(state, inititalContactsData)),
    on(ContactActions.getInitialContactsError, (state) => ({ ...state })),

    on(ContactActions.getContactColorLabelsList, (state) => ({ ...state })),
    on(ContactActions.getContactColorLabelsListSuccess, (state, { contactColors}) => ({ ...state, colors: contactColors })),
    on(ContactActions.getContactColorLabelsListError, (state) => ({ ...state })),

    on(ContactActions.getCreateContactModalData, (state) => ({ ...state })),
    on(ContactActions.getCreateContactModalDataSuccess, (state, { modal }) => ({ ...state, modal })), // add here logic for modal data
    on(ContactActions.getCreateContactModalDataError, (state) => ({ ...state })),

// #endregion

// #region CREATE
    on(ContactActions.createContact, (state) => ({ ...state })),
    on(ContactActions.createContactSuccess, (state, { contact }) => Functions.createContactSuccessResult(state, contact)),
    on(ContactActions.createContactError, (state) => ({ ...state })),
// #endregion

// #region UPDATE
    on(ContactActions.updateContact, (state) => ({ ...state })),
    on(ContactActions.updateContactSuccess, (state, { contact }) => Functions.updateContactSuccessResult(state, contact)),
    on(ContactActions.updateContactError, (state) => ({ ...state })),
// #endregion

// #region DELETE
    on(ContactActions.deleteContactById, (state) => ({ ...state })),
    on(ContactActions.deleteContactByIdSuccess, (state, { contactId }) => Functions.deleteContactByIdSuccessResult(state, contactId)),
    on(ContactActions.deleteContactByIdError, (state) => ({ ...state })),

    on(ContactActions.deleteBulkContact, (state) => ({ ...state })),
    on(ContactActions.deleteBulkContactSuccess, (state, { ids }) => Functions.deleteBulkContactSuccessResult(state, ids)),
    on(ContactActions.deleteBulkContactError, (state) => ({ ...state })),
// #endregion
    on(ContactActions.tableColumnToggle, (state) => ({ ...state })),
    on(ContactActions.tableColumnReset, (state) => ({ ...state })),
    on(ContactActions.tableColumnResize, (state, { columns, width, index }) => Functions.tableColumnResizeResult(state, columns, width, index)),
    on(ContactActions.setActiveViewMode, (state, { activeViewMode }) => ({ ...state, activeViewMode }))
);