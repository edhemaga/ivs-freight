import { Injectable } from '@angular/core';

// Store
import { LoadDataStore } from '../store/load-modal.store';

// Model
import { CardRows } from 'src/app/core/components/shared/model/cardData';

@Injectable({ providedIn: 'root' })
export class LoadServiceModal {
    constructor(private loadDataStore: LoadDataStore) {}

    updateLoadData(data: CardRows) {
        this.loadDataStore.update(data);
    }
}
