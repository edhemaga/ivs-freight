import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

// configs
import { DispatchHistoryModalConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs';

// enums
import { DispatchHistoryModalStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';

// helpers
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { DispatchHistoryModalHelper } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/helpers';

// constants
import { DispatchHistoryModalConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants';

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
        return DispatchHistoryModalConfig.getDispatchHistoryTimeConfig(
            !!this.selectedTime,
            this.isDisplayingCustomPeriodRange
        );
    }

    get dispatchHistoryDispatchBoardConfig(): ITaInput {
        return DispatchHistoryModalConfig.getDispatchHistoryDispatchBoardConfig(
            !!this.selectedDispatchBoard
        );
    }

    get dispatchHistoryTruckConfig(): ITaInput {
        return DispatchHistoryModalConfig.getDispatchHistoryTruckConfig(
            !!this.selectedTruck
        );
    }

    get dispatchHistoryTrailerConfig(): ITaInput {
        return DispatchHistoryModalConfig.getDispatchHistoryTrailerConfig(
            !!this.selectedTrailer
        );
    }

    get dispatchHistoryDriverConfig(): ITaInput {
        return DispatchHistoryModalConfig.getDispatchHistoryDriverConfig(
            !!this.selectedDriver
        );
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

        const fakeItems = [
            {
                id: 5024,
                status: {
                    statusValue: {
                        name: 'Loaded',
                        id: 11,
                    },
                    statusString: 'Loaded',
                    statusCheckInNumber: '1',
                },
                startDate: '2024-09-09T11:56:48.427937',
                startTime: '12:00 PM',
                endDate: null,
                endTime: '',
                totalTime: 'Ongoing',
                location: {
                    city: 'Orangeburg',
                    state: 'New York',
                    county: 'Rockland County',
                    address: '123 NY-303, Orangeburg, NY 10962, US',
                    street: 'NY-303',
                    streetNumber: '123',
                    country: 'US',
                    zipCode: '10962',
                    stateShortName: 'NY',
                    addressUnit: null,
                },
            },
            {
                id: 5023,
                status: {
                    statusValue: {
                        name: 'Loading',
                        id: 14,
                    },
                    statusString: 'Loading',
                    statusCheckInNumber: '1',
                },
                startDate: '2024-09-08T11:56:42.960701',
                startTime: '12:00 PM',
                endDate: '2024-09-08T11:56:48.427146',
                endTime: '01:00 PM',
                totalTime: '1h',
                location: {
                    city: 'Orangeburg',
                    state: 'New York',
                    county: 'Rockland County',
                    address: '123 NY-303, Orangeburg, NY 10962, US',
                    street: 'NY-303',
                    streetNumber: '123',
                    country: 'US',
                    zipCode: '10962',
                    stateShortName: 'NY',
                    addressUnit: null,
                },
            },
            {
                id: 5022,
                status: {
                    statusValue: {
                        name: 'CheckedInPickup',
                        id: 19,
                    },
                    statusString: 'Checked-In',
                    statusCheckInNumber: '1',
                },
                startDate: '2024-09-07T11:56:38.440388',
                startTime: '12:00 PM',
                endDate: '2024-09-07T11:56:42.959965',
                endTime: '01:00 PM',
                totalTime: '1h',
                location: {
                    city: 'Orangeburg',
                    state: 'New York',
                    county: 'Rockland County',
                    address: '123 NY-303, Orangeburg, NY 10962, US',
                    street: 'NY-303',
                    streetNumber: '123',
                    country: 'US',
                    zipCode: '10962',
                    stateShortName: 'NY',
                    addressUnit: null,
                },
            },
            {
                id: 5021,
                status: {
                    statusValue: {
                        name: 'ArrivedPickup',
                        id: 17,
                    },
                    statusString: 'Arrived',
                    statusCheckInNumber: '1',
                },
                startDate: '2024-09-06T11:56:32.845202',
                startTime: '12:00 PM',
                endDate: '2024-09-06T11:56:38.43924',
                endTime: '01:00 PM',
                totalTime: '1h',
                location: {
                    city: 'Orangeburg',
                    state: 'New York',
                    county: 'Rockland County',
                    address: '123 NY-303, Orangeburg, NY 10962, US',
                    street: 'NY-303',
                    streetNumber: '123',
                    country: 'US',
                    zipCode: '10962',
                    stateShortName: 'NY',
                    addressUnit: null,
                },
            },
            {
                id: 5020,
                status: {
                    statusValue: {
                        name: 'Dispatched',
                        id: 3,
                    },
                    statusString: 'Dispatched',
                    statusCheckInNumber: '',
                },
                startDate: '2024-09-05T11:55:46.742392',
                startTime: '12:00 PM',
                endDate: '2024-09-05T11:56:32.844415',
                endTime: '01:00 PM',
                totalTime: '1h',
                location: {
                    city: 'Fargo',
                    state: 'North Dakota',
                    county: 'Cass County',
                    address: 'Fargo, ND, US',
                    street: null,
                    streetNumber: null,
                    country: 'US',
                    zipCode: null,
                    stateShortName: 'ND',
                    addressUnit: null,
                },
            },
        ];

        const fakeData = data.map((group) => {
            return {
                ...group,
                items: fakeItems,
            };
        });

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

        /*   this.groupData = data.map((group, index) => {
            return {
                ...group,
                items:
                    index === 0
                        ? fakeItems.map((item) => {
                              return {
                                  ...item,
                                  stopOrder: item.status.statusCheckInNumber,
                                  type: DispatchHistoryModalHelper.createStatusOrderValues(
                                      item.status.statusValue.name
                                  ),
                              };
                          })
                        : group.items.map((item) => {
                              return {
                                  ...item,
                                  stopOrder: item.status.statusCheckInNumber,
                                  type: DispatchHistoryModalHelper.createStatusOrderValues(
                                      item.status.statusValue.name
                                  ),
                              };
                          }),
            };
        }); */
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

                // times
                this.timesDropdownList = dispatchHistoryTimes;

                // dispatch boards
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

                // trucks
                this.trucksDropdownList = trucks.map(({ id, truckNumber }) => {
                    return {
                        id,
                        name: truckNumber,
                    };
                });

                // trailers
                const noTrailerDropdownItem = {
                    id: -1,
                    name: DispatchHistoryModalStringEnum.NO_TRAILER,
                };

                this.trailersDropdownList = trailers.map(
                    ({ id, trailerNumber }) => {
                        return {
                            id,
                            name: trailerNumber,
                        };
                    }
                );

                this.trailersDropdownList.unshift(noTrailerDropdownItem);

                // drivers
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
        /*   this.selectedTime = {
            id: 12,
            name: 'This Year',
        };
        this.selectedDispatchBoard = {
            id: 15,
            name: 'Team Board',
        };
        this.selectedTruck = {
            id: 200,
            name: '1',
        };
        this.selectedTrailer = {
            id: 127,
            name: '11',
        };
        this.selectedDriver = {
            id: 245,
            name: 'Aaa Aaa',
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
