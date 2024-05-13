import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable } from 'rxjs';

// Store
import { RepairTrailerState } from '@pages/repair/state/repair-trailer-state/repair-trailer.store';

@Injectable({
    providedIn: 'root',
})
export class RepairTrailerResolver implements Resolve<RepairTrailerState> {
    constructor() {}

    resolve(): Observable<any> {
        return null;
    }
}
