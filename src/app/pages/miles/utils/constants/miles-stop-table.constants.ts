import { IMilesStopTableHeader } from '@pages/miles/interface';

export class MilesStopsTable {
    static HEADER_CONFIG: IMilesStopTableHeader[] = [
        { label: '#', isAlignedCenter: true },
        { label: 'STOP' },
        { label: 'LEG', isAlignedRight: true },
        { label: 'LOADED', isAlignedRight: true, isExpandable: true },
        { label: 'EMPTY', isAlignedRight: true, isExpandable: true },
        { label: 'TOTAL', isAlignedRight: true },
    ];
}
