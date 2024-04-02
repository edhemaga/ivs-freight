import { ContactsPhoneType } from './contacts-phone-type.model';

export interface ContactsPhone {
    id?: number;
    phone?: string;
    phoneExt?: string;
    contactPhoneType?: ContactsPhoneType;
    primary?: boolean;
}
