import { ContactsEmailType } from '@pages/contacts/pages/contacts-table/models/contacts-email-type.model';

export interface ContactsEmail {
    id?: number;
    email?: string;
    contactEmailType?: ContactsEmailType;
    primary?: boolean;
}
