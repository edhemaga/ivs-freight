import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  public newMaintenance: boolean;
  public newShopOrEdit: boolean;
  public tabShop: boolean;
  public loadChange: boolean;
  public reloadAddRepair: boolean;

  private shop = new BehaviorSubject<any>([]);
  public currentShop = this.shop.asObservable();

  private deletedShop = new BehaviorSubject<any>([]);
  public currentDeletedShop = this.deletedShop.asObservable();

  constructor(private http: HttpClient) {
  }

  public sendShopData(data: any) {
    this.shop.next(data);
  }

  public sendDeletedShop(data: any) {
    this.deletedShop.next({data, check: true});
  }

  public getMaintenance() {
    return this.http.get(
      environment.API_ENDPOINT + 'maintenance/list/all/1/' + environment.perPage
    );
  }
}
