import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// pipes
import { TableDoubleHeadHeightPipe } from '@shared/components/ta-table/ta-table-head/pipes';

// models
import { TableHeadActionsData } from '@shared/components/ta-table/ta-table-head/models/table-head-actions-data.model';

@Component({
    selector: 'app-table-head-actions',
    templateUrl: './table-head-actions.component.html',
    styleUrls: ['./table-head-actions.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // pipes
        TableDoubleHeadHeightPipe,
    ],
})
export class TableHeadActionsComponent {
    @Input() tableHeadActionsData: TableHeadActionsData;
    @Input() isDisplayBorder: boolean;

    constructor() {}
}
