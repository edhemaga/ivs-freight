import {
    Component,
    Input,
    Output,
    OnDestroy,
    EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
    NgbPopoverModule,
    NgbPopover,
    NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

// Svg Routes
import { SortDropdownSvgRoutes } from '@shared/components/ta-sort-dropdown/utils/svg-routes';

// Models
import { SortColumn } from '@shared/components/ta-sort-dropdown/models';

// Enums
import { SortDropdownEnum } from '@shared/components/ta-sort-dropdown/enums';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-ta-sort-dropdown',
    templateUrl: './ta-sort-dropdown.component.html',
    styleUrls: ['./ta-sort-dropdown.component.scss'],
    standalone: true,
    imports: [
        // Modules
        AngularSvgIconModule,
        NgbPopoverModule,
        NgbTooltipModule,
        CommonModule,

        // Components
        TaAppTooltipV2Component,
    ],
})
export class TaSortDropdownComponent implements OnDestroy {
    @Input() set sortColumns(values: SortColumn[]) {
        this._sortColumns = values;

        if (!this.activeSortColumn) this.sortChangeEvent(this._sortColumns[0]);
    }
    @Input() activeSortColumn: SortColumn | null = null;
    @Input() dropdownPosition: string = SortDropdownEnum.RIGHT_TOP;
    @Input() dropdownWidth: number = 100;
    @Output() onSortChange: EventEmitter<{
        column: SortColumn;
        sortName: string;
    }> = new EventEmitter();

    private destroy$ = new Subject<void>();

    public sortDropdownSvgRoutes = SortDropdownSvgRoutes;

    public sortDirection: string = SortDropdownEnum.DESC;

    public sortDirectionsRotate = {
        asc: SortDropdownEnum.DESC,
        desc: SortDropdownEnum.ASC,
    };

    public sortDropdownPopover: NgbPopover;

    public isDropdownOpen: boolean = false;

    public _sortColumns: SortColumn[] = [];

    public sortDirectionChange(): void {
        this.sortDirection = this.sortDirectionsRotate[this.sortDirection];

        this.sortChangeEvent();
    }

    public sortChangeEvent(column?: SortColumn): void {
        if (column) this.activeSortColumn = column;

        const directionSort = this.sortDirection
            ? this.activeSortColumn.sortName +
              (this.sortDirection[0]?.toUpperCase() +
                  this.sortDirection?.substr(1).toLowerCase())
            : '';

        this.onSortChange.emit({
            column: this.activeSortColumn,
            sortName: directionSort,
        });

        if (this.sortDropdownPopover?.isOpen())
            this.openClosePopover(this.sortDropdownPopover);
    }

    public openClosePopover(popover: NgbPopover): void {
        this.sortDropdownPopover = popover;

        if (this.sortDropdownPopover.isOpen()) this.sortDropdownPopover.close();
        else this.sortDropdownPopover.open();

        this.isDropdownOpen = this.sortDropdownPopover.isOpen();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
