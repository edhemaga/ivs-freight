import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

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
import { CustomPeriodRange } from '@shared/models/custom-period-range.model';

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

    public trackByIdentity = (index: number): number => index;

    private createForm(): void {
        this.dispatchHistoryForm = this.formBuilder.group({
            time: [null],
            dispatchBoard: [null],
            truck: [null],
            trailer: [null],
            driver: [null],
        });
    }

    private getConstantData(): void {
        this.groupHeaderItems =
            DispatchHistoryModalConstants.DISPATCH_HISTORY_GROUP_HEADER_ITEMS;
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
                        stopOrder: item.status.statusCheckInNumber,
                        type: DispatchHistoryModalHelper.createStatusOrderValues(
                            item.status.statusValue.name
                        ),
                    };
                }),
            };
        });
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
            DispatchHistoryModalHelper.createDispatchHistoryGridSpanClassNames(
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
        this.selectedTime = {
            id: 12,
            name: 'This Year',
        };
        this.selectedDispatchBoard = {
            id: 15,
            name: 'Team Board',
        };
        this.selectedTruck = {
            id: 156,
            name: '2',
        };
        this.selectedTrailer = {
            id: 36,
            name: 'R1422',
        };
        this.selectedDriver = {
            id: 9,
            name: 'Milos Djordjevic',
        };

        /*  this.selectedTime = {
            id: 12,
            name: 'This Year',
        };
        this.selectedDispatchBoard = {
            id: 15,
            name: 'Team Board',
        };
        this.selectedTruck = {
            id: 67,
            name: '5142',
        };
        this.selectedTrailer = {
            id: 107,
            name: '12345678',
        };
        this.selectedDriver = {
            id: 13,
            name: 'Alan Parker',
        };
 */
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
