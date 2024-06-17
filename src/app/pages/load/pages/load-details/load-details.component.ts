import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil, take } from 'rxjs';

// modules
import { SharedModule } from '@shared/shared.module';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { LoadService } from '@shared/services/load.service';

// components
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from '@shared/components/ta-chart/ta-chart.component';
import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';
import { LoadDetailsItemComponent } from '@pages/load/pages/load-details/components/load-details-item/load-details-item.component';
import { LoadDetailsCardComponent } from '@pages/load/pages/load-details/components/load-details-card/load-details-card.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// store
import { LoadDetailsListQuery } from '@pages/load/state/load-details-state/load-details-list-state/load-details-list.query';

// models
import { LoadResponse } from 'appcoretruckassist';
import { MapRoute } from '@shared/models/map-route.model';

interface IStopRoutes {
    longitude: number;
    latitude: number;
    pickup?: boolean;
    delivery?: boolean;
    stopNumber?: number;
}

@Component({
    selector: 'app-load-details',
    templateUrl: './load-details.component.html',
    styleUrls: ['./load-details.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,

        // components
        TaProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,

        TaDetailsHeaderComponent,
        TaDetailsHeaderCardComponent,
        TaChartComponent,
        TaMapsComponent,
        LoadDetailsItemComponent,
        LoadDetailsCardComponent,

        // pipes
        FormatCurrencyPipe,
        FormatDatePipe,
    ],
    providers: [DetailsPageService],
})
export class LoadDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public loadConfig: any;

    public statusIsClosed: boolean;
    public dataTest: any;
    public loadStopRoutes: MapRoute[] = [];

    constructor(
        private activated_route: ActivatedRoute,
        private detailsPageService: DetailsPageService,
        private router: Router,
        private loadService: LoadService,
        private ldlQuery: LoadDetailsListQuery
    ) {}
    ngOnInit(): void {
        this.detailsPageService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;
                if (this.ldlQuery.hasEntity(id)) {
                    query = this.ldlQuery.selectEntity(id).pipe(take(1));
                } else {
                    query = this.loadService.getLoadById(id);
                }
                query.pipe(takeUntil(this.destroy$)).subscribe({
                    next: (res: LoadResponse) => {
                        this.detailCongif(res);
                        this.router.navigate([`/list/load/${res.id}/details`]);
                    },
                    error: () => {},
                });
            });

        this.detailCongif(this.activated_route.snapshot.data.loadItem);
        this.initTableOptions(this.activated_route.snapshot.data.loadItem);
    }
    /**Function template and names for header and other options in header */
    public detailCongif(data: LoadResponse) {
        if (data?.statusType?.name === 'Closed') {
            this.statusIsClosed = true;
        } else {
            this.statusIsClosed = false;
        }

        this.loadConfig = [
            {
                id: 0,
                name: `${data?.statusType?.name} Load Detail`,
                template: 'general',
                data: data,
            },
            {
                id: 1,
                name: 'Finance',
                template: 'finance',
                req: false,
                hide: true,
                data: data,
                pl: true,
            },
            {
                id: 2,
                name: 'Stop',
                template: 'stop',
                req: false,
                hide: true,
                data: data,
                pl: false,
                length: data?.stops?.length ? data.stops.length : 0,
            },
            {
                id: 3,
                name: 'Comment',
                template: 'comment',
                hide: false,
                hasArrow: true,
                data: data,
                pl: false,
                length: data?.comments?.length ? data.commentsCount : 0,
            },
        ];
    }
    /**Function retrun id */
    public identity(index: number): number {
        return index;
    }

    public initTableOptions(data: any): void {
        this.dataTest = {
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
                    disabled: data.status == 0 ? true : false,
                    iconName: 'edit',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Create Load',
                    name: 'create-load',
                    svg: 'assets/svg/common/ic_plus.svg',
                    show: true,
                    blueIcon: true,
                    iconName: 'assets/svg/common/ic_plus.svg',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    iconName: 'share',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    iconName: 'print',
                    show: data.status == 1 || data.status == 0 ? true : false,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    iconName: 'delete',
                    danger: true,
                    show: data.status == 1 || data.status == 0 ? true : false,
                    redIcon: true,
                },
            ],
        };

        const routes: IStopRoutes[] = [];

        data.stops.map((stop: any, index: number) => {
            routes[index] = {
                longitude: stop.shipper.longitude,
                latitude: stop.shipper.latitude,
                pickup: stop.stopType.name == 'Pickup' ? true : false,
                delivery: stop.stopType.name == 'Delivery' ? true : false,
                stopNumber: index,
            };
        });

        this.loadStopRoutes[0] = {
            routeColor: '#919191',
            stops: routes.map((route, index) => {
                return {
                    lat: route.latitude,
                    long: route.longitude,
                    stopColor: route.pickup
                        ? '#26A690'
                        : route.delivery
                        ? '#EF5350'
                        : '#919191',
                    stopNumber: route?.stopNumber?.toString(),
                    zIndex: 99 + index,
                };
            }),
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
