import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { User } from '../model/auth.model';

export interface AuthState extends EntityState<User, string> {}

export function createInitialState(): AuthState {
    return {
        statistic: {
            todayObject: [],
            mtdObject: [],
            ytdObject: [], 
            allTimeObject: []
        }
    };
  }

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'auth' })
export class AuthStore extends EntityStore<AuthState> {
    constructor() {
        super(createInitialState());
    }
}