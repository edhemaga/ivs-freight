import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class integrationResolver implements Resolve<any> {
    constructor() {}

    resolve(): Observable<any> {
        console.log('hi');
        return;
    }
}
