import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShopStore } from './shop.store';
import { RepairShopResponse } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class ShopQuery extends QueryEntity<RepairShopResponse> {
    constructor(protected shopStore: ShopStore) {
        super(shopStore);
    }
}
