import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    ReactiveFormsModule,
} from '@angular/forms';

import { Subject } from 'rxjs';

// store
import { RepairMinimalListQuery } from '@pages/repair/state/driver-details-minimal-list-state/repair-minimal-list.query';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';

// components
import { RepairShopDetailsOpenHoursCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-open-hours-card/repair-shop-details-open-hours-card.component';
import { RepairShopDetailsServicesCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-services-card/repair-shop-details-services-card.component';
import { RepairShopDetailsBankCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-bank-card/repair-shop-details-bank-card.component';
import { RepairShopDetailsRepairExpenseCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-repair-expense-card/repair-shop-details-repair-expense-card.component';
import { RepairShopDetailsMapCoverCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-map-cover-card/repair-shop-details-map-cover-card.component';
import { RepairShopDetailsTitleCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-title-card/repair-shop-details-title-card.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';

import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';

// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';

// helpers
import { RepairShopDetailsCardHelper } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/utils/helpers';

// models
import {
    RepairShopMinimalResponse,
    RepairShopResponse,
    RepairShopShortResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-card',
    templateUrl: './repair-shop-details-card.component.html',
    styleUrls: ['./repair-shop-details-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,

        // components
        RepairShopDetailsOpenHoursCardComponent,
        RepairShopDetailsServicesCardComponent,
        RepairShopDetailsBankCardComponent,
        RepairShopDetailsRepairExpenseCardComponent,
        RepairShopDetailsMapCoverCardComponent,
        RepairShopDetailsTitleCardComponent,

        TaCustomCardComponent,
        TaInputNoteComponent,
        TaUploadFilesComponent,
    ],
})
export class RepairShopDetailsCard implements OnInit, OnDestroy {
    @Input() set repairShop(data: RepairShopResponse) {
        this._repairShop = data;

        this.getRepairShopsDropdownList();
    }

    public _repairShop: RepairShopResponse;

    public repairShopCurrentIndex: number;

    // repair shop dropdown
    public repairShopDropdownList: RepairShopResponse[] = [];

    // note card
    public noteForm: UntypedFormGroup;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private tableService: TruckassistTableService,
        private detailsPageService: DetailsPageService,
        private modalService: ModalService,

        // store
        private repairMinimalListQuery: RepairMinimalListQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getRepairShopsDropdownList();

        this.getCurrentIndex();
    }

    private createForm(): void {
        this.noteForm = this.formBuilder.group({
            note: [this._repairShop?.note],
        });
    }

    private getCurrentIndex(): void {
        const currentIndex = this.repairShopDropdownList?.findIndex(
            (repairShop) => repairShop.id === this._repairShop.id
        );

        this.repairShopCurrentIndex = currentIndex;
    }

    public getRepairShopsDropdownList(): void {
        this.repairShopDropdownList = this.repairMinimalListQuery
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
                        ? RepairShopDetailsStringEnum.CLOSED_ROUTE
                        : companyOwned
                          ? RepairShopDetailsStringEnum.COMPANY_OWNED_ROUTE
                          : pinned
                            ? RepairShopDetailsStringEnum.STAR_ROUTE
                            : RepairShopDetailsStringEnum.EMPTY_STRING,
                    folder: RepairShopDetailsStringEnum.COMMON,
                };
            });

        this.repairShopDropdownList =
            RepairShopDetailsCardHelper.sortByPinnedAndFavorite(
                this.repairShopDropdownList
            );
    }

    public onSelectedShop(event: RepairShopResponse): void {
        if (event?.id !== this._repairShop.id)
            this.detailsPageService.getDataDetailId(event.id);
    }

    public onChangeShop(action: string): void {
        let currentIndex = this.repairShopDropdownList?.findIndex(
            (repairShop) => repairShop.id === this._repairShop.id
        );

        switch (action) {
            case RepairShopDetailsStringEnum.PREVIOUS:
                currentIndex = --currentIndex;

                if (currentIndex !== -1) {
                    this.detailsPageService.getDataDetailId(
                        this.repairShopDropdownList[currentIndex].id
                    );

                    this.repairShopCurrentIndex = currentIndex;
                }

                break;
            case RepairShopDetailsStringEnum.NEXT:
                currentIndex = ++currentIndex;

                if (
                    currentIndex !== -1 &&
                    this.repairShopDropdownList.length > currentIndex
                ) {
                    this.detailsPageService.getDataDetailId(
                        this.repairShopDropdownList[currentIndex].id
                    );

                    this.repairShopCurrentIndex = currentIndex;

                    break;
                }
            default:
                break;
        }
    }

    public handleRepairShopDetailsTitleCardEmit(event: {
        event: RepairShopMinimalResponse;
        type: string;
    }): void {
        switch (event.type) {
            case RepairShopDetailsStringEnum.SELECT_REPAIR_SHOP:
                if (event.event.name === RepairShopDetailsStringEnum.ADD_NEW) {
                    this.modalService.openModal(RepairShopModalComponent, {
                        size: RepairShopDetailsStringEnum.MEDIUM,
                    });

                    return;
                }

                this.onSelectedShop(event.event);

                break;
            case RepairShopDetailsStringEnum.CHANGE_REPAIR_SHOP:
                this.onChangeShop(event.event as string);

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
