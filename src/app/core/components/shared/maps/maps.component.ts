import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import * as AppConst from 'src/app/const';
import { MapsService } from '../../../services/shared/maps.service';
import { RepairTService } from '../../repair/state/repair.service';
import { ShipperTService } from '../../customer/state/shipper-state/shipper.service';
import { FuelTService } from '../../fuel/state/fuel.service';
import { AccidentTService } from '../../safety/accident/state/accident.service';
import { RoadsideService } from '../../safety/violation/state/roadside.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: [
        './maps.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MapsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    viewData = [];
    @Input() set _viewData(value) {
        // table data (shippers, repair shops)
        var previousData = JSON.parse(JSON.stringify(this.viewData));
        var updatedData = false;

        this.viewData = value;

        this.viewData.map((data, index) => {
            var doAnimation = false;
            if (previousData[index]?.latitude != data.latitude)
                doAnimation = true;

            if (
                (data.actionAnimation == 'update' && doAnimation) ||
                data.actionAnimation == 'add'
            ) {
                this.markerAnimations[data.id] = false;
                this.showMarkerWindow[data.id] = false;
                updatedData = true;
            }
        });

        if (updatedData) {
            setTimeout(() => {
                this.markersDropAnimation();
            }, 1000);
        }
    }
    @Input() mapType: string = 'shipper'; // shipper, repairShop, fuelStop, accident, inspection, routing
    @Input() routes: any[] = []; // array of stops to be shown on map, ex. - [{routeColor: #3074D3, stops: [{lat: 39.353087, long: -84.299328, stopColor: #EF5350, empty: true}, {lat: 39.785871, long: -86.143448, stopColor: #26A690, empty: false}]]
    @Input() dropdownActions: any[] = [];
    @Output() callDropDownAction: EventEmitter<any> = new EventEmitter();
    @Output() updateMapList: EventEmitter<any> = new EventEmitter();

    public agmMap: any;
    public styles = AppConst.GOOGLE_MAP_STYLES;
    mapRestrictions = {
        latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
        strictBounds: true,
    };

    public searchForm!: FormGroup;
    public locationForm!: FormGroup;
    public sortTypes: any[] = [];
    public sortDirection: string = 'asc';
    public activeSortType: any = {};
    public markerSelected: boolean = false;
    public mapLatitude: number = 41.860119;
    public mapLongitude: number = -87.660156;
    public sortBy: string = 'nameAsc';
    public searchValue: string = '';
    public mapMarkers: any[] = [];
    public mapCircle: any = {
        lat: 41.860119,
        lng: -87.660156,
        radius: 160934.4, // 100 miles
    };
    public locationFilterOn: boolean = false;
    private tooltip: any;
    public locationRange: any = 100;

    public markerAnimations: any = {};
    public showMarkerWindow: any = {};
    public dropDownActive: number = -1;
    public mapZoom: number = 1;
    public mapCenter: any = {
        lat: 41.860119,
        lng: -87.660156,
    };

    public routeColors: any[] = [
        '#3074D3',
        '#FFA726',
        '#EF5350',
        '#26A690',
        '#AB47BC',
        '#38BDEB',
        '#F276EF',
        '#8D6E63',
    ];

    public mapZoomTime: number = 0;

    public clusterMarkers: any[] = [];
    public clustersTimeout: any;

    public searchText: string = '';
    public firstClusterCall: boolean = true;

    constructor(
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private mapsService: MapsService,
        private repairShopService: RepairTService,
        private shipperService: ShipperTService,
        private fuelStopService: FuelTService,
        private accidentService: AccidentTService,
        private roadsideService: RoadsideService,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.showHideMarkers();
        this.markersDropAnimation();

        this.addMapListSearchListener();
    }

    addMapListSearchListener() {
        this.mapsService.searchTextChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((text) => {
                this.searchText = text;
                this.getClusters(true);
            });

        this.mapsService.sortChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((category) => {
                this.sortBy = category;
                console.log('sortCategoryChange', category);
                this.getClusters(true);
            });
    }

    public getMapInstance(map) {
        this.agmMap = map;

        if (this.mapType == 'repairShop' || this.mapType == 'shipper' || this.mapType == 'fuelStop') {
            map.addListener('idle', () => {
                // update the coordinates here

                clearTimeout(this.clustersTimeout);

                this.clustersTimeout = setTimeout(() => {
                    this.getClusters(this.firstClusterCall);

                    if (this.firstClusterCall) {
                        this.firstClusterCall = false;
                    }
                }, 500);
            });
        }
    }

    clickedMarker(id) {
        this.viewData.map((data: any, index) => {
            if (data.isExpanded) {
                data.isExpanded = false;
            }

            if (data.isSelected && data.id != id) {
                data.isSelected = false;
            } else if (data.id == id) {
                var selectShop = !data.isSelected;

                //data.isSelected = !data.isSelected;

                if (selectShop) {
                    this.markerSelected = true;

                    if (!data.createdAt) {
                        if (this.mapType == 'repairShop') {
                            this.getRepairShop(data.id, index);
                        } else if (this.mapType == 'shipper') {
                            console.log('getShipper data.id', data.id);
                            this.getShipper(data.id, index);
                        } else if (this.mapType == 'fuelStop') {
                            console.log('getFuelStop data.id', data.id);
                            this.getFuelStop(data.id, index);
                        } else if (this.mapType == 'accident') {
                            console.log('getAccident data.id', data.id);
                            this.getAccident(data.id, index);
                        }
                    } else {
                        data.isSelected = true;
                    }

                    if (
                        this.mapLatitude == data.latitude &&
                        this.mapLongitude == data.longitude
                    ) {
                        this.mapLatitude = data.latitude + 0.000001;
                        this.mapLongitude = data.longitude + 0.000001;
                    } else {
                        this.mapLatitude = data.latitude;
                        this.mapLongitude = data.longitude;
                    }
                } else {
                    this.markerSelected = false;
                    data.isSelected = false;
                }

                document
                    .querySelectorAll('.si-float-wrapper')
                    .forEach((parentElement: HTMLElement) => {
                        parentElement.style.zIndex = '998';

                        setTimeout(() => {
                            var childElements = parentElement.querySelectorAll(
                                '.show-marker-dropdown'
                            );
                            if (childElements.length)
                                parentElement.style.zIndex = '999';
                        }, 1);
                    });
            }
        });

        this.clusterMarkers.map((cluster) => {
            if (cluster.isSelected) cluster.isSelected = false;
        });

        this.ref.detectChanges();
    }

    mapClick() {
        this.viewData.map((data: any) => {
            if (data.isSelected) {
                data.isSelected = false;
                data.isExpanded = false;
            }
        });

        this.clusterMarkers.map((data: any) => {
            if (data.isSelected) {
                data.isSelected = false;
                if (data.detailedInfo) {
                    setTimeout(() => {
                        data.detailedInfo = false;
                    }, 200);
                }
            }
        });

        var shadowElements = document.getElementsByClassName(
            'marker-tooltip-shadow'
        );
        if (shadowElements.length)
            shadowElements[0].classList.remove('marker-tooltip-shadow');
    }

    markersDropAnimation() {
        var mainthis = this;

        setTimeout(() => {
            this.viewData.map((data: any) => {
                if (!mainthis.markerAnimations[data.id]) {
                    mainthis.markerAnimations[data.id] = true;
                }
            });

            setTimeout(() => {
                this.viewData.map((data: any) => {
                    if (!mainthis.showMarkerWindow[data.id]) {
                        mainthis.showMarkerWindow[data.id] = true;
                    }
                });
            }, 100);
        }, 1000);
    }

    zoomChange(event) {
        this.mapZoom = event;
    }

    markerZoom(e, item) {
        var currentTime = new Date().getTime();

        if (!this.mapZoomTime || currentTime - this.mapZoomTime > 200) {
            this.mapZoomTime = currentTime;
        } else {
            return;
        }

        if (e.wheelDeltaY > 0) {
            // The user scrolled up.
            this.zoomChange(this.mapZoom + 1);

            if (
                this.mapLatitude == item.latitude &&
                this.mapLongitude == item.longitude
            ) {
                this.mapLatitude = item.latitude + 0.000001;
                this.mapLongitude = item.longitude + 0.000001;
            } else {
                this.mapLatitude = item.latitude;
                this.mapLongitude = item.longitude;
            }
        } else {
            // The user scrolled down.
            this.zoomChange(this.mapZoom - 1);
        }

        this.ref.detectChanges();
    }

    showHideMarkers() {
        this.viewData.map((data: any) => {
            var getDistance = this.mapsService.getDistanceBetween(
                data.latitude,
                data.longitude,
                this.mapCircle.lat,
                this.mapCircle.lng
            );
            data.isShown = getDistance[0];
            data.distanceBetween = this.mapsService
                .getMiles(getDistance[1])
                .toFixed(1);
        });
    }

    dropDownActionCall(action) {
        this.callDropDownAction.emit(action);
    }

    setLocationRange(value) {
        this.mapCircle.radius = this.mapsService.getMeters(value);
        this.showHideMarkers();
        this.locationFilterOn = true;

        this.sortTypes[1].isHidden = false;
        this.ref.detectChanges();
    }

    clearLocationRange() {
        this.mapCircle.radius = this.mapsService.getMeters(100);
        this.showHideMarkers();
        this.locationFilterOn = false;

        this.sortTypes[1].isHidden = true;

        if (this.activeSortType.name == 'Location') {
            this.activeSortType = this.sortTypes[0];
        }

        this.locationForm.reset();

        this.ref.detectChanges();
    }

    changeLocationRange(value) {
        this.locationRange = value;
    }

    setLocationFilter() {
        this.setLocationRange(this.locationRange);
    }

    clearLocationFilter() {
        this.locationRange = 100;
        this.clearLocationRange();
    }

    zoomMap(zoom) {
        if (zoom == 'minus' && this.mapZoom > 0) {
            this.mapZoom--;
        } else if (this.mapZoom < 21) {
            this.mapZoom++;
        }
    }

    callClusters(clustersObj, changedSearchOrSort) {
        //this.viewData = [];

        if (this.mapType == 'repairShop') {
            this.repairShopService
                .getRepairShopClusters(clustersObj)
                .pipe(takeUntil(this.destroy$))
                .subscribe((clustersResponse: any) => {
                    var clustersToShow = [];
                    var markersToShow = [];
                    var newMarkersAdded = false;

                    clustersResponse.map((clusterItem) => {
                        if (clusterItem.count > 1) {
                            let clusterIndex = this.clusterMarkers.findIndex(
                                (item) =>
                                    item.latitude === clusterItem.latitude &&
                                    item.longitude === clusterItem.longitude
                            );

                            if (clusterIndex == -1) {
                                this.clusterMarkers.push(clusterItem);
                            }

                            clustersToShow.push(clusterItem.latitude);
                        } else {
                            let markerIndex = this.viewData.findIndex(
                                (item) => item.id === clusterItem.id
                            );

                            if (markerIndex == -1) {
                                this.viewData.push(clusterItem);
                                newMarkersAdded = true;
                            }

                            markersToShow.push(clusterItem.id);
                        }
                    });

                    this.viewData.map((item) => {
                        if (
                            markersToShow.includes(item.id) &&
                            !item.showMarker
                        ) {
                            item.showMarker = true;
                        } else if (
                            !markersToShow.includes(item.id) &&
                            item.showMarker
                        ) {
                            item.showMarker = false;
                        }
                    });

                    this.clusterMarkers.map((cluster) => {
                        if (
                            clustersToShow.includes(cluster.latitude) &&
                            !cluster.showMarker
                        ) {
                            cluster.fadeIn = true;
                            setTimeout(() => {
                                cluster.fadeIn = false;
                                this.ref.detectChanges();
                            }, 200);

                            cluster.showMarker = true;
                        } else if (
                            !clustersToShow.includes(cluster.latitude) &&
                            cluster.showMarker
                        ) {
                            cluster.fadeOut = true;
                            setTimeout(() => {
                                cluster.fadeOut = false;
                                cluster.showMarker = false;
                                this.ref.detectChanges();
                            }, 200);
                        }
                    });

                    if (newMarkersAdded) this.markersDropAnimation();

                    this.ref.detectChanges();
                });

            this.repairShopService
                .getRepairShopMapList(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    null,
                    null,
                    null,
                    this.sortBy,
                    this.searchText
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((mapListResponse: any) => {
                    console.log('repair shop list', mapListResponse);

                    var mapListData = { ...mapListResponse };
                    mapListData.pagination.data.map((data) => {
                        data.shopRaiting = {
                            hasLiked: data.currentCompanyUserRating === 1,
                            hasDislike: data.currentCompanyUserRating === -1,
                            likeCount: data?.upCount ? data.upCount : '0',
                            dislikeCount: data?.downCount
                                ? data.downCount
                                : '0',
                        };
                    });

                    mapListData.changedSort = changedSearchOrSort;

                    this.updateMapList.emit(mapListData);
                    // this.mapsService.updateMapList(mapListResponse);
                });
        } else if (this.mapType == 'shipper') {
            this.shipperService
                .getShipperClusters(clustersObj)
                .pipe(takeUntil(this.destroy$))
                .subscribe((clustersResponse: any) => {
                    var clustersToShow = [];
                    var markersToShow = [];
                    var newMarkersAdded = false;
                    console.log('clustersResponse', clustersResponse);

                    clustersResponse.map((clusterItem) => {
                        if (clusterItem.count > 1) {
                            let clusterIndex = this.clusterMarkers.findIndex(
                                (item) =>
                                    item.latitude === clusterItem.latitude &&
                                    item.longitude === clusterItem.longitude
                            );

                            console.log('clusterItem', clusterIndex);

                            if (clusterIndex == -1) {
                                this.clusterMarkers.push(clusterItem);
                            }

                            clustersToShow.push(clusterItem.latitude);
                        } else {
                            let markerIndex = this.viewData.findIndex(
                                (item) => item.id === clusterItem.id
                            );

                            if (markerIndex == -1) {
                                this.viewData.push(clusterItem);
                                newMarkersAdded = true;
                            }

                            markersToShow.push(clusterItem.id);
                        }
                    });

                    this.viewData.map((item) => {
                        if (
                            markersToShow.includes(item.id) &&
                            !item.showMarker
                        ) {
                            item.showMarker = true;
                        } else if (
                            !markersToShow.includes(item.id) &&
                            item.showMarker
                        ) {
                            item.showMarker = false;
                        }
                    });

                    this.clusterMarkers.map((cluster) => {
                        if (
                            clustersToShow.includes(cluster.latitude) &&
                            !cluster.showMarker
                        ) {
                            cluster.fadeIn = true;
                            setTimeout(() => {
                                cluster.fadeIn = false;
                                this.ref.detectChanges();
                            }, 200);

                            cluster.showMarker = true;
                        } else if (
                            !clustersToShow.includes(cluster.latitude) &&
                            cluster.showMarker
                        ) {
                            cluster.fadeOut = true;
                            setTimeout(() => {
                                cluster.fadeOut = false;
                                cluster.showMarker = false;
                                this.ref.detectChanges();
                            }, 200);
                        }
                    });

                    if (newMarkersAdded) this.markersDropAnimation();

                    this.ref.detectChanges();
                });

            console.log('sortName', this.sortBy);
            this.shipperService
                .getShipperMapList(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    null,
                    null,
                    null,
                    null,
                    null,
                    this.sortBy,
                    this.searchText
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((mapListResponse: any) => {
                    console.log('shipper list', mapListResponse);

                    var mapListData = { ...mapListResponse };
                    mapListData.pagination.data.map((data) => {
                        data.raiting = {
                            hasLiked: data.currentCompanyUserRating === 1,
                            hasDislike: data.currentCompanyUserRating === -1,
                            likeCount: data?.upCount ? data.upCount : '0',
                            dislikeCount: data?.downCount
                                ? data.downCount
                                : '0',
                        };
                    });

                    mapListData.changedSort = changedSearchOrSort;

                    this.updateMapList.emit(mapListData);
                    // this.mapsService.updateMapList(mapListResponse);
                });
        } else if (this.mapType == 'fuelStop') {
            this.fuelStopService
                .getFuelStopClusters(clustersObj)
                .pipe(takeUntil(this.destroy$))
                .subscribe((clustersResponse: any) => {
                    var clustersToShow = [];
                    var markersToShow = [];
                    var newMarkersAdded = false;
                    console.log('clustersResponse', clustersResponse);

                    clustersResponse.map((clusterItem) => {
                        if (clusterItem.count > 1) {
                            let clusterIndex = this.clusterMarkers.findIndex(
                                (item) =>
                                    item.latitude === clusterItem.latitude &&
                                    item.longitude === clusterItem.longitude
                            );

                            console.log('clusterItem', clusterIndex);

                            if (clusterIndex == -1) {
                                this.clusterMarkers.push(clusterItem);
                            }

                            clustersToShow.push(clusterItem.latitude);
                        } else {
                            let markerIndex = this.viewData.findIndex(
                                (item) => item.id === clusterItem.id
                            );

                            if (markerIndex == -1) {
                                this.viewData.push(clusterItem);
                                newMarkersAdded = true;
                            }

                            markersToShow.push(clusterItem.id);
                        }
                    });

                    this.viewData.map((item) => {
                        if (
                            markersToShow.includes(item.id) &&
                            !item.showMarker
                        ) {
                            item.showMarker = true;
                        } else if (
                            !markersToShow.includes(item.id) &&
                            item.showMarker
                        ) {
                            item.showMarker = false;
                        }
                    });

                    this.clusterMarkers.map((cluster) => {
                        if (
                            clustersToShow.includes(cluster.latitude) &&
                            !cluster.showMarker
                        ) {
                            cluster.fadeIn = true;
                            setTimeout(() => {
                                cluster.fadeIn = false;
                                this.ref.detectChanges();
                            }, 200);

                            cluster.showMarker = true;
                        } else if (
                            !clustersToShow.includes(cluster.latitude) &&
                            cluster.showMarker
                        ) {
                            cluster.fadeOut = true;
                            setTimeout(() => {
                                cluster.fadeOut = false;
                                cluster.showMarker = false;
                                this.ref.detectChanges();
                            }, 200);
                        }
                    });

                    if (newMarkersAdded) this.markersDropAnimation();

                    this.ref.detectChanges();
                });

            console.log('sortName', this.sortBy);

            this.fuelStopService
                .getFuelStopMapList(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    null, //_long,
                    null, //lat,
                    null, //distance,
                    null, //lastFrom,
                    null, //lastTo,
                    null, //costFrom,
                    null, //costTo,
                    null, //ppgFrom,
                    null, //ppgTo,
                    null, //pageIndex,
                    null, //pageSize,
                    null, //companyId
                    null, //this.sortBy
                    this.searchText
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((mapListResponse: any) => {
                    console.log('shipper list', mapListResponse);
                    console.log('shipper list clustersObj', clustersObj);
                    console.log('shipper list sortBy', this.sortBy);
                    console.log('shipper list searchText', this.searchText);

                    var mapListData = { ...mapListResponse };
                    mapListData.pagination.data.map((data) => {
                        data.raiting = {
                            hasLiked: data.currentCompanyUserRating === 1,
                            hasDislike: data.currentCompanyUserRating === -1,
                            likeCount: data?.upCount ? data.upCount : '0',
                            dislikeCount: data?.downCount
                                ? data.downCount
                                : '0',
                        };
                    });

                    mapListData.changedSort = changedSearchOrSort;

                    this.updateMapList.emit(mapListData);
                    // this.mapsService.updateMapList(mapListResponse);
                });
        } else if ( this.mapType == 'accident' ) {
            this.accidentService
                .getAccidentClusters(clustersObj)
                .pipe(takeUntil(this.destroy$))
                .subscribe((clustersResponse: any) => {
                    var clustersToShow = [];
                    var markersToShow = [];
                    var newMarkersAdded = false;
                    console.log('clustersResponse', clustersResponse);

                    clustersResponse.map((clusterItem) => {
                        if (clusterItem.count > 1) {
                            let clusterIndex = this.clusterMarkers.findIndex(
                                (item) =>
                                    item.latitude === clusterItem.latitude &&
                                    item.longitude === clusterItem.longitude
                            );

                            console.log('clusterItem', clusterIndex);

                            if (clusterIndex == -1) {
                                this.clusterMarkers.push(clusterItem);
                            }

                            clustersToShow.push(clusterItem.latitude);
                        } else {
                            let markerIndex = this.viewData.findIndex(
                                (item) => item.id === clusterItem.id
                            );

                            if (markerIndex == -1) {
                                this.viewData.push(clusterItem);
                                newMarkersAdded = true;
                            }

                            markersToShow.push(clusterItem.id);
                        }
                    });

                    this.viewData.map((item) => {
                        if (
                            markersToShow.includes(item.id) &&
                            !item.showMarker
                        ) {
                            item.showMarker = true;
                        } else if (
                            !markersToShow.includes(item.id) &&
                            item.showMarker
                        ) {
                            item.showMarker = false;
                        }
                    });

                    this.clusterMarkers.map((cluster) => {
                        if (
                            clustersToShow.includes(cluster.latitude) &&
                            !cluster.showMarker
                        ) {
                            cluster.fadeIn = true;
                            setTimeout(() => {
                                cluster.fadeIn = false;
                                this.ref.detectChanges();
                            }, 200);

                            cluster.showMarker = true;
                        } else if (
                            !clustersToShow.includes(cluster.latitude) &&
                            cluster.showMarker
                        ) {
                            cluster.fadeOut = true;
                            setTimeout(() => {
                                cluster.fadeOut = false;
                                cluster.showMarker = false;
                                this.ref.detectChanges();
                            }, 200);
                        }
                    });

                    if (newMarkersAdded) this.markersDropAnimation();

                    this.ref.detectChanges();
                });

            console.log('sortName', this.sortBy);
            this.accidentService
                .getAccidentMapList(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    null,
                    null,
                    null,
                    this.sortBy,
                    this.searchText
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((mapListResponse: any) => {
                    console.log('shipper list', mapListResponse);

                    var mapListData = { ...mapListResponse };
                    mapListData.pagination.data.map((data) => {
                        data.raiting = {
                            hasLiked: data.currentCompanyUserRating === 1,
                            hasDislike: data.currentCompanyUserRating === -1,
                            likeCount: data?.upCount ? data.upCount : '0',
                            dislikeCount: data?.downCount
                                ? data.downCount
                                : '0',
                        };
                    });

                    mapListData.changedSort = changedSearchOrSort;

                    this.updateMapList.emit(mapListData);
                    // this.mapsService.updateMapList(mapListResponse);
                });
        }
        console.log('mapType', this.mapType);
    }

    clickedCluster(cluster) {
        this.clusterMarkers.map((data: any) => {
            if (
                data.isSelected &&
                (data.latitude != cluster.latitude ||
                    data.longitude != cluster.longitude)
            ) {
                data.isSelected = false;
            } else if (
                data.latitude == cluster.latitude &&
                data.longitude == cluster.longitude
            ) {
                if (!data.detailedInfo) {
                    data.isSelected = !data.isSelected;
                }

                if (data.isSelected && !data.detailedInfo) {
                    this.markerSelected = true;

                    if (
                        this.mapLatitude == data.latitude &&
                        this.mapLongitude == data.longitude
                    ) {
                        this.mapLatitude = data.latitude + 0.000001;
                        this.mapLongitude = data.longitude + 0.000001;
                    } else {
                        this.mapLatitude = data.latitude;
                        this.mapLongitude = data.longitude;
                    }
                } else if (data.detailedInfo) {
                    data.detailedInfo = false;
                } else {
                    this.markerSelected = false;
                }

                document
                    .querySelectorAll('.si-float-wrapper')
                    .forEach((parentElement: HTMLElement) => {
                        parentElement.style.zIndex = '998';

                        setTimeout(() => {
                            var childElements = parentElement.querySelectorAll(
                                '.show-marker-dropdown'
                            );
                            if (childElements.length)
                                parentElement.style.zIndex = '999';
                        }, 1);
                    });
            }
        });

        this.viewData.map((marker) => {
            if (marker.isSelected) marker.isSelected = false;
        });

        this.ref.detectChanges();
    }

    clusterHover(cluster, hover) {
        cluster.markerHover = hover;
        this.ref.detectChanges();
    }

    getRepairShop(id, index) {
        this.repairShopService
            .getRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.viewData[index] = { ...this.viewData[index], ...res };

                    this.viewData[index].shopRaiting = {
                        hasLiked: res.currentCompanyUserRating === 1,
                        hasDislike: res.currentCompanyUserRating === -1,
                        likeCount: res?.upCount ? res.upCount : '0',
                        dislikeCount: res?.downCount ? res.downCount : '0',
                    };

                    setTimeout(() => {
                        this.viewData[index].isSelected = true;
                        this.ref.detectChanges();
                    }, 200);
                },
                error: () => {
                    this.notificationService.error(
                        `Cant' get repair shop by ${id}`,
                        'Error'
                    );
                },
            });
    }

    getShipper(id, index) {
        console.log('getShipper', id);
        this.shipperService
            .getShipperById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.viewData[index] = { ...this.viewData[index], ...res };

                    this.viewData[index].raiting = {
                        hasLiked: res.currentCompanyUserRating === 1,
                        hasDislike: res.currentCompanyUserRating === -1,
                        likeCount: res?.upCount ? res.upCount : '0',
                        dislikeCount: res?.downCount ? res.downCount : '0',
                    };

                    setTimeout(() => {
                        this.viewData[index].isSelected = true;
                        this.ref.detectChanges();
                    }, 200);
                },
                error: () => {
                    this.notificationService.error(
                        `Cant' get shipper by ${id}`,
                        'Error'
                    );
                },
            });
    }

    getFuelStop(id, index) {
        console.log('getFuelStop', id);
        this.fuelStopService
            .getFuelStopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.viewData[index] = { ...this.viewData[index], ...res };

                    console.log('get fuel stop', res);

                    // this.viewData[index].raiting = {
                    //     hasLiked: res.currentCompanyUserRating === 1,
                    //     hasDislike: res.currentCompanyUserRating === -1,
                    //     likeCount: res?.upCount ? res.upCount : '0',
                    //     dislikeCount: res?.downCount ? res.downCount : '0',
                    // };

                    setTimeout(() => {
                        this.viewData[index].isSelected = true;
                        this.ref.detectChanges();
                    }, 200);
                },
                error: () => {
                    this.notificationService.error(
                        `Cant' get shipper by ${id}`,
                        'Error'
                    );
                },
            });
    }

    getAccident(id, index) {
        this.accidentService
            .getAccidentById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.viewData[index] = { ...this.viewData[index], ...res };

                    console.log('get fuel stop', res);

                    // this.viewData[index].raiting = {
                    //     hasLiked: res.currentCompanyUserRating === 1,
                    //     hasDislike: res.currentCompanyUserRating === -1,
                    //     likeCount: res?.upCount ? res.upCount : '0',
                    //     dislikeCount: res?.downCount ? res.downCount : '0',
                    // };

                    setTimeout(() => {
                        this.viewData[index].isSelected = true;
                        this.ref.detectChanges();
                    }, 200);
                },
                error: () => {
                    this.notificationService.error(
                        `Cant' get shipper by ${id}`,
                        'Error'
                    );
                },
            });
    }

    updateRef() {
        this.ref.detectChanges();
    }

    showClusterItemInfo(data) {
        var cluster = data[0];
        var item = data[1];

        if (this.mapType == 'repairShop') {
            this.repairShopService
                .getRepairShopById(item.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        cluster.detailedInfo = res;

                        cluster.detailedInfo.shopRaiting = {
                            hasLiked: res.currentCompanyUserRating === 1,
                            hasDislike: res.currentCompanyUserRating === -1,
                            likeCount: res?.upCount ? res.upCount : '0',
                            dislikeCount: res?.downCount ? res.downCount : '0',
                        };

                        this.ref.detectChanges();
                    },
                    error: () => {
                        this.notificationService.error(
                            `Cant' get repair shop by ${item.id}`,
                            'Error'
                        );
                    },
                });
        } else if (this.mapType == 'shipper') {
            this.shipperService
                .getShipperById(item.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        cluster.detailedInfo = res;

                        cluster.detailedInfo.raiting = {
                            hasLiked: res.currentCompanyUserRating === 1,
                            hasDislike: res.currentCompanyUserRating === -1,
                            likeCount: res?.upCount ? res.upCount : '0',
                            dislikeCount: res?.downCount ? res.downCount : '0',
                        };

                        this.ref.detectChanges();
                    },
                    error: () => {
                        this.notificationService.error(
                            `Cant' get shipper by ${item.id}`,
                            'Error'
                        );
                    },
                });
        } else if (this.mapType == 'fuelStop') {
            this.fuelStopService
                .getFuelStopById(item.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        cluster.detailedInfo = res;

                        console.log('get fuel stop', res);
                        // cluster.detailedInfo.raiting = {
                        //     hasLiked: res.currentCompanyUserRating === 1,
                        //     hasDislike: res.currentCompanyUserRating === -1,
                        //     likeCount: res?.upCount ? res.upCount : '0',
                        //     dislikeCount: res?.downCount ? res.downCount : '0',
                        // };

                        this.ref.detectChanges();
                    },
                    error: () => {
                        this.notificationService.error(
                            `Cant' get shipper by ${item.id}`,
                            'Error'
                        );
                    },
                });
        } else if (this.mapType == 'accident') {
            this.accidentService
                .getAccidentById(item.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        cluster.detailedInfo = res;

                        console.log('get accident', res);
                        // cluster.detailedInfo.raiting = {
                        //     hasLiked: res.currentCompanyUserRating === 1,
                        //     hasDislike: res.currentCompanyUserRating === -1,
                        //     likeCount: res?.upCount ? res.upCount : '0',
                        //     dislikeCount: res?.downCount ? res.downCount : '0',
                        // };

                        this.ref.detectChanges();
                    },
                    error: () => {
                        this.notificationService.error(
                            `Cant' get shipper by ${item.id}`,
                            'Error'
                        );
                    },
                });
        }
    }

    getClusters(changedSearchOrSort?) {
        var bounds = this.agmMap.getBounds();
        var ne = bounds.getNorthEast(); // LatLng of the north-east corner
        var sw = bounds.getSouthWest(); // LatLng of the south-west corder

        var clustersObject = {
            northEastLatitude: ne.lat(),
            northEastLongitude: ne.lng(),
            southWestLatitude: sw.lat(),
            southWestLongitude: sw.lng(),
            zoomLevel: this.mapZoom,
        };

        this.callClusters(clustersObject, changedSearchOrSort);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
