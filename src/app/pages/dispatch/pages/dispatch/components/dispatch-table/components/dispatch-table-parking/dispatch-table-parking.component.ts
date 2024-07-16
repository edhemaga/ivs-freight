import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// Svg routes
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/utils/helpers/dispatch-parking-svg-routes';

// Models
import { DispatchBoardParking } from '@pages/dispatch/models/dispatch-parking.model';
import { ParkingSlotDispatchModalResponse, ParkingSlotShortResponse } from 'appcoretruckassist';


@Component({
    selector: 'app-dispatch-table-parking',
    templateUrl: './dispatch-table-parking.component.html',
    styleUrls: ['./dispatch-table-parking.component.scss'],
})
export class DispatchTableParkingComponent implements OnInit {
    // Inputs
    @Input() parkingList: Array<DispatchBoardParking> | null;
    @Input() parkingSlot: ParkingSlotShortResponse | null;
    @Input() parkingFormControl: UntypedFormControl;
    
    // Ouputs
    @Output() addOrUpdateParking = new EventEmitter();

    // Svg routes 
    public svgRoutes = DispatchParkingSvgRoutes;
    
    // TODO: Use throught props
    public isTruckOrTrailerSelected: boolean = false;
    public isMultipleParkingSlots: boolean;
    constructor() {}
    ngOnInit(): void {
        this.handleListVisibility();
    }


    public get isParkingAssigned() : boolean {
        return !!this.parkingSlot;
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

    public addParking(parkingSlot: ParkingSlotDispatchModalResponse): void {
        // Parking cannot be reassign, user needs to remove it first
        if(!!this.parkingSlot) {
            return;
        }
        this.addOrUpdateParking.emit(parkingSlot);
    }

    public removeParking(): void {
        this.addOrUpdateParking.emit({id: null});
    }

    openParkingList(index: number) {
        const parking = this.parkingList[index];
        this.parkingList[index] = {
            ...parking,
            isDropdownVisible: !parking.isDropdownVisible,
        };
    }
}
