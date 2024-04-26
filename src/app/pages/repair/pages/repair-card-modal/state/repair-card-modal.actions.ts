import { createAction, props } from '@ngrx/store';
import { RepairCardTypes } from '@pages/repair/pages/repair-card-modal/models/repair-card-types.model';

export const setActiveTabCards = createAction(
    '[Repair Card Modal] Set Active Tab Cards',
    props<RepairCardTypes>()
);

export const setInactiveTabCards = createAction(
    '[Repair Card Modal] Set Inactive Tab Cards',
    props<RepairCardTypes>()
);

export const setRepairShopTabCards = createAction(
    '[Repair Card Modal] Set Repair Shop Tab Cards',
    props<RepairCardTypes>()
);
