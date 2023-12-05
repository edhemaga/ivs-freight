export interface MapState {
    color: string;
    state: string;
    value: string;
    percent: string;
}

export interface MapStates {
    [stateAbbreviation: string]: MapState;
}
