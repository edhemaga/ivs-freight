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
import { GroupItem } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/group-item.model';

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

    public isInputHoverRows: boolean[][][] = [];

    public isHoveringGroupIndex: number = -1;
    public isHoveringGroupItemIndex: number = -1;

    public groupIndex: number = -1;
    public itemIndex: number = -1;

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
            .subscribe((value) => {
                this.updateGroupHistory(value);
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
                        });
                    })
                );

                itemsArray.push(itemsGroup);
            });

            this.monitorUpdateGroupHistoryData();
        }, 200);
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
        itemIndex: number
    ): void {
        this.groupIndex = groupIndex;
        this.itemIndex = itemIndex;
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
