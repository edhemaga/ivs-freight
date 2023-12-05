import {
    DashboardTopReportType,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';

export type TopRatedApiArguments = [
    DashboardTopReportType,
    string[],
    number,
    number,
    boolean,
    TimeInterval,
    string,
    string,
    SubintervalType
];

export type TopRatedWithoutTabApiArguments = [
    string[],
    number,
    number,
    boolean,
    TimeInterval,
    string,
    string,
    SubintervalType
];
