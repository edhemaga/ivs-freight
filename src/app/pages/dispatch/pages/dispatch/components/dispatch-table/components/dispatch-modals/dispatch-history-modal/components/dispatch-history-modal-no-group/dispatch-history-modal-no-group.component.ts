import { Component, EventEmitter, Input, Output } from '@angular/core';

// interfaces
import { NoGroupItemEmitAction } from '@pages/dispatch/pages/dispatch/components/dispatch-table/interfaces';

@Component({
    selector: 'app-dispatch-history-modal-no-group',
    templateUrl: './dispatch-history-modal-no-group.component.html',
    styleUrls: ['./dispatch-history-modal-no-group.component.scss'],
})
export class DispatchHistoryModalNoGroupComponent {
    @Input() noGroupClass: string;
    @Input() noGroupHeaderItems: string[];
    @Input() noGroupData: string[][] = [];
    @Input() noGroupItemSpanArray: number[][] = [];
    @Input() noGroupItemSpanClassNameArray: string[][] = [];

    @Output() onNoGroupItemAction: EventEmitter<NoGroupItemEmitAction> =
        new EventEmitter();

    public hoveredSpanGroup: string;

    constructor() {}

    public trackByIdentity = (index: number): number => index;

    public handleSpanGroupHover(
        isHover?: boolean,
        rowIndex?: number,
        colIndex?: number
    ): void {
        this.hoveredSpanGroup = isHover
            ? this.noGroupItemSpanClassNameArray[rowIndex][colIndex]
            : null;
    }

    public onNoGroupItemClick(
        noGroupItem: string,
        noGroupItemIndex: number,
        noGroupItemDataIndex: number,
        noGroupItemSpanClassName: string
    ): void {
        const selectedDrodpownListName =
            this.noGroupHeaderItems[noGroupItemIndex];

        let clickedItem: string;

        if (!noGroupItem) {
            const firstNoGroupItemDataIndex =
                this.noGroupItemSpanClassNameArray.findIndex((row) =>
                    row.includes(noGroupItemSpanClassName)
                );

            const filteredNoGroupData = this.noGroupData.slice(
                firstNoGroupItemDataIndex,
                noGroupItemDataIndex
            );

            clickedItem = filteredNoGroupData
                .map((row) => row[noGroupItemIndex])
                .find((value) => !!value);
        } else {
            clickedItem = noGroupItem;
        }

        const emitAction = { clickedItem, selectedDrodpownListName };

        clickedItem && this.onNoGroupItemAction.emit(emitAction);
    }
}
