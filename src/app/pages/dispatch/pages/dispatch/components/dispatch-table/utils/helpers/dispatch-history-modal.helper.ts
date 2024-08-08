import { DispatchHistoryModalConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants/dispatch-history-modal.constants';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// enums
import { LoadStatusEnum } from '@shared/enums/load-status.enum';
import { DispatchHistoryModalStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-history-modal-string.enum';

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
        const layout = this.createDispatchHistoryLayout(layoutParams);

        const dispatchHistoryHeaderItems = [
            ...DispatchHistoryModalConstants.DISPATCH_HISTORY_HEADER_ITEMS,
        ];

        let headerItems: string[];
        let noGroupClass: string;

        switch (layout) {
            case 'layout-1':
                headerItems = dispatchHistoryHeaderItems;

                noGroupClass = layout;

                break;
            case 'layout-2':
                const headerLayout2 = dispatchHistoryHeaderItems.slice(1);

                headerItems = headerLayout2;

                noGroupClass = layout;

                break;
            case 'layout-3':
                const headerLayout3 = dispatchHistoryHeaderItems.slice(2);

                headerLayout3.splice(3, 0, '');
                headerLayout3.splice(5, 0, '');

                headerItems = headerLayout3;

                noGroupClass = layout;

                break;
            case 'layout-4':
                const headerLayout4 = dispatchHistoryHeaderItems.slice(3);

                headerLayout4.splice(2, 0, '');
                headerLayout4.splice(4, 0, '');

                headerItems = headerLayout4;

                noGroupClass = layout;

                break;
            case 'layout-5':
                const headerLayout5 = [
                    dispatchHistoryHeaderItems[0],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout5.splice(2, 0, '');
                headerLayout5.splice(4, 0, '');

                headerItems = headerLayout5;

                noGroupClass = 'layout-4';

                break;
            case 'layout-6':
                const headerLayout6 = [
                    dispatchHistoryHeaderItems[1],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout6.splice(2, 0, '');
                headerLayout6.splice(4, 0, '');

                headerItems = headerLayout6;

                noGroupClass = 'layout-4';

                break;
            case 'layout-7':
                const headerLayout7 = [
                    dispatchHistoryHeaderItems[2],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout7.splice(2, 0, '');
                headerLayout7.splice(4, 0, '');

                headerItems = headerLayout7;

                noGroupClass = 'layout-4';

                break;
            case 'layout-8':
                const headerLayout8 = [
                    ...dispatchHistoryHeaderItems.slice(0, 2),
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout8.splice(3, 0, '');
                headerLayout8.splice(5, 0, '');

                headerItems = headerLayout8;

                noGroupClass = 'layout-5';

                break;
            case 'layout-9':
                const headerLayout9 = [
                    dispatchHistoryHeaderItems[0],
                    dispatchHistoryHeaderItems[2],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout9.splice(3, 0, '');
                headerLayout9.splice(5, 0, '');

                headerItems = headerLayout9;

                noGroupClass = 'layout-5';

                break;
            case 'layout-10':
                const headerLayout10 = [
                    dispatchHistoryHeaderItems[0],
                    dispatchHistoryHeaderItems[3],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout10.splice(3, 0, '');
                headerLayout10.splice(5, 0, '');

                headerItems = headerLayout10;

                noGroupClass = 'layout-6';

                break;
            case 'layout-11':
                const headerLayout11 = [
                    dispatchHistoryHeaderItems[1],
                    dispatchHistoryHeaderItems[3],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout11.splice(3, 0, '');
                headerLayout11.splice(5, 0, '');

                headerItems = headerLayout11;

                noGroupClass = 'layout-3';

                break;
            case 'layout-12':
                const headerLayout12 = [
                    ...dispatchHistoryHeaderItems.slice(1, 3),
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout12.splice(3, 0, '');
                headerLayout12.splice(5, 0, '');

                headerItems = headerLayout12;

                noGroupClass = 'layout-6';

                break;
            case 'layout-13':
                const headerLayout13 = [
                    dispatchHistoryHeaderItems[0],
                    ...dispatchHistoryHeaderItems.slice(2),
                ];

                headerItems = headerLayout13;

                noGroupClass = 'layout-7';

                break;
            case 'layout-14':
                const headerLayout14 = [
                    ...dispatchHistoryHeaderItems.slice(0, 2),
                    ...dispatchHistoryHeaderItems.slice(3),
                ];

                headerItems = headerLayout14;

                noGroupClass = 'layout-7';

                break;
            case 'layout-15':
                const headerLayout15 = [
                    ...dispatchHistoryHeaderItems.slice(0, 3),
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = headerLayout15;

                noGroupClass = 'layout-8';

                break;
            case 'layout-16':
                const headerLayout16 = dispatchHistoryHeaderItems.slice(1);

                headerItems = headerLayout16;

                noGroupClass = 'layout-9';

                break;
            case 'layout-17':
                const headerLayout17 = dispatchHistoryHeaderItems.slice(2);

                headerLayout17.splice(3, 0, '');
                headerLayout17.splice(5, 0, '');

                headerItems = headerLayout17;

                noGroupClass = 'layout-3';

                break;
            case 'layout-18':
                const headerLayout18 = [
                    dispatchHistoryHeaderItems[1],
                    ...dispatchHistoryHeaderItems.slice(3),
                ];

                headerLayout18.splice(3, 0, '');
                headerLayout18.splice(5, 0, '');

                headerItems = headerLayout18;

                noGroupClass = 'layout-3';

                break;
            case 'layout-19':
                const headerLayout19 = [
                    ...dispatchHistoryHeaderItems.slice(1, 3),
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout19.splice(3, 0, '');
                headerLayout19.splice(5, 0, '');

                headerItems = headerLayout19;

                noGroupClass = 'layout-6';

                break;
            case 'layout-20':
                const headerLayout20 = dispatchHistoryHeaderItems.slice(3);

                headerLayout20.splice(2, 0, '');
                headerLayout20.splice(4, 0, '');

                headerItems = headerLayout20;

                noGroupClass = 'layout-4';

                break;
            case 'layout-21':
                const headerLayout21 = [
                    dispatchHistoryHeaderItems[2],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout21.splice(2, 0, '');
                headerLayout21.splice(4, 0, '');

                headerItems = headerLayout21;

                noGroupClass = 'layout-4';

                break;
            case 'layout-22':
                const headerLayout22 = [
                    dispatchHistoryHeaderItems[1],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout22.splice(2, 0, '');
                headerLayout22.splice(4, 0, '');

                headerItems = headerLayout22;

                noGroupClass = 'layout-4';

                break;
            case 'layout-23':
                const headerLayout23 = [
                    dispatchHistoryHeaderItems[1],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout23.splice(2, 0, '');
                headerLayout23.splice(4, 0, '');

                headerItems = headerLayout23;

                noGroupClass = 'layout-4';

                break;
            case 'layout-24':
                const headerLayout24 = [
                    dispatchHistoryHeaderItems[0],
                    ...dispatchHistoryHeaderItems.slice(2),
                ];

                headerItems = headerLayout24;

                noGroupClass = 'layout-10';

                break;
            case 'layout-25':
                const headerLayout25 = [
                    dispatchHistoryHeaderItems[0],
                    ...dispatchHistoryHeaderItems.slice(3),
                ];

                headerLayout25.splice(3, 0, '');
                headerLayout25.splice(5, 0, '');

                headerItems = headerLayout25;

                noGroupClass = 'layout-6';

                break;
            case 'layout-26':
                const headerLayout26 = [
                    dispatchHistoryHeaderItems[0],
                    dispatchHistoryHeaderItems[2],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout26.splice(3, 0, '');
                headerLayout26.splice(5, 0, '');

                headerItems = headerLayout26;

                noGroupClass = 'layout-5';

                break;
            case 'layout-27':
                const headerLayout27 = [
                    dispatchHistoryHeaderItems[0],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout27.splice(2, 0, '');
                headerLayout27.splice(4, 0, '');

                headerItems = headerLayout27;

                noGroupClass = 'layout-4';

                break;
            case 'layout-28':
                const headerLayout28 = [
                    ...dispatchHistoryHeaderItems.slice(0, 2),
                    ...dispatchHistoryHeaderItems.slice(3),
                ];

                headerItems = headerLayout28;

                noGroupClass = 'layout-11';

                break;
            case 'layout-29':
                const headerLayout29 = [
                    ...dispatchHistoryHeaderItems.slice(0, 2),
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerLayout29.splice(3, 0, '');
                headerLayout29.splice(5, 0, '');

                headerItems = headerLayout29;

                noGroupClass = 'layout-5';

                break;
            case 'layout-30':
                const headerLayout30 = [
                    ...dispatchHistoryHeaderItems.slice(0, 3),
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = headerLayout30;

                noGroupClass = 'layout-12';

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
            isDriverSelected,
        } = layoutParams;

        const layout1 =
            isTimeSelected &&
            !isDispatchBoardSelected &&
            !isTruckSelected &&
            !isTrailerSelected &&
            !isDriverSelected;
        const layout2 =
            isTimeSelected &&
            isDispatchBoardSelected &&
            !isTruckSelected &&
            !isTrailerSelected &&
            !isDriverSelected;
        const layout3 =
            isTimeSelected &&
            isDispatchBoardSelected &&
            isTruckSelected &&
            !isTrailerSelected &&
            !isDriverSelected;
        const layout4 =
            isTimeSelected &&
            isDispatchBoardSelected &&
            isTruckSelected &&
            isTrailerSelected &&
            !isDriverSelected;
        const layout5 =
            isTimeSelected &&
            !isDispatchBoardSelected &&
            isTruckSelected &&
            isTrailerSelected &&
            isDriverSelected;
        const layout6 =
            isTimeSelected &&
            isDispatchBoardSelected &&
            !isTruckSelected &&
            isTrailerSelected &&
            isDriverSelected;
        const layout7 =
            isTimeSelected &&
            isDispatchBoardSelected &&
            isTruckSelected &&
            !isTrailerSelected &&
            isDriverSelected;
        const layout8 =
            isTimeSelected &&
            !isDispatchBoardSelected &&
            !isTruckSelected &&
            isTrailerSelected &&
            isDriverSelected;
        const layout9 =
            isTimeSelected &&
            !isDispatchBoardSelected &&
            isTruckSelected &&
            !isTrailerSelected &&
            isDriverSelected;
        const layout10 =
            isTimeSelected &&
            !isDispatchBoardSelected &&
            isTruckSelected &&
            isTrailerSelected &&
            !isDriverSelected;
        const layout11 =
            isTimeSelected &&
            isDispatchBoardSelected &&
            !isTruckSelected &&
            isTrailerSelected &&
            !isDriverSelected;
        const layout12 =
            isTimeSelected &&
            isDispatchBoardSelected &&
            !isTruckSelected &&
            !isTrailerSelected &&
            isDriverSelected;
        const layout13 =
            isTimeSelected &&
            !isDispatchBoardSelected &&
            isTruckSelected &&
            !isTrailerSelected &&
            !isDriverSelected;
        const layout14 =
            isTimeSelected &&
            !isDispatchBoardSelected &&
            !isTruckSelected &&
            isTrailerSelected &&
            !isDriverSelected;
        const layout15 =
            isTimeSelected &&
            !isDispatchBoardSelected &&
            !isTruckSelected &&
            !isTrailerSelected &&
            isDriverSelected;
        const layout16 =
            !isTimeSelected &&
            isDispatchBoardSelected &&
            !isTruckSelected &&
            !isTrailerSelected &&
            !isDriverSelected;
        const layout17 =
            !isTimeSelected &&
            isDispatchBoardSelected &&
            isTruckSelected &&
            !isTrailerSelected &&
            !isDriverSelected;
        const layout18 =
            !isTimeSelected &&
            isDispatchBoardSelected &&
            !isTruckSelected &&
            isTrailerSelected &&
            !isDriverSelected;
        const layout19 =
            !isTimeSelected &&
            isDispatchBoardSelected &&
            !isTruckSelected &&
            !isTrailerSelected &&
            isDriverSelected;
        const layout20 =
            !isTimeSelected &&
            isDispatchBoardSelected &&
            isTruckSelected &&
            isTrailerSelected &&
            !isDriverSelected;
        const layout21 =
            !isTimeSelected &&
            isDispatchBoardSelected &&
            isTruckSelected &&
            !isTrailerSelected &&
            isDriverSelected;
        const layout22 =
            !isTimeSelected &&
            isDispatchBoardSelected &&
            !isTruckSelected &&
            isTrailerSelected &&
            isDriverSelected;
        const layout23 =
            !isTimeSelected &&
            isDispatchBoardSelected &&
            isTruckSelected &&
            isTrailerSelected &&
            isDriverSelected;
        const layout24 =
            !isTimeSelected &&
            !isDispatchBoardSelected &&
            isTruckSelected &&
            !isTrailerSelected &&
            !isDriverSelected;
        const layout25 =
            !isTimeSelected &&
            !isDispatchBoardSelected &&
            isTruckSelected &&
            isTrailerSelected &&
            !isDriverSelected;
        const layout26 =
            !isTimeSelected &&
            !isDispatchBoardSelected &&
            isTruckSelected &&
            !isTrailerSelected &&
            isDriverSelected;
        const layout27 =
            !isTimeSelected &&
            !isDispatchBoardSelected &&
            isTruckSelected &&
            isTrailerSelected &&
            isDriverSelected;
        const layout28 =
            !isTimeSelected &&
            !isDispatchBoardSelected &&
            !isTruckSelected &&
            isTrailerSelected &&
            !isDriverSelected;
        const layout29 =
            !isTimeSelected &&
            !isDispatchBoardSelected &&
            !isTruckSelected &&
            isTrailerSelected &&
            isDriverSelected;
        const layout30 =
            !isTimeSelected &&
            !isDispatchBoardSelected &&
            !isTruckSelected &&
            !isTrailerSelected &&
            isDriverSelected;

        switch (true) {
            case layout1:
                return 'layout-1';
            case layout2:
                return 'layout-2';
            case layout3:
                return 'layout-3';
            case layout4:
                return 'layout-4';
            case layout5:
                return 'layout-5';
            case layout6:
                return 'layout-6';
            case layout7:
                return 'layout-7';
            case layout8:
                return 'layout-8';
            case layout9:
                return 'layout-9';
            case layout10:
                return 'layout-10';
            case layout11:
                return 'layout-11';
            case layout12:
                return 'layout-12';
            case layout13:
                return 'layout-13';
            case layout14:
                return 'layout-14';
            case layout15:
                return 'layout-15';
            case layout16:
                return 'layout-16';
            case layout17:
                return 'layout-17';
            case layout18:
                return 'layout-18';
            case layout19:
                return 'layout-19';
            case layout20:
                return 'layout-20';
            case layout21:
                return 'layout-21';
            case layout22:
                return 'layout-22';
            case layout23:
                return 'layout-23';
            case layout24:
                return 'layout-24';
            case layout25:
                return 'layout-25';
            case layout26:
                return 'layout-26';
            case layout27:
                return 'layout-27';
            case layout28:
                return 'layout-28';
            case layout29:
                return 'layout-29';
            case layout30:
                return 'layout-30';
            default:
                return;
        }
    }

    static createStatusOrderValues(statusString: string): string {
        const pickupStatus = [
            LoadStatusEnum[4],
            LoadStatusEnum[46],
            LoadStatusEnum[48],
            LoadStatusEnum[50],
            LoadStatusEnum[53],
        ];

        const deliveryStatus = [
            LoadStatusEnum[5],
            LoadStatusEnum[47],
            LoadStatusEnum[49],
            LoadStatusEnum[51],
            LoadStatusEnum[54],
        ];

        return pickupStatus.includes(statusString)
            ? DispatchHistoryModalStringEnum.PICKUP
            : deliveryStatus.includes(statusString)
            ? DispatchHistoryModalStringEnum.DELIVERY
            : DispatchHistoryModalStringEnum.EMPTY_STRING;
    }
}
