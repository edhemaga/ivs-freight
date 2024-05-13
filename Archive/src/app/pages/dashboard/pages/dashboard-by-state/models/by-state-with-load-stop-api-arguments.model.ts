import {
    ByStateReportType,
    LoadStopType,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';

export type ByStateWithLoadStopApiArguments = [
    LoadStopType,
    ByStateReportType,
    string[],
    number,
    number,
    boolean,
    TimeInterval,
    string,
    string,
    SubintervalType
];
