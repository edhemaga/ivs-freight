import { createAction, props } from '@ngrx/store';
import { PMCardTypes } from "@pages/pm-truck-trailer/pages/pm-card-modal/models";

export const setActiveTabCards = createAction(
    '[PM Card Modal] Set Active Tab Cards',
    props<PMCardTypes>()
);

export const setInactiveTabCards = createAction(
    '[PM Card Modal] Set Inactive Tab Cards',
    props<PMCardTypes>()
);
