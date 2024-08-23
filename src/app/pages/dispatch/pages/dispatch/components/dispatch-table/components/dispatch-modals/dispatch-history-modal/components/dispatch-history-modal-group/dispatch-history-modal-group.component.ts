import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
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

// enums
import { DispatchHistoryModalStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-history-modal-string.enum';

// configs
import { DispatchHistoryModalConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs/dispatch-history-modal.config';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DispatchHistoryModalHelper } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/helpers/dispatch-history-modal.helper';

// constants
import { DispatchHistoryModalConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants/dispatch-history-modal.constants';

// models
import { DispatchHistoryGroupResponse } from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { DispatchInputConfigParams } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/dispatch-input-config-params.model';
import { DispatchHistoryGroupItem } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/dispatch-history-group-item.model';

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

    constructor(private formBuilder: UntypedFormBuilder) {}

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

    private monitorUpdateGroupHistoryData(): void {
        console.log('monitoring');
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

    isBackendUpdate: boolean = false;

    checkIsSelectedDateSameOrAfterPreviousDate(
        dateStart: string,
        dateEnd: string
    ): boolean {
        const selectedGroupItemDateStart = moment(dateStart, 'MM/DD/YY');

        const previousGroupItemDateEnd = moment(dateEnd, 'MM/DD/YY');

        const isSelectedDateSameOrAfterPreviousDate =
            selectedGroupItemDateStart.isSame(previousGroupItemDateEnd) ||
            selectedGroupItemDateStart.isAfter(previousGroupItemDateEnd);

        return isSelectedDateSameOrAfterPreviousDate;
    }

    checkIsSelectedDateBeforeOrSameAsSelectedGroupItemDateEnd(
        dateStart: string,
        dateEnd: string
    ): {
        isSelectedDateBeforeSelectedGroupItemDateEnd: boolean;
        isSelectedDateSameAsSelectedGroupItemDateEnd: boolean;
    } {
        const selectedGroupItemDateStart = moment(dateStart, 'MM/DD/YY');

        const selectedGroupItemDateEnd = moment(dateEnd, 'MM/DD/YY');

        const isSelectedDateBeforeSelectedGroupItemDateEnd =
            selectedGroupItemDateStart.isBefore(selectedGroupItemDateEnd);

        const isSelectedDateSameAsSelectedGroupItemDateEnd =
            selectedGroupItemDateStart.isSame(selectedGroupItemDateEnd);

        return {
            isSelectedDateBeforeSelectedGroupItemDateEnd,
            isSelectedDateSameAsSelectedGroupItemDateEnd,
        };
    }

    checkIsTimeStartBeforeOrSameTimeEnd(
        timeStart: string,
        timeEnd: string
    ): boolean {
        const selectedGroupItemTimeStart = moment(
            /* timeStart */ '06:15 AM',
            'hh:mm A'
        );
        const selectedGroupItemTimeEnd = moment(
            /* timeEnd */ '05:15 AM',
            'hh:mm A'
        );

        const isTimeStartBeforeOrSameTimeEnd =
            selectedGroupItemTimeStart.isBefore(selectedGroupItemTimeEnd) ||
            selectedGroupItemTimeStart.isSame(selectedGroupItemTimeEnd);

        return isTimeStartBeforeOrSameTimeEnd;
    }

    createDateAndTimeFormat(date: string, time: string): string {
        const combinedDateTime = moment(
            `${date} ${time}`,
            'MM/DD/YY hh:mm A'
        ).format('YYYY-MM-DDTHH:mm:ss.SSSSSS');

        return combinedDateTime;
    }

    checkIsGroupItemsRowValid(): boolean {
        return this.getDispatchHistoryGroup(this.groupIndex).at(this.itemIndex)
            .valid;
    }

    setInputValidationToInvalid(formControlName: string): void {
        this.getDispatchHistoryGroup(this.groupIndex)
            .at(this.itemIndex)
            .get(formControlName)
            .setErrors({ invalid: true });
    }

    updateTotalColumnValue(
        dateStart: string,
        timeStart: string,
        dateEnd: string,
        timeEnd: string
    ): void {
        const formatedDateAndTimeStart = this.createDateAndTimeFormat(
            dateStart,
            timeStart
        );
        const formatedDateAndTimeEnd = this.createDateAndTimeFormat(
            dateEnd,
            timeEnd
        );

        const total = DispatchHistoryModalHelper.createTotalColumnValue(
            formatedDateAndTimeStart,
            formatedDateAndTimeEnd
        );

        this.getDispatchHistoryGroup(this.groupIndex)
            .at(this.itemIndex)
            .get('totalTime')
            .patchValue(total);

        this.isBackendUpdate = false;
    }

    isSelectedDateBeforeSelectedGroupItemDateEnd;

    handleSelectedDateBeforeOrSameDateEnd() {}

    updateGroupHistoryData(
        dateStart: string,
        timeStart: string,
        dateEnd: string,
        timeEnd: string
    ): void {
        this.isBackendUpdate = true;

        this.updateTotalColumnValue(dateStart, timeStart, dateEnd, timeEnd);

        // TODO UPDATE BACKEND
    }

    private updateGroupHistory(
        dispatchHistoryGroupItems: DispatchHistoryGroupItem[][]
    ): void {
        if (this.isBackendUpdate) return;

        console.log('dispatchHistoryGroupItems', dispatchHistoryGroupItems);

        /* console.log('groupIndex', this.groupIndex);
        console.log('itemIndex', this.itemIndex);
        console.log(
            'this.selectedFormControlName',
            this.selectedFormControlName
        ); */

        const selectedGroupItem =
            dispatchHistoryGroupItems[this.groupIndex][this.itemIndex];
        const nextGroupItem =
            dispatchHistoryGroupItems[this.groupIndex][this.itemIndex - 1];
        const previousGroupItem =
            dispatchHistoryGroupItems[this.groupIndex][this.itemIndex + 1];

        console.log('selectedGroupItem', selectedGroupItem);
        console.log('nextGroupItem', nextGroupItem);
        console.log('previousGroupItem', previousGroupItem);

        if (this.selectedFormControlName === 'dateStart') {
            /* DATE START - HAS NEXT STATUS */
            if (nextGroupItem) {
                /* DATE START - HAS PREVIOUS STATUS */
                if (previousGroupItem) {
                    const isSelectedDateSameOrAfterPreviousDate =
                        this.checkIsSelectedDateSameOrAfterPreviousDate(
                            selectedGroupItem.dateStart,
                            previousGroupItem.dateEnd
                        );

                    if (isSelectedDateSameOrAfterPreviousDate) {
                        const {
                            isSelectedDateBeforeSelectedGroupItemDateEnd,
                            isSelectedDateSameAsSelectedGroupItemDateEnd,
                        } =
                            this.checkIsSelectedDateBeforeOrSameAsSelectedGroupItemDateEnd(
                                selectedGroupItem.dateStart,
                                selectedGroupItem.dateEnd
                            );

                        if (
                            isSelectedDateBeforeSelectedGroupItemDateEnd ||
                            isSelectedDateSameAsSelectedGroupItemDateEnd
                        ) {
                            if (isSelectedDateBeforeSelectedGroupItemDateEnd) {
                                const isGroupItemsRowValid =
                                    this.checkIsGroupItemsRowValid();

                                if (isGroupItemsRowValid) {
                                    this.updateGroupHistoryData(
                                        selectedGroupItem.dateStart,
                                        selectedGroupItem.timeStart,
                                        selectedGroupItem.dateEnd,
                                        selectedGroupItem.timeEnd
                                    );

                                    console.log('VALID, UPDATE BACK');
                                } else {
                                    console.log('INVALID');
                                }
                            } else {
                                const isTimeStartBeforeOrSameTimeEnd =
                                    this.checkIsTimeStartBeforeOrSameTimeEnd(
                                        selectedGroupItem.timeStart,
                                        selectedGroupItem.timeEnd
                                    );

                                if (isTimeStartBeforeOrSameTimeEnd) {
                                    const isGroupItemsRowValid =
                                        this.checkIsGroupItemsRowValid();

                                    if (isGroupItemsRowValid) {
                                        console.log('VALID, UPDATE TOTAL');
                                    } else {
                                        console.log('INVALID');
                                    }
                                } else {
                                    this.setInputValidationToInvalid(
                                        'timeStart'
                                    );
                                }
                            }
                        } else {
                            this.setInputValidationToInvalid('dateStart');
                        }
                    } else {
                        this.setInputValidationToInvalid('dateStart');
                    }
                } else {
                    /* DATE START - NO PREVIOUS STATUS */
                    const {
                        isSelectedDateBeforeSelectedGroupItemDateEnd,
                        isSelectedDateSameAsSelectedGroupItemDateEnd,
                    } =
                        this.checkIsSelectedDateBeforeOrSameAsSelectedGroupItemDateEnd(
                            selectedGroupItem.dateStart,
                            selectedGroupItem.dateEnd
                        );

                    if (
                        isSelectedDateBeforeSelectedGroupItemDateEnd ||
                        isSelectedDateSameAsSelectedGroupItemDateEnd
                    ) {
                        if (isSelectedDateBeforeSelectedGroupItemDateEnd) {
                            const isGroupItemsRowValid =
                                this.checkIsGroupItemsRowValid();

                            if (isGroupItemsRowValid) {
                                console.log('VALID, UPDATE TOTAL');
                            } else {
                                console.log('INVALID');
                            }
                        } else {
                            const isTimeStartBeforeOrSameTimeEnd =
                                this.checkIsTimeStartBeforeOrSameTimeEnd(
                                    selectedGroupItem.timeStart,
                                    selectedGroupItem.timeEnd
                                );

                            if (isTimeStartBeforeOrSameTimeEnd) {
                                const isGroupItemsRowValid =
                                    this.checkIsGroupItemsRowValid();

                                if (isGroupItemsRowValid) {
                                    console.log('VALID, UPDATE TOTAL');
                                } else {
                                    console.log('INVALID');
                                }
                            } else {
                                this.setInputValidationToInvalid('timeStart');
                            }
                        }
                    } else {
                        this.setInputValidationToInvalid('dateStart');
                    }
                }
            } else {
                /* DATE START - NO NEXT STATUS - FIRST IN LIST */
                /* DATE START - HAS PREVIOUS STATUS */
                if (previousGroupItem) {
                    const isSelectedDateSameOrAfterPreviousDate =
                        this.checkIsSelectedDateSameOrAfterPreviousDate(
                            selectedGroupItem.dateStart,
                            previousGroupItem.dateEnd
                        );

                    if (isSelectedDateSameOrAfterPreviousDate) {
                        console.log('VALID, UPDATE BACK');
                    } else {
                        this.setInputValidationToInvalid('dateStart');
                    }
                } else {
                    /* DATE START - NO PREVIOUS STATUS - ONE IN LIST*/
                    console.log('VALID, UPDATE TOTAL');
                }
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
