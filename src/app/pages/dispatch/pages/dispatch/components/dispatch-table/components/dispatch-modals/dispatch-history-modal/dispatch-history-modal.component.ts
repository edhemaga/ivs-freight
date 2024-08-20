import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    UntypedFormArray,
} from '@angular/forms';

import {
    debounceTime,
    distinctUntilChanged,
    skip,
    Subject,
    takeUntil,
} from 'rxjs';

// moment
import moment from 'moment';

// services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

// configs
import { DispatchHistoryModalConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs/dispatch-history-modal.config';

// enums
import { DispatchHistoryModalStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-history-modal-string.enum';

// helpers
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DispatchHistoryModalHelper } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/helpers/dispatch-history-modal.helper';

// constants
import { DispatchHistoryModalConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants/dispatch-history-modal.constants';

// models
import {
    DispatchHistoryGroupResponse,
    DispatchHistoryResponse,
    EnumValue,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { DispatchInputConfigParams } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/dispatch-input-config-params.model';
import { CustomPeriodRange } from '@shared/models/custom-period-range.model';
import { GroupItem } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/group-item.model';

@Component({
    selector: 'app-dispatch-history-modal',
    templateUrl: './dispatch-history-modal.component.html',
    styleUrls: ['./dispatch-history-modal.component.scss'],
})
export class DispatchHistoryModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public dispatchHistoryForm: UntypedFormGroup;

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;
    public dispatchHistoryModalStringEnum = DispatchHistoryModalStringEnum;

    public hasContent: boolean = false;
    public hasNoneSelected: boolean = true;
    public isGroup: boolean = false;

    // non group
    public noGroupHeaderItems: string[] = [];
    public noGroupClass: string;

    public noGroupData: string[][] = [];

    public noGroupItemSpanArray: number[][] = [];
    public noGroupItemSpanClassNameArray: string[][] = [];

    // group
    public groupHeaderItems: string[] = [];
    public groupData: DispatchHistoryGroupResponse[] = [];

    public isInputHoverRows: boolean[][][] = [];

    public groupIndex: number = -1;
    public itemIndex: number = -1;

    public isHoveringGroupIndex: number = -1;
    public isHoveringGroupItemIndex: number = -1;

    // custom period - date range
    public isDisplayingCustomPeriodRange: boolean = false;
    public isCustomTimeSelected: boolean = false;

    private selectedCustomPeriodRange: CustomPeriodRange;

    // dropdown lists
    public timesDropdownList: EnumValue[] = [];
    public dispatchBoardsDropdownList: EnumValue[] = [];
    public trucksDropdownList: EnumValue[] = [];
    public trailersDropdownList: EnumValue[] = [];
    public driversDropdownList: EnumValue[] = [];

    public selectedTime: EnumValue;
    public selectedDispatchBoard: EnumValue;
    public selectedTruck: EnumValue;
    public selectedTrailer: EnumValue;
    public selectedDriver: EnumValue;

    public previousSelectedTime: EnumValue;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private dispatcherService: DispatcherService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getModalDropdowns();

        this.getConstantData();

        this.getDispatchHistory();
    }

    get dispatchHistoryTimeConfig(): ITaInput {
        return DispatchHistoryModalConfig.getDispatchHistoryTimeConfig();
    }

    get dispatchHistoryDispatchBoardConfig(): ITaInput {
        return DispatchHistoryModalConfig.getDispatchHistoryDispatchBoardConfig();
    }

    get dispatchHistoryTruckConfig(): ITaInput {
        return DispatchHistoryModalConfig.getDispatchHistoryTruckConfig();
    }

    get dispatchHistoryTrailerConfig(): ITaInput {
        return DispatchHistoryModalConfig.getDispatchHistoryTrailerConfig();
    }

    get dispatchHistoryDriverConfig(): ITaInput {
        return DispatchHistoryModalConfig.getDispatchHistoryDriverConfig();
    }

    get dispatchHistoryDateStartConfig() {
        return (configData: DispatchInputConfigParams): ITaInput => {
            const { groupIndex, itemIndex, groupItem } = configData;

            return DispatchHistoryModalConfig.getDispatchHistoryDateStartConfig(
                {
                    isInputHoverRows: this.isInputHoverRows,
                    groupIndex,
                    itemIndex,
                    groupItem,
                }
            );
        };
    }

    get dispatchHistoryTimeStartConfig() {
        return (configData: DispatchInputConfigParams): ITaInput => {
            const { groupIndex, itemIndex, groupItem } = configData;

            return DispatchHistoryModalConfig.getDispatchHistoryTimeStartConfig(
                {
                    isInputHoverRows: this.isInputHoverRows,
                    groupIndex,
                    itemIndex,
                    groupItem,
                }
            );
        };
    }

    get dispatchHistoryDateEndConfig() {
        return (configData: DispatchInputConfigParams): ITaInput => {
            const { groupIndex, itemIndex, groupItem } = configData;

            return DispatchHistoryModalConfig.getDispatchHistoryDateEndConfig({
                isInputHoverRows: this.isInputHoverRows,
                groupIndex,
                itemIndex,
                groupItem,
            });
        };
    }

    get dispatchHistoryTimeEndConfig() {
        return (configData: DispatchInputConfigParams): ITaInput => {
            const { groupIndex, itemIndex, groupItem } = configData;

            return DispatchHistoryModalConfig.getDispatchHistoryTimeEndConfig({
                isInputHoverRows: this.isInputHoverRows,
                groupIndex,
                itemIndex,
                groupItem,
            });
        };
    }

    public trackByIdentity = (index: number): number => index;

    private createForm(): void {
        this.dispatchHistoryForm = this.formBuilder.group({
            time: [null],
            dispatchBoard: [null],
            truck: [null],
            trailer: [null],
            driver: [null],
            dispatchHistoryGroupItems: this.formBuilder.array([]),
        });
    }

    private getConstantData(): void {
        this.groupHeaderItems =
            DispatchHistoryModalConstants.DISPATCH_HISTORY_GROUP_HEADER_ITEMS;
    }

    private getDispatchHistoryGroupItems(): UntypedFormArray {
        return this.dispatchHistoryForm?.get(
            DispatchHistoryModalStringEnum.DISPATCH_HISTORY_GROUP_ITEMS
        ) as UntypedFormArray;
    }

    public getDispatchHistoryGroup(index: number): UntypedFormArray {
        return this.getDispatchHistoryGroupItems().at(
            index
        ) as UntypedFormArray;
    }

    private monitorUpdateGroupHistoryData(): void {
        console.log('monitoring');
        this.getDispatchHistoryGroupItems()
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                debounceTime(300),
                distinctUntilChanged(),
                skip(1)
            )
            .subscribe((value) => {
                this.updateGroupHistory(value);
            });
    }

    public handleUpdateGroupHistoryDataIndex(
        groupIndex: number,
        itemIndex: number
    ): void {
        this.groupIndex = groupIndex;
        this.itemIndex = itemIndex;
    }

    public handleGroupRowHover(
        isHover: boolean,
        groupIndex?: number,
        itemIndex?: number
    ): void {
        this.isHoveringGroupIndex = isHover ? groupIndex : -1;
        this.isHoveringGroupItemIndex = isHover ? groupIndex + itemIndex : -1;
    }

    public handleInputHover(
        isHovering: boolean,
        groupIndex: number,
        itemIndex: number,
        inputIndex: number
    ): void {
        this.isInputHoverRows[groupIndex][itemIndex][inputIndex] = isHovering;
    }

    public handleResetFiltersClick(): void {
        this.selectedDispatchBoard = null;
        this.selectedTime = null;
        this.selectedTruck = null;
        this.selectedTrailer = null;
        this.selectedDriver = null;

        this.hasNoneSelected = true;
        this.isGroup = false;

        this.dispatchHistoryForm.reset();
    }

    public handleTimeDropdown(isClick: boolean): void {
        this.isDisplayingCustomPeriodRange = isClick
            ? false
            : this.isCustomTimeSelected;
    }

    public handleSetCustomPeriodRangeClick(
        customPeriodRange: CustomPeriodRange
    ): void {
        this.isDisplayingCustomPeriodRange = false;
        this.isCustomTimeSelected = false;

        if (!customPeriodRange) {
            this.selectedTime = this.previousSelectedTime;

            this.dispatchHistoryForm
                .get(DispatchHistoryModalStringEnum.TIME)
                .patchValue(this.previousSelectedTime?.name ?? null);
        } else {
            this.selectedCustomPeriodRange = customPeriodRange;
        }

        this.getDispatchHistory();
    }

    public onSelectDropdown(event: EnumValue, type: string): void {
        switch (type) {
            case DispatchHistoryModalStringEnum.TIME:
                this.previousSelectedTime = this.selectedTime;

                this.selectedTime = event;

                if (
                    this.selectedTime?.name ===
                    DispatchHistoryModalStringEnum.CUSTOM
                ) {
                    this.isDisplayingCustomPeriodRange = true;
                    this.isCustomTimeSelected = true;

                    return;
                } else {
                    this.isDisplayingCustomPeriodRange = false;
                    this.isCustomTimeSelected = false;

                    this.selectedCustomPeriodRange = null;
                }

                break;
            case DispatchHistoryModalStringEnum.DISPATCH_BOARD:
                this.selectedDispatchBoard = event;

                break;
            case DispatchHistoryModalStringEnum.TRUCK:
                this.selectedTruck = event;

                break;
            case DispatchHistoryModalStringEnum.TRAILER:
                this.selectedTrailer = event;

                break;
            case DispatchHistoryModalStringEnum.DRIVER:
                this.selectedDriver = event;

                break;
            default:
                break;
        }

        if (
            this.selectedTime?.name !== DispatchHistoryModalStringEnum.CUSTOM ||
            (this.selectedTime?.name ===
                DispatchHistoryModalStringEnum.CUSTOM &&
                this.selectedCustomPeriodRange)
        ) {
            if (
                type === DispatchHistoryModalStringEnum.TRAILER &&
                this.selectedDispatchBoard &&
                this.selectedTruck &&
                this.selectedTrailer &&
                !this.selectedDriver
            ) {
                this.getDispatchHistoryDriverAutoComplete();
            } else {
                this.getDispatchHistory();
            }
        }
    }

    private createDispatchHistoryGroupItemRows(
        data: DispatchHistoryGroupResponse[]
    ): void {
        const itemsArray = this.dispatchHistoryForm.get(
            DispatchHistoryModalStringEnum.DISPATCH_HISTORY_GROUP_ITEMS
        ) as UntypedFormArray;

        this.isInputHoverRows = [];

        itemsArray.clear();

        data.forEach((group, index) => {
            this.isInputHoverRows = [...this.isInputHoverRows, []];

            const itemsGroup = this.formBuilder.array(
                group.items.map((item) => {
                    const roundedTimeStart =
                        DispatchHistoryModalHelper.roundToNearestQuarterHour(
                            item.startDate
                        );
                    const roundedTimeEnd =
                        DispatchHistoryModalHelper.roundToNearestQuarterHour(
                            item.endDate
                        );

                    const newIsInputHoverRow = this.createIsHoverRow();

                    this.isInputHoverRows[index] = [
                        ...this.isInputHoverRows[index],
                        newIsInputHoverRow,
                    ];

                    return this.formBuilder.group({
                        dateStart: [
                            MethodsCalculationsHelper.convertDateFromBackend(
                                item.startDate
                            ),
                        ],
                        timeStart: [roundedTimeStart],
                        dateEnd: [
                            item.endDate
                                ? MethodsCalculationsHelper.convertDateFromBackend(
                                      item.endDate
                                  )
                                : null,
                        ],
                        timeEnd: [roundedTimeEnd],
                    });
                })
            );

            itemsArray.push(itemsGroup);
        });

        this.monitorUpdateGroupHistoryData();
    }

    private createIsHoverRow(): boolean[] {
        const isInputHoverRow =
            DispatchHistoryModalConstants.IS_INPUT_HOVER_ROW_DISPATCH;

        return JSON.parse(JSON.stringify(isInputHoverRow));
    }

    private createDispatchHistoryGroupData(
        data: DispatchHistoryGroupResponse[]
    ): void {
        console.log('group data', data);

        this.hasContent = !!data?.length;

        this.groupData = data.map((group) => {
            return {
                ...group,
                items: group.items.map((item) => {
                    return {
                        ...item,
                        stopOrder: null,
                        type: DispatchHistoryModalHelper.createStatusOrderValues(
                            item.status.statusValue.name
                        ),
                    };
                }),
            };
        });

        this.createDispatchHistoryGroupItemRows(data);
    }

    private createDispatchHistoryData(data: DispatchHistoryResponse[]): void {
        const layoutParams = {
            isTimeSelected: !!this.selectedTime,
            isDispatchBoardSelected: !!this.selectedDispatchBoard,
            isTruckSelected: !!this.selectedTruck,
            isTrailerSelected: !!this.selectedTrailer,
            isDriverSelected: !!this.selectedDriver,
        };

        const { headerItems, noGroupClass, noGroupData } =
            DispatchHistoryModalHelper.getDispatchHistoryLayoutItems(
                layoutParams,
                data
            );

        this.noGroupItemSpanArray =
            DispatchHistoryModalHelper.createDispatchHistoryGridSpanData(
                noGroupData
            );

        this.noGroupItemSpanClassNameArray =
            DispatchHistoryModalHelper.createDispatchHistoryDataClassNames(
                this.noGroupItemSpanArray
            );

        this.hasContent = !!data?.length;

        this.noGroupData = noGroupData;

        this.noGroupHeaderItems = headerItems;
        this.noGroupClass = noGroupClass;
    }

    private getModalDropdowns(): void {
        this.dispatcherService
            .getDispatchHistoryModalDropdownLists()
            .pipe(takeUntil(this.destroy$))
            .subscribe((dropdownLists) => {
                const {
                    dispatchHistoryTimes,
                    dispatchBoards,
                    trucks,
                    trailers,
                    drivers,
                } = dropdownLists;

                this.timesDropdownList = dispatchHistoryTimes;

                this.dispatchBoardsDropdownList = dispatchBoards.map(
                    ({ id, dispatcher }) => {
                        return {
                            id,
                            name:
                                dispatcher?.fullName ??
                                DispatchHistoryModalStringEnum.TEAM_BOARD,
                        };
                    }
                );

                this.trucksDropdownList = trucks.map(({ id, truckNumber }) => {
                    return {
                        id,
                        name: truckNumber,
                    };
                });

                this.trailersDropdownList = trailers.map(
                    ({ id, trailerNumber }) => {
                        return {
                            id,
                            name: trailerNumber,
                        };
                    }
                );

                this.driversDropdownList = drivers.map(
                    ({ id, firstName, lastName }) => {
                        return {
                            id,
                            name:
                                firstName +
                                DispatchHistoryModalStringEnum.EMPTY_STRING +
                                lastName,
                        };
                    }
                );
            });
    }

    private getDispatchHistory(): void {
        /*  this.selectedTime = {
            id: 12,
            name: 'This Year',
        };
        this.selectedDispatchBoard = {
            id: 15,
            name: 'Team Board',
        };
        this.selectedTruck = {
            id: 55,
            name: '0697',
        };
        this.selectedTrailer = {
            id: 9,
            name: 'A012096',
        };
        this.selectedDriver = {
            id: 10,
            name: 'Eric Reid',
        }; */

        const layoutParams = {
            isTimeSelected: !!this.selectedTime,
            isDispatchBoardSelected: !!this.selectedDispatchBoard,
            isTruckSelected: !!this.selectedTruck,
            isTrailerSelected: !!this.selectedTrailer,
            isDriverSelected: !!this.selectedDriver,
        };

        const { selectedTimeId, isGroupWithoutTime } =
            DispatchHistoryModalHelper.checkIsGroupWithoutTime(layoutParams);

        const data = {
            dispatchBoardId: this.selectedDispatchBoard?.id,
            dispatchHistoryTime: isGroupWithoutTime
                ? selectedTimeId
                : this.selectedTime?.id,
            truckId: this.selectedTruck?.id,
            trailerId: this.selectedTrailer?.id,
            driverId: this.selectedDriver?.id,
            customDateFrom:
                this.selectedTime?.name ===
                DispatchHistoryModalStringEnum.CUSTOM
                    ? this.selectedCustomPeriodRange?.fromDate
                    : null,
            customDateTo:
                this.selectedTime?.name ===
                DispatchHistoryModalStringEnum.CUSTOM
                    ? this.selectedCustomPeriodRange?.toDate
                    : null,
        };

        const { customDateFrom, customDateTo, ...filteredData } = data;

        this.isGroup =
            MethodsGlobalHelper.checkIfEveryPropertyInObjectHasValue(
                filteredData
            ) || isGroupWithoutTime;

        this.hasNoneSelected =
            MethodsGlobalHelper.checkIfEveryPropertyInObjectHasNoValue(
                filteredData
            );

        if (this.hasNoneSelected) {
            this.hasContent = false;

            return;
        }

        if (this.isGroup) {
            this.dispatcherService
                .getDispatchHistoryGroups(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe(({ pagination: { data } }) =>
                    this.createDispatchHistoryGroupData(data)
                );
        } else {
            this.dispatcherService
                .getDispatchHistory(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe(({ pagination: { data } }) => {
                    this.createDispatchHistoryData(data);
                });
        }
    }

    private getDispatchHistoryDriverAutoComplete(): void {
        const data = {
            truckId: this.selectedTruck?.id,
            trailerId: this.selectedTrailer?.id,
            dispatchBoardId: this.selectedDispatchBoard?.id,
        };

        this.dispatcherService
            .getDispatchHistoryDriver(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ drivers }) => {
                if (drivers.length === 1) {
                    const driver = {
                        ...drivers[0],
                        name:
                            drivers[0].firstName +
                            DispatchHistoryModalStringEnum.EMPTY_STRING +
                            drivers[0].lastName,
                    };

                    this.onSelectDropdown(
                        driver,
                        DispatchHistoryModalStringEnum.DRIVER
                    );
                } else {
                    this.getDispatchHistory();
                }
            });
    }

    private updateGroupHistory(groupItems: GroupItem[][]) {
        console.log('groupItems', groupItems);

        console.log('groupIndex', this.groupIndex);
        console.log('itemIndex', this.itemIndex);

        let selectedGroupItem = groupItems[this.groupIndex][this.itemIndex];
        let nextGroupItem = groupItems[this.groupIndex][this.itemIndex + 1];
        let previousGroupItem = groupItems[this.groupIndex][this.itemIndex - 1];

        console.log('selectedGroupItem', selectedGroupItem);
        console.log('nextGroupItem', nextGroupItem);
        console.log('previousGroupItem', previousGroupItem);

        const dateFrom = moment(previousGroupItem.dateStart, 'MM/DD/YY'); // Example start date
        const dateTo = moment(selectedGroupItem.dateEnd, 'MM/DD/YY'); // Example end date

        const previousDateDifferenceInDays = dateTo.diff(dateFrom, 'days');

        /*    const previousDateDifferenceInDays = moment(
            selectedGroupItem.dateEnd
        ).diff(moment(previousGroupItem.dateStart, 'days'));
 */
        console.log(
            'previousDateDifferenceInDays',
            previousDateDifferenceInDays
        );

        if (previousDateDifferenceInDays >= 0) {
            let newDateStart = dateFrom
                .add(previousDateDifferenceInDays, 'days')
                .format('MM/DD/YY');

            console.log('newDateStart', newDateStart);

            previousGroupItem = {
                ...previousGroupItem,
                dateStart: newDateStart,
            };
        } else {
            let newDateStart = dateFrom
                .subtract(previousDateDifferenceInDays * -1, 'days')
                .format('MM/DD/YY');

            console.log('newDateStart', newDateStart);

            previousGroupItem = {
                ...previousGroupItem,
                dateStart: newDateStart,
            };
        }

        const date1 = '08/14/24';

        const date2 = '08/13/24';

        const date3 = '08/15/24';
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
