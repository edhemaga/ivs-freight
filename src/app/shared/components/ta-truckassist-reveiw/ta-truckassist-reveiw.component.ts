import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-ta-truckassist-reveiw',
    templateUrl: './ta-truckassist-reveiw.component.html',
    styleUrls: ['./ta-truckassist-reveiw.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, AngularSvgIconModule],
})
export class TaTruckassistReveiwComponent implements OnInit {
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
