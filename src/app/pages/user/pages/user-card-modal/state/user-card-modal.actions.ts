import { createAction, props } from '@ngrx/store';
import { UserCardTypes } from "@pages/user/pages/user-card-modal/models";

export const setActiveTabCards = createAction(
    '[User Card Modal] Set Active Tab Cards',
    props<UserCardTypes>()
);

export const setInactiveTabCards = createAction(
    '[User Card Modal] Set Inactive Tab Cards',
    props<UserCardTypes>()
);
