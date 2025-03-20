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
import { CaSearchMultipleStatesService } from 'ca-components';
import { DetailsSearchService } from '@shared/services';

// store
import { RepairDetailsQuery } from '@pages/repair/state/repair-details-state/repair-details.query';
import { RepairItemStore } from '@pages/repair/state/repair-details-item-state/repair-details-item.store';

// components
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { RepairShopDetailsItemComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/repair-shop-details-item.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';

// enums
import { eRepairShopDetails } from '@pages/repair/pages/repair-shop-details/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { RepairTableStringEnum } from '@pages/repair/pages/repair-table/enums';
import { eCommonElement, eGeneralActions } from '@shared/enums';

// helpers
import { RepairShopDetailsHelper } from '@pages/repair/pages/repair-shop-details/utils/helpers';
import {
    RepairTableBackFilterDataHelper,
    RepairTableDateFormaterHelper,
} from '@pages/repair/pages/repair-table/utils/helpers';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

// models
import {
    RepairedVehicleResponse,
    RepairResponse,
    RepairShopContactResponse,
    RepairShopResponse,
} from 'appcoretruckassist';
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

        // components
        TaDetailsHeaderComponent,
        RepairShopDetailsItemComponent,
    ],
})
export class RepairShopDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public detailsDropdownOptions: DetailsDropdownOptions;
    public repairShopDetailsConfig: DetailsConfig[] = [];

    public repairShopObject: ExtendedRepairShopResponse;

    public newRepairShopId: number;

    // search
    public contactListSearchValue: string;

    public searchConfig: boolean[] = [false, false, false, false];

    // filters
    public backFilterQuery: RepairBackFilter =
        RepairTableBackFilterDataHelper.backRepairFilterData();

    public backRepairedVehiclesFilterQuery: RepairBackFilter =
        RepairTableBackFilterDataHelper.backRepairedVehiclesFilterData();

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
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        private detailsSearchService: DetailsSearchService,

        // ref
        private cdRef: ChangeDetectorRef,

        // store
        private repairItemStore: RepairItemStore,
        private repairDetailsQuery: RepairDetailsQuery
    ) {}

    ngOnInit(): void {
        this.getStoreData();

        this.setTableFilter();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();

        this.searchSubscribe();

        this.handleRepairShopIdRouteChange();
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
            .subscribe((repairList) => {
                const {
                    pagination: { data },
                } = repairList;

                if (data.length) this.handleRepairListSearchData(data);
            });
    }

    private repairedVehiclesBackFilter(filter: RepairBackFilter): void {
        this.repairService
            .getRepairShopRepairedVehicle(
                filter.repairShopId,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((repairedVehiclesList) => {
                const {
                    pagination: { data },
                } = repairedVehiclesList;

                if (data.length) this.handleRepairedVehicleListSearchData(data);
            });
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
                    if (res?.type === eGeneralActions.DELETE) {
                        if (res?.template === eRepairShopDetails.REPAIR_SHOP) {
                            this.deleteRepairShop(res?.data?.id);
                        } else if (
                            res?.template ===
                            eRepairShopDetails.REPAIR_SHOP_CONTACT
                        ) {
                            this.deleteRepairShopContact(res?.id);
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
                    res?.subTypeStatus === eRepairShopDetails.BUSINESS &&
                    [
                        eRepairShopDetails.OPEN,
                        eRepairShopDetails.CLOSE,
                    ].includes(res?.type as eRepairShopDetails)
                )
                    this.handleOpenCloseRepairShop(res?.id);
            });
    }

    private searchSubscribe(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const { searchType } = res;

                    switch (searchType) {
                        case eRepairShopDetails.REPAIR:
                            this.handleRepairListSearch(res);

                            break;
                        case eRepairShopDetails.VEHICLE:
                            this.handleRepairedVehicleListSearch(res);

                            break;
                        case eRepairShopDetails.CONTACT:
                            this.handleContactListSearch(res);

                            break;
                        case eRepairShopDetails.REVIEW:
                            break;
                        default:
                            break;
                    }
                }
            });

        // close search subscribe
        this.detailsSearchService.getCloseSearchStatus$
            .pipe(takeUntil(this.destroy$))
            .subscribe((detailsPartIndex) => {
                this.searchConfig = this.searchConfig.map(
                    (searchItem, index) =>
                        index !== detailsPartIndex && searchItem
                );

                if (detailsPartIndex === 3) this.contactListSearchValue = null;
            });
    }

    private handleRepairListSearch<T>(res: T): void {
        this.backFilterQuery.pageIndex = 1;

        const searchEvent = MethodsGlobalHelper.tableSearch(
            res,
            this.backFilterQuery
        );

        if (searchEvent) {
            searchEvent.action === TableStringEnum.API
                ? this.repairBackFilter(this.backFilterQuery)
                : this.handleRepairListSearchData(
                      this.repairShopObject.repairList
                  );
        }
    }

    private handleRepairedVehicleListSearch<T>(res: T): void {
        this.backRepairedVehiclesFilterQuery.pageIndex = 1;

        const searchEvent = MethodsGlobalHelper.tableSearch(
            res,
            this.backRepairedVehiclesFilterQuery
        );

        if (searchEvent) {
            searchEvent.action === TableStringEnum.API
                ? this.repairedVehiclesBackFilter(
                      this.backRepairedVehiclesFilterQuery
                  )
                : this.handleRepairedVehicleListSearchData(
                      this.repairShopObject.repairedVehicleList
                  );
        }
    }

    private handleContactListSearch<T extends { search: string }>(
        res: T
    ): void {
        const { search } = res;

        const searchToLowerCase = search?.toLowerCase();

        this.contactListSearchValue = searchToLowerCase;

        if (search) {
            const filteredContacts =
                RepairShopDetailsHelper.filterRepairShopContacts(
                    this.repairShopObject?.contacts,
                    searchToLowerCase
                );

            this.handleContactListSearchData(filteredContacts);
        } else {
            this.handleContactListSearchData(this.repairShopObject.contacts);
        }
    }

    private handleRepairListSearchData(repairList: RepairResponse[]): void {
        this.repairShopDetailsConfig = this.repairShopDetailsConfig.map(
            (item, index) =>
                index === 1
                    ? {
                          ...item,
                          data: { ...item.data, repairList },
                      }
                    : item
        );

        this.cdRef.detectChanges();
    }

    private handleRepairedVehicleListSearchData(
        repairedVehicleList: RepairedVehicleResponse[]
    ): void {
        this.repairShopDetailsConfig = this.repairShopDetailsConfig.map(
            (item, index) =>
                index === 2
                    ? {
                          ...item,
                          data: { ...item.data, repairedVehicleList },
                      }
                    : item
        );

        this.cdRef.detectChanges();
    }

    private handleContactListSearchData(
        contacts: RepairShopContactResponse[]
    ): void {
        this.repairShopDetailsConfig = this.repairShopDetailsConfig.map(
            (item, index) =>
                index === 3
                    ? {
                          ...item,
                          data: {
                              ...item.data,
                              contacts: contacts?.length
                                  ? contacts
                                  : this.repairShopObject.contacts,
                          },
                      }
                    : item
        );

        this.cdRef.detectChanges();
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

                    query
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((res: ExtendedRepairShopResponse) => {
                            this.getDetailsConfig(res);
                            this.getDetailsOptions(this.repairShopObject);

                            if (
                                this.router.url.includes(eCommonElement.DETAILS)
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

    private handleOpenCloseRepairShop(id: number): void {
        this.repairService
            .updateRepairShopStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private getStoreData(): void {
        const dataId = this.activatedRoute.snapshot.params.id;

        const storeData$ = this.repairItemStore._select((state) => state);

        this.newRepairShopId = dataId;

        storeData$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
            const newRepairShopData = {
                ...state.entities[this.newRepairShopId],
            };

            this.getDetailsConfig(newRepairShopData);
            this.getDetailsOptions(newRepairShopData);
        });
    }

    public getDetailsConfig(repairShop: ExtendedRepairShopResponse): void {
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

    public onModalAction(action: string): void {
        switch (action) {
            case eRepairShopDetails.REPAIR:
                this.modalService.openModal(RepairOrderModalComponent, {
                    size: TableStringEnum.SMALL,
                });

                break;
            case eRepairShopDetails.CONTACT:
            case eRepairShopDetails.REVIEW:
                const mappedEvent = {
                    id: this.repairShopObject.id,
                    type: eRepairShopDetails.EDIT_2,
                    openedTab:
                        action === eRepairShopDetails.CONTACT
                            ? TableStringEnum.CONTACT
                            : TableStringEnum.REVIEW,
                };

                this.modalService.openModal(
                    RepairShopModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                    }
                );

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

    public onRepairShopSortActions(
        event: { direction: string },
        type: string
    ): void {
        if (type === eRepairShopDetails.REPAIR) {
            this.backFilterQuery.sort = event.direction;

            this.repairBackFilter(this.backFilterQuery);
        } else {
            this.backRepairedVehiclesFilterQuery.repairShopId =
                this.repairShopObject.id;

            this.backRepairedVehiclesFilterQuery.sort = event.direction;

            this.repairedVehiclesBackFilter(
                this.backRepairedVehiclesFilterQuery
            );
        }
    }

    public onSearchBtnClick(isSearch: boolean, type: string): void {
        const index =
            type === eRepairShopDetails.REPAIR
                ? 0
                : type === eRepairShopDetails.VEHICLE
                  ? 1
                  : type === eRepairShopDetails.REVIEW
                    ? 2
                    : 3;

        this.searchConfig[index] = isSearch;
    }

    public onDetailsSelectClick(id: number): void {
        this.repairShopDetailsConfig =
            RepairShopDetailsHelper.getRepairShopDetailsConfig(
                this.repairShopObject,
                id
            );
    }

    public onFilter<T>(event: T): void {
        this.tableService.sendCurrentSetTableFilter(event);
    }

    public deleteRepairShop(id: number): void {
        this.repairService
            .deleteRepairShop(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() =>
                this.router.navigate([eRepairShopDetails.REPAIR_LIST_ROUTE])
            );
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

    public deleteRepairShopContact(id: number): void {
        this.repairService
            .deleteRepairShopContact(id, this.repairShopObject?.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
    }
}
