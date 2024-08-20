import { DispatchHistoryModalConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants/dispatch-history-modal.constants';

// moment
import moment from 'moment';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

// enums
import { LoadStatusEnum } from '@shared/enums/load-status.enum';
import { DispatchHistoryModalStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-history-modal-string.enum';

// models
import { GetDispatchHistoryLayoutParams } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/get-dispatch-history-layout-params.model';
import { DispatchHistoryResponse } from 'appcoretruckassist';

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
        layoutParams: GetDispatchHistoryLayoutParams,
        data: DispatchHistoryResponse[]
    ): {
        headerItems: string[];
        noGroupClass: string;
        noGroupData: string[][];
    } {
        const layout = this.createDispatchHistoryLayout(layoutParams);

        const noGroupData = this.createDispatchHistoryData(layout, data);

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

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout3,
                    3,
                    5
                );

                noGroupClass = layout;

                break;
            case 'layout-4':
                const headerLayout4 = dispatchHistoryHeaderItems.slice(3);

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout4,
                    2,
                    4
                );

                noGroupClass = layout;

                break;
            case 'layout-5':
                const headerLayout5 = [
                    dispatchHistoryHeaderItems[0],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout5,
                    2,
                    4
                );

                noGroupClass = 'layout-4';

                break;
            case 'layout-6':
                const headerLayout6 = [
                    dispatchHistoryHeaderItems[1],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout6,
                    2,
                    4
                );

                noGroupClass = 'layout-4';

                break;
            case 'layout-7':
                const headerLayout7 = [
                    dispatchHistoryHeaderItems[2],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout7,
                    2,
                    4
                );

                noGroupClass = 'layout-4';

                break;
            case 'layout-8':
                const headerLayout8 = [
                    ...dispatchHistoryHeaderItems.slice(0, 2),
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout8,
                    3,
                    5
                );

                noGroupClass = 'layout-5';

                break;
            case 'layout-9':
                const headerLayout9 = [
                    dispatchHistoryHeaderItems[0],
                    dispatchHistoryHeaderItems[2],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout9,
                    3,
                    5
                );

                noGroupClass = 'layout-5';

                break;
            case 'layout-10':
                const headerLayout10 = [
                    dispatchHistoryHeaderItems[0],
                    dispatchHistoryHeaderItems[3],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout10,
                    3,
                    5
                );

                noGroupClass = 'layout-6';

                break;
            case 'layout-11':
                const headerLayout11 = [
                    dispatchHistoryHeaderItems[1],
                    dispatchHistoryHeaderItems[3],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout11,
                    3,
                    5
                );

                noGroupClass = 'layout-3';

                break;
            case 'layout-12':
                const headerLayout12 = [
                    ...dispatchHistoryHeaderItems.slice(1, 3),
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout12,
                    3,
                    5
                );

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

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout17,
                    3,
                    5
                );

                noGroupClass = 'layout-3';

                break;
            case 'layout-18':
                const headerLayout18 = [
                    dispatchHistoryHeaderItems[1],
                    ...dispatchHistoryHeaderItems.slice(3),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout18,
                    3,
                    5
                );

                noGroupClass = 'layout-3';

                break;
            case 'layout-19':
                const headerLayout19 = [
                    ...dispatchHistoryHeaderItems.slice(1, 3),
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout19,
                    3,
                    5
                );

                noGroupClass = 'layout-6';

                break;
            case 'layout-20':
                const headerLayout20 = dispatchHistoryHeaderItems.slice(3);

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout20,
                    2,
                    4
                );

                noGroupClass = 'layout-4';

                break;
            case 'layout-22':
                const headerLayout22 = [
                    dispatchHistoryHeaderItems[1],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout22,
                    2,
                    4
                );

                noGroupClass = 'layout-4';

                break;
            case 'layout-23':
                const headerLayout23 = [
                    dispatchHistoryHeaderItems[1],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout23,
                    2,
                    4
                );

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

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout25,
                    3,
                    5
                );

                noGroupClass = 'layout-6';

                break;
            case 'layout-26':
                const headerLayout26 = [
                    dispatchHistoryHeaderItems[0],
                    dispatchHistoryHeaderItems[2],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout26,
                    3,
                    5
                );

                noGroupClass = 'layout-5';

                break;
            case 'layout-27':
                const headerLayout27 = [
                    dispatchHistoryHeaderItems[0],
                    ...dispatchHistoryHeaderItems.slice(4),
                ];

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout27,
                    2,
                    4
                );

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

                headerItems = this.addExtraItemsInDispatchHistoryHeader(
                    headerLayout29,
                    3,
                    5
                );

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

        return { headerItems, noGroupClass, noGroupData };
    }

    static createDispatchHistoryData(
        layout: string,
        data: DispatchHistoryResponse[]
    ): string[][] {
        const dataItems = data.map((dataItem, index) => {
            const { dateFrom, dateTo } = dataItem;

            const dataArray = this.createDispatchHistoryDataArray(
                data,
                dataItem,
                index
            );

            switch (layout) {
                case 'layout-1':
                    return dataArray;
                case 'layout-2':
                    const dataArray2 = dataArray.slice(1);

                    return dataArray2;
                case 'layout-3':
                    const dataArray3 = dataArray.slice(2);

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray3,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-4':
                    const dataArray4 = dataArray.slice(3);

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray4,
                        dateFrom,
                        dateTo,
                        2,
                        4
                    );
                case 'layout-5':
                    const dataArray5 = [dataArray[0], ...dataArray.slice(4)];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray5,
                        dateFrom,
                        dateTo,
                        2,
                        4
                    );
                case 'layout-6':
                    const dataArray6 = [dataArray[1], ...dataArray.slice(4)];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray6,
                        dateFrom,
                        dateTo,
                        2,
                        4
                    );
                case 'layout-7':
                    const dataArray7 = [dataArray[2], ...dataArray.slice(4)];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray7,
                        dateFrom,
                        dateTo,
                        2,
                        4
                    );
                case 'layout-8':
                    const dataArray8 = [
                        ...dataArray.slice(0, 2),
                        ...dataArray.slice(4),
                    ];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray8,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-9':
                    const dataArray9 = [
                        dataArray[0],
                        dataArray[2],
                        ...dataArray.slice(4),
                    ];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray9,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-10':
                    const dataArray10 = [
                        dataArray[0],
                        dataArray[3],
                        ...dataArray.slice(4),
                    ];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray10,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-11':
                    const dataArray11 = [
                        dataArray[1],
                        dataArray[3],
                        ...dataArray.slice(4),
                    ];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray11,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-12':
                    const dataArray12 = [
                        ...dataArray.slice(1, 3),
                        ...dataArray.slice(4),
                    ];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray12,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-13':
                    const dataArray13 = [dataArray[0], ...dataArray.slice(2)];

                    return dataArray13;
                case 'layout-14':
                    const dataArray14 = [
                        ...dataArray.slice(0, 2),
                        ...dataArray.slice(3),
                    ];

                    return dataArray14;
                case 'layout-15':
                    const dataArray15 = [
                        ...dataArray.slice(0, 3),
                        ...dataArray.slice(4),
                    ];

                    return dataArray15;
                case 'layout-16':
                    const dataArray16 = dataArray.slice(1);

                    return dataArray16;
                case 'layout-17':
                    const dataArray17 = dataArray.slice(2);

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray17,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-18':
                    const dataArray18 = [dataArray[1], ...dataArray.slice(3)];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray18,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-19':
                    const dataArray19 = [
                        ...dataArray.slice(1, 3),
                        ...dataArray.slice(4),
                    ];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray19,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-20':
                    const dataArray20 = dataArray.slice(3);

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray20,
                        dateFrom,
                        dateTo,
                        2,
                        4
                    );
                case 'layout-21':
                    const dataArray21 = [dataArray[2], ...dataArray.slice(4)];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray21,
                        dateFrom,
                        dateTo,
                        2,
                        4
                    );
                case 'layout-22':
                    const dataArray22 = [dataArray[1], ...dataArray.slice(4)];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray22,
                        dateFrom,
                        dateTo,
                        2,
                        4
                    );
                case 'layout-23':
                    const dataArray23 = [dataArray[1], ...dataArray.slice(4)];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray23,
                        dateFrom,
                        dateTo,
                        2,
                        4
                    );
                case 'layout-24':
                    const dataArray24 = [dataArray[0], ...dataArray.slice(2)];

                    return dataArray24;
                case 'layout-25':
                    const dataArray25 = [dataArray[0], ...dataArray.slice(3)];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray25,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-26':
                    const dataArray26 = [
                        dataArray[0],
                        dataArray[2],
                        ...dataArray.slice(4),
                    ];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray26,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-27':
                    const dataArray27 = [dataArray[0], ...dataArray.slice(4)];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray27,
                        dateFrom,
                        dateTo,
                        2,
                        4
                    );
                case 'layout-28':
                    const dataArray28 = [
                        ...dataArray.slice(0, 2),
                        ...dataArray.slice(3),
                    ];

                    return dataArray28;
                case 'layout-29':
                    const dataArray29 = [
                        ...dataArray.slice(0, 2),
                        ...dataArray.slice(4),
                    ];

                    return this.addExtraItemsInDispatchHistoryData(
                        dataArray29,
                        dateFrom,
                        dateTo,
                        3,
                        5
                    );
                case 'layout-30':
                    const dataArray30 = [
                        ...dataArray.slice(0, 3),
                        ...dataArray.slice(4),
                    ];

                    return dataArray30;
                default:
                    break;
            }
        });

        return dataItems;
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

    static createDispatchHistoryDataArray(
        data: DispatchHistoryResponse[],
        dataItem: DispatchHistoryResponse,
        index: number
    ): string[] {
        const { dispatcher, truck, trailer, driver, dateFrom, dateTo } =
            dataItem;

        const dataArray = [
            dispatcher?.fullName &&
            data[index - 1]?.dispatcher?.fullName !== dispatcher?.fullName
                ? dispatcher?.fullName
                : null,
            truck?.truckNumber &&
            data[index - 1]?.truck?.truckNumber !== truck?.truckNumber
                ? truck?.truckNumber
                : null,
            trailer?.trailerNumber &&
            data[index - 1]?.trailer?.trailerNumber !== trailer?.trailerNumber
                ? trailer?.trailerNumber
                : null,
            driver?.firstName &&
            data[index - 1]?.driver?.firstName +
                ' ' +
                data[index - 1]?.driver?.lastName !==
                driver?.firstName + ' ' + driver?.lastName
                ? driver?.firstName + ' ' + driver?.lastName
                : null,
            MethodsCalculationsHelper.convertDateFromBackend(dateFrom),
            dateTo
                ? MethodsCalculationsHelper.convertDateFromBackend(dateTo)
                : null,
            this.createTotalColumnValue(dateFrom, dateTo),
        ];

        return dataArray;
    }

    static createDispatchHistoryGridSpanData(
        noGroupData: string[][]
    ): number[][] {
        const noGroupItemSpanArray = noGroupData.map((row, index) => {
            const spanArray: number[] = [];

            const nextRow = noGroupData[index + 1] || [];
            const nextRowIndex = noGroupData.indexOf(nextRow);
            const nextRowHasItemWithNoValue =
                MethodsGlobalHelper.checkIfAnyItemInArrayHasNoValue(nextRow);

            if (!nextRowHasItemWithNoValue) {
                for (let i = 0; i < row.length; i++) {
                    spanArray.push(1);
                }
            } else {
                nextRow.forEach((rowItem, rowItemIndex) => {
                    if (!rowItem) {
                        let spanCounter = 1;

                        for (
                            let i = nextRowIndex;
                            i < noGroupData.length;
                            i++
                        ) {
                            if (noGroupData[i][rowItemIndex]) {
                                break;
                            } else {
                                spanCounter++;
                            }
                        }

                        spanArray[rowItemIndex] = spanCounter;
                    } else {
                        spanArray[rowItemIndex] = 1;
                    }
                });
            }

            return spanArray;
        });

        return noGroupItemSpanArray;
    }

    static createDispatchHistoryDataClassNames(
        noGroupItemSpanArray: number[][]
    ): string[][] {
        const groupArray: string[][] = [];

        let groupCounter = 1;

        function getNextGroupName(): string {
            return `group-${groupCounter.toString().padStart(3, '0')}`;
        }

        for (
            let rowIndex = 0;
            rowIndex < noGroupItemSpanArray.length;
            rowIndex++
        ) {
            // initialize groupArray[rowIndex] if it doesn't exist
            if (!groupArray[rowIndex]) {
                groupArray[rowIndex] = [];
            }

            for (
                let colIndex = 0;
                colIndex < noGroupItemSpanArray[rowIndex].length;
                colIndex++
            ) {
                if (!groupArray[rowIndex][colIndex]) {
                    const groupName = getNextGroupName();
                    groupCounter++;

                    // assign the group name to the current cell
                    groupArray[rowIndex][colIndex] = groupName;

                    // propagate the group name downward if the value spans multiple rows
                    let span = noGroupItemSpanArray[rowIndex][colIndex];
                    for (
                        let i = 1;
                        i < span && rowIndex + i < noGroupItemSpanArray.length;
                        i++
                    ) {
                        if (!groupArray[rowIndex + i])
                            groupArray[rowIndex + i] = [];

                        groupArray[rowIndex + i][colIndex] = groupName;
                    }
                }
            }
        }

        return groupArray;
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

    static createTotalColumnValue(dateFrom: string, dateTo: string): string {
        if (!dateTo) {
            return 'Ongoing';
        } else {
            const from = moment(dateFrom);
            const to = moment(dateTo);

            const years = to.diff(from, 'years');
            from.add(years, 'years');

            const days = to.diff(from, 'days');
            from.add(days, 'days');

            const hours = to.diff(from, 'hours');
            from.add(hours, 'hours');

            const minutes = to.diff(from, 'minutes');

            const seconds = to.diff(from, 'seconds');

            if (!years && !days && !hours && !minutes) {
                return seconds ? seconds + 's' : null;
            } else {
                const totalResult = `${years ? years + 'y' : ''} ${
                    days ? days + 'd' : ''
                } ${hours ? hours + 'h' : ''} ${
                    minutes ? minutes + 'm' : ''
                }`.trim();

                const matches = totalResult.match(/(\d+\w)\s*/g);

                return matches ? matches.slice(0, 2).join(' ') : '';
            }
        }
    }

    static addExtraItemsInDispatchHistoryHeader(
        headerItemsArray: string[],
        startIndex: number,
        endIndex: number
    ) {
        const newHeaderItemsArray = [...headerItemsArray];

        newHeaderItemsArray.splice(startIndex, 0, '');
        newHeaderItemsArray.splice(endIndex, 0, '');

        return newHeaderItemsArray;
    }

    static addExtraItemsInDispatchHistoryData(
        dataArray: string[],
        dateFrom: string,
        dateTo: string,
        startIndex: number,
        endIndex: number
    ) {
        const newDataArray = [...dataArray];

        const timeFrom = MethodsCalculationsHelper.convertDateToTimeFromBackend(
            dateFrom,
            true
        );

        const timeTo = dateTo
            ? MethodsCalculationsHelper.convertDateToTimeFromBackend(
                  dateTo,
                  true
              )
            : null;

        newDataArray.splice(startIndex, 0, timeFrom);
        newDataArray.splice(endIndex, 0, timeTo);

        return newDataArray;
    }

    static checkIsGroupWithoutTime(
        layoutParams: GetDispatchHistoryLayoutParams
    ): {
        selectedTimeId: number;
        isGroupWithoutTime: boolean;
    } {
        // if all inputs are selected except time, call group api with time selected as All Time

        const {
            isTimeSelected,
            isDispatchBoardSelected,
            isTruckSelected,
            isTrailerSelected,
            isDriverSelected,
        } = layoutParams;

        const isGroupWithoutTime =
            !isTimeSelected &&
            isDispatchBoardSelected &&
            isTruckSelected &&
            isTrailerSelected &&
            isDriverSelected;

        const selectedTimeId = isGroupWithoutTime ? 14 : null;

        return {
            selectedTimeId,
            isGroupWithoutTime,
        };
    }
}
