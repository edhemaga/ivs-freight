import {
    DashboardTopReportType,
    IntervalLabelResponse,
} from 'appcoretruckassist';

export interface ITopRatedTabData {
    // leave these 2 any for now, backend changes needed
    topRated: any;
    allOther: any;
    intervalLabels: IntervalLabelResponse[];
    selectedTab: DashboardTopReportType;
}
