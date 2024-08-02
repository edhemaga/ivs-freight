import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    UntypedFormArray,
    UntypedFormControl,
} from '@angular/forms';

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
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DispatchHistoryModalHelper } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/helpers/dispatch-history-modal.helper';

// constants
import { DispatchTableConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants/dispatch-table.constants';

// models
import { DispatchHistoryGroupResponse, EnumValue } from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { DispatchInputConfigParams } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/dispatch-input-config-params';

@Component({
    selector: 'app-dispatch-history-modal',
    templateUrl: './dispatch-history-modal.component.html',
    styleUrls: ['./dispatch-history-modal.component.scss'],
})
export class DispatchHistoryModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public dispatchHistoryForm: UntypedFormGroup;

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    public hasContent: boolean = false;
    public hasNoneSelected: boolean = true;
    public isGroup: boolean = false;

    // group
    public groupHeaderItems: string[] = [];
    public groupData: DispatchHistoryGroupResponse[] = [];

    public isInputHoverRows: boolean[][][] = [];

    public isHoveringGroupItemIndex: number = -1;

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
            DispatchTableConstants.DISPATCH_HISTORY_GROUP_HEADER_ITEMS;
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

    private createDispatchHistoryGroupItemRows(
        data: DispatchHistoryGroupResponse[]
    ): void {
        console.log('data', data);

        const itemsArray = this.dispatchHistoryForm.get(
            DispatchHistoryModalStringEnum.DISPATCH_HISTORY_GROUP_ITEMS
        ) as UntypedFormArray;

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
    }

    private createIsHoverRow(): boolean[] {
        const isInputHoverRow =
            DispatchTableConstants.IS_INPUT_HOVER_ROW_DISPATCH;

        return JSON.parse(JSON.stringify(isInputHoverRow));
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

    public onSelectDropdown(event: EnumValue, type: string): void {
        switch (type) {
            case DispatchHistoryModalStringEnum.TIME:
                this.selectedTime = event;

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

        this.getDispatchHistory();
    }

    private createDispatchHistoryGroupData(
        data: DispatchHistoryGroupResponse[]
    ): void {
        this.hasContent = !!data?.length;
        this.groupData = data;

        this.createDispatchHistoryGroupItemRows(data);
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
        this.selectedDispatchBoard = { name: 'Team Board', id: 15 };
        this.selectedTime = { name: 'This year', id: 12 };
        this.selectedTruck = { name: '1826', id: 13 };
        this.selectedTrailer = { name: 'A012102', id: 13 };
        this.selectedDriver = { name: 'Sara Key', id: 279 };

        /*
        this.selectedDispatchBoard = { name: 'Team Board', id: 15 };
        this.selectedTime = { name: 'This year', id: 12 };
        this.selectedTruck = { name: '0258', id: 61 };
        this.selectedTrailer = { name: '12345678', id: 107 };
         this.selectedDriver = { name: 'Douglas Gunnoe', id: 54 }; */

        const data = {
            dispatchBoardId: this.selectedDispatchBoard?.id,
            dispatchHistoryTime: this.selectedTime?.id,
            truckId: this.selectedTruck?.id,
            trailerId: this.selectedTrailer?.id,
            driverId: this.selectedDriver?.id,
        };

        this.isGroup =
            MethodsGlobalHelper.checkIfEveryPropertyInObjectHasValue(data);

        this.hasNoneSelected =
            MethodsGlobalHelper.checkIfEveryPropertyInObjectHasNoValue(data);

        if (this.hasNoneSelected) return;

        if (this.isGroup) {
            this.dispatcherService
                .getDispatchHistoryGroups(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe(({ pagination: { data } }) =>
                    this.createDispatchHistoryGroupData(data)
                );
        } else {
            /* TODO */
            this.hasContent = false;

            this.dispatcherService
                .getDispatchHistory(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe((dispatchHistory) => {
                    console.log('dispatchHistory', dispatchHistory);
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
