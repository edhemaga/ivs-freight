// Store
import { createReducer, on } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
    setDriverApplicantTabCards,
} from '@pages/driver/pages/driver-card-modal/state/driver-card-modal.actions';

// Constants
import { DriverCardsModalConfig } from '@pages/driver/pages/driver-card-modal/utils/constants/driver-cards-modal.config';

// Models
import { DriverCardData } from '@pages/driver/pages/driver-card-modal/models/driver-card-data.model';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

const getInitialState = (): DriverCardData => {
    const savedState = localStorage.getItem(TableStringEnum.DRIVER_CARD_STATE);
    if (savedState) {
        return JSON.parse(savedState);
    }
    return {
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
};

const saveStateToLocalStorage = (state: DriverCardData) => {
    localStorage.setItem(TableStringEnum.DRIVER_CARD_STATE, JSON.stringify(state));
};

export const driverCardModalReducer = createReducer(
    getInitialState(),
    on(setActiveTabCards, (state, active) => {
        const newState = { ...state, active };
        saveStateToLocalStorage(newState);
        return newState;
    }),
    on(setInactiveTabCards, (state, inactive) => {
        const newState = { ...state, inactive };
        saveStateToLocalStorage(newState);
        return newState;
    }),
    on(setDriverApplicantTabCards, (state, applicants) => {
        const newState = { ...state, applicants };
        saveStateToLocalStorage(newState);
        return newState;
    })
);
