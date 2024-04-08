import { ContactColumn } from './contact-column.model';

export interface ContactsTableToolbarAction {
    mode?: string;
    action?: string;
    tabData?: ContactColumn;
}
