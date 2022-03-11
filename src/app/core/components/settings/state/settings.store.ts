import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ISettings } from './settings.model';

export interface SettingsState extends EntityState<ISettings, string> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'settings' })
export class SettingsStore extends EntityStore<SettingsState> {
  constructor() {
    super();
  }
}
