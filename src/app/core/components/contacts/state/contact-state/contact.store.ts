import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CompanyContactResponse } from 'appcoretruckassist';

export interface ContactState
    extends EntityState<CompanyContactResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'contact' })
export class ContactStore extends EntityStore<ContactState> {
    constructor() {
        super();
    }
}
