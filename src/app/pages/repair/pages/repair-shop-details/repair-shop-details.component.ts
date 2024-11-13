import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
} from '@angular/core';

import { Subject, take, takeUntil } from 'rxjs';

// services
import { DropDownService } from '@shared/services/drop-down.service';
import { RepairService } from '@shared/services/repair.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// store
import { RepairDetailsQuery } from '@pages/repair/state/repair-details-state/repair-details.query';
import {
    RepairMinimalListState,
    RepairMinimalListStore,
} from '@pages/repair/state/driver-details-minimal-list-state/repair-minimal-list.store';
import { RepairItemStore } from '@pages/repair/state/repair-details-item-state/repair-details-item.store';
import { RepairMinimalListQuery } from '@pages/repair/state/driver-details-minimal-list-state/repair-minimal-list.query';

// components
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { RepairShopDetailsItemComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/repair-shop-details-item.component';

// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';

// helpers
import { RepairShopDetailsHelper } from '@pages/repair/pages/repair-shop-details/utils/helpers/repair-shop-details.helper';

// models
import { RepairShopResponse } from 'appcoretruckassist';
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';
import { DetailsConfig } from '@shared/models/details-config.model';
import { ExtendedRepairShopResponse } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/models';

@Component({
    selector: 'app-repair-shop-details',
    templateUrl: './repair-shop-details.component.html',
    styleUrls: ['./repair-shop-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        // Modules
        CommonModule,

        TaDetailsHeaderComponent,
        RepairShopDetailsItemComponent,
    ],
})
export class RepairShopDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public detailsDropdownOptions: DetailsDropdownOptions;
    public repairShopDetailsConfig: DetailsConfig[] = [];

    public currentIndex: number = 0;

    public repairShopList: RepairMinimalListState;
    public repairShopObject: RepairShopResponse;

    public repairShopId: number;
    public newRepairShopId: number;

    constructor(
        // router
        private router: Router,
        private activatedRoute: ActivatedRoute,

        // services
        private detailsPageService: DetailsPageService,
        private repairService: RepairService,
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private dropDownService: DropDownService,
        private detailsDataService: DetailsDataService,
        private confirmationActivationService: ConfirmationActivationService,

        // ref
        private cdRef: ChangeDetectorRef,

        // store
        private repairMinimalListStore: RepairMinimalListStore,
        private repairItemStore: RepairItemStore,
        private repairMinimalListQuery: RepairMinimalListQuery,
        private repairDetailsQuery: RepairDetailsQuery
    ) {}

    ngOnInit(): void {
        this.getRepairShopData();

        this.getStoreData();

        this.getRepairShopMinimalList();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();

        this.handleRepairShopIdRouteChange();
    }

    public trackByIdentity(_: number, item: RepairShopResponse): number {
        return item.id;
    }

    public isEmpty<T>(obj: Record<string, T>): boolean {
        return !Object.keys(obj).length;
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    if (
                        res?.template ===
                            RepairShopDetailsStringEnum.REPAIR_SHOP &&
                        res?.type === RepairShopDetailsStringEnum.DELETE
                    )
                        this.deleteRepairShop(res.data.id);
                },
            });
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (
                    res?.subTypeStatus ===
                        RepairShopDetailsStringEnum.BUSINESS &&
                    [
                        RepairShopDetailsStringEnum.OPEN,
                        RepairShopDetailsStringEnum.CLOSE,
                    ].includes(res?.type as RepairShopDetailsStringEnum)
                )
                    this.handleOpenCloseRepairShop(res?.id);
            });
    }

    private getStoreData(): void {
        const storeData$ = this.repairItemStore._select((state) => state);

        storeData$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
            const newRepairShopData = {
                ...state.entities[this.newRepairShopId],
            };

            if (!this.isEmpty(newRepairShopData)) {
                this.detailsDataService.setNewData(newRepairShopData);

                this.getDetailsConfig(newRepairShopData);
                this.getDetailsOptions(newRepairShopData);
            }
        });
    }

    private getRepairShopMinimalList(): void {
        this.repairShopList = this.repairMinimalListQuery.getAll();
    }

    private getRepairShopData(): void {
        const dataId = this.activatedRoute.snapshot.params.id;

        const repairShopData = {
            ...this.repairItemStore?.getValue()?.entities[dataId],
        };

        this.newRepairShopId = dataId;

        this.getDetailsConfig(repairShopData);
    }

    public getDetailsConfig(repairShop: ExtendedRepairShopResponse): void {
        this.repairShopId = repairShop?.id;
        this.repairShopObject = repairShop;

        this.detailsDataService.setNewData(repairShop);

        this.getDetailsOptions(repairShop);

        this.repairShopDetailsConfig =
            RepairShopDetailsHelper.getRepairShopDetailsConfig(repairShop);

        this.cdRef.detectChanges();
    }

    public getDetailsOptions(repairShop: RepairShopResponse): void {
        const { pinned, status, companyOwned } = repairShop;

        this.detailsDropdownOptions =
            RepairShopDetailsHelper.getDetailsDropdownOptions(
                pinned,
                status,
                companyOwned
            );
    }

    private handleRepairShopIdRouteChange(): void {
        this.detailsPageService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;

                this.newRepairShopId = id;

                if (this.repairDetailsQuery.hasEntity(id)) {
                    query = this.repairDetailsQuery
                        .selectEntity(id)
                        .pipe(take(1));

                    query.subscribe((res: ExtendedRepairShopResponse) => {
                        this.currentIndex = this.repairShopList.findIndex(
                            (repairShop: RepairShopResponse) =>
                                repairShop.id === res.id
                        );

                        this.getDetailsConfig(res);
                        this.getDetailsOptions(this.repairShopObject);

                        if (
                            this.router.url.includes(
                                RepairShopDetailsStringEnum.DETAILS
                            )
                        ) {
                            this.router.navigate([
                                `/list/repair/${res.id}/details`,
                            ]);
                        }
                    });
                } else {
                    this.router.navigate([`/list/repair/${id}/details`]);
                }

                this.cdRef.detectChanges();
            });
    }

    public onRepairShopActions<T>(event: {
        id: number;
        data: T;
        type: string;
    }): void {
        this.dropDownService.dropActionsHeaderRepair(
            event,
            this.repairShopObject
        );
    }

    public deleteRepairShop(id: number): void {
        this.repairService
            .deleteRepairShop(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        RepairShopDetailsStringEnum.REPAIR_LIST_ROUTE,
                    ]);
                },
                error: () => {
                    this.router.navigate([
                        RepairShopDetailsStringEnum.REPAIR_LIST_ROUTE,
                    ]);
                },
            });
    }

    private handleOpenCloseRepairShop(id: number): void {
        this.repairService
            .updateRepairShopStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
    }
}
