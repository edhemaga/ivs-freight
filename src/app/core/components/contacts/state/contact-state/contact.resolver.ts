import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetCompanyContactListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContactTService } from '../contact.service';
import { ContactState, ContactStore } from './contact.store';

@Injectable({
  providedIn: 'root',
})
export class ContactResolver implements Resolve<ContactState> {
  constructor(
    private contactService: ContactTService,
    private contactStore: ContactStore
  ) {}
  resolve(): Observable<ContactState | boolean> {
    return this.contactService
    .getContacts(null, 1, 25)
    .pipe(
      catchError(() => {
        return of('No contact data...');
      }),
      tap((contactPagination: GetCompanyContactListResponse) => {
        localStorage.setItem(
          'contactTableCount',
          JSON.stringify({
            contact: contactPagination.count,
          })
        );
        
        this.contactStore.set(contactPagination.pagination.data);
      })
    );
  }
}
