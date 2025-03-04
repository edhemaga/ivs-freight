import { createFeatureSelector, createSelector } from '@ngrx/store';

// models
import { ITableData } from '@shared/models/table-data.model';
import { ITableOptions } from '@shared/models';
import { IContactState } from '@pages/contacts/pages/contacts-table/interfaces/contact-state.interface';

// enums
import { eActiveViewMode, TableStringEnum } from '@shared/enums';

// helpers
import { ContactStoreHelper } from '@pages/contacts/utils/helpers/contact-store.helper';
import { ContactsStringEnum } from '@pages/contacts/enums/contacts-string.enum';
import { getToolsContactsColumnDefinition } from '@shared/utils/settings/table-settings/contacts-columns';

export const contactFeatureKey: string = 'contact';

export const contactState =
    createFeatureSelector<IContactState>(contactFeatureKey);

export const getContactListSelector = createSelector(contactState, (state) => {
    const { data, tableCount, selectedTab } = state || {};

    return {
        data,
        tableCount,
        selectedTab,
    };
});

export const getSelector = createSelector(
    getContactListSelector,
    (contacts: { data; tableCount; selectedTab }) => {
        return { ...contacts };
    }
);

export const viewDataSelector = createSelector(getSelector, ({ data }) => {
    if (!data) return [];

    return data.map((rowData) => {
        return ContactStoreHelper.mapContactData(rowData);
    });
});

export const selectedTabSelector = createSelector(
    getSelector,
    ({ selectedTab }) => {
        return selectedTab;
    }
);

export const activeViewModeSelector = createSelector(contactState, (state) => {
    const { activeViewMode } = state || {};
    return eActiveViewMode[activeViewMode];
});

export const tableDataSelector = createSelector(
    getSelector,
    ({ data, tableCount }) => {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(
                `table-${ContactsStringEnum.CONTACT}-Configuration`
            )
        );

        const tableData: ITableData[] = [
            {
                title: ContactsStringEnum.CONTACTS,
                field: TableStringEnum.ACTIVE,
                length: tableCount,
                data: data,
                extended: false,
                gridNameTitle: ContactsStringEnum.CONTACT_2,
                stateName: ContactsStringEnum.CONTACTS_2,
                tableConfiguration: ContactsStringEnum.CONTACT,
                isActive: true,
                gridColumns:
                    tableColumnsConfig ?? getToolsContactsColumnDefinition(),
            },
        ];

        return tableData;
    }
);

export const columnsSelector = createSelector(
    tableDataSelector,
    selectedTabSelector,
    (tableData, selectedTab) => {
        const selectedTabLowerCase = selectedTab.toLowerCase();
        const tableDataSelectedItem = tableData?.find(
            (item) => item.field === selectedTabLowerCase
        );
        const { gridColumns } = tableDataSelectedItem || {};

        return gridColumns ?? [];
    }
);

export const tableOptionsSelector = createSelector(
    activeViewModeSelector,
    (activeViewMode) => {
        const tableOptions: ITableOptions = {
            toolbarActions: {
                hideActivationButton: true,
                showLabelFilter: true,
                viewModeOptions: [
                    {
                        name: TableStringEnum.LIST,
                        active: activeViewMode === TableStringEnum.LIST,
                    },
                    {
                        name: TableStringEnum.CARD,
                        active: activeViewMode === TableStringEnum.CARD,
                    },
                ],
            },
        };

        return tableOptions;
    }
);

export const modalDataSelector = createSelector(contactState, (state) => {
    const { modal } = state;

    return modal;
});

export const contactLabelsColorSelector = createSelector(
    contactState,
    (state) => {
        const { colors } = state;

        return colors;
    }
);
