import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-pri-trip-inspection',
    templateUrl: './pri-trip-inspection.component.html',
    styleUrls: ['./pri-trip-inspection.component.scss'],
    standalone: true,
    imports: [AngularSvgIconModule, CommonModule],
})
export class PriTripInspectionComponent implements OnInit {
    private _status: number = 0;
    @Input() set status(value: number | null) {
        this._status = value !== null ? value : 0;
    }
    get status(): number {
        return this._status;
    }

    doneInspection: boolean = true;
    constructor() {}

    ngOnInit(): void {
        console.log(this.status);
    }
}
