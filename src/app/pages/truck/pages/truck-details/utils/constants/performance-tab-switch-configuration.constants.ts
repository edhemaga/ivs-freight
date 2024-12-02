import { Tabs } from "@shared/models/tabs.model";

export class PerformanceTabSwitchConfiguration {
    static PERFORMANCE_TAB_CONFIG : Tabs[]  = [
        {
            id: 222,
            name: '1M',
            checked: true,
        },
        {
            id: 333,
            name: '3M',
        },
        {
            id: 444,
            name: '6M',
        },
        {
            id: 555,
            name: '1Y',
        },
        {
            id: 231,
            name: 'YTD',
        },
        {
            id: 213,
            name: 'ALL',
        },
    ]
}