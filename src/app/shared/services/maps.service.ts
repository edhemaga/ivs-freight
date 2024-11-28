import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';

// signalR
import * as signalR from '@microsoft/signalr';

// services
import { DetailsDataService } from '@shared/services/details-data.service';
import { NotificationService } from '@shared/services/notification.service';
import { MapService } from 'appcoretruckassist';

// models
import { CreateMapCommand, MapResponse } from 'appcoretruckassist';

declare var google: any;

@Injectable({
    providedIn: 'root',
})
export class MapsService implements OnDestroy {
    private destroy$ = new Subject<void>();

    public mapCircle: any = {
        lat: 41.860119,
        lng: -87.660156,
        radius: 160934.4, // 100 miles
    };

    sortCategory: any = {};
    sortCategoryChange: Subject<any> = new Subject<any>();
    sortChange: Subject<any> = new Subject<any>();
    searchText: any = {};
    searchTextChange: Subject<any> = new Subject<any>();

    selectedMarkerChange: Subject<any> = new Subject<any>();
    selectedMapListCardChange: Subject<any> = new Subject<any>();
    selectedMarkerId: any;
    searchLoadingChanged: Subject<any> = new Subject<any>();
    mapListScrollChange: Subject<any> = new Subject<any>();
    mapFilterChange: Subject<any> = new Subject<any>();
    mapRatingChange: Subject<any> = new Subject<any>();
    searchResultsCountChange: Subject<any> = new Subject<any>();
    markerUpdateChange: Subject<any> = new Subject<any>();

    private hubConnection: signalR.HubConnection;
    public statusChange = new Subject<any>();

