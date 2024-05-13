import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';

@Component({
    selector: 'app-violation-details-item',
    templateUrl: './violation-details-item.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./violation-details-item.component.scss'],
    animations: [cardComponentAnimation('showHideCardBody')],
})
export class ViolationDetailsItemComponent implements OnInit {
    @Input() violationData: any;
    public toggler: boolean[] = [];
    public note: UntypedFormControl = new UntypedFormControl();
    constructor() {}

    ngOnInit(): void {}

    public identity(index: number, item: any): number {
        return item.id;
    }

    public toggleResizePage(value: number, indexName: string) {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }
}
