import { Injectable } from '@angular/core';
import { LoadDataStore } from '../store/load-modal.store';
import { MyData } from '../store/load-modal.store';

@Injectable({ providedIn: 'root' })
export class LoadServiceModal {
    constructor(private loadDataStore: LoadDataStore) {}

    updateLoadData(data: MyData) {
        this.loadDataStore.update(data);
    }
}
