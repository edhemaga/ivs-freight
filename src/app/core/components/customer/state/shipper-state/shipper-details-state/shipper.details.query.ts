import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShipperItemState, ShipperItemStore } from './shipper-details.store';

@Injectable({ providedIn: 'root' })
export class ShipperDetailsQuery extends QueryEntity<ShipperItemState> {
   constructor(protected shipperItemStore: ShipperItemStore) {
      super(shipperItemStore);
   }
}
