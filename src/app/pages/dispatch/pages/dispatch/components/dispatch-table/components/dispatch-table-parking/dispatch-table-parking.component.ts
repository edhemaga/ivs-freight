import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Svg routes
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/utils/helpers/dispatch-parking-svg-routes';

// Models
import { DispatchBoardParking } from '@pages/dispatch/models/dispatch-parking.model';
import {
    ParkingSlotDispatchModalResponse,
    ParkingSlotShortResponse,
} from 'appcoretruckassist';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// Components
import { SettingsParkingModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-parking-modal/settings-parking-modal.component';

// Services
import { ModalService } from '@shared/services/modal.service';

@Component({
    selector: 'app-dispatch-table-parking',
    templateUrl: './dispatch-table-parking.component.html',
    styleUrls: ['./dispatch-table-parking.component.scss'],
})
export class DispatchTableParkingComponent implements OnInit {
    // Inputs
    @Input() parkingList: Array<DispatchBoardParking> | null;
    @Input() parkingSlot: ParkingSlotShortResponse | null;
    @Input() isTableUnlocked: boolean;
    @Input() isTruckOrTrailerSelected: boolean;
    // Ouputs
    @Output()
    addOrUpdateParking: EventEmitter<ParkingSlotDispatchModalResponse> =
        new EventEmitter();
    // Svg routes
    public svgRoutes = DispatchParkingSvgRoutes;

    // Form
    public parkingForm: UntypedFormGroup;

    // Popover
    @ViewChild('t2') public popoverRef: NgbPopover;
    @ViewChild('input') public input: ElementRef;

    // Use to show on frontend so we don't change orginal data
    public filteredParkingList: Array<DispatchBoardParking>;
    // If we have only one parking no need to show name
    public isMultipleParkingSlots: boolean;
    public isInputInFocus: boolean = false;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.handleListVisibility();
        this.createForm();
    }

    public get isParkingAssigned(): boolean {
        return !!this.parkingSlot;
    }

    public get isParkingAvailable(): boolean {
        return !!this.parkingList.length && this.isTruckOrTrailerSelected;
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
        this.popoverRef.open();
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

    private handleListVisibility(): void {
        // We can have parking with 0 slots
        this.isMultipleParkingSlots =
            this.parkingList.filter(
                (parkingList) => parkingList.parkingSlots.length > 0
            ).length > 1;

        // If we have only one parking, open it and remove parking title
        if (!this.isMultipleParkingSlots && this.parkingList.length) {
            this.parkingList[0].isDropdownVisible = true;
        }
    }

    public addParking(parkingSlot: ParkingSlotDispatchModalResponse): void {
        this.popoverRef.close();
        // Parking cannot be reassign, user needs to remove it first
        if (!!this.parkingSlot) {
            return;
        }
        this.addOrUpdateParking.emit(parkingSlot);
        this.isInputInFocus = false;
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

    public addNewParking(): void {
        this.popoverRef.close();
        this.modalService.openModal(SettingsParkingModalComponent, {
            size: 'small',
        });
    }

    public onInputClick(): void {
        this.popoverRef.open();
    }
}
