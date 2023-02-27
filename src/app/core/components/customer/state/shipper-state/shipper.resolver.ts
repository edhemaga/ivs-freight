import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ShipperState } from './shipper.store';

@Injectable({
    providedIn: 'root',
})
export class ShipperResolver implements Resolve<ShipperState> {
    constructor() {}
    resolve(): Observable<any> {
        return null;
    }
}
