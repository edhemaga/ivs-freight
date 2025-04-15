import { IMilesStopTableHeader } from '@pages/miles/interface';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class MilesStopsTable {
    static HEADER_CONFIG: IMilesStopTableHeader[] = [
        { label: '#', isAlignedCenter: true },
        { label: 'STOP' },
        { label: 'LEG', isAlignedRight: true },
        { label: 'LOADED', isAlignedRight: true, isExpandable: true },
        { label: 'EMPTY', isAlignedRight: true, isExpandable: true },
        { label: 'TOTAL', isAlignedRight: true },
    ];

    static SEARCH_FIELD: ITaInput = {
        name: 'search',
        type: 'text',
        label: 'Find Stop',
        placeholderIcon: 'ic_search',
        placeholderInsteadOfLabel: true,
    };

    static BOTTOM_SCROLL_THRESHOLD = 100;
}
