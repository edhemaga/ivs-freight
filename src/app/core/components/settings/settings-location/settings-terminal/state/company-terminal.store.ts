import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TerminalResponse } from '../../../../../../../../appcoretruckassist/model/terminalResponse';

export interface TerminalState extends EntityState<TerminalResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'terminalStore' })
export class TerminalStore extends EntityStore<TerminalState> {
   constructor() {
      super();
   }
}
