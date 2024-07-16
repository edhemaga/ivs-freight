import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { DispatchBoardParking } from '@pages/dispatch/models/dispatch-parking.model';
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/utils/helpers/dispatch-parking-svg-routes';

@Component({
    selector: 'app-dispatch-table-parking',
    templateUrl: './dispatch-table-parking.component.html',
    styleUrls: ['./dispatch-table-parking.component.scss'],
})
export class DispatchTableParkingComponent implements OnInit {
    @Input() parkingList: Array<DispatchBoardParking> | null;
    @Input() parkingFormControl: UntypedFormControl;

    public svgRoutes = DispatchParkingSvgRoutes;
    // TODO: Use throught props
    public isTruckOrTrailerSelected: boolean = false;
    public isParkingAssigned: boolean = false;
    public isMultipleParkingSlots: boolean;
    constructor() {}
    ngOnInit(): void {
        this.handleListVisibility();
    }

    private handleListVisibility() {
        // We can have parking with 0 slots
        this.isMultipleParkingSlots =
            this.parkingList.filter(
                (parkingList) => parkingList.parkingSlots.length > 0
            ).length > 1;

        // If we have only one parking, open it and remove parking title
        if (!this.isMultipleParkingSlots) {
            this.parkingList[0].isDropdownVisible = true;
        }
    }

    public addParking(e: any): void {}

    openParkingList(index: number) {
        const parking = this.parkingList[index];
        this.parkingList[index] = {
            ...parking,
            isDropdownVisible: !parking.isDropdownVisible,
        };
    }
}
