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

import { TableStringEnum } from '@shared/enums/table-string.enum';

@Component({
    selector: 'app-ta-table-empty',
    templateUrl: './ta-table-empty.component.html',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./ta-table-empty.component.scss'],
})
export class TaTableEmptyComponent implements OnInit, OnChanges {
    public taStringEnum = TableStringEnum;
    public emptyColums: number[] = [];
    private columnCountCard: number = 6;
    private columnCountList: number = 3;
    @Input() view: TableStringEnum.LIST | TableStringEnum.CARD =
        TableStringEnum.LIST;
    @Input() actionTemplate: TemplateRef<Element>;
    @Input() filteredResults: boolean;
    @Input() hasResults: boolean;
    @Output() resetFilter$: EventEmitter<any> = new EventEmitter();

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
