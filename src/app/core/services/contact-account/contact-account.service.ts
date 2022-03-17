import { HttpClient } from '@angular/common/http';
import {EventEmitter, Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {checkParamas} from "../../utils/methods.globals";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactAccountService {
  public emitAccountsUpdate: EventEmitter<any> = new EventEmitter();
  public emitAccountLabel: EventEmitter<any> = new EventEmitter();

  public emitContactsUpdate: EventEmitter<any> = new EventEmitter();
  public emitContactLabel: EventEmitter<any> = new EventEmitter();
  public reloadAccount: boolean;
  public reloadContact: boolean;

  public companyId = JSON.parse(localStorage.getItem('currentUser')).companyId;

  constructor(private http: HttpClient) {
  }

  public getAllItems(serviceType: string) {
    return this.http.get(
      environment.API_ENDPOINT + `company/${serviceType}/list/all/1/${environment.perPage}`
    );
  }

  public createItem(serviceType: string, data: any) {
    return this.http.post(environment.API_ENDPOINT + `company/${serviceType}`, data);
  }

  getItemDetails(serviceType: string, id) {
    return this.http.get(environment.API_ENDPOINT + `company/${serviceType}/${id}/all`);
  }

  importContacts(contact) {
    return this.http.post(environment.API_ENDPOINT + `import/b64/contact`, contact);
  }

  updateItem(serviceType, itemId, data) {
    return this.http.put(environment.API_ENDPOINT + `company/${serviceType}/${itemId}`, data);
  }

  public deleteItem(serviceType: string, id: any) {
    console.log(environment.API_ENDPOINT + `company/${serviceType}/${id}`);
    return this.http.delete(environment.API_ENDPOINT + `company/${serviceType}/${id}`);
  }

  deleteMultipleItems(serviceType: string, options) {
    return this.http.put(
      environment.API_ENDPOINT + `company/${serviceType}/multiple/delete`,
      options
    );
  }

  decryptPassword(id) {
    return this.http.get(environment.API_ENDPOINT + `company/account/password/${id}`);
  }

  getContactLabels(){
    return this.http.get(environment.API_ENDPOINT + `metadata/app/companycontactlabel/list`);
  }

  getAccountLabels(){
    return this.http.get(environment.API_ENDPOINT + `metadata/app/companyaccountlabel/list`);
  }

  getLabels() {
    return this.http.get(environment.API_ENDPOINT + `metadata/app/label/list`);
  }

  getLabelsByType(domain) {
    return this.http.get<any>(environment.API_ENDPOINT + `metadata/app/label/list`).pipe(
      map((x) => {
        return x.filter((p) => p.domain === domain);
      })
    );
  }

  deleteLabel(id) {
    return this.http.delete(environment.API_ENDPOINT + `metadata/app/label/` + id);
  }

  createLabel(data) {
    return this.http.post(environment.API_ENDPOINT + 'metadata', data);
  }

  updateLabel(data, id) {
    return this.http.put(environment.API_ENDPOINT + `metadata/app/label/` + id, data);
  }

  /* Account */
  public getAccount(pageIndex: number, pageSize: number, queryParams?: any) {
    const params = checkParamas(queryParams);

    return this.http.get(
      environment.API_ENDPOINT + `company/account/list/all/${pageIndex}/${pageSize}`,
      {
        params,
      }
    );
  }

  /* Contact */
  public getContacts(pageIndex: number, pageSize: number, queryParams?: any) {
    const params = checkParamas(queryParams);

    return this.http.get(
      environment.API_ENDPOINT + `company/contact/list/all/${pageIndex}/${pageSize}`,
      {
        params,
      }
    );
  }
}
