import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

import { retry, Subject, takeUntil } from 'rxjs';

// components
import { FuelStopDetailsTitleCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-title-card/fuel-stop-details-title-card.component';
import { FuelStopDetailsLastFuelPriceCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-last-fuel-price-card/fuel-stop-details-last-fuel-price-card.component';
import { FuelStopDetailsFuelExpenseCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-fuel-expense-card/fuel-stop-details-fuel-expense-card.component';
import { FuelStopDetailsMapCoverCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-map-cover-card/fuel-stop-details-map-cover-card.component';

import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';

// store
import { FuelMinimalListQuery } from '@pages/fuel/state/fuel-details-minimal-list-state/fuel-minimal-list.query';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { FuelService } from '@shared/services/fuel.service';

// enums
import { eFuelStopDetails } from '@pages/fuel/pages/fuel-stop-details/enums';
import { eStringPlaceholder } from '@shared/enums';

// models
import { FuelStopMinimalResponse, FuelStopResponse } from 'appcoretruckassist';

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

        console.log('this._fuelStop', this._fuelStop);

        this.getFuelStopsDropdownList();
    }

    private destroy$ = new Subject<void>();

    public _fuelStop: FuelStopResponse;

    public fuelStopCurrentIndex: number;
    public fuelStopStoreCurrentIndex: number = 0;

    // enums
    public eStringPlaceholder = eStringPlaceholder;

    // fuel stop dropdown
    public fuelStopFranchiseDropdownList: FuelStopMinimalResponse[] = [];
    public fuelStopStoreDropdownList: FuelStopMinimalResponse[] = [];

    // note card
    public noteForm: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private tableService: TruckassistTableService,
        private detailsPageService: DetailsPageService,
        private modalService: ModalService,
        private fuelService: FuelService,

        // store
        private fuelMinimalListQuery: FuelMinimalListQuery
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
        const fuelStopId =
            this._fuelStop?.fuelStopFranchise?.id ?? this._fuelStop.id;

        const currentIndex = this.fuelStopFranchiseDropdownList?.findIndex(
            (fuelStop) => fuelStop.id === fuelStopId
        );

        this.fuelStopCurrentIndex = currentIndex;
    }

    private getFuelStopsDropdownList(): void {
        const isFranchise = !!this._fuelStop?.fuelStopFranchise;

        if (isFranchise) {
            const fuelStopId = this._fuelStop?.fuelStopFranchise?.id;

            this.getFuelStopStoreDropdownList(fuelStopId);
        }

        console.log('isFranchise', isFranchise);

        this.fuelStopFranchiseDropdownList = this.fuelMinimalListQuery
            .getAll()
            .map((fuelStop: FuelStopMinimalResponse) => {
                /*   const {
                        id,
                        companyOwned,
                        name,
                        address,
                        pinned,
                        repairsCount,
                        cost,
                        status,
                    } = fuelStop;
    
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
                    }; */

                return fuelStop;
            });

        /* this.fuelStopFranchiseDropdownList =
                RepairShopDetailsCardHelper.sortByPinnedAndFavorite(
                    this.fuelStopFranchiseDropdownList
                ); */
    }

    private getFuelStopStoreDropdownList(
        fuelStopId: number,
        isFuelStopFranchiseChangeClick?: boolean,
        currentIndex?: number
    ): void {
        this.fuelService
            .getFuelStopsMinimalList(fuelStopId, 1, 25)
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ pagination: { data } }) => {
                this.fuelStopStoreDropdownList = data;

                if (isFuelStopFranchiseChangeClick) {
                    const fuelStopStoreId =
                        this.fuelStopStoreDropdownList[0].id;

                    this.detailsPageService.getDataDetailId(fuelStopStoreId);

                    this.fuelStopCurrentIndex = currentIndex;
                }

                console.log(
                    'this.fuelStopFranchiseDropdownList',
                    this.fuelStopFranchiseDropdownList
                );

                console.log(
                    'this.fuelStopStoreDropdownList',
                    this.fuelStopStoreDropdownList
                );
            });
    }

    private onSelectedFuelStop(event: FuelStopResponse): void {
        if (event?.id !== this._fuelStop.id)
            this.detailsPageService.getDataDetailId(event.id);
    }

    private handleOnChangeFuelStopAction(
        currentIndex: number,
        fuelStopId: number
    ): void {
        const isFranchise =
            this.fuelStopFranchiseDropdownList[currentIndex].isFranchise;

        if (isFranchise) {
            const fuelStopId =
                this.fuelStopFranchiseDropdownList[currentIndex].id;

            this.getFuelStopStoreDropdownList(fuelStopId, true, currentIndex);

            return;
        }

        this.detailsPageService.getDataDetailId(fuelStopId);

        this.fuelStopCurrentIndex = currentIndex;
    }

    private onChangeFuelStop(action: string): void {
        const fuelStopId =
            this._fuelStop?.fuelStopFranchise?.id ?? this._fuelStop.id;

        let currentIndex = this.fuelStopFranchiseDropdownList?.findIndex(
            (fuelStop) => fuelStop.id === fuelStopId
        );

        if (action === eFuelStopDetails.PREVIOUS && --currentIndex >= 0) {
            this.handleOnChangeFuelStopAction(currentIndex, fuelStopId);
        } else if (
            action === eFuelStopDetails.NEXT &&
            ++currentIndex < this.fuelStopFranchiseDropdownList.length
        ) {
            this.handleOnChangeFuelStopAction(currentIndex, fuelStopId);
        }
    }

    private onChangeFuelStopStore(action: string): void {
        console.log('action', action);
        console.log(
            'this.fuelStopStoreCurrentIndex',
            this.fuelStopStoreCurrentIndex
        );

        if (action === eFuelStopDetails.PREVIOUS) {
        } else {
        }
    }

    public handleFuelStopDetailsTitleCardEmit(event: {
        event: string;
        type: string;
        isAdditionalDropdownAction?: boolean;
    }): void {
        console.log('event', event);

        switch (event.type) {
            case eFuelStopDetails.SELECT_FUEL_STOP:
                /* if (event.event.name === eFuelStopDetails.ADD_NEW) {
                        this.modalService.openModal(RepairShopModalComponent, {
                            size: eFuelStopDetails.MEDIUM,
                        });
    
                        return;
                    } */

                /* this.onSelectedFuelStop(event.event); */

                break;
            case eFuelStopDetails.CHANGE_FUEL_STOP:
                event.isAdditionalDropdownAction
                    ? this.onChangeFuelStopStore(event.event)
                    : this.onChangeFuelStop(event.event);

                break;
            default:
                break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
    }
}
