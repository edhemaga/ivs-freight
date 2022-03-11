import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';
import { ISettings } from './settings.model';
import { SettingsState, SettingsStore } from './settings.store';

@Injectable({
  providedIn: 'root',
})
export class SettingsQuery extends QueryEntity<SettingsState, ISettings> {
  constructor(protected store: SettingsStore) {
    super(store);
  }
}
