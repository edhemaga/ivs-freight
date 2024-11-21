import { createAction, props } from '@ngrx/store';
import { FuelCardTypes } from "@pages/fuel/pages/fuel-card-modal/models";

export const setActiveTabCards = createAction(
    '[Fuel Card Modal] Set Active Tab Cards',
    props<FuelCardTypes>()
);

export const setInactiveTabCards = createAction(
    '[Fuel Card Modal] Set Inactive Tab Cards',
    props<FuelCardTypes>()
);
