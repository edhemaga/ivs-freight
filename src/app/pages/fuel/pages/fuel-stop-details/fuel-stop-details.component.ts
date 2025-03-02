import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, take, takeUntil } from 'rxjs';

// store
import { FuelItemStore } from '@pages/fuel/state/fuel-details-item-state/fuel-details-item.store';
import { FuelDetailsQuery } from '@pages/fuel/state/fuel-details-state/fuel-details.query';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { FuelService } from '@shared/services/fuel.service';

// components
import { FuelStopDetailsItemComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/fuel-stop-details-item.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';

// enums
import { eCommonElement, eGeneralActions } from '@shared/enums';

// helpers
import { FuelStopDetailsHelper } from '@pages/fuel/pages/fuel-stop-details/utils/helpers';

// models
import { FuelStopResponse } from 'appcoretruckassist';
import { DetailsConfig, DetailsDropdownOptions } from '@shared/models';

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
export class FuelStopDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public detailsDropdownOptions: DetailsDropdownOptions;
    public fuelDetailsConfig: DetailsConfig[] = [];

    public fuelStopObject: FuelStopResponse;

    public newFuelStopId: number;

    constructor(
        // router
        private router: Router,
        private activatedRoute: ActivatedRoute,

        // services
        private detailsPageService: DetailsPageService,
        private confirmationService: ConfirmationService,
        private fuelService: FuelService,

        // ref
        private cdRef: ChangeDetectorRef,

        // store
        private fuelItemStore: FuelItemStore,
        private fuelDetailsQuery: FuelDetailsQuery
    ) {}

    ngOnInit(): void {
        this.getStoreData();

        this.confirmationSubscribe();

        this.handleRepairShopIdRouteChange();
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    const { id, type } = res;

                    if (type === eGeneralActions.DELETE) {
                        if (false) {
                            // delete fuel stop
                        } else {
                            this.deleteFuelTransaction(id);
                        }
                    }
                },
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

    private getDetailsConfig(fuelStop: FuelStopResponse): void {
        this.fuelStopObject = fuelStop;

        this.getDetailsOptions(fuelStop);

        this.fuelDetailsConfig =
            FuelStopDetailsHelper.getFuelStopDetailsConfig(fuelStop);

        this.cdRef.detectChanges();
    }

    private getDetailsOptions(fuelStop: FuelStopResponse): void {
        /*  const { pinned, status, companyOwned } = fuelStop;
        
                this.detailsDropdownOptions =
                    RepairShopDetailsHelper.getDetailsDropdownOptions(
                        pinned,
                        status,
                        companyOwned
                    ); */

        this.detailsDropdownOptions = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: 'Edit',
                    name: eGeneralActions.EDIT,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                },

                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'truck',
                    text: 'Are you sure you want to delete truck(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                },
            ],
            export: true,
        };
    }

    private deleteFuelTransaction(ids: number): void {
        this.fuelService
            .deleteFuelTransactionsList([ids], this.fuelStopObject?.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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
                        .subscribe((res: FuelStopResponse) => {
                            this.getDetailsConfig(res);
                            this.getDetailsOptions(this.fuelStopObject);

                            if (
                                this.router.url.includes(eCommonElement.DETAILS)
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
