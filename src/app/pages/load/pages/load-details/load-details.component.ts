import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil, take, tap } from 'rxjs';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { LoadService } from '@shared/services/load.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// components
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { LoadDetailsItemComponent } from '@pages/load/pages/load-details/components/load-details-item/load-details-item.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

// store
import { LoadDetailsListQuery } from '@pages/load/state/load-details-state/load-details-list-state/load-details-list.query';
import { LoadMinimalListQuery } from '@pages/load/state/load-details-state/load-minimal-list-state/load-details-minimal.query';
import {
    LoadMinimalListState,
    LoadMinimalListStore,
} from '@pages/load/state/load-details-state/load-minimal-list-state/load-details-minimal.store';
import { LoadItemStore } from '@pages/load/state/load-details-state/load-details.store';

// enums
import { LoadDetailsStringEnum } from '@pages/load/pages/load-details/enums/load-details-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// helpers
import { LoadDetailsHelper } from '@pages/load/pages/load-details/utils/helpers/load-details.helper';

// models
import { LoadResponse } from 'appcoretruckassist';
import { DetailsConfig } from '@shared/models/details-config.model';
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';

@Component({
    selector: 'app-load-details',
    templateUrl: './load-details.component.html',
    styleUrls: ['./load-details.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        LoadDetailsItemComponent,
        TaDetailsHeaderComponent,
    ],
})
export class LoadDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public currentIndex: number = 0;

    public loadDetailsConfig: DetailsConfig;

    public detailsDropdownOptions: DetailsDropdownOptions;

    public loadsList: LoadMinimalListState;
    public loadObject: LoadResponse;

    public loadId: number;
    public newLoadId: number;

    public isMapDisplayed: boolean = true;
    public isAddNewComment: boolean = false;
    public isSearchComment: boolean = false;

    constructor(
        private cdRef: ChangeDetectorRef,

        // router
        private router: Router,
        private activatedRoute: ActivatedRoute,

        // services
        private detailsPageService: DetailsPageService,
        private modalService: ModalService,
        private confirmationService: ConfirmationService,
        private loadService: LoadService,
        private detailsDataService: DetailsDataService,

        // store
        private loadMinimalListStore: LoadMinimalListStore,
        private loadMinimalListQuery: LoadMinimalListQuery,
        private loadDetailsListQuery: LoadDetailsListQuery,
        private loadItemStore: LoadItemStore
    ) {}

    ngOnInit(): void {
        this.getLoadData();

        this.getStoreData();

        this.getLoadsMinimalList();

        this.getConfigAndOptions();

        this.confirmationSubscribe();

        this.handleLoadIdRouteChange();
    }

    ngOnChange;

    public trackByIdentity(index: number): number {
        return index;
    }

    public isEmpty(obj: Record<string, any>): boolean {
        return !Object.keys(obj).length;
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    if (
                        res?.template === TableStringEnum.LOAD &&
                        res.type === TableStringEnum.DELETE
                    )
                        this.deleteLoadById(res.data.id);
                },
            });
    }

    private getStoreData(): void {
        const storeData$ = this.loadItemStore._select((state) => state);

        storeData$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
            const newLoadData = { ...state.entities[this.newLoadId] };

            if (!this.isEmpty(newLoadData)) {
                this.detailsDataService.setNewData(newLoadData);

                this.getDetailsConfig(newLoadData);
                this.getDetailsOptions(newLoadData);
            }
        });
    }

    private getLoadsMinimalList(): void {
        this.loadsList = this.loadMinimalListQuery.getAll();
    }

    private getLoadData(): void {
        const dataId = this.activatedRoute.snapshot.params.id;

        const loadData = {
            ...this.loadItemStore?.getValue()?.entities[dataId],
        };

        this.newLoadId = dataId;

        this.getDetailsConfig(loadData);
    }

    public getDetailsConfig(load: LoadResponse): void {
        this.loadDetailsConfig = LoadDetailsHelper.getLoadDetailsConfig(load);

        this.loadId = load.id;
        this.loadObject = load;
    }

    public getDetailsOptions(load: LoadResponse): void {
        this.detailsDropdownOptions =
            LoadDetailsHelper.getDetailsDropdownOptions(load);
    }

    private getConfigAndOptions(): void {
        this.getDetailsConfig(this.activatedRoute.snapshot.data.loadItem);
        this.getDetailsOptions(this.activatedRoute.snapshot.data.loadItem);
    }

    public onLoadActions(event: { id: number; type: string }): void {
        switch (event.type) {
            case LoadDetailsStringEnum.EDIT:
                this.loadService
                    .getLoadById(event.id)
                    .pipe(
                        takeUntil(this.destroy$),
                        tap((load) => {
                            const editData = {
                                data: {
                                    ...load,
                                },
                                type: event.type,
                            };

                            this.modalService.openModal(
                                LoadModalComponent,
                                { size: TableStringEnum.LOAD },
                                {
                                    ...editData,
                                    disableButton: false,
                                }
                            );
                        })
                    )
                    .subscribe();

                break;
            case LoadDetailsStringEnum.DELETE_ITEM:
                const loadTab = this.loadObject.statusType.name;

                const modalTitle =
                    TableStringEnum.DELETE_2 +
                    LoadDetailsStringEnum.EMPTY_SPACE +
                    loadTab +
                    LoadDetailsStringEnum.EMPTY_SPACE +
                    TableStringEnum.LOAD_2;

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        data: { ...this.loadObject },
                        type: TableStringEnum.DELETE,
                        template: TableStringEnum.LOAD,
                        subType: loadTab,
                        modalHeaderTitle: modalTitle,
                    }
                );

                break;
            default:
                break;
        }
    }

    public onMapBtnClick(isClicked: boolean): void {
        this.isMapDisplayed = isClicked;

        this.loadDetailsConfig[1] = {
            ...this.loadDetailsConfig[1],
            isMapDisplayed: this.isMapDisplayed,
        };
    }

    public onSearchBtnClick(isSearch: boolean): void {
        this.isSearchComment = isSearch;
    }

    public onAddNewClick(detailsTitle: string): void {
        if (detailsTitle === LoadDetailsStringEnum.COMMENT) {
            this.isAddNewComment = true;

            setTimeout(() => {
                this.isAddNewComment = false;
            }, 500);
        }
    }

    public onDetailsSelectClick(id: number): void {
        this.loadDetailsConfig = LoadDetailsHelper.getLoadDetailsConfig(
            this.loadObject,
            id
        );
    }

    private handleLoadIdRouteChange(): void {
        this.detailsPageService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;

                this.newLoadId = id;

                if (this.loadDetailsListQuery.hasEntity(id)) {
                    query = this.loadDetailsListQuery
                        .selectEntity(id)
                        .pipe(take(1));

                    query.subscribe((load: LoadResponse) => {
                        this.currentIndex = this.loadsList.findIndex(
                            (driver: LoadResponse) => driver.id === load.id
                        );

                        this.getDetailsOptions(load);
                        this.getDetailsConfig(load);

                        if (
                            this.router.url.includes(
                                LoadDetailsStringEnum.DETAILS
                            )
                        ) {
                            this.router.navigate([
                                `/list/load/${load.id}/details`,
                            ]);
                        }
                    });
                } else {
                    this.router.navigate([`/list/load/${id}/details`]);
                }

                this.cdRef.detectChanges();
            });
    }

    private deleteLoadById(id: number): void {
        const last = this.loadsList.at(-1);
        const loadStatus = this.loadObject.statusType.name;

        if (
            last.id ===
            this.loadMinimalListStore.getValue().ids[this.currentIndex]
        ) {
            this.currentIndex = --this.currentIndex;
        } else {
            this.currentIndex = ++this.currentIndex;
        }

        this.loadService
            .deleteLoadById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        LoadDetailsStringEnum.LIST_LOAD_ROUTE,
                    ]);
                },
                error: () => {
                    this.router.navigate([
                        LoadDetailsStringEnum.LIST_LOAD_ROUTE,
                    ]);
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
