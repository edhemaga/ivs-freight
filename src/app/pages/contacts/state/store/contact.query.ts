import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ContactState, ContactStore } from './contact.store';

@Injectable({ providedIn: 'root' })
export class ContactQuery extends QueryEntity<ContactState> {
    constructor(protected contactStore: ContactStore) {
        super(contactStore);
    }
}
