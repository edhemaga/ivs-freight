import { createAction, props } from '@ngrx/store';

// Models
import { TruckCardTypes } from '@pages/truck/pages/truck-card-modal/models';

export const setActiveTabCards = createAction(
    '[Truck Card Modal] Set Active Tab Cards',
    props<TruckCardTypes>()
);

export const setInactiveTabCards = createAction(
    '[Truck Card Modal] Set Inactive Tab Cards',
    props<TruckCardTypes>()
);
