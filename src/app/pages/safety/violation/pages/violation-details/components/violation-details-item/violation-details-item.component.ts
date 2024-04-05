import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// animations
import { card_component_animation } from 'src/app/core/components/shared/animations/card-component.animations';

@Component({
    selector: 'app-violation-details-item',
    templateUrl: './violation-details-item.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./violation-details-item.component.scss'],
    animations: [card_component_animation('showHideCardBody')],
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
