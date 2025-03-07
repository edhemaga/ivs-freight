import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

import { Subject } from 'rxjs';

// components
import { FuelStopDetailsTitleCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-title-card/fuel-stop-details-title-card.component';
import { FuelStopDetailsLastFuelPriceCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-last-fuel-price-card/fuel-stop-details-last-fuel-price-card.component';
import { FuelStopDetailsFuelExpenseCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-fuel-expense-card/fuel-stop-details-fuel-expense-card.component';
import { FuelStopDetailsMapCoverCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-map-cover-card/fuel-stop-details-map-cover-card.component';

import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';

// enums
import { eFuelStopDetails } from '@pages/fuel/pages/fuel-stop-details/enums';
import { eStringPlaceholder } from '@shared/enums';

// models
import { FuelStopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-fuel-stop-details-card',
    templateUrl: './fuel-stop-details-card.component.html',
    styleUrl: './fuel-stop-details-card.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,

        // components
        FuelStopDetailsTitleCardComponent,
        FuelStopDetailsLastFuelPriceCardComponent,
        FuelStopDetailsFuelExpenseCardComponent,
        FuelStopDetailsMapCoverCardComponent,

        TaInputNoteComponent,
    ],
})
export class FuelStopDetailsCardComponent {
    @Input() set fuelStop(data: FuelStopResponse) {
        this._fuelStop = data;
        this.getFuelStopsDropdownList();
    }

    private destroy$ = new Subject<void>();

    public _fuelStop: FuelStopResponse;

    public fuelStopCurrentIndex: number;

    // enums
    public eStringPlaceholder = eStringPlaceholder;

    // fuel stop dropdown
    public fuelStopDropdownList: FuelStopResponse[] = [];

    // note card
    public noteForm: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private tableService: TruckassistTableService,
        private detailsPageService: DetailsPageService,
        private modalService: ModalService

        // store
        /*  private repairMinimalListQuery: RepairMinimalListQuery */
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getCurrentIndex();
    }

    private createForm(): void {
        this.noteForm = this.formBuilder.group({
            note: [this._fuelStop?.note],
        });
    }

    private getCurrentIndex(): void {
        const currentIndex = this.fuelStopDropdownList?.findIndex(
            (repairShop) => repairShop.id === this._fuelStop.id
        );

        this.fuelStopCurrentIndex = currentIndex;
    }

    private getFuelStopsDropdownList(): void {
        /*   this.fuelStopDropdownList = this.repairMinimalListQuery
                .getAll()
                .map((repairShop: RepairShopShortResponse) => {
                    const {
                        id,
                        companyOwned,
                        name,
                        address,
                        pinned,
                        repairsCount,
                        cost,
                        status,
                    } = repairShop;
    
                    return {
                        id,
                        companyOwned,
                        name,
                        address,
                        pinned,
                        repairs: repairsCount,
                        expense: cost,
                        status,
                        isRepairShopDetails: true,
                        svg: !status
                            ? eFuelStopDetails.CLOSED_ROUTE
                            : companyOwned
                              ? eFuelStopDetails.COMPANY_OWNED_ROUTE
                              : pinned
                                ? eFuelStopDetails.STAR_ROUTE
                                : eFuelStopDetails.EMPTY_STRING,
                        folder: eFuelStopDetails.COMMON,
                    };
                });
    
            this.fuelStopDropdownList =
                RepairShopDetailsCardHelper.sortByPinnedAndFavorite(
                    this.fuelStopDropdownList
                ); */
    }

    public onSelectedShop(event: FuelStopResponse): void {
        if (event?.id !== this._fuelStop.id)
            this.detailsPageService.getDataDetailId(event.id);
    }

    public onChangeShop(action: string): void {
        let currentIndex = this.fuelStopDropdownList?.findIndex(
            (repairShop) => repairShop.id === this._fuelStop.id
        );

        switch (action) {
            case eFuelStopDetails.PREVIOUS:
                currentIndex = --currentIndex;

                if (currentIndex !== -1) {
                    this.detailsPageService.getDataDetailId(
                        this.fuelStopDropdownList[currentIndex].id
                    );

                    this.fuelStopCurrentIndex = currentIndex;
                }

                break;
            case eFuelStopDetails.NEXT:
                currentIndex = ++currentIndex;

                if (
                    currentIndex !== -1 &&
                    this.fuelStopDropdownList.length > currentIndex
                ) {
                    this.detailsPageService.getDataDetailId(
                        this.fuelStopDropdownList[currentIndex].id
                    );

                    this.fuelStopCurrentIndex = currentIndex;

                    break;
                }
            default:
                break;
        }
    }

    public handleFuelStopDetailsTitleCardEmit(event: {
        event: any;
        type: string;
    }): void {
        /*  switch (event.type) {
                case eFuelStopDetails.SELECT_FUEL_STOP:
                    if (event.event.name === eFuelStopDetails.ADD_NEW) {
                        this.modalService.openModal(RepairShopModalComponent, {
                            size: eFuelStopDetails.MEDIUM,
                        });
    
                        return;
                    }
    
                    this.onSelectedShop(event.event);
    
                    break;
                case eFuelStopDetails.CHANGE_FUEL_STOP:
                    this.onChangeShop(event.event as string);
    
                    break;
                default:
                    break;
            } */
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
    }
}
