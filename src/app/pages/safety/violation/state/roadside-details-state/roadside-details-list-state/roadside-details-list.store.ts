import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RoadsideInspectionResponse } from '../../../../../../../../../appcoretruckassist/model/roadsideInspectionResponse';

export interface RoadsideDetailsListState
    extends EntityState<RoadsideInspectionResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'roadsideDetailsList' })
export class RoadsideDetailsListStore extends EntityStore<RoadsideDetailsListState> {
    constructor() {
        super();
    }
}
