import { DispatchHistoryModalConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants/dispatch-history-modal.constants';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// models
import { GetDispatchHistoryLayoutParams } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/get-dispatch-history-layout-params.model';

export class DispatchHistoryModalHelper {
    static roundToNearestQuarterHour(time: string): string {
        const convertedTime = time
            ? MethodsCalculationsHelper.convertDateFromBackendToTime(time)
            : null;

        if (convertedTime) {
            const [hours, minutesWithPmAm] = convertedTime.split(':');
            const [minutes, amPm] = minutesWithPmAm.split(' ');

            const quarterHours = Math.round(+minutes / 15);

            const roundedMinutes = quarterHours * 15;
            const roundedHours =
                roundedMinutes === 60 ? (+hours + 1) % 24 : hours;

            return `${String(roundedHours).padStart(2, '0')}:${String(
                roundedMinutes % 60
            ).padStart(2, '0')} ${amPm}`;
        }

        return convertedTime;
    }

    static getDispatchHistoryLayoutItems(
        layoutParams: GetDispatchHistoryLayoutParams
    ): { headerItems: string[]; noGroupClass: string } {
        const noGroupClass = this.createDispatchHistoryLayout(layoutParams);

        const dispatchHistoryHeaderItems = [
            ...DispatchHistoryModalConstants.DISPATCH_HISTORY_HEADER_ITEMS,
        ];

        let headerItems: string[];

        switch (noGroupClass) {
            case 'layout-1':
                headerItems = dispatchHistoryHeaderItems;

                break;
            case 'layout-2':
                const slicedHeaderItemsLayoutTwo =
                    dispatchHistoryHeaderItems.slice(1);

                headerItems = slicedHeaderItemsLayoutTwo;

                break;
            case 'layout-3':
                const slicedHeaderItemsLayoutThree =
                    dispatchHistoryHeaderItems.slice(2);

                headerItems = slicedHeaderItemsLayoutThree;

                break;
            case 'layout-4':
                const slicedHeaderItemsLayoutFour =
                    dispatchHistoryHeaderItems.slice(3);

                headerItems = slicedHeaderItemsLayoutFour;

                break;
            default:
                break;
        }

        return { headerItems, noGroupClass };
    }

    static createDispatchHistoryLayout(
        layoutParams: GetDispatchHistoryLayoutParams
    ): string {
        const {
            isTimeSelected,
            isDispatchBoardSelected,
            isTruckSelected,
            isTrailerSelected,
        } = layoutParams;

        const layoutMap = {
            '1000': 'layout-1',
            '1100': 'layout-2',
            '1010': 'layout-3',
            '1110': 'layout-3',
            '1101': 'layout-4',
            '1111': 'layout-4',
            '0110': 'layout-3',
            '0111': 'layout-4',
            '0011': 'layout-4',
            '0101': 'layout-4',
            '0100': 'layout-2',
            '0010': 'layout-3',
            '0001': 'layout-4',
        };

        const key = `${+isTimeSelected}${+isDispatchBoardSelected}${+isTruckSelected}${+isTrailerSelected}`;

        return layoutMap[key];
    }
}
