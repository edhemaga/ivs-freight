import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnChanges,
    OnInit,
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
}
