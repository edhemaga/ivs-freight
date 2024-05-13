import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable } from 'rxjs';

// store
import { DriversInactiveState } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class DriverInactiveResolver implements Resolve<DriversInactiveState> {
    constructor() {}

    resolve(): Observable<DriversInactiveState | boolean> {
        return null;
    }
}
