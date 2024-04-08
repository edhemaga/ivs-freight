import { ContactTableData } from './contact-table-data.model';

export interface ContactsTableBodyAction {
    id?: number;
    type?: string;
    data?: ContactTableData;
}
