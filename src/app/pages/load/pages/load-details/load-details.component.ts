import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil, take } from 'rxjs';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { LoadService } from '@shared/services/load.service';

// components
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { LoadDetailsItemComponent } from '@pages/load/pages/load-details/components/load-details-item/load-details-item.component';

// store
import { LoadDetailsListQuery } from '@pages/load/state/load-details-state/load-details-list-state/load-details-list.query';

// enums
import { LoadDetailsStringEnum } from '@pages/load/pages/load-details/enums/load-details-string.enum';

// helpers
import { LoadDetailsHelper } from '@pages/load/pages/load-details/utils/helpers/load-details.helper';

// models
import { LoadResponse } from 'appcoretruckassist';
import { MapRoute } from '@shared/models/map-route.model';
import { DetailsConfig } from '@shared/models/details-config.model';

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

        // components
        LoadDetailsItemComponent,
        TaDetailsHeaderComponent,
    ],
    providers: [DetailsPageService],
})
export class LoadDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public loadDetailsConfig: DetailsConfig;

    public dataTest: any;
    public loadStopRoutes: MapRoute[] = [];

    constructor(
        private cdRef: ChangeDetectorRef,

        // router
        private router: Router,
        private activatedRoute: ActivatedRoute,

        // services
        private detailsPageService: DetailsPageService,
        private loadService: LoadService,

        // store
        private loadDetailsListQuery: LoadDetailsListQuery
    ) {}

    ngOnInit(): void {
        this.handleLoadIdRouteChange();

        this.getDetailsConfig(this.activatedRoute.snapshot.data.loadItem);
        this.getDetailsOptions(this.activatedRoute.snapshot.data.loadItem);
    }

    public trackByIdentity(index: number): number {
        return index;
    }

    public getDetailsConfig(load: LoadResponse): void {
        this.loadDetailsConfig = LoadDetailsHelper.getLoadDetailsConfig(load);
    }

    public getDetailsOptions(data: any): void {
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

        /*   data.stops.map((stop: any, index: number) => {
            routes[index] = {
                longitude: stop.shipper.longitude,
                latitude: stop.shipper.latitude,
                pickup: stop.stopType.name == 'Pickup' ? true : false,
                delivery: stop.stopType.name == 'Delivery' ? true : false,
                stopNumber: index,
            };
        }); */

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

    private handleLoadIdRouteChange(): void {
        this.detailsPageService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;

                /* this.newDriverId = id; */

                if (this.loadDetailsListQuery.hasEntity(id)) {
                    query = this.loadDetailsListQuery
                        .selectEntity(id)
                        .pipe(take(1));

                    query.subscribe((res: LoadResponse) => {
                        /*    this.currentIndex = this.driversList.findIndex(
                            (driver: DriverResponse) => driver.id === res.id
                        ); */

                        this.getDetailsOptions(res.status);
                        this.getDetailsConfig(res);

                        if (
                            this.router.url.includes(
                                LoadDetailsStringEnum.DETAILS
                            )
                        ) {
                            this.router.navigate([
                                `/list/load/${res.id}/details`,
                            ]);
                        }
                    });
                } else {
                    this.router.navigate([`/list/load/${id}/details`]);
                }

                this.cdRef.detectChanges();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
