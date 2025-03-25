import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// models
import { CardDetails } from '@shared/models';
@Component({
    selector: 'app-table-card-view',
    templateUrl: './table-card-view.component.html',
    styleUrl: './table-card-view.component.scss',
    standalone: true,
    imports: [CommonModule],
})
export class TableCardViewComponent {
    @Input() set frontSide(value: any) {
        //This is WIP will be changed later...
        this._frontSide = value;
    }
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    public _viewData: CardDetails[];
    public _frontSide: any; //This is WIP will be changed later...
    constructor() {}
}
