import {
    ByStateReportType,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';

export type ByStateApiArguments = [
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
