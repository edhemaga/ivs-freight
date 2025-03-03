// appcoretruckassist
import {
    CompanyContactModalResponse,
    CompanyContactResponse,
    ContactColorResponse,
    TableType,
} from 'appcoretruckassist';

// models
import { IContactState } from '@pages/contacts/pages/contacts-table/interfaces/contact-state.interface';
import { ITableColummn } from '@shared/models';
import { IContactsInitialData } from '@pages/contacts/pages/contacts-table/interfaces';

// enums
import { ContactsTableData } from '@pages/contacts/pages/contacts-table/models/contacts-table-data.model';

export const getInitialContactsPayloadSuccessResult = function (
    state: IContactState,
    inititalContactsData: IContactsInitialData
): IContactState {
    const { data: stateData } = state || {};
    const { isShowMore, contactColors, contactLabels, data, tableCount } =
        inititalContactsData || {};

    let _data: CompanyContactResponse[] = isShowMore
        ? [...stateData, ...data]
        : [...data];

    const mappedContactLabels = contactLabels.labels.map((item) => {
        return { ...item, dropLabel: true };
    });

    const mappedData = _data.map((item: ContactsTableData) => {
        return {
            ...item,
            colorLabels: mappedContactLabels,
            colorRes: contactColors,
        };
    });

    const result: IContactState = {
        ...state,
        data: mappedData,
        tableCount,
    };

    return result;
};

export const getContactsPayloadSuccessResult = function (
    state: IContactState,
    data: CompanyContactResponse[],
    tableCount: number,
    isShowMore?: boolean
): IContactState {
    const { data: stateData } = state || {};
    const _data: CompanyContactResponse[] = isShowMore
        ? [...stateData, ...data]
        : [...data];

    const result: IContactState = {
        ...state,
        data: _data,
        tableCount,
    };

    return result;
};

export const deleteContactByIdSuccessResult = function (
    state: IContactState,
    contactId: number
): IContactState {
    const { data, tableCount } = state || {};
    const updatedData = data.filter((_) => _.id !== contactId);
    const _tableCount = tableCount - 1;

    const result: IContactState = {
        ...state,
        data: updatedData,
        tableCount: _tableCount,
    };

    return result;
};

export const createContactSuccessResult = function (
    state: IContactState,
    contact: CompanyContactResponse
): IContactState {
    const { data, tableCount } = state || {};

    const result: IContactState = {
        ...state,
        data: [...data, contact],
        tableCount: tableCount + 1,
    };

    return result;
};

export const updateContactSuccessResult = function (
    state: IContactState,
    contact: CompanyContactResponse
): IContactState {
    const { data } = state || {};
    const { id } = contact || {};
    let _data: CompanyContactResponse[] = JSON.parse(JSON.stringify(data));
    const exist: boolean = data.some((_) => _.id === id);

    if (exist) {
        const updatingIndex = data.findIndex((_) => _.id === id);
        const updatingItem = contact;

        _data.splice(updatingIndex, 1, updatingItem);
    }

    const result: IContactState = {
        ...state,
        data: _data,
    };

    return result;
};

export const deleteBulkContactSuccessResult = function (
    state: IContactState,
    ids: number[]
): IContactState {
    const { data, tableCount } = state || {};
    const result: IContactState = {
        ...state,
        data: data.filter((_) => !ids.includes(_.id)),
        tableCount: tableCount - ids?.length,
    };

    return result;
};

export const tableColumnResizeResult = function (
    state: IContactState,
    columns: ITableColummn[],
    width: number,
    index: number
): IContactState {
    let _columns: ITableColummn[] = JSON.parse(
        localStorage.getItem(`table-${TableType.Contact}-Configuration`)
    );

    _columns = _columns.map((column) => {
        if (column.title === columns[index].title) {
            column.width = width;
        }

        return column;
    });

    localStorage.setItem(
        `table-${TableType.Contact}-Configuration`,
        JSON.stringify(_columns)
    );

    const result: IContactState = {
        ...state,
    };

    return result;
};
