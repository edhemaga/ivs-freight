import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// interfaces
import { IToolbarWidth } from '@shared/interfaces';

// svg routes
import { TableEmptySvgRoutes } from '@shared/components/ta-table/ta-table-empty/utils/svg-routes';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Component({
    selector: 'app-ta-table-empty',
    templateUrl: './ta-table-empty.component.html',
    styleUrls: ['./ta-table-empty.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
})
export class TaTableEmptyComponent implements OnInit, OnChanges, OnDestroy {
    @Input() activeViewMode: TableStringEnum.LIST | TableStringEnum.CARD =
        TableStringEnum.LIST;

    private destroy$ = new Subject<void>();

    // empty grid
    public toolbarWidth: IToolbarWidth;

    // svg routes
    public tableEmptySvgRoutes = TableEmptySvgRoutes;

    ////////////////////////////////////////////////////////////////////////////////////

    @Input() filteredResults: boolean;
    @Input() hasResults: boolean;

    @Output() resetFilter$: EventEmitter<boolean> = new EventEmitter();

    public emptyGridPlaceholder: number[] = [];

    // enums
    public taStringEnum = TableStringEnum;

    constructor(private tableService: TruckassistTableService) {}

    ngOnInit(): void {
        this.getToolbarWidth();
    }

    ngOnChanges(): void {
        this.fillEmptyGridPlaceholder();
    }

    private fillEmptyGridPlaceholder(): void {
        const columnCountCard: number = 6;
        const columnCountList: number = 3;

        this.emptyGridPlaceholder = Array(
            this.activeViewMode === TableStringEnum.LIST
                ? columnCountList
                : columnCountCard
        ).fill(0);
    }

    private getToolbarWidth(): void {
        this.tableService.currentToolbarWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((toolbarWidth) => {
                this.toolbarWidth = toolbarWidth;
            });
    }

    ////////////////////////////////////////////////////////

    public get isEmptyList(): boolean {
        if (!this.hasResults && this.filteredResults) {
            return true;
        }

        return false;
    }

    public resetFilters(): void {
        this.resetFilter$.emit(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
