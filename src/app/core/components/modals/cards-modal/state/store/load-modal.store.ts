import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface MyData {
    numberOfRows: number;
    checked: boolean;
    selectedTitle_0: string;
    selectedTitle_1: string;
    selectedTitle_2: string;
    selectedTitle_3: string;
    selectedTitle_4: string;
    selectedTitle_5: string;
    selectedTitle_back_0: string[];
    selectedTitle_back_1: string[];
    selectedTitle_back_2: string[];
    selectedTitle_back_3: string[];
    selectedTitle_back_4: string[];
    selectedTitle_back_5: string[];
}

export interface LoadDataState extends EntityState<any> {}

export const initialState = (): LoadDataState => {
    return {
        template: null,
        pending: null,
        active: null,
        closed: null,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'LoadData' })
export class LoadDataStore extends EntityStore<LoadDataState, any> {
    constructor() {
        super(initialState());
    }
}
