import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ParkingDispatchModalResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-dispatch-table-parking',
    templateUrl: './dispatch-table-parking.component.html',
    styleUrls: ['./dispatch-table-parking.component.scss'],
})
export class DispatchTableParkingComponent implements OnInit {
    @Input() parkingList: Array<ParkingDispatchModalResponse> | null;
    @Input() parkingFormControl: UntypedFormControl;
    // TODO: Use throught props
    public isTruckOrTrailerSelected: boolean = true;
    public isParkingAssigned: boolean = true;
    public selectedParking = {};
    constructor() {}
    ngOnInit(): void {}

    public addParking(e: any): void {
        console.log(e);
    }
}
