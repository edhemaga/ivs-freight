import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LoadTemplateResponse } from 'appcoretruckassist';

export interface LoadTemplateState
  extends EntityState<LoadTemplateResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'loadTemplate' })
export class LoadTemplateStore extends EntityStore<LoadTemplateState> {
  constructor() {
    super();
  }
}
