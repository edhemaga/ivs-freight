import { ContactTableData } from '@pages/contacts/pages/contacts-table/models/contact-table-data.model';

export interface ContactsTableBodyAction {
    id?: number;
    type?: string;
    data?: ContactTableData;
}
