import { TrailersMinimalListStore } from './../state/trailer-minimal-list-state/trailer-minimal.store';
import { TrailersMinimalListQuery } from './../state/trailer-minimal-list-state/trailer-minimal.query';
import { TrailerResponse } from './../../../../../../appcoretruckassist/model/trailerResponse';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TrailerTService } from '../state/trailer.service';
import { Subject, take, takeUntil } from 'rxjs';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TtTitleModalComponent } from '../../modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';
import { Confirmation } from '../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { TrailersDetailsListQuery } from '../state/trailer-details-list-state/trailer-details-list.query';
import { DetailsDataService } from '../../../services/details-data/details-data.service';

@Component({
    selector: 'app-trailer-details',
    templateUrl: './trailer-details.component.html',
    styleUrls: ['./trailer-details.component.scss'],
    providers: [DetailsPageService],
})
export class TrailerDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public trailerDetailsConfig: any[] = [];
    public trailerId: number = null;
    public dataHeaderDropDown: any;
    public trailerObject: any;
    public trailerList: any = this.trailerMinimalQuery.getAll();
    public currentIndex: number = 0;
    constructor(
        private activated_route: ActivatedRoute,
        private modalService: ModalService,
        private trailerService: TrailerTService,
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private notificationService: NotificationService,
        private detailsPageDriverSer: DetailsPageService,
        private tableService: TruckassistTableService,
        private trailerDetailListQuery: TrailersDetailsListQuery,
        private dropService: DropDownService,
        private confirmationService: ConfirmationService,
        private trailerMinimalQuery: TrailersMinimalListQuery,
        private trailerMinimalStore: TrailersMinimalListStore,
        private DetailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.initTableOptions(this.activated_route.snapshot.data.trailer);
        this.DetailsDataService.setNewData(
            this.activated_route.snapshot.data.trailer
        );
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.trailerConf(res.data);
                    this.initTableOptions(res.data);
                    this.cdRef.detectChanges();
                }
            });
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'trailer') {
                                this.deleteTrailerById(res.id);
                            }
                            break;
                        }
                        case 'activate': {
                            this.changeTrailerStatus(res.id);
                            break;
                        }
                        case 'deactivate': {
                            this.changeTrailerStatus(res.id);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        this.detailsPageDriverSer.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;
                if (this.trailerDetailListQuery.hasEntity(id)) {
                    query = this.trailerDetailListQuery
                        .selectEntity(id)
                        .pipe(take(1));
                } else {
                    query = this.trailerService.getTrailerById(id);
                }
                query.pipe(takeUntil(this.destroy$)).subscribe({
                    next: (res: TrailerResponse) => {
                        this.currentIndex = this.trailerList.findIndex(
                            (trailer) => trailer.id === res.id
                        );
                        this.DetailsDataService.setNewData(res);
                        this.trailerConf(res);
                        this.initTableOptions(res);
                        this.router.navigate([`/trailer/${res.id}/details`]);
                       
                        this.cdRef.detectChanges();
                    },
                    error: () => {
                        
                    },
                });
            });
        this.trailerConf(this.activated_route.snapshot.data.trailer);
    }

    trailerConf(data: TrailerResponse) {
        this.trailerDetailsConfig = [
            {
                id: 0,
                name: 'Trailer Details',
                template: 'general',
                data: data,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 1,
                name: 'Registration',
                template: 'registration',
                data: data,
                length: data?.registrations?.length
                    ? data.registrations.length
                    : 0,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 2,
                name: 'FHWA Inspection',
                template: 'fhwa-insepction',
                data: data,
                length: data?.inspections?.length ? data.inspections.length : 0,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 3,
                name: 'Title',
                template: 'title',
                data: data,
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
        this.trailerId = data?.id ? data.id : null;
    }
    /**Function for dots in cards */
    public initTableOptions(data: TrailerResponse): void {
        this.currentIndex = this.trailerList.findIndex(
            (trailer) => trailer.id === data.id
        );
        this.getTrailerById(data.id);
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
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    show: true,
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
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print-truck',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
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
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'truck',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                    redIcon: true,
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
                            `/trailer/${
                                this.trailerList[this.currentIndex].id
                            }/details`,
                        ]);
                    }
                   
                },
                error: () => {
                    this.router.navigate(['/trailer']);
                },
            });
    }
    public changeTrailerStatus(id: number) {
        let status = this.trailerObject.status == 0 ? 'inactive' : 'active';
        this.trailerService
            .changeTrailerStatus(id, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                 
                },
                error: () => {
                   
                },
            });
    }
    public onTrailerActions(event: any) {
        this.dropService.dropActionHeaderTruck(
            event,
            this.trailerObject,
            null,
            event.id
        );
    }
    public onModalAction(action: string): void {
        const trailer = this.activated_route.snapshot.data.trailer;
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
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
