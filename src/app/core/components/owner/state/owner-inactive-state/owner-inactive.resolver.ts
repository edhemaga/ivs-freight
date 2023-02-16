import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { OwnerInactiveState } from './owner-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class OwnerInactiveResolver implements Resolve<OwnerInactiveState> {
    constructor() {}
    resolve(): Observable<OwnerInactiveState | boolean> {
        return null;
    }
}
