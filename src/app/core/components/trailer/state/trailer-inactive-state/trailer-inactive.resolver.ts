import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TrailerInactiveState } from './trailer-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class TrailerInactiveResolver implements Resolve<TrailerInactiveState> {
    constructor() {}
    resolve(): Observable<TrailerInactiveState | boolean> {
        return null;
    }
}
