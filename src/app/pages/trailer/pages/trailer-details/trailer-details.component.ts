import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, of, Subject, take, takeUntil, tap } from 'rxjs';

// components
import { TtFhwaInspectionModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-registration-modal/tt-registration-modal.component';
import { TtTitleModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-title-modal/tt-title-modal.component';

// services
import { TrailerService } from '@shared/services/trailer.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ModalService } from '@shared/services/modal.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// store
import { TrailerItemStore } from '@pages/trailer/state/trailer-details-state/trailer-details.store';
import { TrailersMinimalListStore } from '@pages/trailer/state/trailer-minimal-list-state/trailer-minimal.store';
import { TrailersMinimalListQuery } from '@pages/trailer/state/trailer-minimal-list-state/trailer-minimal.query';
import { TrailersDetailsListQuery } from '@pages/trailer/state/trailer-details-list-state/trailer-details-list.query';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckDetailsEnum } from '@pages/truck/pages/truck-details/enums/truck-details.enum';

// models
import { TrailerConfigData } from '@pages/trailer/pages/trailer-details/models/trailer-config-data.model';
import { TrailerResponse } from 'appcoretruckassist';
import { TrailerDetailsConfig } from '@pages/trailer/pages/trailer-details/models/trailer-details-config.model';
import {
    TrailerUiData,
    TrailerCombinedData,
} from '@pages/trailer/pages/trailer-modal/models/';

@Component({
    selector: 'app-trailer-details',
    templateUrl: './trailer-details.component.html',
    styleUrls: ['./trailer-details.component.scss'],
    providers: [DetailsPageService],
})
export class TrailerDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public trailerDetailsConfig: TrailerDetailsConfig[] = [];
    public trailerId: number;
    public dataHeaderDropDown;
    public trailerObject: TrailerResponse;
    public trailerList: any = this.trailerMinimalQuery.getAll();
    public currentIndex: number = 0;
    public newTrailerId: number;
    public trailerConfData: TrailerConfigData;

    constructor(
        private router: Router,
        private activated_route: ActivatedRoute,
        private cdRef: ChangeDetectorRef,

        // services
        private modalService: ModalService,
        private trailerService: TrailerService,
        private detailsPageDriverSer: DetailsPageService,
        private tableService: TruckassistTableService,
        private DetailsDataService: DetailsDataService,
        private dropService: DropDownService,
        private confirmationService: ConfirmationService,

        // store
        private trailerDetailListQuery: TrailersDetailsListQuery,
        private trailerMinimalQuery: TrailersMinimalListQuery,
        private trailerMinimalStore: TrailersMinimalListStore,
        private trailerItemStore: TrailerItemStore
    ) {}

    ngOnInit(): void {
        this.setTableData();

        this.actionAnimationSubscribe();

        // Confirmation Subscribe
        this.confirmationServiceSubscribe();

        this.pageDetailChangeSubscribe();
    }

    public isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
    }

    public trailerConf(data: TrailerConfigData): void {
        this.DetailsDataService.setNewData(data);
        this.trailerConfData = data;

        this.trailerDetailsConfig = [
            {
                id: 0,
                name: 'Trailer Detail',
                template: 'general',
                data: data,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 1,
                name: TruckDetailsEnum.REGISTRATION,
                template: TruckDetailsEnum.REGISTRATION_2,
                data: data.registrations,
                length: data?.registrations?.length
                    ? data.registrations.length
                    : 0,
                status: data?.status == 0 ? true : false,
                businessOpen: true,
            },
            {
                id: 2,
                name: TruckDetailsEnum.FHWA_INSPECTION,
                template: TruckDetailsEnum.FHWA_INSPECTION_2,
                data: data.inspections,
                length: data?.inspections?.length ? data.inspections.length : 0,
                status: data?.status == 0 ? true : false,
                businessOpen: true,
            },
            {
                id: 3,
                name: TruckDetailsEnum.TITLE_2,
                template: TruckDetailsEnum.TITLE,
                data: data.titles,
                length: data?.titles?.length ? data.titles.length : 0,
                status: data?.status == 0 ? true : false,
                businessOpen: true,
            },
        ];

        this.trailerId = data?.id ? data.id : 0;
    }

    /**Function for dots in cards */
    public initTableOptions(data: any): void {
        this.dataHeaderDropDown = {
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
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    svg: TruckDetailsEnum.EDIT_SVG_2,
                    iconName: TableStringEnum.EDIT,
                    show: true,
                    disabled: data.status == 0 ? true : false,
                },
                {
                    title: TruckDetailsEnum.BORDER,
                },
                {
                    title: TableStringEnum.ADD_NEW_2,
                    svg: TruckDetailsEnum.DROPDOWN_ARROW_SVG,
                    iconName: TableStringEnum.ADD_NEW,
                    disabled: data.status == 0 ? true : false,
                    subType: [
                        {
                            subName: TruckDetailsEnum.REGISTRATION,
                            actionName: TruckDetailsEnum.REGISTRATION,
                        },
                        {
                            subName: TruckDetailsEnum.FHWA_INSPECTION,
                            actionName: TruckDetailsEnum.FHWA_INSPECTION,
                        },
                        {
                            subName: TruckDetailsEnum.TITLE_2,
                            actionName: TruckDetailsEnum.TITLE_2,
                        },
                        {
                            subName: TruckDetailsEnum.LEASE_RENT,
                            actionName: TruckDetailsEnum.LEASE_RENT,
                        },
                    ],
                },
                {
                    title: TruckDetailsEnum.BORDER,
                },
                {
                    title:
                        data.status == 0
                            ? TableStringEnum.ACTIVATE_2
                            : TableStringEnum.DEACTIVATE_2,
                    name:
                        data.status == 0
                            ? TableStringEnum.ACTIVATE
                            : TableStringEnum.DEACTIVATE,
                    svg: TruckDetailsEnum.DEACTIVATE_SVG,
                    iconName: TableStringEnum.ACTIVATE_ITEM,
                    activate: data.status == 0 ? true : false,
                    deactivate: data.status == 1 ? true : false,
                    show: data.status == 1 || data.status == 0 ? true : false,
                    redIcon: data.status == 1 ? true : false,
                    blueIcon: data.status == 0 ? true : false,
                },
                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    type: TableStringEnum.TRUCK,
                    svg: TruckDetailsEnum.TRASH_UPDATE_SVG,
                    iconName: TableStringEnum.DELETE,
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
            export: true,
        };
    }

    public getTrailerById(trid: number) {
        const trailerData$ = this.trailerService
            .getTrailerById(trid)
            .pipe(take(1));
        const trailerRegistration$ = this.trailerService
            .getTrailerRegistrationsById(trid)
            .pipe(take(1));
        const trailerInspection$ = this.trailerService
            .getTrailerInspectionsById(trid)
            .pipe(take(1));
        const trailerTitles$ = this.trailerService
            .getTrailerTitlesById(trid)
            .pipe(take(1));

        forkJoin({
            trailerData: trailerData$,
            trailerRegistrations: trailerRegistration$,
            trailerInspection: trailerInspection$,
            trailerTitles: trailerTitles$,
        })
            .pipe(
                tap((data: TrailerCombinedData) => {
                    let trailerData = data.trailerData as TrailerUiData;
                    trailerData.registrations = data.trailerRegistrations;
                    trailerData.inspections = data.trailerInspection;
                    trailerData.titles = data.trailerTitles;
                    this.initTableOptions(trailerData);
                    this.trailerConf(trailerData);
                }),
                catchError((error) => {
                    return of(null);
                })
            )
            .subscribe();
    }

    public deleteTrailerById(id: number) {
        let status = this.trailerObject.status == 0 ? 'inactive' : 'active';
        let last = this.trailerList.at(-1);
        if (
            last.id ===
            this.trailerMinimalStore.getValue().ids[this.currentIndex]
        ) {
            this.currentIndex = --this.currentIndex;
        } else {
            this.currentIndex = ++this.currentIndex;
        }
        this.trailerList = this.trailerMinimalQuery.getAll();

        this.trailerService
            .deleteTrailerByIdDetails(id, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.trailerMinimalStore.getValue().ids.length >= 1) {
                        this.router.navigate([
                            `/list/trailer/${
                                this.trailerList[this.currentIndex].id
                            }/details`,
                        ]);
                    }
                },
                error: () => {
                    this.router.navigate(['/list/trailer']);
                },
            });
    }

    public changeTrailerStatus(id: number) {
        this.trailerService.changeActiveStatus(id);
    }

    public onTrailerActions(event: { id: number; type: string }): void {
        const trailerData = this.trailerObject ?? this.trailerConfData;
        this.dropService.dropActionHeaderTruck(
            event,
            trailerData,
            null,
            event.id
        );
    }

    public onModalAction(action: string): void {
        let dataId = this.activated_route.snapshot.params.id;
        let trailer = {
            ...this.trailerItemStore?.getValue()?.entities[dataId],
        };
        switch (action.toLowerCase()) {
            case TruckDetailsEnum.REGISTRATION_2: {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        id: trailer.id,
                        payload: trailer,
                        type: TableStringEnum.ADD_REGISTRATION,
                        modal: TableStringEnum.TRAILER_2,
                    }
                );
                break;
            }
            case TruckDetailsEnum.FHWA_INSPECTION_3: {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        id: trailer.id,
                        payload: trailer,
                        type: TableStringEnum.ADD_INSPECTION,
                        modal: TableStringEnum.TRAILER_2,
                    }
                );
                break;
            }
            case TruckDetailsEnum.TITLE: {
                this.modalService.openModal(
                    TtTitleModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        id: trailer.id,
                        payload: trailer,
                        type: TruckDetailsEnum.ADD_TITLE,
                        modal: TableStringEnum.TRAILER_2,
                    }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public setTableData(): void {
        const dataId = this.activated_route.snapshot.params.id;
        const trailerData = {
            ...this.trailerItemStore?.getValue()?.entities[dataId],
        };

        this.initTableOptions(trailerData);

        this.trailerConf(trailerData);
    }

    public actionAnimationSubscribe(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.animation && res?.data?.id) {
                    this.getTrailerById(res?.data?.id);
                }
            });
    }

    public confirmationServiceSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE:
                            if (res.template === 'trailer')
                                this.deleteTrailerById(res?.id);
                            break;

                        case TableStringEnum.ACTIVATE:
                        case TableStringEnum.DEACTIVATE:
                            this.changeTrailerStatus(res?.id);
                            break;

                        default:
                            break;
                    }
                },
            });
    }

    public pageDetailChangeSubscribe(): void {
        this.detailsPageDriverSer.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;
                if (this.trailerDetailListQuery.hasEntity(id)) {
                    query = this.trailerDetailListQuery
                        .selectEntity(id)
                        .pipe(take(1));

                    query.pipe(takeUntil(this.destroy$)).subscribe({
                        next: (res: TrailerResponse) => {
                            this.currentIndex = this.trailerList.findIndex(
                                (trailer) => trailer.id === res.id
                            );

                            this.DetailsDataService.setNewData(res);
                            this.trailerConf(res);
                            this.initTableOptions(res);
                            this.newTrailerId = id;
                            this.router.navigate([
                                `/list/trailer/${res.id}/details`,
                            ]);

                            this.cdRef.detectChanges();
                        },
                        error: () => {},
                    });
                } else {
                    this.newTrailerId = id;
                    this.router.navigate([`/list/trailer/${id}/details`]);
                    this.cdRef.detectChanges();
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
