import { Injectable } from '@angular/core';

import { forkJoin, Observable, tap } from 'rxjs';

// services
import { ContactsService } from '@shared/services/contacts.service';

// store
import { ContactStore } from '@pages/contacts/state/contact.store';

// models
import { ContactsTableData } from '@pages/contacts/pages/contacts-table/models/contacts-table-data.model';

@Injectable({
    providedIn: 'root',
})
export class ContactsResolver {
    constructor(
        private contactService: ContactsService,
        private contactStore: ContactStore
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.contactService.getContacts(null, 1, 25),
            this.contactService.companyContactLabelsColorList(),
            this.contactService.getCompanyContactModal(),
        ]).pipe(
            tap(([contactPagination, colorRes, contactLabels]) => {
                localStorage.setItem(
                    'contactTableCount',
                    JSON.stringify({
                        contact: contactPagination.count,
                    })
                );

                const mappedContactLabels = contactLabels.labels.map((item) => {
                    return { ...item, dropLabel: true };
                });

                const contactTableData = contactPagination.pagination.data;

                contactTableData.map(
                    (e: ContactsTableData) => (
                        (e.colorRes = colorRes),
                        (e.colorLabels = mappedContactLabels)
                    )
                );

                this.contactStore.set(contactTableData);
            })
        );
    }
}
