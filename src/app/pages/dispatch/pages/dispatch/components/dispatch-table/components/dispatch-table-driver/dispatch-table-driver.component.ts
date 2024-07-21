import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-dispatch-table-driver',
    templateUrl: './dispatch-table-driver.component.html',
    styleUrls: ['./dispatch-table-driver.component.scss'],
})
export class DispatchTableDriverComponent implements OnInit {
    @Input() driver: any;
    @Input() rowIndex: number;
    @Input() driverList: any;
    @Input() isBoardLocked: boolean;
    @Input() phone: string;
    @Input() email: string;
    @Input() isDrag: boolean;
    @Input() draggingType: string;
    @Input() openedDriverDropdown: number;

    constructor() {}

    ngOnInit(): void {}
}
