import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { LoadDetails, LoadTableData } from '../dataTypes';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
@Component({
    selector: 'app-truckassist-cards',
    templateUrl: './truckassist-cards.component.html',
    styleUrls: ['./truckassist-cards.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
})
export class TruckassistCardsComponent implements OnInit {
    @Input() viewData: LoadDetails[];
    @Input() tableData: LoadTableData[];
    isCardFlipped = false;
    constructor(private tableService: TruckassistTableService) {}

    ngOnInit(): void {
        this.tableService.currentSelectOrDeselect.subscribe((response: any) => {
            console.log(response);
        });
    }
    ngOnChanges(changes: SimpleChanges): void {}
    flipCard(index) {
        this.viewData[index].isFlipped = !this.viewData[index].isFlipped;
    }
    onSelectItem(card, i) {
        console.log(card, i);
    }
    trackCard(item: number) {
        return item;
    }
}
