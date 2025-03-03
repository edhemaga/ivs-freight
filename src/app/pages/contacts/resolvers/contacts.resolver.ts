import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// store
import { ContactStoreService } from '../services/contact-store.service';

@Injectable({
    providedIn: 'root',
})
export class ContactsResolver {
    constructor(private contactStoreService: ContactStoreService) {}
    resolve(): Observable<any> {
        this.contactStoreService.dispatchInitialContactList();

        return this.contactStoreService.resolveInitialData$;
    }
}
