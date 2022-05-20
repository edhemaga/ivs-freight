import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShopState, ShopStore } from './shop.store';

@Injectable({ providedIn: 'root' })
export class ShopQuery extends QueryEntity<ShopState> {
  constructor(protected shopStore: ShopStore) {
    super(shopStore);
  }
  }