import { createAction, props } from '@ngrx/store';
import { LoadCardTypes } from '@pages/load/pages/load-card-modal/models/load-card-types.model';

export const setActiveTabCards = createAction(
    '[Load Card Modal] Set Active Tab Cards',
    props<LoadCardTypes>()
);

export const setPendingTabCards = createAction(
    '[Load Card Modal] Set Pending Tab Cards',
    props<LoadCardTypes>()
);

export const setTemplateTabCards = createAction(
    '[Load Card Modal] Set Template Tab Cards',
    props<LoadCardTypes>()
);

export const setClosedTabCards = createAction(
    '[Load Card Modal] Set Closed Tab Cards',
    props<LoadCardTypes>()
);