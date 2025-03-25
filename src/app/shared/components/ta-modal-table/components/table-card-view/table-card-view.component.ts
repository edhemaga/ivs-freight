import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-table-card-view',
    templateUrl: './table-card-view.component.html',
    styleUrl: './table-card-view.component.scss',
    standalone: true,
    imports: [CommonModule],
})
export class TableCardViewComponent {
    @Input() set frontSide(value) {
      this._frontSide = value;
      console.log(value, 'frontside')
    };
    @Input() set viewData(value) {
      console.log(value, 'vaaaaaaaaal')
      this._viewData = value;
    }
    _viewData;
    _frontSide;
    constructor() {}
}
