import { ContactsPhoneType } from '@pages/contacts/pages/contacts-table/models/contacts-phone-type.model';

export interface ContactsPhone {
    id?: number;
    phone?: string;
    phoneExt?: string;
    contactPhoneType?: ContactsPhoneType;
    primary?: boolean;
}
