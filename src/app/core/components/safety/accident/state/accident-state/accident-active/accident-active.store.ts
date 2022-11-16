import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AccidentShortResponse, CompanyContactResponse } from 'appcoretruckassist';

export interface AccidentActiveState extends EntityState<AccidentShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'accidentActive' })
export class AccidentActiveStore extends EntityStore<AccidentActiveState> {
  constructor() {
    super();
  }
}
