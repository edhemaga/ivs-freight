import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-truckassist-reveiw',
    templateUrl: './truckassist-reveiw.component.html',
    styleUrls: ['./truckassist-reveiw.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class TruckassistReveiwComponent implements OnInit {
    @Input() data: any;

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes?.data &&
            !changes?.data?.firstChange &&
            changes.data.currentValue !== changes.data.previousValue
        ) {
            this.data = changes.data.currentValue;
        }
    }
}
