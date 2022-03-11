import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SettingsStore } from './settings.store';

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {

  public noDataSubject$ = new BehaviorSubject<boolean>(false);

  constructor(private settingsStore: SettingsStore, private http: HttpClient) {}

}
