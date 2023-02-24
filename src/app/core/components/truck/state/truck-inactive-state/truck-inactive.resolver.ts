import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TruckInactiveState } from './truck-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class TruckInactiveResolver implements Resolve<TruckInactiveState> {
    constructor() {}

    resolve(): Observable<TruckInactiveState | boolean> {
        return null;
    }
}
