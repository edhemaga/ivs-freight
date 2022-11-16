import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { OwnerResponse } from 'appcoretruckassist';

export interface OwnerActiveState extends EntityState<OwnerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ownerActive' })
export class OwnerActiveStore extends EntityStore<OwnerActiveState> {
  constructor() {
    super();
  }
}
