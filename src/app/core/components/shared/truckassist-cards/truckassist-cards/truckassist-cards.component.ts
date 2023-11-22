import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { LoadDetails, LoadTableData } from '../dataTypes';
@Component({
    selector: 'app-truckassist-cards',
    templateUrl: './truckassist-cards.component.html',
    styleUrls: ['./truckassist-cards.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class TruckassistCardsComponent implements OnInit {
    @Input() viewData: LoadDetails[];
    @Input() tableData: LoadTableData[];
    constructor() {}

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.viewData, 'viewData', this.tableData, 'tableData');
    }
}
