import { Injectable } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';

@Injectable({
    providedIn: 'root',
})
export class LoadResolver {
    constructor(private loadStoreService: LoadStoreService) {}

    resolve(): void {
        return this.loadStoreService.dispatchLoadList();
    }
}
