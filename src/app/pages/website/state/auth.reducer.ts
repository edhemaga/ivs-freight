import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface State {
    home: number;
    away: number;
}

export const authState: State = {
    home: 0,
    away: 0,
};

export const authReducer = createReducer(
    authState,
    on(AuthActions.login, (state) => ({ ...state, home: state.home + 1 }))
);
