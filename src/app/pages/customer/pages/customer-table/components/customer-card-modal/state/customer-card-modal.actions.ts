import { createAction, props } from '@ngrx/store';

// models
import { CustomerCardTypes } from '@pages/customer/pages/customer-table/components/customer-card-modal/models';

export const setActiveTabCards = createAction(
    '[Customer Card Modal] Set Active Tab Cards',
    props<CustomerCardTypes>()
);

export const setInactiveTabCards = createAction(
    '[Customer Card Modal] Set Inactive Tab Cards',
    props<CustomerCardTypes>()
);
