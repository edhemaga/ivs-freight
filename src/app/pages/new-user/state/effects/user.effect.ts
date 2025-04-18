// Modules
import { Injectable } from '@angular/core';

// Store
import { Store } from '@ngrx/store';

@Injectable()
export class UserEffects {
    constructor(private store: Store) {}
}