    constructor(
        private mapService: MapService,
        private notificationService: NotificationService,
        private router: Router,
        private detailsDataService: DetailsDataService
    ) {
        this.sortCategoryChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((category) => {
                this.sortCategory = category;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getMeters(miles) {
        return miles * 1609.344;
    }

    getMiles(meters) {
        return meters * 0.000621371192;
    }

    getDistanceBetween(lat1, long1, lat2, long2) {
        var from = new google.maps.LatLng(lat1, long1);
        var to = new google.maps.LatLng(lat2, long2);

        var distanceBetween =
            google.maps.geometry.spherical.computeDistanceBetween(from, to);

        if (distanceBetween <= this.mapCircle.radius) {
            return [true, distanceBetween];
        } else {
            return [false, distanceBetween];
        }
    }

    createMap(data: CreateMapCommand) {
        this.mapService.apiMapPost(data).pipe(
            tap((res: any) => {
                const subMap = this.getMapById(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (map: MapResponse | any) => {
                            // this.shipperStore.add(shipper);
                            // this.shipperMinimalStore.add(shipper);
                            // const brokerShipperCount = JSON.parse(
                            //   localStorage.getItem('brokerShipperTableCount')
                            // );

                            // brokerShipperCount.shipper++;

                            // localStorage.setItem(
                            //   'brokerShipperTableCount',
                            //   JSON.stringify({
                            //     broker: brokerShipperCount.broker,
                            //     shipper: brokerShipperCount.shipper,
                            //   })
                            // );

                            // this.tableService.sendActionAnimation({
                            //   animation: 'add',
                            //   tab: 'shipper',
                            //   data: shipper,
                            //   id: shipper.id,
                            // });

                            subMap.unsubscribe();
                        },
                    });
            })
        );
    }

    public searchTextChanged(text: string) {
        this.searchTextChange.next(text);
    }

    getMapById(mapId: number) {
        return this.mapService.apiMapIdGet(mapId);
    }

    selectedMarker(id: number) {
        this.selectedMarkerId = id;
        this.selectedMarkerChange.next(id);
    }

    selectedMapListCard(id) {
        this.selectedMarkerId = id;
        this.selectedMapListCardChange.next(id);
    }

    mapListScroll(data) {
        this.mapListScrollChange.next(data);
    }

    toggleFilter(filter) {
        this.mapFilterChange.next(filter);
    }

    addRating(item) {
        this.mapRatingChange.next(item);
    }

    getDropdownActions(data, type) {
        var dropActions = {};

        if (type == 'shipper') {
            dropActions = [
                {
                    title: 'Edit',
                    name: 'edit-cutomer-or-shipper',
                    svg: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                    show: true,
                    iconName: 'edit',
                    disabled: !data.status || data.isClosed,
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                    show: true,
                    iconName: 'view-details',
                },
                {
                    title: 'Add Contact',
                    name: 'add-contact',
                    svg: 'assets/svg/common/ic_broker-user.svg',
                    show: true,
                    iconName: 'add-contact',
                    disabled: !data.status || data.isClosed,
                },
                {
                    title: 'Write Review',
                    name: 'write-review',
                    svg: 'assets/svg/common/review-pen.svg',
                    show: true,
                    iconName: 'write-review',
                    disabled: !data.status || data.isClosed,
                },
                {
                    title: 'border',
                },
                // {
                //     title: 'Share',
                //     name: 'share',
                //     svg: 'assets/svg/common/share-icon.svg',
                //     show: true,
                //     iconName: 'share',
                // },
                // {
                //     title: 'Print',
                //     name: 'print',
                //     svg: 'assets/svg/common/ic_fax.svg',
                //     show: true,
                //     iconName: 'print',
                // },
                // {
                //     title: 'border',
                // },
                {
                    title:
                        !data.status || data.isClosed
                            ? 'Open Business'
                            : 'Close Business',
                    name: 'close-business',
                    svg: 'assets/svg/common/close-business-icon.svg',
                    redIcon: data.status && !data.isClosed,
                    greenIcon: !data.status || data.isClosed,
                    show: true,
                    iconName:
                        !data.status || data.isClosed
                            ? 'mark-as-done'
                            : 'close-business',
                },
                {
                    title: 'Delete',
                    name: 'delete',
                    svg: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                    redIcon: true,
                    show: true,
                    iconName: 'delete',
                },
            ];
        } else if (type == 'repairShop') {
            dropActions = [
                {
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                    iconName: 'edit',
                    disabled: data.status == 0 || data.isClosed,
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                    show: true,
                    iconName: 'view-details',
                },
                {
                    title: 'Add Bill',
                    name: 'add-bill',
                    svg: 'assets/svg/common/ic_plus.svg',
                    show: true,
                    blueIcon: true,
                    iconName: 'ic_plus',
                    disabled: data.status == 0 || data.isClosed,
                },
                {
                    title: data.isFavorite
                        ? 'Unmark Favorite'
                        : 'Mark as Favorite',
                    name: 'favorite',
                    svg: 'assets/svg/common/ic_star.svg',
                    activate: true,
                    blueIcon: data.isFavorite,
                    show: true,
                    iconName: 'ic_star',
                    disabled:
                        data.companyOwned || data.status == 0 || data.isClosed,
                },
                {
                    title: 'Write Review',
                    name: 'write-review',
                    svg: 'assets/svg/common/review-pen.svg',
                    show: true,
                    iconName: 'write-review',
                    disabled: data.status == 0 || data.isClosed,
                },
                {
                    title: 'border',
                },
                // {
                //     title: 'Share',
                //     name: 'share',
                //     svg: 'assets/svg/common/share-icon.svg',
                //     show: true,
                //     iconName: 'share',
                // },
                // {
                //     title: 'Print',
                //     name: 'print',
                //     svg: 'assets/svg/common/ic_fax.svg',
                //     show: true,
                //     iconName: 'print',
                // },
                // {
                //     title: 'border',
                // },
                {
                    title:
                        data.status == 0 || data.isClosed
                            ? 'Open Business'
                            : 'Close Business',
                    name: 'close-business',
                    svg: 'assets/svg/common/close-business-icon.svg',
                    redIcon: data.status != 0 && !data.isClosed,
                    greenIcon: data.status == 0 || data.isClosed,
                    show: true,
                    iconName:
                        data.status == 0 || data.isClosed
                            ? 'mark-as-done'
                            : 'close-business',
                },
                {
                    title: 'Delete',
                    name: 'delete',
                    type: 'truck',
                    text: 'Are you sure you want to delete truck(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                    redIcon: true,
                    iconName: 'delete',
                },
            ];
        }

        return dropActions;
    }

    goToDetails(data, type) {
        var linkStart = '';
        var linkEnd = '';
        var doesNotHaveRout = false;

        if (type == 'shipper') {
            linkStart = '/list/customer/';
            linkEnd = '/shipper-details';
        } else if (type == 'repairShop') {
            linkStart = '/list/repair/';
            linkEnd = '/details';
        } else if (type == 'fuelStop') {
            doesNotHaveRout = true;
        } else if (type == 'accident') {
            doesNotHaveRout = true;
        } else {
            doesNotHaveRout = true;
        }

        if (!doesNotHaveRout) {
            const link = linkStart + data['id'] + linkEnd;

            this.detailsDataService.setNewData(data);
            this.selectedMarker(0);

            this.router.navigate([link]);
        }
    }

    markerUpdate(data) {
        this.markerUpdateChange.next(data);
    }
}
