import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    ContactState,
    ContactStore,
} from '@pages/contacts/state_old/contact.store';

@Injectable({ providedIn: 'root' })
export class ContactQuery extends QueryEntity<ContactState> {
    constructor(protected contactStore: ContactStore) {
        super(contactStore);
    }
}
