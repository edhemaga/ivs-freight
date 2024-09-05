import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

// services
import { LoadService } from '@shared/services/load.service';

// store
import { LoadPandingState } from '@pages/load/state/load-pending-state/load-pending.store';

@Injectable({
    providedIn: 'root',
})
export class LoadPendingResolver {
    constructor(private loadService: LoadService) {}

    resolve(): Observable<LoadPandingState | boolean> {
        return this.loadService.getPendingData();
    }
}
