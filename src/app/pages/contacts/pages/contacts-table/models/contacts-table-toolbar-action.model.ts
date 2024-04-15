import { ContactColumn } from '@pages/contacts/pages/contacts-table/models/contact-column.model';

export interface ContactsTableToolbarAction {
    mode?: string;
    action?: string;
    tabData?: ContactColumn;
}
