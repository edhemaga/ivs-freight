import { RepairShopResponse } from './../../../../../../appcoretruckassist/model/repairShopResponse';

import { Injectable } from '@angular/core';
import { RepairShopService } from 'appcoretruckassist';
import { Observable} from 'rxjs';
import { ShopStore } from './shop.store';



@Injectable({
  providedIn: 'root',
})
export class ShopTService {
  constructor(private shopServices: RepairShopService, private shopStore:ShopStore) {}


  public getRepairShopById(id:number): Observable<RepairShopResponse>{
       return this.shopServices.apiRepairshopIdGet(id);
  }
}
