import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ShopState } from './shop.store';

@Injectable({
    providedIn: 'root',
})
export class ShopResolver implements Resolve<ShopState> {
    constructor() {}

    resolve(): Observable<any> {
        return null;
    }
}
