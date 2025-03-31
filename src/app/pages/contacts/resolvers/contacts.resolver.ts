import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// store
import { ContactStoreService } from '@pages/contacts/services/contact-store.service';

// interfaces
import { IContactsInitialData } from '@pages/contacts/pages/contacts-table/interfaces'

@Injectable({
    providedIn: 'root',
})
export class ContactsResolver {
    constructor(private contactStoreService: ContactStoreService) {}
    resolve(): Observable<IContactsInitialData> {
        this.contactStoreService.dispatchInitialContactList();

        return this.contactStoreService.resolveInitialData$;
    }
}
