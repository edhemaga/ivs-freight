import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CompanyContactResponse } from 'appcoretruckassist';

export interface RoadsideActiveState extends EntityState<CompanyContactResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'roadsideActive' })
export class RoadsideActiveStore extends EntityStore<RoadsideActiveState> {
  constructor() {
    super();
  }
}
