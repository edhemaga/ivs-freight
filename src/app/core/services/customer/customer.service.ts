import { Injectable } from '@angular/core';
import {Subject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  /* Swich */
  public tabOnCustomer: boolean;
  // Shipper
  public createShipper = new Subject<void>();
  // return shipper type instead of any when transferred
  public editShipperSubject = new Subject<any>();
  public editShipperSubjectMap = new Subject<any>();
  public shipperEdited = false;

  // Customer
  public createCustomer = new Subject<void>();
  // return customer type instead of any when transferred
  public editCustomerSubject = new Subject<any>();

  public customerEdited = false;

  constructor(private http: HttpClient) {}

  // Shipper
  get newShipper() {
    return this.createShipper;
  }

  get updateShipperSubject() {
    return this.editShipperSubject;
  }

  get updateShipperSubjectMap() {
    return this.editShipperSubjectMap;
  }

  // Customer
  get newCustomer() {
    return this.createCustomer;
  }

  get updateCustomerSubject() {
    return this.editCustomerSubject;
  }

  /* Customer */
  getCustomers() {
    return this.http.get(environment.API_ENDPOINT + 'broker/list/all/1/' + environment.perPage);
  }

  getCustomerById(id: number) {
    return this.http.get(environment.API_ENDPOINT + `broker/${id}/all`);
  }

  editCustomer(id: number) {
    return this.http.get(environment.API_ENDPOINT + `broker/${id}/all`);
  }

  addCustomer(customer) {
    return this.http.post(environment.API_ENDPOINT + 'broker', customer).pipe(
      tap(() => {
        this.createCustomer.next();
      })
    );
  }

  updateCustomer(data: any, id: number) {
    return this.http.put(environment.API_ENDPOINT + `broker/${id}`, data).pipe(
      tap(() => {
        this.editCustomerSubject.next(data);
      })
    );
  }

  deleteCustomer(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `broker/${id}`);
  }

  importBrokers(brokers) {
    return this.http.post(environment.API_ENDPOINT + `import/b64/broker`, brokers);
  }

  /* Customer Reiting */
  createCustomerReiting(data: any) {
    return this.http.post(environment.API_ENDPOINT + `broker/rating`, data);
  }

  getCustomerCommentsById(customerId: number) {
    return this.http.get(
      environment.API_ENDPOINT + `broker/rating/reviews/${customerId}/1/${environment.perPage}`
    );
  }

  getCustomerRaitingList() {
    return this.http.get(environment.API_ENDPOINT + `broker/rating/list/1/100`);
  }

  getCustomerReitingById(customerId: number) {
    return this.http.get(environment.API_ENDPOINT + `broker/rating/${customerId}`);
  }

  updateCustomerReiting(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `broker/rating/${id}`, data);
  }

  deleteCustomerReiting(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `broker/rating/${id}`);
  }

  /* Review */
  createBrokerReview(data: any) {
    return this.http.post(environment.API_ENDPOINT + `broker/review`, data);
  }

  /* Shipper reiting */
  createShipperReiting(data: any) {
    return this.http.post(environment.API_ENDPOINT + `shipper/rating`, data);
  }

  getShipperReitingList() {
    return this.http.get(environment.API_ENDPOINT + `shipper/rating/list/1/100`);
  }

  getShipperComentsById(shipperId: number) {
    return this.http.get(
      environment.API_ENDPOINT + `shipper/rating/reviews/${shipperId}/1/${environment.perPage}`
    );
  }

  updateShipperReiting(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `shipper/rating/${id}`, data);
  }

  deleteShipperReiting(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `shipper/rating/${id}`);
  }

  /* Shipper */

  getShipper() {
    return this.http.get(
      environment.API_ENDPOINT + 'shipper/list/all/' + 1 + '/' + environment.perPage
    );
  }

  editShipper(id: number) {
    return this.http.get(environment.API_ENDPOINT + `shipper/${id}/all`);
  }

  addShipper(shipper: any) {
    return this.http.post(environment.API_ENDPOINT + 'shipper', shipper).pipe(
      tap(() => {
        this.createShipper.next();
      })
    );
  }

  updateShipper(data: any, id: number, isMapedit?: boolean) {
    return this.http.put(environment.API_ENDPOINT + `shipper/${id}`, data).pipe(
      tap(() => {
        if (!isMapedit) {
          this.editShipperSubject.next(data);
        } else {
          this.editShipperSubjectMap.next({data, id});
        }
      })
    );
  }

  getShipperById(id: number) {
    return this.http.get(environment.API_ENDPOINT + `shipper/${id}/all`);
  }

  deleteShipper(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `shipper/${id}`);
  }

  importShippers(shippers) {
    return this.http.post(environment.API_ENDPOINT + `import/b64/shipper`, shippers);
  }

}
