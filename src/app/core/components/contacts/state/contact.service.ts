import { Injectable } from '@angular/core';
import {
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
import { Observable, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ContactQuery } from './contact-state/contact.query';
import { ContactStore } from './contact-state/contact.store';

@Injectable({
  providedIn: 'root',
})
export class ContactTService {
  constructor(
    private contactService: CompanyContactService,
    private contactStore: ContactStore,
    private contactQuery: ContactQuery,
    private tableService: TruckassistTableService,
    private companyLabelService: CompanyContactLabelService
  ) {}

  // Add Contact
  public addCompanyContact(
    data: CreateCompanyContactCommand
  ): Observable<CreateResponse> {
    return this.contactService.apiCompanycontactPost(data).pipe(
      tap((res: any) => {
        const subContact = this.getCompanyContactById(res.id).subscribe({
          next: (contact: CompanyContactResponse | any) => {
            this.contactStore.add(contact);

            const contactCount = JSON.parse(
              localStorage.getItem('contactTableCount')
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

            subContact.unsubscribe();
          },
        });
      })
    );
  }

  // Update Contact
  public updateCompanyContact(
    data: UpdateCompanyContactCommand
  ): Observable<any> {
    return this.contactService.apiCompanycontactPut(data).pipe(
      tap(() => {
        const subContact = this.getCompanyContactById(data.id).subscribe({
          next: (contact: CompanyContactResponse | any) => {
            this.contactStore.remove(({ id }) => id === data.id);

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

  // Get Contact By Id
  public getCompanyContactById(id: number): Observable<CompanyContactResponse> {
    return this.contactService.apiCompanycontactIdGet(id);
  }

  // Get Contacts List
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

  // Company Contact Modal
  public getCompanyContactModal(): Observable<CompanyContactModalResponse> {
    return this.contactService.apiCompanycontactModalGet();
  }

  // Delete Contact List
  public deleteAccountList(contactsToDelete: any[]): Observable<any> {
    let deleteOnBack = contactsToDelete.map((owner: any) => {
      return owner.id;
    });

    return this.contactService.apiCompanycontactListDelete(deleteOnBack).pipe(
      tap(() => {
        let storeContacts = this.contactQuery.getAll();
        let countDeleted = 0;

        storeContacts.map((contact: any) => {
          deleteOnBack.map((d) => {
            if (d === contact.id) {
              this.contactStore.remove(({ id }) => id === contact.id);
              countDeleted++;
            }
          });
        });

        localStorage.setItem(
          'contactTableCount',
          JSON.stringify({
            contact: storeContacts.length - countDeleted,
          })
        );
      })
    );
  }

  // Delete Contact By Id
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
