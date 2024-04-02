import { ContactsEmailType } from './contacts-email-type.model';

export interface ContactsEmail {
    id?: number;
    email?: string;
    contactEmailType?: ContactsEmailType;
    primary?: boolean;
}
