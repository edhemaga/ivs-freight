import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    LoadTemplateState,
    LoadTemplateStore,
} from '@pages/load/state/load-template-state/load-template.store';

@Injectable({ providedIn: 'root' })
export class LoadTemplateQuery extends QueryEntity<LoadTemplateState> {
    constructor(protected loadTemplateStore: LoadTemplateStore) {
        super(loadTemplateStore);
    }
}
