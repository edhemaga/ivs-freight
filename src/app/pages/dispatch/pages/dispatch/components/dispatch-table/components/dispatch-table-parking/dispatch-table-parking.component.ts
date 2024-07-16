import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
} from '@angular/forms';

// Svg routes
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/utils/helpers/dispatch-parking-svg-routes';

// Models
import { DispatchBoardParking } from '@pages/dispatch/models/dispatch-parking.model';
import {
    ParkingSlotDispatchModalResponse,
    ParkingSlotShortResponse,
} from 'appcoretruckassist';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

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

    // Form
    public parkingForm: UntypedFormGroup;

    // Popover
    @ViewChild('t2', { static: true }) public popover: NgbPopover;

    // Use to show on frontend so we don't change orginal data
    public filteredParkingList: Array<DispatchBoardParking>;
    public isTruckOrTrailerSelected: boolean = false;
    // If we have only one parking no need to show name
    public isMultipleParkingSlots: boolean;
    public isInputInFocus: boolean = false;
    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.handleListVisibility();
        this.createForm();
    }

    private createForm() {
        this.parkingForm = this.formBuilder.group({
            parking: [null],
        });

        this.parkingForm
            .get('parking')
            .valueChanges.subscribe((value) => this.filterParkingList(value));
        this.filteredParkingList = this.parkingList;
    }

    private filterParkingList(input: string): void {
        if (input) {
            const searchValue = input.toLowerCase();
            this.filteredParkingList = this.parkingList
                .map((parking) => ({
                    ...parking,
                    parkingSlots: parking.parkingSlots.filter((slot) =>
                        slot.slotNumber.toString().includes(searchValue)
                    ),
                    isDropdownVisible: parking.parkingSlots.some((slot) =>
                        slot.slotNumber.toString().includes(searchValue)
                    ),
                }))
                .filter((parking) => parking.parkingSlots.length > 0);
        } else {
            this.filteredParkingList = this.parkingList;
        }
    }

    public get isParkingAssigned(): boolean {
        return !!this.parkingSlot;
    }

    private handleListVisibility(): void {
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
        if (!!this.parkingSlot) {
            return;
        }
        this.addOrUpdateParking.emit(parkingSlot);
        this.isInputInFocus = false;
        this.popover.close();
    }

    public removeParking(): void {
        this.addOrUpdateParking.emit({ id: null });
    }

    public openParkingList(index: number): void {
        const parking = this.filteredParkingList[index];
        this.filteredParkingList[index] = {
            ...parking,
            isDropdownVisible: !parking.isDropdownVisible,
        };
    }

    public showInputField(): void {
        this.isInputInFocus = true;
    }

    public inputOnFocusOut(): void {
        this.isInputInFocus = false;
        setTimeout(() => this.parkingForm.get('parking').patchValue(''), 150);
    }
}
