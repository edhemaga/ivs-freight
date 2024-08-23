import { Component, Input } from '@angular/core';

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
}
