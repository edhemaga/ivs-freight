import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DriversInactiveState } from './driver-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class DriverInactiveResolver implements Resolve<DriversInactiveState> {
    constructor() {}

    resolve(): Observable<DriversInactiveState | boolean> {
        return null;
    }
}
