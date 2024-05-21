import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

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

// models
import { TrailerConfigData } from '@pages/trailer/pages/trailer-details/models/trailer-config-data.model';
import { TrailerResponse } from 'appcoretruckassist';
import { TrailerDetailsConfig } from '@pages/trailer/pages/trailer-details/models/trailer-details-config.model';

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
    ) {
        let storeData$ = this.trailerItemStore._select((state) => state);

        storeData$.subscribe((state) => {
            let newTrailerData = { ...state.entities[this.newTrailerId] };

            if (!this.isEmpty(newTrailerData)) {
                this.DetailsDataService.setNewData(newTrailerData);
                this.trailerConf(newTrailerData);
                this.initTableOptions(newTrailerData);
            }
        });
    }

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
                name: 'Registration',
                template: 'registration',
                data: data.registrations,
                length: data?.registrations?.length
                    ? data.registrations.length
                    : 0,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 2,
                name: 'FHWA Inspection',
                template: 'fhwa-inspection',
                data: data.inspections,
                length: data?.inspections?.length ? data.inspections.length : 0,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 3,
                name: 'Title',
                template: 'title',
                data: data.titles,
                length: data?.titles?.length ? data.titles.length : 0,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 4,
                name: 'Lease / Purchase',
                template: 'lease-purchase',
                length: 1,
                data: data,
                status: data?.status == 0 ? true : false,
            },
        ];

        this.trailerId = data?.id ? data.id : 0;
    }

    /**Function for dots in cards */
    public initTableOptions(data: any): void {
        this.currentIndex = this.trailerList.findIndex(
            (trailer) => trailer.id === data.id
        );
        //this.getTrailerById(data.id);
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
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                    disabled: data.status == 0 ? true : false,
                    iconName: 'edit',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Add New',
                    svg: 'assets/svg/common/dropdown-arrow.svg',
                    disabled: data.status == 0 ? true : false,
                    subType: [
                        { subName: 'Registration', actionName: 'Registration' },
                        {
                            subName: 'FHWA Inspection',
                            actionName: 'FHWA Inspection',
                        },
                        { subName: 'Title', actionName: 'Title' },
                        { subName: 'Lease / Rent', actionName: 'Lease / Rent' },
                    ],
                    iconName: 'add-new',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: 'share',
                },
                {
                    title: 'Print',
                    name: 'print-truck',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                    iconName: 'print',
                },
                {
                    title: 'border',
                },
                {
                    title: data.status == 0 ? 'Activate' : 'Deactivate',
                    name: data.status == 0 ? 'activate' : 'deactivate',
                    svg: 'assets/svg/common/ic_deactivate.svg',
                    activate: data.status == 0 ? true : false,
                    deactivate: data.status == 1 ? true : false,
                    show: data.status == 1 || data.status == 0 ? true : false,
                    redIcon: data.status == 1 ? true : false,
                    blueIcon: data.status == 0 ? true : false,
                    iconName: 'activate-item',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'truck',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                    redIcon: true,
                    iconName: 'delete',
                },
            ],
            export: true,
        };
    }

    public getTrailerById(id: number) {
        this.trailerService
            .getTrailerById(id, true)
            .subscribe((item) => (this.trailerObject = item));
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
            case 'registration': {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: 'small' },
                    {
                        id: trailer.id,
                        payload: trailer,
                        type: 'add-registration',
                        modal: 'trailer',
                    }
                );
                break;
            }
            case 'fhwa inspection': {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: 'small' },
                    {
                        id: trailer.id,
                        payload: trailer,
                        type: 'add-inspection',
                        modal: 'trailer',
                    }
                );
                break;
            }
            case 'title': {
                this.modalService.openModal(
                    TtTitleModalComponent,
                    { size: 'small' },
                    {
                        id: trailer.id,
                        payload: trailer,
                        type: 'add-title',
                        modal: 'trailer',
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
                if (res?.animation) {
                    this.trailerConf(res.data);
                    this.initTableOptions(res.data);
                    this.cdRef.detectChanges();
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
