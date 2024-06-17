import { createAction, props } from '@ngrx/store';
import { TrailerCardTypes } from '@pages/trailer/pages/trailer-card-modal/models/trailer-card-types.model';

export const setActiveTabCards = createAction(
    '[Trailer Card Modal] Set Active Tab Cards',
    props<TrailerCardTypes>()
);

export const setInactiveTabCards = createAction(
    '[Trailer Card Modal] Set Inactive Tab Cards',
    props<TrailerCardTypes>()
);