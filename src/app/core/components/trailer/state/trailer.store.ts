import { TrailerShortResponse } from './../../../../../../appcoretruckassist/model/trailerShortResponse';
import { Injectable } from '@angular/core';
import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
export interface TrailerState extends EntityState<TrailerShortResponse,number>{}

@Injectable({providedIn:'root'})
@StoreConfig({name:'trailers'})
export class TrailerStore extends EntityStore<TrailerState>{
    constructor(){
        super();
    }
}