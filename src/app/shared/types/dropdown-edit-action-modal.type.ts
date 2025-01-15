import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';

export type DropdownEditActionModal =
    | AccountModalComponent
    | ContactsModalComponent
    | OwnerModalComponent;
