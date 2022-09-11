import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OfficeState, OfficeStore } from './company-office.store';

@Injectable({ providedIn: 'root' })
export class OfficeQuery extends QueryEntity<OfficeState> {
  constructor(protected officeStore: OfficeStore) {
    super(officeStore);
  }
}
