import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, take, takeUntil } from 'rxjs';

// base classes
import { FuelDropdownMenuActionsBase } from '@pages/fuel/base-classes';

// store
import { FuelItemStore } from '@pages/fuel/state/fuel-details-item-state/fuel-details-item.store';
import { FuelDetailsQuery } from '@pages/fuel/state/fuel-details-state/fuel-details.query';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DetailsSearchService, FuelService } from '@shared/services';
import { ModalService } from '@shared/services/modal.service';
import { CaSearchMultipleStatesService } from 'ca-components';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// components
import { FuelStopDetailsItemComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/fuel-stop-details-item.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { FuelPurchaseModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';

// enums
import {
    eDropdownMenu,
    eGeneralActions,
    TableStringEnum,
    eSharedString,
} from '@shared/enums';
import {
    eFuelDetailsPartIndex,
    eFuelStopDetails,
} from '@pages/fuel/pages/fuel-stop-details/enums';

// helpers
import { FuelStopDetailsHelper } from '@pages/fuel/pages/fuel-stop-details/utils/helpers';

// models
import { DetailsConfig, DetailsDropdownOptions } from '@shared/models';
import { ExtendedFuelStopResponse } from '@pages/fuel/pages/fuel-stop-details/models';
import {
    FuelledVehicleResponse,
    FuelTransactionResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-fuel-stop-details',
    templateUrl: './fuel-stop-details.component.html',
    styleUrls: ['./fuel-stop-details.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaDetailsHeaderComponent,
        FuelStopDetailsItemComponent,
    ],
})
export class FuelStopDetailsComponent
    extends FuelDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    public destroy$ = new Subject<void>();

    public detailsDropdownOptions: DetailsDropdownOptions;
    public fuelStopDetailsConfig: DetailsConfig[] = [];

    public fuelStopObject: ExtendedFuelStopResponse;

    public newFuelStopId: number;

    // enums
    public eDropdownMenu = eDropdownMenu;

    // search
    public searchConfig: boolean[] = [false, false];

    get viewData() {
        return [];
    }

    constructor(
        // router
        protected router: Router,

        private activatedRoute: ActivatedRoute,

        // services
        protected fuelService: FuelService,
        protected modalService: ModalService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,

        private detailsPageService: DetailsPageService,
        private confirmationService: ConfirmationService,
        private confirmationActivationService: ConfirmationActivationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        private detailsSearchService: DetailsSearchService,

        // ref
        private cdRef: ChangeDetectorRef,

        // store
        private fuelItemStore: FuelItemStore,
        private fuelDetailsQuery: FuelDetailsQuery
    ) {
        super();
    }

    ngOnInit(): void {
        this.getStoreData();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();

        this.searchSubscribe();

        this.handleRepairShopIdRouteChange();
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    const { id, type } = res;

                    if (type === eGeneralActions.DELETE) {
                        res?.template === eFuelStopDetails.FUEL_STOP
                            ? this.deleteFuelStop(id)
                            : this.deleteFuelTransaction(id);
                    }
                },
            });
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (
                    res?.subTypeStatus === eSharedString.BUSINESS &&
                    [eGeneralActions.OPEN, eGeneralActions.CLOSE].includes(
                        res?.type as eGeneralActions
                    )
                )
                    this.handleOpenCloseFuelStop(res?.id);
            });
    }

    private searchSubscribe(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const { searchType } = res;

                    searchType === eFuelStopDetails.TRANSACTION
                        ? this.handleTransactionListSearch(res)
                        : this.handleFuelledVehicleListSearch(res);
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
            });
    }

    private getStoreData(): void {
        const dataId = this.activatedRoute.snapshot.params.id;

        const storeData$ = this.fuelItemStore._select((state) => state);

        this.newFuelStopId = dataId;

        storeData$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
            const newFuelStopData = {
                ...state.entities[this.newFuelStopId],
            };

            this.getDetailsConfig(newFuelStopData);
            this.getDetailsOptions(newFuelStopData);
        });
    }

    private getDetailsConfig(fuelStop: ExtendedFuelStopResponse): void {
        this.fuelStopObject = fuelStop;

        this.getDetailsOptions(fuelStop);

        this.fuelStopDetailsConfig =
            FuelStopDetailsHelper.getFuelStopDetailsConfig(fuelStop);

        this.cdRef.detectChanges();
    }

    private getDetailsOptions(fuelStop: ExtendedFuelStopResponse): void {
        this.detailsDropdownOptions =
            FuelStopDetailsHelper.getDetailsDropdownOptions(fuelStop);
    }

    private handleOpenCloseFuelStop(id: number): void {
        this.fuelService
            .updateFuelStopStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public deleteFuelStop(id: number): void {
        this.fuelService
            .deleteFuelStopList([id])
            .pipe(takeUntil(this.destroy$))
            .subscribe(() =>
                this.router.navigate([eFuelStopDetails.FUEL_LIST_ROUTE])
            );
    }

    private deleteFuelTransaction(ids: number): void {
        this.fuelService
            .deleteFuelTransactionsList([ids], this.fuelStopObject?.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private handleTransactionListSearch<T>(res: T): void {
        // w8 for back
        /*  this.backFilterQuery.pageIndex = 1;
    
            const searchEvent = MethodsGlobalHelper.tableSearch(
                res,
                this.backFilterQuery
            );
    
            if (searchEvent) {
                searchEvent.action === TableStringEnum.API
                    ? this.fuelBackFilter(this.backFilterQuery)
                    : this.handleTransactionListSearchData(
                          this.fuelStopObject.transactionList
                      );
            } */
    }

    private handleFuelledVehicleListSearch<T>(res: T): void {
        // w8 for back
        /*  this.backFuelledVehiclesFilterQuery.pageIndex = 1;

        const searchEvent = MethodsGlobalHelper.tableSearch(
            res,
            this.backFuelledVehiclesFilterQuery
        );

        if (searchEvent) {
            searchEvent.action === TableStringEnum.API
                ? this.fuelledVehiclesBackFilter(
                      this.backFuelledVehiclesFilterQuery
                  )
                : this.handleFuelledVehicleListSearchData(
                      this.fuelStopObject.fuelledVehicleList
                  );
        } */
    }

    private handleTransactionListSearchData(
        transactionList: FuelTransactionResponse[]
    ): void {
        this.fuelStopDetailsConfig = this.fuelStopDetailsConfig.map(
            (item, index) =>
                index === eFuelDetailsPartIndex.TRANSACTION_INDEX
                    ? {
                          ...item,
                          data: { ...item.data, transactionList },
                      }
                    : item
        );

        this.cdRef.detectChanges();
    }

    private handleFuelledVehicleListSearchData(
        fuelledVehicleList: FuelledVehicleResponse[]
    ): void {
        this.fuelStopDetailsConfig = this.fuelStopDetailsConfig.map(
            (item, index) =>
                index === eFuelDetailsPartIndex.VEHICLE_INDEX
                    ? {
                          ...item,
                          data: { ...item.data, fuelledVehicleList },
                      }
                    : item
        );

        this.cdRef.detectChanges();
    }

    private handleRepairShopIdRouteChange(): void {
        this.detailsPageService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                this.newFuelStopId = id;

                if (this.fuelDetailsQuery.hasEntity(id)) {
                    this.fuelDetailsQuery
                        .selectEntity(id)
                        .pipe(take(1), takeUntil(this.destroy$))
                        .subscribe((res: ExtendedFuelStopResponse) => {
                            this.getDetailsConfig(res);
                            this.getDetailsOptions(this.fuelStopObject);

                            if (
                                this.router.url.includes(eSharedString.DETAILS)
                            ) {
                                this.router.navigate([
                                    `/list/fuel/${res.id}/details`,
                                ]);
                            }
                        });
                } else this.router.navigate([`/list/fuel/${id}/details`]);

                this.cdRef.detectChanges();
            });
    }

    public onModalAction(action: string): void {
        if (action === eFuelStopDetails.TRANSACTION)
            this.modalService.openModal(FuelPurchaseModalComponent, {
                size: TableStringEnum.SMALL,
            });
    }

    public onFuelStopSortActions(
        event: { direction: string },
        type: string
    ): void {
        if (type === eFuelStopDetails.TRANSACTION) {
            // w8 for back
            /*  this.backFilterQuery.sort = event.direction;
    
                this.repairBackFilter(this.backFilterQuery); */
        } else {
            /*   this.backRepairedVehiclesFilterQuery.repairShopId =
                    this.repairShopObject.id;
    
                this.backRepairedVehiclesFilterQuery.sort = event.direction;
    
                this.repairedVehiclesBackFilter(
                    this.backRepairedVehiclesFilterQuery
                ); */
        }
    }

    public onSearchBtnClick(isSearch: boolean, type: string): void {
        const index = Number(type !== eFuelStopDetails.TRANSACTION);

        this.searchConfig[index] = isSearch;
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
