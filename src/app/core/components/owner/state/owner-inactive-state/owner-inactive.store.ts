import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { OwnerResponse } from 'appcoretruckassist';

export interface OwnerInactiveState
  extends EntityState<OwnerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ownerInactive' })
export class OwnerInactiveStore extends EntityStore<OwnerInactiveState> {
  constructor() {
    super();
  }
}
