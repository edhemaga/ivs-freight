import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  ShopDetailsListState,
  ShopDetailsListStore,
} from './shop-details-list.store';

@Injectable({ providedIn: 'root' })
export class ShopDetailsListQuery extends QueryEntity<ShopDetailsListState> {
  constructor(protected shopDetailsListStore: ShopDetailsListStore) {
    super(shopDetailsListStore);
  }
}
