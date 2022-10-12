import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShopItemState, ShopItemStore } from './shop-detail.store';

@Injectable({ providedIn: 'root' })
export class ShopDetailsQuery extends QueryEntity<ShopItemState> {
  constructor(protected shopItemStore: ShopItemStore) {
    super(shopItemStore);
  }
}
