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

// components
import { CaModalButtonComponent, eModalButtonClassType } from 'ca-components';

// interfaces
import { IToolbarWidth } from '@shared/interfaces';

// svg routes
import { TableEmptySvgRoutes } from '@shared/components/ta-table/ta-table-empty/utils/svg-routes';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { eTableEmpty } from '@shared/components/ta-table/ta-table-empty/enums';
import { eModalButtonText } from '@shared/enums';

@Component({
    selector: 'app-ta-table-empty',
    templateUrl: './ta-table-empty.component.html',
    styleUrls: ['./ta-table-empty.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        CaModalButtonComponent,
    ],
})
export class TaTableEmptyComponent implements OnInit, OnChanges, OnDestroy {
    @Input() activeViewMode: TableStringEnum.LIST | TableStringEnum.CARD =
        TableStringEnum.LIST;

    @Input() btnText: string;
    @Input() hasResults: boolean;
    @Input() filteredResults: boolean;

    @Output() btnClickEmitter: EventEmitter<string> = new EventEmitter();

    // empty grid
    public emptyGridPlaceholder: number[] = [];

    public toolbarWidth: IToolbarWidth;

    // enums
    public taStringEnum = TableStringEnum;
    public eModalButtonClassType = eModalButtonClassType;
    public emodalButtonText = eModalButtonText;
    public eTableEmpty = eTableEmpty;

    // svg routes
    public tableEmptySvgRoutes = TableEmptySvgRoutes;

    private destroy$ = new Subject<void>();

    constructor(private tableService: TruckassistTableService) {}

    ngOnInit(): void {
        this.getToolbarWidth();
    }

    ngOnChanges(): void {
        this.fillEmptyGridPlaceholder();
    }

    public handleBtnClick(btnClickType: string): void {
        this.btnClickEmitter.emit(btnClickType);
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
            .subscribe((toolbarWidth) => (this.toolbarWidth = toolbarWidth));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
