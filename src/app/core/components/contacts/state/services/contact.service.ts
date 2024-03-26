import { Injectable } from '@angular/core';

import { Observable, forkJoin, tap } from 'rxjs';

// services
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';

// store
import { ContactQuery } from '../store/contact.query';
import { ContactStore } from '../store/contact.store';

// models
import {
    AccountColorResponse,
    CompanyAccountLabelResponse,
    CompanyContactLabelService,
    CompanyContactModalResponse,
    CompanyContactResponse,
    CompanyContactService,
    ContactColorResponse,
    CreateCompanyContactCommand,
    CreateCompanyContactLabelCommand,
    CreateResponse,
    GetCompanyContactLabelListResponse,
    GetCompanyContactListResponse,
    UpdateCompanyContactCommand,
    UpdateCompanyContactLabelCommand,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ContactTService {
    constructor(
        private contactStore: ContactStore,
        private contactQuery: ContactQuery,
        private contactService: CompanyContactService,
        private tableService: TruckassistTableService,
        private companyLabelService: CompanyContactLabelService
    ) {}

    // add contact
    public addCompanyContact(
        data: CreateCompanyContactCommand
    ): Observable<CreateResponse> {
        return this.contactService.apiCompanycontactPost(data).pipe(
            tap((res) => {
                this.getCompanyContactById(res.id).subscribe({
                    next: (contact: CompanyContactResponse) => {
                        forkJoin([
                            this.companyContactLabelsColorList(),
                            this.getCompanyContactModal(),
                        ])
                            .pipe(
                                tap(([colorRes, { labels }]) => {
                                    labels = labels.map((label) => {
                                        return {
                                            ...label,
                                            dropLabel: true,
                                        };
                                    });

                                    const newContact = {
                                        ...contact,
                                        colorLabels: labels,
                                        colorRes,
                                    };

                                    const contactCount = JSON.parse(
                                        localStorage.getItem(
                                            'contactTableCount'
                                        )
                                    );

                                    contactCount.contact++;

                                    localStorage.setItem(
                                        'contactTableCount',
                                        JSON.stringify({
                                            contact: contactCount.contact,
                                        })
                                    );

                                    this.tableService.sendActionAnimation({
                                        animation: 'add',
                                        data: contact,
                                        id: contact.id,
                                    });

                                    this.contactStore.add(newContact);
                                })
                            )
                            .subscribe();
                    },
                });
            })
        );
    }

    // update contact
    public updateCompanyContact(
        data: UpdateCompanyContactCommand,
        colors?: Array<AccountColorResponse>,
        colorLabels?: Array<CompanyAccountLabelResponse>
    ): Observable<any> {
        return this.contactService.apiCompanycontactPut(data).pipe(
            tap(() => {
                const subContact = this.getCompanyContactById(
                    data.id
                ).subscribe({
                    next: (contact: CompanyContactResponse | any) => {
                        this.contactStore.remove(({ id }) => id === data.id);
                        colors && (contact.colorRes = colors);
                        colorLabels && (contact.colorLabels = colorLabels);
                        this.contactStore.add(contact);

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: contact,
                            id: contact.id,
                        });

                        subContact.unsubscribe();
                    },
                });
            })
        );
    }

    // get contact by id
    public getCompanyContactById(
        id: number
    ): Observable<CompanyContactResponse> {
        return this.contactService.apiCompanycontactIdGet(id);
    }

    // get contacts list
    public getContacts(
        labelId?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<GetCompanyContactListResponse> {
        return this.contactService.apiCompanycontactListGet(
            labelId,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    // company contact modal
    public getCompanyContactModal(): Observable<CompanyContactModalResponse> {
        return this.contactService.apiCompanycontactModalGet();
    }

    // delete contact list
    public deleteAccountList(contactIds: number[]): Observable<any> {
        return this.contactService.apiCompanycontactListDelete(contactIds).pipe(
            tap(() => {
                for (let i = 0; i < contactIds.length; i++) {
                    this.contactStore.remove(({ id }) => id === contactIds[i]);

                    const contactCount = JSON.parse(
                        localStorage.getItem('contactTableCount')
                    );

                    contactCount.contact--;

                    localStorage.setItem(
                        'contactTableCount',
                        JSON.stringify({
                            contact: contactCount.contact,
                        })
                    );

                    this.tableService.sendActionAnimation({
                        animation: 'delete',
                        id: contactIds[i],
                    });
                }
            })
        );
    }

    // delete contact by id
    public deleteCompanyContactById(contactId: number): Observable<any> {
        return this.contactService.apiCompanycontactIdDelete(contactId).pipe(
            tap(() => {
                this.contactStore.remove(({ id }) => id === contactId);

                const contactCount = JSON.parse(
                    localStorage.getItem('contactTableCount')
                );

                contactCount.contact--;

                localStorage.setItem(
                    'contactTableCount',
                    JSON.stringify({
                        contact: contactCount.contact,
                    })
                );

                this.tableService.sendActionAnimation({
                    animation: 'delete',
                    id: contactId,
                });
            })
        );
    }

    // --------------------- Contact LABEL ---------------------
    public companyContactLabelsColorList(): Observable<
        Array<ContactColorResponse>
    > {
        return this.companyLabelService.apiCompanycontactlabelColorListGet();
    }

    public companyContactLabelsList(): Observable<GetCompanyContactLabelListResponse> {
        return this.companyLabelService.apiCompanycontactlabelListGet();
    }

    public addCompanyContactLabel(
        data: CreateCompanyContactLabelCommand
    ): Observable<CreateResponse> {
        return this.companyLabelService.apiCompanycontactlabelPost(data);
    }

    public updateCompanyContactLabel(
        data: UpdateCompanyContactLabelCommand
    ): Observable<any> {
        return this.companyLabelService.apiCompanycontactlabelPut(data);
    }
}
