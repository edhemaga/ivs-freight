import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { IContactsStore } from '../models/contacts-store.model';

export interface ContactsState extends EntityState<IContactsStore> {}

export const initialState = (): ContactsState => {
    return {
        contactsData: null,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'contacts' })
export class ContactsStore extends EntityStore<ContactsState> {
    constructor() {
        super(initialState());
    }
}
