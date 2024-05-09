import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-table-head-border',
    templateUrl: './table-head-border.component.html',
    styleUrls: ['./table-head-border.component.scss'],
    standalone: true,
})
export class TableHeadBorderComponent {
    @Input() isBorderLeft?: boolean = true;
    @Input() isDisplayBorder: boolean = false;

    constructor() {}
}
