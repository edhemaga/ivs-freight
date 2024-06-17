import { createAction, props } from '@ngrx/store';
import { DriverCardTypes } from '@pages/driver/pages/driver-card-modal/models/driver-card-types.model';

export const setActiveTabCards = createAction(
    '[Driver Card Modal] Set Active Tab Cards',
    props<DriverCardTypes>()
);

export const setInactiveTabCards = createAction(
    '[Driver Card Modal] Set Inactive Tab Cards',
    props<DriverCardTypes>()
);

export const setDriverApplicantTabCards = createAction(
    '[Driver Card Modal] Set Driver Applicant Tab Cards',
    props<DriverCardTypes>()
);
