import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    TemplateRef,
} from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

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
export class TaTableEmptyComponent implements OnInit, OnChanges {
    @Input() view: TableStringEnum.LIST | TableStringEnum.CARD =
        TableStringEnum.LIST;

    @Input() actionTemplate: TemplateRef<Element>;
    @Input() filteredResults: boolean;
    @Input() hasResults: boolean;

    @Output() resetFilter$: EventEmitter<boolean> = new EventEmitter();

    // columns
    public emptyColums: number[] = [];

    private columnCountCard: number = 6;
    private columnCountList: number = 3;

    // enums
    public taStringEnum = TableStringEnum;

    // svg routes
    public tableEmptySvgRoutes = TableEmptySvgRoutes;

    ngOnInit(): void {
        this.fillColumns();
    }

    ngOnChanges(): void {
        this.fillColumns();
    }

    private fillColumns(): void {
        this.emptyColums = Array(
            this.view === TableStringEnum.LIST
                ? this.columnCountList
                : this.columnCountCard
        ).fill(0);
    }

    public get isEmptyList(): boolean {
        if (!this.hasResults && this.filteredResults) {
            return true;
        }

        return false;
    }

    public resetFilters(): void {
        this.resetFilter$.emit(true);
    }
}
