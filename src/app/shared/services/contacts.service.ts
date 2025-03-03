import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
export class ContactsService {
    constructor(
        private contactService: CompanyContactService,
        private companyLabelService: CompanyContactLabelService
    ) {}

    // add contact
    public addCompanyContact(
        data: CreateCompanyContactCommand
    ): Observable<CreateResponse> {
        return this.contactService.apiCompanycontactPost(data);
    }

    // update contact
    public updateCompanyContact(
        data: UpdateCompanyContactCommand,
        colors?: Array<AccountColorResponse>,
        colorLabels?: Array<CompanyAccountLabelResponse>
    ): Observable<any> {
        return this.contactService.apiCompanycontactPut(data);
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
            null,
            null,
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
    public deleteContactList(contactIds: number[]): Observable<any> {
        return this.contactService.apiCompanycontactListDelete(contactIds);
    }

    // delete contact by id
    public deleteCompanyContactById(contactId: number): Observable<any> {
        return this.contactService.apiCompanycontactIdDelete(contactId);
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
