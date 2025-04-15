// External Libraries
import { Injectable } from '@angular/core';

// Feature Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// Enums
import { eActiveViewMode } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class MilesCardsResolver {
    constructor(private milesService: MilesStoreService) {}
    resolve(): void {
        this.milesService.dispatchSetActiveViewMode(eActiveViewMode.Card);
    }
}
