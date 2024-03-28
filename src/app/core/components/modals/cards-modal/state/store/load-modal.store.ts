import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// model
import { DisplayLoadConfiguration } from 'src/app/pages/load/load-card-data';
import { CardRows } from 'src/app/core/components/shared/model/card-data.model';
import { ModalModelData } from '../../models/modal-input.model';

export interface LoadDataState extends EntityState<CardRows> {}

export const initialState = (): LoadDataState => {
    const template: ModalModelData = {
        numberOfRows: 4,
        checked: true,
        front_side: DisplayLoadConfiguration.displayRowsFrontTemplate,
        back_side: DisplayLoadConfiguration.displayRowsBackTemplate,
    };

    const pending: ModalModelData = {
        numberOfRows: 4,
        checked: true,
        front_side: DisplayLoadConfiguration.displayRowsFrontPending,
        back_side: DisplayLoadConfiguration.displayRowsBackPending,
    };

    const active: ModalModelData = {
        numberOfRows: 4,
        checked: true,
        front_side: DisplayLoadConfiguration.displayRowsFrontPending,
        back_side: DisplayLoadConfiguration.displayRowsBackActive,
    };

    const closed: ModalModelData = {
        numberOfRows: 4,
        checked: true,
        front_side: DisplayLoadConfiguration.displayRowsFrontClosed,
        back_side: DisplayLoadConfiguration.displayRowsBackClosed,
    };

    return {
        template: template,
        pending: pending,
        active: active,
        closed: closed,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'LoadData' })
export class LoadDataStore extends EntityStore<LoadDataState, any> {
    constructor() {
        super(initialState());
    }
}
