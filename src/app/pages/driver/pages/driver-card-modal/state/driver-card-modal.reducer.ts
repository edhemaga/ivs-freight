//Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
    setDriverApplicantTabCards,
} from '@pages/driver/pages/driver-card-modal/state/driver-card-modal.actions';

//Constants
import { DriverCardsModalConfig } from '@pages/driver/pages/driver-card-modal/utils/constants/driver-cards-modal.config';

//Models
import { DriverCardData } from '@pages/driver/pages/driver-card-modal/models/driver-card-data.model';

export const driverState: DriverCardData = {
    active: {
        numberOfRows: 4,
        checked: true,
        front_side: DriverCardsModalConfig.displayRowsFrontActive,
        back_side: DriverCardsModalConfig.displayRowsBackActive,
    },
    inactive: {
        numberOfRows: 4,
        checked: true,
        front_side: DriverCardsModalConfig.displayRowsFrontInactive,
        back_side: DriverCardsModalConfig.displayRowsBackInactive,
    },
    applicants: {
        numberOfRows: 4,
        checked: true,
        front_side: DriverCardsModalConfig.displayRowsFrontApplicant,
        back_side: DriverCardsModalConfig.displayRowsBackApplicant,
    },
};

export const driverCardModalReducer = createReducer(
    driverState,
    on(setActiveTabCards, (state, active) => ({
        ...state,
        active,
    })),
    on(setInactiveTabCards, (state, inactive) => ({
        ...state,
        inactive,
    })),
    on(setDriverApplicantTabCards, (state, applicants) => ({
        ...state,
        applicants,
    }))
);
