import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

import {
    debounceTime,
    distinctUntilChanged,
    skip,
    Subject,
    takeUntil,
} from 'rxjs';

// services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

// enums
import { DispatchHistoryModalStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';

// configs
import { DispatchHistoryModalConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DispatchHistoryModalDateHelper } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/helpers';

// constants
import { DispatchHistoryModalConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants';

// models
import { DispatchHistoryGroupResponse } from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import {
    DispatchHistoryGroupItem,
    DispatchInputConfigParams,
} from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';

@Component({
    selector: 'app-dispatch-history-modal-group',
    templateUrl: './dispatch-history-modal-group.component.html',
    styleUrls: ['./dispatch-history-modal-group.component.scss'],
})
export class DispatchHistoryModalGroupComponent implements OnInit, OnDestroy {
    @Input() groupHeaderItems: string[] = [];

    @Input() set groupData(data: DispatchHistoryGroupResponse[]) {
        this.createDispatchHistoryGroupItemRows(data);
    }

    private destroy$ = new Subject<void>();

    public _groupData: DispatchHistoryGroupResponse[];

    public dispatchHistoryGroupForm: UntypedFormGroup;

    // hover
    public isInputHoverRows: boolean[][][] = [];

    public isHoveringGroupIndex: number = -1;
    public isHoveringGroupItemIndex: number = -1;

    // update
    public groupIndex: number = -1;
    public itemIndex: number = -1;

    public selectedFormControlName: string;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private dispatcherService: DispatcherService
    ) {}

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
                    isHoveringRow:
                        this.isHoveringGroupIndex === groupIndex &&
                        this.isHoveringGroupItemIndex ===
                            groupIndex + itemIndex,
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
                isHoveringRow:
                    this.isHoveringGroupIndex === groupIndex &&
                    this.isHoveringGroupItemIndex === groupIndex + itemIndex,
            });
        };
    }

    ngOnInit(): void {
        this.createForm();
    }

    public trackByIdentity = (index: number): number => index;

    private createForm(): void {
        this.dispatchHistoryGroupForm = this.formBuilder.group({
            dispatchHistoryGroupItems: this.formBuilder.array([]),
        });
    }

    private getDispatchHistoryGroupItems(): UntypedFormArray {
        return this.dispatchHistoryGroupForm?.get(
            DispatchHistoryModalStringEnum.DISPATCH_HISTORY_GROUP_ITEMS
        ) as UntypedFormArray;
    }

    public getDispatchHistoryGroup(index: number): UntypedFormArray {
        return this.getDispatchHistoryGroupItems().at(
            index
        ) as UntypedFormArray;
    }

    private checkIsGroupItemsRowValid(): boolean {
        return this.getDispatchHistoryGroup(this.groupIndex).at(this.itemIndex)
            .valid;
    }

    private setInputValidationToInvalid(formControlName: string): void {
        this.getDispatchHistoryGroup(this.groupIndex)
            .at(this.itemIndex)
            .get(formControlName)
            .setErrors({ invalid: true });
    }

    private clearInputValidations(): void {
        const formControlNames =
            DispatchHistoryModalConstants.GROUP_ITEM_CONTROL_NAMES;

        formControlNames.forEach((controlName) => {
            this.getDispatchHistoryGroup(this.groupIndex)
                .at(this.itemIndex)
                .get(controlName)
                .setErrors(null);
        });
    }

    private monitorUpdateGroupHistoryData(): void {
        this.getDispatchHistoryGroupItems()
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                debounceTime(300),
                distinctUntilChanged(),
                skip(1)
            )
            .subscribe((groupItemsData: DispatchHistoryGroupItem[][]) => {
                this.updateGroupHistory(groupItemsData);
            });
    }

    private createIsHoverRow(): boolean[] {
        const isInputHoverRow =
            DispatchHistoryModalConstants.IS_INPUT_HOVER_ROW_DISPATCH;

        return JSON.parse(JSON.stringify(isInputHoverRow));
    }

    private createDispatchHistoryGroupItemRows(
        data: DispatchHistoryGroupResponse[]
    ): void {
        setTimeout(() => {
            const itemsArray = this.dispatchHistoryGroupForm.get(
                DispatchHistoryModalStringEnum.DISPATCH_HISTORY_GROUP_ITEMS
            ) as UntypedFormArray;

            this._groupData = data;

            this.isInputHoverRows = [];

            itemsArray.clear();

            data.forEach((group, index) => {
                this.isInputHoverRows = [...this.isInputHoverRows, []];

                const itemsGroup = this.formBuilder.array(
                    group.items.map((item) => {
                        const createdIsInputHoverRow = this.createIsHoverRow();

                        this.isInputHoverRows[index] = [
                            ...this.isInputHoverRows[index],
                            createdIsInputHoverRow,
                        ];

                        return this.formBuilder.group({
                            id: item.id,
                            dateStart: [
                                MethodsCalculationsHelper.convertDateFromBackend(
                                    item.startDate
                                ),
                            ],
                            timeStart: [item.startTime],
                            dateEnd: [
                                item.endDate
                                    ? MethodsCalculationsHelper.convertDateFromBackend(
                                          item.endDate
                                      )
                                    : null,
                            ],
                            timeEnd: [item.endTime],
                            totalTime: item.totalTime,
                        });
                    })
                );

                itemsArray.push(itemsGroup);
            });

            this.monitorUpdateGroupHistoryData();
        }, 100);
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

    public handleUpdateGroupHistoryDataIndex(
        groupIndex: number,
        itemIndex: number,
        selectedFormControlName: string
    ): void {
        this.groupIndex = groupIndex;
        this.itemIndex = itemIndex;

        this.selectedFormControlName = selectedFormControlName;
    }

    private handleSelectDateStart(
        selectedGroupItem: DispatchHistoryGroupItem,
        nextGroupItem: DispatchHistoryGroupItem,
        previousGroupItem: DispatchHistoryGroupItem
    ): void {
        this.clearInputValidations();

        const isDateValid = previousGroupItem
            ? DispatchHistoryModalDateHelper.checkIsSelectedDateSameOrAfterPreviousDate(
                  selectedGroupItem.dateStart,
                  previousGroupItem.dateEnd
              )
            : true;

        if (!isDateValid) {
            this.setInputValidationToInvalid(
                DispatchHistoryModalStringEnum.DATE_START
            );

            return;
        }

        if (previousGroupItem) {
            const isDateSameAsPrevious =
                DispatchHistoryModalDateHelper.checkIsSelectedDateSameOrAfterPreviousDate(
                    selectedGroupItem.dateStart,
                    previousGroupItem.dateEnd,
                    true
                );

            this.handleDateComparisonSelectedDateStart(
                isDateSameAsPrevious,
                selectedGroupItem,
                previousGroupItem,
                nextGroupItem
            );
        } else {
            const isOngoing = !selectedGroupItem.dateEnd;

            if (nextGroupItem || (!nextGroupItem && !isOngoing)) {
                this.handleSelectedDateBeforeOrSameDateEnd(selectedGroupItem);
            } else {
                this.updateGroupHistoryData(true);
            }
        }
    }

    private handleSelectDateEnd(
        selectedGroupItem: DispatchHistoryGroupItem,
        nextGroupItem: DispatchHistoryGroupItem
    ): void {
        this.clearInputValidations();

        if (nextGroupItem) {
            const isSelectedDateSameOrBeforeNextDate =
                DispatchHistoryModalDateHelper.checkIsSelectedDateSameOrBeforeNextDate(
                    selectedGroupItem.dateEnd,
                    nextGroupItem.dateStart
                );

            if (isSelectedDateSameOrBeforeNextDate) {
                const isDateSameAsNext =
                    DispatchHistoryModalDateHelper.checkIsSelectedDateSameOrBeforeNextDate(
                        selectedGroupItem.dateEnd,
                        nextGroupItem.dateStart,
                        true
                    );

                this.handleDateComparisonSelectedDateEnd(
                    isDateSameAsNext,
                    selectedGroupItem,
                    nextGroupItem
                );
            } else {
                this.setInputValidationToInvalid(
                    DispatchHistoryModalStringEnum.DATE_END
                );
            }
        } else {
            this.handleSelectedDateAfterOrSameDateStart(selectedGroupItem);
        }
    }

    private handleSelectTimeStart(
        selectedGroupItem: DispatchHistoryGroupItem,
        previousGroupItem: DispatchHistoryGroupItem
    ): void {
        const isOngoing = !selectedGroupItem.dateEnd;

        const isGroupItemsRowValid = this.checkIsGroupItemsRowValid();

        if (!isGroupItemsRowValid) return;

        this.clearInputValidations();

        if (isOngoing) {
            this.handleDateComparisonSelectedTimeStartOnGoing(
                selectedGroupItem,
                previousGroupItem
            );
        } else {
            this.handleDateComparisonSelectedTimeStartNotOnGoing(
                selectedGroupItem,
                previousGroupItem
            );
        }
    }

    private handleSelectTimeEnd(
        selectedGroupItem: DispatchHistoryGroupItem,
        nextGroupItem: DispatchHistoryGroupItem
    ): void {
        this.clearInputValidations();

        if (nextGroupItem) {
            const isSelectedDateSameOrBeforeNextDate =
                DispatchHistoryModalDateHelper.checkIsSelectedDateSameOrBeforeNextDate(
                    selectedGroupItem.dateEnd,
                    nextGroupItem.dateStart
                );

            if (isSelectedDateSameOrBeforeNextDate)
                this.handleDateComparisonSelectedTimeEnd(
                    selectedGroupItem,
                    nextGroupItem
                );
        } else {
            const isGroupItemsRowValid = this.checkIsGroupItemsRowValid();

            if (isGroupItemsRowValid)
                this.handleSameDateTime(selectedGroupItem);
        }
    }

    private handleSelectedDateBeforeOrSameDateEnd(
        selectedGroupItem: DispatchHistoryGroupItem
    ): void {
        const { dateStart, timeStart, dateEnd, timeEnd } = selectedGroupItem;

        const isDateValid =
            DispatchHistoryModalDateHelper.checkIsSelectedDateBeforeOrSameAsSelectedGroupItemDateEnd(
                dateStart,
                dateEnd
            );

        if (
            isDateValid.isSelectedDateBeforeSelectedGroupItemDateEnd ||
            isDateValid.isSelectedDateSameAsSelectedGroupItemDateEnd
        ) {
            const isTimeValid =
                isDateValid.isSelectedDateBeforeSelectedGroupItemDateEnd ||
                DispatchHistoryModalDateHelper.checkIsTimeStartBeforeOrSameTimeEnd(
                    timeStart,
                    timeEnd
                );

            const isGroupItemsRowValid = this.checkIsGroupItemsRowValid();

            if (isTimeValid && isGroupItemsRowValid) {
                this.updateGroupHistoryData(
                    false,
                    dateStart,
                    timeStart,
                    dateEnd,
                    timeEnd
                );
            } else if (!isTimeValid) {
                this.setInputValidationToInvalid(
                    DispatchHistoryModalStringEnum.TIME_START
                );
            }
        } else {
            this.setInputValidationToInvalid(
                DispatchHistoryModalStringEnum.DATE_START
            );
        }
    }

    private handleSelectedDateSameAsPreviousDate(
        selectedGroupItem: DispatchHistoryGroupItem,
        previousGroupItem: DispatchHistoryGroupItem
    ): void {
        const isTimeValid =
            DispatchHistoryModalDateHelper.checkIsTimeStartAfterOrSamePreviousTimeEnd(
                selectedGroupItem.timeStart,
                previousGroupItem.timeEnd
            );

        const isOngoing = !selectedGroupItem.dateEnd;

        const isGroupItemsRowValid = this.checkIsGroupItemsRowValid();

        if (isOngoing) {
            if (isTimeValid && isGroupItemsRowValid) {
                this.updateGroupHistoryData(true);
            } else if (!isTimeValid) {
                this.setInputValidationToInvalid(
                    DispatchHistoryModalStringEnum.TIME_START
                );
            }
        } else {
            if (isTimeValid && isGroupItemsRowValid) {
                const { dateStart, timeStart, dateEnd, timeEnd } =
                    selectedGroupItem;

                this.updateGroupHistoryData(
                    false,
                    dateStart,
                    timeStart,
                    dateEnd,
                    timeEnd
                );
            } else if (!isTimeValid) {
                this.setInputValidationToInvalid(
                    DispatchHistoryModalStringEnum.TIME_START
                );
            }
        }
    }

    private handleSelectedDateAfterOrSameDateStart(
        selectedGroupItem: DispatchHistoryGroupItem
    ): void {
        const { dateStart, timeStart, dateEnd, timeEnd } = selectedGroupItem;

        const isDateValid =
            DispatchHistoryModalDateHelper.checkIsSelectedDateAfterOrSameAsSelectedGroupItemDateStart(
                dateEnd,
                dateStart
            );

        const isGroupItemsRowValid = this.checkIsGroupItemsRowValid();

        if (
            isDateValid.isSelectedDateAfterSelectedGroupItemDateStart ||
            isDateValid.isSelectedDateSameAsSelectedGroupItemDateStart
        ) {
            const isTimeValid =
                isDateValid.isSelectedDateAfterSelectedGroupItemDateStart ||
                DispatchHistoryModalDateHelper.checkIsTimeStartBeforeOrSameTimeEnd(
                    timeStart,
                    timeEnd
                );

            if (isTimeValid && isGroupItemsRowValid) {
                this.updateGroupHistoryData(
                    false,
                    dateStart,
                    timeStart,
                    dateEnd,
                    timeEnd
                );
            } else if (!isTimeValid) {
                this.setInputValidationToInvalid(
                    DispatchHistoryModalStringEnum.TIME_START
                );
            }
        } else {
            this.setInputValidationToInvalid(
                DispatchHistoryModalStringEnum.DATE_END
            );
        }
    }

    private handleDateComparisonSelectedDateStart(
        isSameDate: boolean,
        selectedGroupItem: DispatchHistoryGroupItem,
        previousGroupItem: DispatchHistoryGroupItem,
        nextGroupItem: DispatchHistoryGroupItem
    ): void {
        if (isSameDate) {
            this.handleSelectedDateSameAsPreviousDate(
                selectedGroupItem,
                previousGroupItem
            );
        } else {
            nextGroupItem
                ? this.handleSelectedDateBeforeOrSameDateEnd(selectedGroupItem)
                : this.updateGroupHistoryData(true);
        }
    }

    private handleDateComparisonSelectedDateEnd(
        isSameDate: boolean,
        selectedGroupItem: DispatchHistoryGroupItem,
        nextGroupItem: DispatchHistoryGroupItem
    ): void {
        if (isSameDate) {
            this.handleSameDateTimeAsNext(selectedGroupItem, nextGroupItem);
        } else {
            this.handleSelectedDateAfterOrSameDateStart(selectedGroupItem);
        }
    }

    private handleDateComparisonSelectedTimeStartOnGoing(
        selectedGroupItem: DispatchHistoryGroupItem,
        previousGroupItem: DispatchHistoryGroupItem
    ): void {
        const isDateSameAsPrevious =
            DispatchHistoryModalDateHelper.checkIsSelectedDateSameOrAfterPreviousDate(
                selectedGroupItem.dateStart,
                previousGroupItem?.dateEnd,
                true
            );

        const isTimeValid =
            DispatchHistoryModalDateHelper.checkIsTimeStartAfterOrSamePreviousTimeEnd(
                selectedGroupItem.timeStart,
                previousGroupItem?.timeEnd
            );

        if (isDateSameAsPrevious && !isTimeValid) {
            this.setInputValidationToInvalid(
                DispatchHistoryModalStringEnum.TIME_START
            );
        } else {
            this.updateGroupHistoryData(true);
        }
    }

    private handleDateComparisonSelectedTimeStartNotOnGoing(
        selectedGroupItem: DispatchHistoryGroupItem,
        previousGroupItem: DispatchHistoryGroupItem
    ): void {
        const { dateStart, timeStart, dateEnd, timeEnd } = selectedGroupItem;

        const isSameDate =
            DispatchHistoryModalDateHelper.checkIsSelectedDateBeforeOrSameAsSelectedGroupItemDateEnd(
                dateStart,
                dateEnd
            ).isSelectedDateSameAsSelectedGroupItemDateEnd;

        const isTimeStartBeforeOrSameTimeEnd =
            DispatchHistoryModalDateHelper.checkIsTimeStartBeforeOrSameTimeEnd(
                timeStart,
                timeEnd
            );

        const isDateSameAsPrevious =
            DispatchHistoryModalDateHelper.checkIsSelectedDateSameOrAfterPreviousDate(
                dateStart,
                previousGroupItem?.dateEnd,
                true
            );

        const isTimeValid =
            DispatchHistoryModalDateHelper.checkIsTimeStartAfterOrSamePreviousTimeEnd(
                selectedGroupItem.timeStart,
                previousGroupItem?.timeEnd
            );

        const isUpdateGroupHistoryData = previousGroupItem
            ? ((!isSameDate || isTimeStartBeforeOrSameTimeEnd) &&
                  !isDateSameAsPrevious) ||
              (isDateSameAsPrevious && isTimeValid)
            : !isSameDate || isTimeStartBeforeOrSameTimeEnd;

        if (isUpdateGroupHistoryData) {
            this.updateGroupHistoryData(
                false,
                dateStart,
                timeStart,
                dateEnd,
                timeEnd
            );
        } else {
            this.setInputValidationToInvalid(
                DispatchHistoryModalStringEnum.TIME_START
            );
        }
    }

    private handleDateComparisonSelectedTimeEnd(
        selectedGroupItem: DispatchHistoryGroupItem,
        nextGroupItem: DispatchHistoryGroupItem
    ): void {
        const isGroupItemsRowValid = this.checkIsGroupItemsRowValid();

        if (isGroupItemsRowValid) {
            const isDateSameAsNext =
                DispatchHistoryModalDateHelper.checkIsSelectedDateSameOrBeforeNextDate(
                    selectedGroupItem.dateEnd,
                    nextGroupItem.dateStart,
                    true
                );

            if (isDateSameAsNext) {
                this.handleSameDateTimeAsNext(selectedGroupItem, nextGroupItem);
            } else {
                this.handleSameDateTime(selectedGroupItem);
            }
        }
    }

    private handleSameDateTimeAsNext(
        selectedGroupItem: DispatchHistoryGroupItem,
        nextGroupItem: DispatchHistoryGroupItem
    ): void {
        const isTimeValid =
            DispatchHistoryModalDateHelper.checkIsTimeEndBeforeOrSameNextTimeStart(
                selectedGroupItem.timeEnd,
                nextGroupItem.timeStart
            );

        const isGroupItemsRowValid = this.checkIsGroupItemsRowValid();

        if (isTimeValid && isGroupItemsRowValid) {
            const { dateStart, timeStart, dateEnd, timeEnd } =
                selectedGroupItem;

            this.updateGroupHistoryData(
                false,
                dateStart,
                timeStart,
                dateEnd,
                timeEnd
            );
        } else if (!isTimeValid) {
            this.setInputValidationToInvalid(
                DispatchHistoryModalStringEnum.TIME_END
            );
        }
    }

    private handleSameDateTime(
        selectedGroupItem: DispatchHistoryGroupItem
    ): void {
        const { dateStart, timeStart, dateEnd, timeEnd } = selectedGroupItem;

        const isGroupItemsRowValid = this.checkIsGroupItemsRowValid();

        const isSameDate =
            DispatchHistoryModalDateHelper.checkIsSelectedDateBeforeOrSameAsSelectedGroupItemDateEnd(
                dateStart,
                dateEnd
            ).isSelectedDateSameAsSelectedGroupItemDateEnd;

        const isTimeStartBeforeOrSameTimeEnd =
            DispatchHistoryModalDateHelper.checkIsTimeStartBeforeOrSameTimeEnd(
                timeStart,
                timeEnd
            );

        if (
            (!isSameDate || isTimeStartBeforeOrSameTimeEnd) &&
            isGroupItemsRowValid
        ) {
            this.updateGroupHistoryData(
                false,
                dateStart,
                timeStart,
                dateEnd,
                timeEnd
            );
        } else {
            this.setInputValidationToInvalid(
                DispatchHistoryModalStringEnum.TIME_END
            );
        }
    }

    private updateTotalColumnValue(
        dateStart: string,
        timeStart: string,
        dateEnd: string,
        timeEnd: string
    ): void {
        const formatedDateAndTimeStart =
            DispatchHistoryModalDateHelper.createDateAndTimeFormat(
                dateStart,
                timeStart
            );
        const formatedDateAndTimeEnd =
            DispatchHistoryModalDateHelper.createDateAndTimeFormat(
                dateEnd,
                timeEnd
            );

        const total = DispatchHistoryModalDateHelper.createTotalColumnValue(
            formatedDateAndTimeStart,
            formatedDateAndTimeEnd
        );

        this.getDispatchHistoryGroup(this.groupIndex)
            .at(this.itemIndex)
            .get(DispatchHistoryModalStringEnum.TOTAL_TIME)
            .patchValue(total, { emitEvent: false });
    }

    private updateGroupHistoryData(
        isSkipUpdateTotalColumn: boolean,
        dateStart?: string,
        timeStart?: string,
        dateEnd?: string,
        timeEnd?: string
    ): void {
        if (!isSkipUpdateTotalColumn) {
            this.updateTotalColumnValue(dateStart, timeStart, dateEnd, timeEnd);

            const id = this.getDispatchHistoryGroup(this.groupIndex).at(
                this.itemIndex
            ).value.id;

            const formatedDateAndTimeStart =
                DispatchHistoryModalDateHelper.createDateAndTimeFormat(
                    dateStart,
                    timeStart
                );
            const formatedDateAndTimeEnd =
                DispatchHistoryModalDateHelper.createDateAndTimeFormat(
                    dateEnd,
                    timeEnd
                );

            const data = {
                id,
                startDate: formatedDateAndTimeStart,
                endDate: formatedDateAndTimeEnd,
            };

            this.dispatcherService
                .updateDispatchHistoryGroup(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        } else {
            const id = this.getDispatchHistoryGroup(this.groupIndex).at(
                this.itemIndex
            ).value.id;

            const formatedDateAndTimeStart =
                DispatchHistoryModalDateHelper.createDateAndTimeFormat(
                    this.getDispatchHistoryGroup(this.groupIndex).at(
                        this.itemIndex
                    ).value.dateStart,
                    this.getDispatchHistoryGroup(this.groupIndex).at(
                        this.itemIndex
                    ).value.timeStart
                );

            const data = {
                id,
                startDate: formatedDateAndTimeStart,
                endDate: null,
            };

            this.dispatcherService
                .updateDispatchHistoryGroup(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    private updateGroupHistory(
        dispatchHistoryGroupItems: DispatchHistoryGroupItem[][]
    ): void {
        if (this.groupIndex >= 0) {
            const selectedGroupItem =
                dispatchHistoryGroupItems[this.groupIndex][this.itemIndex];
            const nextGroupItem =
                dispatchHistoryGroupItems[this.groupIndex][this.itemIndex - 1];
            const previousGroupItem =
                dispatchHistoryGroupItems[this.groupIndex][this.itemIndex + 1];

            switch (this.selectedFormControlName) {
                case DispatchHistoryModalStringEnum.DATE_START:
                    this.handleSelectDateStart(
                        selectedGroupItem,
                        nextGroupItem,
                        previousGroupItem
                    );

                    break;
                case DispatchHistoryModalStringEnum.TIME_START:
                    this.handleSelectTimeStart(
                        selectedGroupItem,
                        previousGroupItem
                    );

                    break;
                case DispatchHistoryModalStringEnum.DATE_END:
                    this.handleSelectDateEnd(selectedGroupItem, nextGroupItem);

                    break;
                case DispatchHistoryModalStringEnum.TIME_END:
                    this.handleSelectTimeEnd(selectedGroupItem, nextGroupItem);

                    break;
                default:
                    break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
