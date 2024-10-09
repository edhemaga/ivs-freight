import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Svg routes
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-parking-svg-routes';

// Config
import { DispatchConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs';

// Enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';

// Models
import { DispatchBoardParking } from '@pages/dispatch/models/dispatch-parking.model';
import { DispatchBoardParkingEmiter } from '@pages/dispatch/models/dispatch-parking-emmiter.model';
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
    @ViewChild('t2') public popoverRef: NgbPopover;

    // Inputs
    @Input() parkingList: DispatchBoardParking[];
    @Input() parkingSlot: ParkingSlotShortResponse;
    @Input() isWideTable: boolean;
    @Input() truckId: number;
    @Input() trailerId: number;
    @Input() isHoveringRow: boolean;
    @Input() isUnlockable: boolean;

    // Ouputs
    @Output()
    updateParking: EventEmitter<DispatchBoardParkingEmiter> =
        new EventEmitter();

    // Svg routes
    public svgRoutes = DispatchParkingSvgRoutes;

    // Form
    public parkingForm: UntypedFormGroup;

    // Use to show on frontend so we don't change orginal data
    public filteredParkingList: Array<DispatchBoardParking>;

    // If we have only one parking no need to show name
    public isMultipleParkingSlots: boolean;
    public isInputInFocus: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private modalService: ModalService
    ) {}

    get getParkingConfig() {
        return DispatchConfig.getDispatchParkingConfig();
    }

    ngOnInit(): void {
        this.createForm();
        this.handleListVisibility();
    }

    public get isParkingAssigned(): boolean {
        return !!this.parkingSlot;
    }

    private get isTruckOrTrailerSelected(): boolean {
        return !!this.trailerId || !!this.truckId;
    }

    public get isParkingAvailable(): boolean {
        return !!this.parkingList?.length && this.isTruckOrTrailerSelected;
    }

    private createForm() {
        this.parkingForm = this.formBuilder.group({
            parking: [null],
        });

        this.parkingForm
            .get(DispatchTableStringEnum.PARKING)
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
                .filter((parking) => parking.parkingSlots.length);
        } else {
            this.filteredParkingList = this.parkingList;
        }
    }

    private handleListVisibility(): void {
        // We can have parking with 0 slots
        this.isMultipleParkingSlots =
            this.parkingList.filter(
                (parkingList) => parkingList.parkingSlots.length
            ).length > 1;

        // If we have only one parking, open it and remove parking title
        if (!this.isMultipleParkingSlots && this.parkingList.length) {
            this.openParkingList(0, true);
        }
    }

    public addParking(parkingSlot: ParkingSlotDispatchModalResponse): void {
        this.popoverRef.close();

        // Parking cannot be reassign, user needs to remove it first
        if (!!this.parkingSlot) {
            return;
        }

        this.updateParking.emit({
            parking: parkingSlot.id,
            trailerId: this.trailerId,
            truckId: this.truckId,
        });

        this.isInputInFocus = false;
    }

    public removeParking(): void {
        this.updateParking.emit({
            parking: this.parkingSlot.id,
            trailerId: null,
            truckId: null,
        });
    }

    public openParkingList(index: number, isDropdownVisible: boolean): void {
        const parking = this.filteredParkingList[index];
        this.filteredParkingList[index] = {
            ...parking,
            isDropdownVisible
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

    public onPopoverShown(): void {
        this.isInputInFocus = true;
    }

    public trackByIdentity(id: number): number {
        return id;
    }
}
