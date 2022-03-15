import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { User } from '../model/auth.model';

export interface AuthState extends EntityState<User, string> {}

export function createInitialState(): AuthState { 
    return {
        loggedUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null,
        token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
        userCompany: localStorage.getItem('userCompany') ? JSON.parse(localStorage.getItem('userCompany')) : null
    } 
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