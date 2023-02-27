import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { RepairTrailerState } from './repair-trailer.store';

@Injectable({
    providedIn: 'root',
})
export class RepairTrailerResolver implements Resolve<RepairTrailerState> {
    constructor() {}

    resolve(): Observable<any> {
        return null;
    }
}
