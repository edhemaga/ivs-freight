import { createAction, props } from '@ngrx/store';
import { LoadCardTypes } from '@pages/load/pages/load-card-modal/models/load-card-types.model';

export const setActiveTabCards = createAction(
    '[Load Card Modal] Set Active Tab Cards',
    props<LoadCardTypes>()
);

export const setInactiveTabCards = createAction(
    '[Load Card Modal] Set Inactive Tab Cards',
    props<LoadCardTypes>()
);
