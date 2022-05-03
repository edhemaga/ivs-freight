import { Injectable } from '@angular/core';
import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { TruckInterface } from './truck.modal';
export interface TruckState extends EntityState<TruckInterface,number>{}

@Injectable({providedIn:'root'})
@StoreConfig({name:'trucks'})
export class TruckStore extends EntityStore<TruckState>{
    constructor(){
        super();
    }
}