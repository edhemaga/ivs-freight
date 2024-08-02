import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-dispatch-table-info',
    templateUrl: './dispatch-table-info.component.html',
    styleUrls: ['./dispatch-table-info.component.scss'],
})
export class DispatchTableInfoComponent {
    @Input() count: number;
    @Input() totalCount: number;
    @Input() type: string;
    @Input() name: string;
    @Input() alignRight: boolean = false;

    constructor() {}
}
