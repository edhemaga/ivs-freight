import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { EnumValue } from 'appcoretruckassist';

@Component({
    selector: 'app-pri-trip-inspection',
    templateUrl: './pri-trip-inspection.component.html',
    styleUrls: ['./pri-trip-inspection.component.scss'],
    standalone: true,
    imports: [AngularSvgIconModule, CommonModule],
})
export class PriTripInspectionComponent implements OnInit {
    private _status: string = '';
    @Input() set status(value: EnumValue | null) {
        this._status = value.name;
    }
    get status(): string {
        return this._status;
    }

    doneInspection: boolean = true;
    constructor() {}

    ngOnInit(): void {
        console.log(this.status);
    }
}
