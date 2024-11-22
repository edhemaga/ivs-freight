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
import { ModalService } from '@shared/services/modal.service';

// store
import { RepairDetailsQuery } from '@pages/repair/state/repair-details-state/repair-details.query';
import { RepairMinimalListState } from '@pages/repair/state/driver-details-minimal-list-state/repair-minimal-list.store';
import { RepairItemStore } from '@pages/repair/state/repair-details-item-state/repair-details-item.store';
import { RepairMinimalListQuery } from '@pages/repair/state/driver-details-minimal-list-state/repair-minimal-list.query';

// components
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { RepairShopDetailsItemComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/repair-shop-details-item.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';

// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { RepairTableStringEnum } from '@pages/repair/pages/repair-table/enums';

// helpers
import { RepairShopDetailsHelper } from '@pages/repair/pages/repair-shop-details/utils/helpers/repair-shop-details.helper';
import {
    RepairTableBackFilterDataHelper,
    RepairTableDateFormaterHelper,
} from '@pages/repair/pages/repair-table/utils/helpers';

// models
import { RepairListResponse, RepairShopResponse } from 'appcoretruckassist';
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';
import { DetailsConfig } from '@shared/models/details-config.model';
import { ExtendedRepairShopResponse } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/models';
import { RepairBackFilter } from '@pages/repair/pages/repair-table/models';

@Component({
    selector: 'app-repair-shop-details',
    templateUrl: './repair-shop-details.component.html',
    styleUrls: ['./repair-shop-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        // modules
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

    public backFilterQuery: RepairBackFilter =
        RepairTableBackFilterDataHelper.backRepairFilterData();

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
        private modalService: ModalService,

        // ref
        private cdRef: ChangeDetectorRef,

        // store
        private repairItemStore: RepairItemStore,
        private repairMinimalListQuery: RepairMinimalListQuery,
        private repairDetailsQuery: RepairDetailsQuery
    ) {}

    ngOnInit(): void {
        this.getRepairShopData();

        this.getStoreData();

        this.setTableFilter();

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

    private repairBackFilter(
        filter: RepairBackFilter,
        isShowMore?: boolean
    ): void {
        this.repairService
            .getRepairList(
                filter.repairShopId,
                filter.unitType,
                filter.dateFrom,
                filter.dateTo,
                filter.isPM,
                filter.categoryIds,
                filter.pmTruckTitles,
                filter.pmTrailerTitles,
                filter.isOrder,
                filter.truckNumbers,
                filter.trailerNumbers,
                filter.costFrom,
                filter.costTo,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            // leave for now
            .subscribe((repair: RepairListResponse) => {});
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    switch (res.filterType) {
                        case RepairTableStringEnum.CATEGORY_REPAIR_FILTER:
                            this.backFilterQuery.categoryIds = res.queryParams;

                            this.repairBackFilter(this.backFilterQuery);

                            break;
                        case RepairTableStringEnum.PM_FILTER:
                            this.backFilterQuery.pmTruckTitles =
                                res.queryParams;

                            this.repairBackFilter(this.backFilterQuery);

                            break;
                        case RepairTableStringEnum.TRAILER_TYPE_FILTER:
                            this.backFilterQuery.trailerNumbers =
                                res.queryParams;

                            this.repairBackFilter(this.backFilterQuery);

                            break;
                        case RepairTableStringEnum.TRUCK_TYPE_FILTER:
                            this.backFilterQuery.truckNumbers = res.queryParams;

                            this.repairBackFilter(this.backFilterQuery);

                            break;
                        case RepairTableStringEnum.TIME_FILTER:
                            const { fromDate, toDate } =
                                RepairTableDateFormaterHelper.getDateRange(
                                    res.queryParams?.timeSelected
                                );

                            this.backFilterQuery.dateTo = toDate;
                            this.backFilterQuery.dateFrom = fromDate;

                            this.repairBackFilter(this.backFilterQuery);

                            break;
                        case RepairTableStringEnum.MONEY_FILTER:
                            this.backFilterQuery.costFrom =
                                res.queryParams?.from;

                            this.backFilterQuery.costTo = res.queryParams?.to;

                            this.repairBackFilter(this.backFilterQuery);

                            break;
                        default:
                            this.backFilterQuery =
                                RepairTableBackFilterDataHelper.backRepairFilterData();
                            break;
                    }
                }
            });
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    if (res?.type === RepairShopDetailsStringEnum.DELETE) {
                        if (
                            res?.template ===
                            RepairShopDetailsStringEnum.REPAIR_SHOP
                        ) {
                            this.deleteRepairShop(res?.data?.id);
                        } else {
                            this.deleteRepair(
                                res?.data?.id,
                                res?.data?.repairShop?.id,
                                res?.data?.unitType?.id
                            );
                        }
                    }
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

    public onModalAction(action: string): void {
        switch (action) {
            case RepairShopDetailsStringEnum.REPAIR:
                this.modalService.openModal(RepairOrderModalComponent, {
                    size: TableStringEnum.SMALL,
                });

                break;
            default:
                break;
        }
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

    public deleteRepair(
        id: number,
        repairShopId: number,
        unitTypeId: number
    ): void {
        const unitType =
            unitTypeId === 1
                ? TableStringEnum.ACTIVE
                : TableStringEnum.INACTIVE;

        this.repairService
            .deleteRepair(id, repairShopId, unitType)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private handleOpenCloseRepairShop(id: number): void {
        this.repairService
            .updateRepairShopStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public onFilter(event: any) {
        this.tableService.sendCurrentSetTableFilter(event);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
    }
}
