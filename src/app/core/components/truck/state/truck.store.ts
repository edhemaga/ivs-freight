import { TruckShortResponse } from './../../../../../../appcoretruckassist/model/truckShortResponse';
import { Injectable } from '@angular/core';
import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
export interface TruckState extends EntityState<TruckShortResponse[],number>{}

@Injectable({providedIn:'root'})
@StoreConfig({name:'trucks'})
export class TruckStore extends EntityStore<TruckState>{
    constructor(){
        super();
    }
}