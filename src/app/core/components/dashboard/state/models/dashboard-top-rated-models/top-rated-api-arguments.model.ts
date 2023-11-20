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
    TimeInterval,
    string,
    string,
    SubintervalType
];

export type TopRatedWithoutTabApiArguments = [
    string[],
    number,
    number,
    TimeInterval,
    string,
    string,
    SubintervalType
];
