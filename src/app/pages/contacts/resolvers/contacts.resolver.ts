import { Injectable } from '@angular/core';


import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ContactsService } from '@shared/services/contacts.service';

// store
import {
    ContactState,
    ContactStore,
} from '@pages/contacts/state/contact.store';

// models
import { ContactsTableData } from '@pages/contacts/pages/contacts-table/models/contacts-table-data.model';

@Injectable({
    providedIn: 'root',
})
export class ContactsResolver  {
    constructor(
        private contactService: ContactsService,
        private contactStore: ContactStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.contactService.getContacts(null, 1, 25),
            this.tableService.getTableConfig(19),
            this.contactService.companyContactLabelsColorList(),
            this.contactService.getCompanyContactModal(),
        ]).pipe(
            tap(([contactPagination, tableConfig, colorRes, contactLabels]) => {
                localStorage.setItem(
                    'contactTableCount',
                    JSON.stringify({
                        contact: contactPagination.count,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

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
