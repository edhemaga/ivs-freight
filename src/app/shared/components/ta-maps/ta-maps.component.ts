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
import { FormsModule, UntypedFormGroup } from '@angular/forms';
//import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
// import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
// import { AgmDirectionModule } from 'agm-direction';
import { Subject, takeUntil } from 'rxjs';

// const
import { MapConstants } from '@shared/utils/constants/map.constants';

// services
import { MapsService } from '@shared/services/maps.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { FuelService } from '@shared/services/fuel.service';
import { ShipperService } from '@pages/customer/services';
import { RepairService } from '@shared/services/repair.service';
import { RoutingStateService } from '@shared/services/routing-state.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { CompanyOfficeService } from '@shared/services/company-office.service';

// models
import { MapRoute } from '@shared/models/map-route.model';
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaMapMarkerDropdownComponent } from '@shared/components/ta-map-marker-dropdown/ta-map-marker-dropdown.component';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-ta-maps',
    templateUrl: './ta-maps.component.html',
    styleUrls: [
        './ta-maps.component.scss',
        '../../../../assets/scss/maps.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        FormsModule,
        NgbModule,
        // AgmCoreModule,
        // AgmSnazzyInfoWindowModule,
        // AgmDirectionModule,
        //GooglePlaceModule,
        AngularSvgIconModule,

        // Components
        TaAppTooltipV2Component,
        TaMapMarkerDropdownComponent,
    ],
})
export class TaMapsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    viewData = [];
    @Input() set _viewData(value) {
        // table data (shippers, repair shops)
        // var newData = value;
        // newData.map((data) => {
        //     if (data.actionAnimation == 'update') {
        //         let markerIndex = this.viewData.findIndex(
        //             (item) => item.id === data.id
        //         );
        //         if (markerIndex < 0 && !this.clusterDetailedInfo) return false;
        //         if (this.mapType == 'repairShop') {
        //             this.getRepairShop(data.id, markerIndex);
        //         } else if (this.mapType == 'shipper') {
        //             this.getShipper(data.id, markerIndex);
        //         } else if (this.mapType == 'fuelStop') {
        //             this.getFuelStop(data.id, markerIndex);
        //         }
        //         this.getClusters(true, true);
        //     } else if (
        //         data.actionAnimation == 'add' ||
        //         data.actionAnimation == 'delete'
        //     ) {
        //         setTimeout(() => {
        //             this.getClusters(true, true);
        //         }, 1000);
        //     }
        // });
    }
    @Input() mapType: string = 'shipper'; // shipper, repairShop, fuelStop, accident, inspection, routing
    @Input() routes: Array<MapRoute> = []; // array of stops to be shown on map, ex. - [{routeColor: #3074D3, stops: [{lat: 39.353087, long: -84.299328, stopColor: #EF5350, empty: true}, {lat: 39.785871, long: -86.143448, stopColor: #26A690, empty: false}]]
    @Input() darkMode: boolean = false;
    @Output() callDropDownAction: EventEmitter<any> = new EventEmitter();
    @Output() updateMapList: EventEmitter<any> = new EventEmitter();
    @Output() selectMarker: EventEmitter<any> = new EventEmitter();

    public agmMap: any;
    public styles: any = MapConstants.GOOGLE_MAP_STYLES;
    mapRestrictions = {
        latLngBounds: MapConstants.NORTH_AMERICA_BOUNDS,
        strictBounds: true,
    };

    public searchForm!: UntypedFormGroup;
    public locationForm!: UntypedFormGroup;
    public sortTypes: any[] = [];
    public sortDirection: string = 'asc';
    public activeSortType: any = {};
    public markerSelected: boolean = false;
    public mapLatitude: number = 41.860119;
    public mapLongitude: number = -87.660156;
    public sortBy: string = 'nameDesc'; //nameDesc
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
    public clusterAnimation: any = {};
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
    public clusterDetailedInfo: any = {};
    public lastClusterCoordinates: any = {};

    public companyOffices: any = [];

    public mapListPagination: any = {
        count: 0,
        data: [],
        pageIndex: 1,
        pageSize: 25,
    };

    public locationFilter: any;
    public stateFilter: any;
    public categoryRepairFilter: any;
    public moneyFilter: any;

    constructor(
        private ref: ChangeDetectorRef,
        private mapsService: MapsService,
        private fuelStopService: FuelService,
        private repairShopService: RepairService,
        private shipperService: ShipperService,
        private routingService: RoutingStateService,
        private confirmationService: ConfirmationService,
        private companyOfficeService: CompanyOfficeService,
        private tableService: TruckassistTableService,
        private dropdownService: DropDownService,
        private detailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.showHideMarkers();
        this.markersDropAnimation();
        this.clusterDropAnimation();

        this.addMapListSearchListener();
        this.addDeleteListener();

        if (this.darkMode) {
            this.styles = MapConstants.GOOGLE_MAP_DARK_STYLES;
        }
    }

    addMapListSearchListener() {
        this.mapsService.searchTextChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((text) => {
                this.mapListPagination.pageIndex = 1;
                this.searchText = text;
                this.getClusters(true, true);
            });

        this.mapsService.sortChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((category) => {
                this.sortBy = category;
                this.getClusters(true);
            });

        this.mapsService.mapListScrollChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.showMoreMapListData(data);
            });

        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                if (data?.filterType == 'locationFilter') {
                    if (data.action == 'Set') {
                        this.locationFilter = data.queryParams;
                        this.mapCircle = {
                            lat: data.queryParams.latValue,
                            lng: data.queryParams.longValue,
                            radius: this.mapsService.getMeters(
                                data.queryParams.rangeValue
                            ),
                        };
                        this.locationFilterOn = true;

                        this.mapLatitude = this.mapCircle.lat;
                        this.mapLongitude = this.mapCircle.lng;
                    } else {
                        this.locationFilter = null;
                        this.locationFilterOn = false;
                    }

                    this.getClusters(true, true);
                } else if (data?.filterType == 'stateFilter') {
                    if (data.action == 'Set') {
                        this.stateFilter = data.queryParams;
                    } else {
                        this.stateFilter = null;
                    }

                    this.getClusters(true, true);
                } else if (data?.filterType == 'categoryRepairFilter') {
                    if (data.action == 'Set') {
                        this.categoryRepairFilter = data.queryParams;
                    } else {
                        this.categoryRepairFilter = null;
                    }

                    this.getClusters(true, true);
                } else if (data?.filterType == 'moneyFilter') {
                    if (data.action == 'Set') {
                        this.moneyFilter = data.queryParams;
                    } else {
                        this.moneyFilter = null;
                    }

                    this.getClusters(true, true);
                }
            });

        this.mapsService.mapRatingChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                let markerIndex = this.viewData.findIndex(
                    (item) => item.id === res.entityId
                );

                if (this.mapType == 'repairShop') {
                    this.getRepairShop(res.entityId, markerIndex);
                } else if (this.mapType == 'shipper') {
                    this.getShipper(res.entityId, markerIndex);
                } else if (this.mapType == 'fuelStop') {
                    this.getFuelStop(res.entityId, markerIndex);
                }

                this.getClusters(true, true);
            });

        this.mapsService.selectedMapListCardChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                if (id > 0) {
                    this.clusterMarkers.map((cluster) => {
                        const clusterIndex = cluster.pagination.data.findIndex(
                            (item) => item.id == id
                        );

                        if (clusterIndex > -1 && cluster.showMarker) {
                            this.clickedCluster(cluster, true);
                            this.showClusterItemInfo([cluster, { id: id }]);
                        } else {
                            this.clickedMarker(id, true);
                        }
                    });

                    this.mapsService.selectedMarker(id);
                } else {
                    this.viewData.map((data: any) => {
                        data.isSelected = false;
                    });

                    this.clusterMarkers.map((cluster) => {
                        cluster.isSelected = false;
                        cluster.detailedInfo = false;
                    });

                    this.mapsService.selectedMarker(0);
                }
            });

        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res?.animation == 'update') {
                    let markerIndex = this.viewData.findIndex(
                        (item) => item.id === res.data.id
                    );

                    if (this.mapType == 'repairShop') {
                        this.getRepairShop(res.data.id, markerIndex);
                    } else if (this.mapType == 'shipper') {
                        this.getShipper(res.data.id, markerIndex);
                    } else if (this.mapType == 'fuelStop') {
                        this.getFuelStop(res.data.id, markerIndex);
                    }

                    this.mapListPagination.pageIndex = 1;
                    this.getClusters(true, true);
                } else if (
                    res?.animation == 'add' ||
                    res?.animation == 'delete'
                ) {
                    setTimeout(() => {
                        this.mapListPagination.pageIndex = 1;
                        this.getClusters(true, true);
                    }, 1000);
                }
            });
    }

    public getMapInstance(map) {
        this.agmMap = map;

        if (
            this.mapType == 'repairShop' ||
            this.mapType == 'shipper' ||
            this.mapType == 'fuelStop'
        ) {
            map.addListener('idle', () => {
                // update the coordinates here

                clearTimeout(this.clustersTimeout);

                this.clustersTimeout = setTimeout(() => {
                    var moveMap = this.firstClusterCall ? true : false;

                    this.mapListPagination.pageIndex = 1;
                    this.getClusters(this.firstClusterCall, moveMap);

                    if (this.firstClusterCall) {
                        this.firstClusterCall = false;
                    }
                }, 500);
            });
        }
    }

    clickedMarker(id, callFromMapList?) {
        var selectId = 0;

        this.viewData.map((data: any, index) => {
            if (data.isExpanded) {
                data.isExpanded = false;
            }

            if (data.isSelected && data.id != id) {
                data.isSelected = false;
            } else if (data.id == id) {
                var selectShop = callFromMapList ? true : !data.isSelected;

                if (selectShop) {
                    this.markerSelected = true;

                    if (!data.createdAt) {
                        if (this.mapType == 'repairShop') {
                            this.getRepairShop(data.id, index, callFromMapList);
                        } else if (this.mapType == 'shipper') {
                            this.getShipper(data.id, index, callFromMapList);
                        } else if (this.mapType == 'fuelStop') {
                            this.getFuelStop(data.id, index, callFromMapList);
                        }
                    } else {
                        data.isSelected = true;
                    }

                    selectId = data.id;
                } else {
                    this.markerSelected = false;
                    data.isSelected = false;
                    selectId = 0;
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

        if (!callFromMapList) this.mapsService.selectedMarker(selectId);

        this.ref.detectChanges();
    }

    mapClick() {
        this.viewData.map((data: any) => {
            if (data.isSelected) {
                data.isSelected = false;
                data.isExpanded = false;
                this.mapsService.selectedMarker(0);
            }
        });

        this.clusterMarkers.map((data: any) => {
            if (data.isSelected) {
                data.isSelected = false;
                if (data.detailedInfo) {
                    setTimeout(() => {
                        data.detailedInfo = false;
                        this.clusterDetailedInfo = false;
                        this.mapsService.selectedMarker(0);
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
        setTimeout(() => {
            this.viewData.map((data: any) => {
                if (!this.markerAnimations[data.id]) {
                    this.markerAnimations[data.id] = true;
                }
            });

            setTimeout(() => {
                this.viewData.map((data: any) => {
                    if (!this.showMarkerWindow[data.id]) {
                        this.showMarkerWindow[data.id] = true;
                    }
                });
            }, 100);
        }, 1000);
    }

    clusterDropAnimation() {
        setTimeout(() => {
            this.clusterMarkers.map((data: any) => {
                if (!this.clusterAnimation[data.id]) {
                    this.clusterAnimation[data.id] = true;
                }
            });

            this.ref.detectChanges();
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
        // if (action.type == 'delete' || action.type == 'delete-repair') {
        //     var name =
        //         this.mapType == 'repairShop'
        //             ? action.data.name
        //             : this.mapType == 'shipper'
        //             ? action.data.businessName
        //             : '';

        //     var shipperData = {
        //         id: action.id,
        //         type: 'delete-item',
        //         data: {
        //             ...action.data,
        //             name: name,
        //         },
        //     };

        //     this.modalService.openModal(
        //         ConfirmationModalComponent,
        //         { size: 'small' },
        //         {
        //             ...shipperData,
        //             template:
        //                 this.mapType == 'repairShop' ? 'repair shop' : 'shipper',
        //             type: 'delete',
        //         }
        //     );
        // } else {
        //     this.callDropDownAction.emit(action);
        // }

        if (action.type == 'view-details') {
            this.mapsService.goToDetails(action.data, this.mapType);
        } else if (action.type == 'raiting') {
            this.detailsDataService.setNewData(action.data);
            this.callDropDownAction.emit(action);
        } else {
            if (this.mapType == 'repairShop') {
                if (action.type == 'write-review') {
                    action.type = 'edit';
                    action.openedTab = 'Review';
                }

                this.dropdownService.dropActionsHeaderRepair(
                    action,
                    action.data
                );
            } else if (this.mapType == 'shipper') {
                let eventType = '';
                if (
                    action.type == 'Contact' ||
                    action.type == 'edit' ||
                    action.type == 'Review'
                ) {
                    eventType = 'edit';
                } else {
                    eventType = action.type;
                }

                let eventObject = {
                    data: undefined,
                    id: action.id,
                    type: eventType,
                    openedTab: action.type,
                };
                setTimeout(() => {
                    this.dropdownService.dropActionsHeaderShipperBroker(
                        eventObject,
                        action.data,
                        'shipper'
                    );
                }, 100);
            }
        }
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

    showAllmarkers: boolean = false;

    callClusters(
        clustersObj,
        changedSearchOrSort,
        clusterPagination?,
        addedNew?
    ) {
        var pageIndex = clusterPagination
            ? clusterPagination?.pagination.pageIndex
            : 1;
        var pageSize = 25;

        var addedNewFlag = addedNew != null ? addedNew : false;

        var locationFilterQuery = this.locationFilter;
        var categoryRepairFilterQuery = this.categoryRepairFilter;
        var moneyFilterQuery = this.moneyFilter;

        if (this.mapType == 'repairShop') {
            this.repairShopService
                .getRepairShopClusters(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    clustersObj.zoomLevel,
                    addedNewFlag,
                    null, // shipperLong
                    null, // shipperLat
                    null, // shipperDistance
                    null, // shipperStates
                    categoryRepairFilterQuery, // categoryIds?: Array<number>,
                    locationFilterQuery ? locationFilterQuery.longValue : null, // _long?: number,
                    locationFilterQuery ? locationFilterQuery.latValue : null, // lat?: number,
                    locationFilterQuery ? locationFilterQuery.rangeValue : null, // distance?: number,
                    moneyFilterQuery ? moneyFilterQuery.singleFrom : null, // costFrom?: number,
                    moneyFilterQuery ? moneyFilterQuery.singleTo : null, // costTo?: number,
                    null, // lastFrom?: number,
                    null, // lastTo?: number,
                    null, // ppgFrom?: number,
                    null, // ppgTo?: number,
                    pageIndex,
                    pageSize,
                    null, // companyId
                    this.sortBy,
                    this.searchText,
                    null, // search1
                    null // search2
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((clustersResponse: any) => {
                    var clustersToShow = [];
                    var markersToShow = [];
                    var newMarkersAdded = false;
                    var newClusterAdded = false;

                    clustersResponse.map((clusterItem) => {
                        if (clusterPagination) {
                            if (
                                clusterItem.latitude ==
                                    clusterPagination.latitude &&
                                clusterItem.longitude ==
                                    clusterPagination.longitude
                            ) {
                                clusterItem.pagination.data.map((marker) => {
                                    clusterPagination.pagination.data.push(
                                        marker
                                    );
                                });
                            }
                        } else {
                            if (clusterItem.count > 1) {
                                let clusterIndex =
                                    this.clusterMarkers.findIndex(
                                        (item) =>
                                            item.latitude ===
                                                clusterItem.latitude &&
                                            item.longitude ===
                                                clusterItem.longitude
                                    );

                                if (clusterIndex == -1) {
                                    this.clusterMarkers = [
                                        ...this.clusterMarkers,
                                        clusterItem,
                                    ];
                                    newClusterAdded = true;
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
                        }
                    });

                    this.viewData.map((item) => {
                        if (
                            markersToShow.includes(item.id) &&
                            !item.showMarker
                        ) {
                            var randomTime = Math.floor(Math.random() * 800);

                            setTimeout(() => {
                                item.showMarker = true;
                                this.ref.detectChanges();
                            }, randomTime);
                        } else if (
                            !markersToShow.includes(item.id) &&
                            item.showMarker
                        ) {
                            item.showMarker = false;
                            item.isSelected = false;
                            this.markerSelected = false;
                            this.mapsService.selectedMarker(0);
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
                                cluster.detailedInfo = false;
                                cluster.isSelected = false;
                                this.mapsService.selectedMarker(0);
                                this.clusterDetailedInfo = false;
                                this.ref.detectChanges();
                            }, 200);
                        }
                    });

                    this.showAllmarkers = true;

                    if (newMarkersAdded) this.markersDropAnimation();
                    if (newClusterAdded) this.clusterDropAnimation();

                    this.ref.detectChanges();
                });

            this.repairShopService
                .getRepairShopMapList(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    categoryRepairFilterQuery, // categoryIds?: Array<number>,
                    locationFilterQuery ? locationFilterQuery.longValue : null, // _long?: number,
                    locationFilterQuery ? locationFilterQuery.latValue : null, // lat?: number,
                    locationFilterQuery ? locationFilterQuery.rangeValue : null, // distance?: number,
                    moneyFilterQuery ? moneyFilterQuery.singleFrom : null, // costFrom?: number,
                    moneyFilterQuery ? moneyFilterQuery.singleTo : null, // costTo?: number,
                    this.mapListPagination.pageIndex,
                    this.mapListPagination.pageSize,
                    null,
                    this.sortBy,
                    this.searchText
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((mapListResponse: any) => {
                    var mapListData = { ...mapListResponse };

                    this.mapListPagination = mapListData.pagination;

                    mapListData.pagination.data.map((data) => {
                        data.shopRaiting = {
                            hasLiked: data.currentCompanyUserRating === 1,
                            hasDislike: data.currentCompanyUserRating === -1,
                            likeCount: data?.upCount ? data.upCount : '0',
                            dislikeCount: data?.downCount
                                ? data.downCount
                                : '0',
                        };

                        data.favourite =
                            data.pinned != null ? data.pinned : false;
                    });

                    mapListData.changedSort = changedSearchOrSort;
                    mapListData.addData =
                        this.mapListPagination.pageIndex > 1 ? true : false;

                    this.updateMapList.emit(mapListData);
                    this.mapsService.searchLoadingChanged.next(false);
                    this.mapsService.searchResultsCountChange.next(
                        mapListData.repairShopCount
                    );
                });
        } else if (this.mapType == 'shipper') {
            this.shipperService
                .getShipperClusters(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    clustersObj.zoomLevel,
                    addedNewFlag, // addedNew
                    locationFilterQuery ? locationFilterQuery.longValue : null, // shipperLong
                    locationFilterQuery ? locationFilterQuery.latValue : null, // shipperLat
                    locationFilterQuery ? locationFilterQuery.rangeValue : null, // shipperDistance
                    null, // shipperStates
                    null, // categoryIds?: Array<number>,
                    null, // _long?: number,
                    null, // lat?: number,
                    null, // distance?: number,
                    null, // costFrom?: number,
                    null, // costTo?: number,
                    null, // lastFrom?: number,
                    null, // lastTo?: number,
                    null, // ppgFrom?: number,
                    null, // ppgTo?: number,
                    pageIndex,
                    pageSize,
                    null, // companyId
                    this.sortBy, // sort
                    this.searchText, // search
                    null, // search1
                    null // search2
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((clustersResponse: any) => {
                    var clustersToShow = [];
                    var markersToShow = [];
                    var newMarkersAdded = false;
                    var newClusterAdded = false;

                    clustersResponse.map((clusterItem) => {
                        if (clusterPagination) {
                            if (
                                clusterItem.latitude ==
                                    clusterPagination.latitude &&
                                clusterItem.longitude ==
                                    clusterPagination.longitude
                            ) {
                                clusterItem.pagination.data.map((marker) => {
                                    clusterPagination.pagination.data.push(
                                        marker
                                    );
                                });

                                let clusterIndex =
                                    this.clusterMarkers.findIndex(
                                        (item) =>
                                            item.latitude ===
                                                clusterItem.latitude &&
                                            item.longitude ===
                                                clusterItem.longitude
                                    );

                                if (clusterIndex == -1) {
                                    this.clusterMarkers[
                                        clusterIndex
                                    ].pagination.data =
                                        clusterPagination.pagination.data;
                                    this.ref.detectChanges();
                                }

                                clustersToShow.push(clusterItem.latitude);
                            }
                        } else {
                            if (clusterItem.count > 1) {
                                let clusterIndex =
                                    this.clusterMarkers.findIndex(
                                        (item) =>
                                            item.latitude ===
                                                clusterItem.latitude &&
                                            item.longitude ===
                                                clusterItem.longitude
                                    );

                                if (clusterIndex == -1) {
                                    this.clusterMarkers.push(clusterItem);
                                    newClusterAdded = true;
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
                        }
                    });

                    if (!clusterPagination) {
                        this.viewData.map((item) => {
                            if (
                                markersToShow.includes(item.id) &&
                                !item.showMarker
                            ) {
                                var randomTime = Math.floor(
                                    Math.random() * 800
                                );

                                setTimeout(() => {
                                    item.showMarker = true;
                                    this.ref.detectChanges();
                                }, randomTime);
                            } else if (
                                !markersToShow.includes(item.id) &&
                                item.showMarker
                            ) {
                                item.showMarker = false;
                                item.isSelected = false;
                                this.markerSelected = false;
                                this.mapsService.selectedMarker(0);
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
                                    cluster.detailedInfo = false;
                                    cluster.isSelected = false;
                                    this.mapsService.selectedMarker(0);
                                    this.clusterDetailedInfo = false;
                                    this.ref.detectChanges();
                                }, 200);
                            }
                        });

                        if (newMarkersAdded) this.markersDropAnimation();
                        if (newClusterAdded) this.clusterDropAnimation();
                    }

                    this.ref.detectChanges();
                });

            this.shipperService
                .getShipperMapList(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    locationFilterQuery ? locationFilterQuery.longValue : null, // shipperLong
                    locationFilterQuery ? locationFilterQuery.latValue : null, // shipperLat
                    locationFilterQuery ? locationFilterQuery.rangeValue : null, // shipperDistance
                    null, // shipperStates
                    this.mapListPagination.pageIndex, // pageIndex
                    this.mapListPagination.pageSize, // pageSize
                    null, // companyId
                    this.sortBy,
                    this.searchText,
                    null, // search1
                    null // search2
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((mapListResponse: any) => {
                    var mapListData = { ...mapListResponse };

                    this.mapListPagination = mapListData.pagination;

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
                    mapListData.addData =
                        this.mapListPagination.pageIndex > 1 ? true : false;

                    this.updateMapList.emit(mapListData);
                    this.mapsService.searchLoadingChanged.next(false);
                    this.mapsService.searchResultsCountChange.next(
                        mapListData.shipperCount
                    );
                });
        } else if (this.mapType == 'fuelStop') {
            this.fuelStopService
                .getFuelStopClusters(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    clustersObj.zoomLevel,
                    addedNewFlag, // addedNew
                    locationFilterQuery ? locationFilterQuery.longValue : null, // shipperLong
                    locationFilterQuery ? locationFilterQuery.latValue : null, // shipperLat
                    locationFilterQuery ? locationFilterQuery.rangeValue : null, // shipperDistance
                    null, // shipperStates
                    null, // categoryIds?: Array<number>,
                    locationFilterQuery ? locationFilterQuery.longValue : null, // _long?: number,
                    locationFilterQuery ? locationFilterQuery.latValue : null, // lat?: number,
                    locationFilterQuery ? locationFilterQuery.rangeValue : null, // distance?: number,
                    moneyFilterQuery ? moneyFilterQuery.thirdFormFrom : null, // costFrom?: number,
                    moneyFilterQuery ? moneyFilterQuery.thirdFormTo : null, // costTo?: number,
                    moneyFilterQuery ? moneyFilterQuery.firstFormFrom : null, // lastFrom?: number,
                    moneyFilterQuery ? moneyFilterQuery.firstFormTo : null, // lastTo?: number,
                    moneyFilterQuery ? moneyFilterQuery.secondFormFrom : null, // ppgFrom?: number,
                    moneyFilterQuery ? moneyFilterQuery.secondFormTo : null, // ppgTo?: number,
                    pageIndex,
                    pageSize,
                    null, // companyId
                    this.sortBy, // sort
                    this.searchText, // search
                    null, // search1
                    null // search2
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((clustersResponse: any) => {
                    var clustersToShow = [];
                    var markersToShow = [];
                    var newMarkersAdded = false;
                    var newClusterAdded = false;

                    clustersResponse.map((clusterItem) => {
                        if (clusterItem.count > 1) {
                            let clusterIndex = this.clusterMarkers.findIndex(
                                (item) =>
                                    item.latitude === clusterItem.latitude &&
                                    item.longitude === clusterItem.longitude
                            );

                            if (clusterIndex == -1) {
                                this.clusterMarkers.push(clusterItem);
                                newClusterAdded = true;
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
                            var randomTime = Math.floor(Math.random() * 800);

                            setTimeout(() => {
                                item.showMarker = true;
                                this.ref.detectChanges();
                            }, randomTime);
                        } else if (
                            !markersToShow.includes(item.id) &&
                            item.showMarker
                        ) {
                            item.showMarker = false;
                            item.isSelected = false;
                            this.markerSelected = false;
                            this.mapsService.selectedMarker(0);
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
                                cluster.detailedInfo = false;
                                cluster.isSelected = false;
                                this.mapsService.selectedMarker(0);
                                this.clusterDetailedInfo = false;
                                this.ref.detectChanges();
                            }, 200);
                        }
                    });

                    if (newMarkersAdded) this.markersDropAnimation();
                    if (newClusterAdded) this.clusterDropAnimation();

                    this.ref.detectChanges();
                });

            this.fuelStopService
                .getFuelStopMapList(
                    clustersObj.northEastLatitude,
                    clustersObj.northEastLongitude,
                    clustersObj.southWestLatitude,
                    clustersObj.southWestLongitude,
                    locationFilterQuery ? locationFilterQuery.longValue : null, // _long?: number,
                    locationFilterQuery ? locationFilterQuery.latValue : null, // lat?: number,
                    locationFilterQuery ? locationFilterQuery.rangeValue : null, // distance?: number,
                    moneyFilterQuery ? moneyFilterQuery.firstFormFrom : null, //lastFrom,
                    moneyFilterQuery ? moneyFilterQuery.firstFormTo : null, //lastTo,
                    moneyFilterQuery ? moneyFilterQuery.thirdFormFrom : null, // costFrom?: number,
                    moneyFilterQuery ? moneyFilterQuery.thirdFormTo : null, // costTo?: number,
                    moneyFilterQuery ? moneyFilterQuery.secondFormFrom : null, // ppgFrom?: number,
                    moneyFilterQuery ? moneyFilterQuery.secondFormTo : null, // ppgTo?: number,
                    this.mapListPagination.pageIndex, //pageIndex,
                    this.mapListPagination.pageSize, //pageSize,
                    null, //companyId
                    this.sortBy, //this.sortBy
                    this.searchText
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((mapListResponse: any) => {
                    var mapListData = { ...mapListResponse };

                    this.mapListPagination = mapListData.pagination;

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
                    mapListData.addData =
                        this.mapListPagination.pageIndex > 1 ? true : false;

                    this.updateMapList.emit(mapListData);
                    this.mapsService.searchLoadingChanged.next(false);
                    this.mapsService.searchResultsCountChange.next(
                        mapListData.fuelStopCount
                    );
                });
        }

        this.companyOfficeService
            .getOfficeClusters(
                clustersObj.northEastLatitude,
                clustersObj.northEastLongitude,
                clustersObj.southWestLatitude,
                clustersObj.southWestLongitude
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((companyOffices: any) => {
                var markersToShow = [];

                companyOffices.map((clusterItem) => {
                    let markerIndex = this.companyOffices.findIndex(
                        (item) => item.id === clusterItem.id
                    );

                    if (markerIndex == -1) {
                        this.companyOffices.push(clusterItem);
                    }

                    markersToShow.push(clusterItem.id);
                });

                this.companyOffices.map((item) => {
                    if (markersToShow.includes(item.id) && !item.showMarker) {
                        item.showMarker = true;
                    } else if (
                        !markersToShow.includes(item.id) &&
                        item.showMarker
                    ) {
                        item.showMarker = false;
                    }
                });

                this.ref.detectChanges();
            });
    }

    clickedCluster(cluster, callFromMapList?) {
        var selectId = 0;

        this.clusterMarkers.map((data: any) => {
            if (
                data.isSelected &&
                (data.latitude != cluster.latitude ||
                    data.longitude != cluster.longitude)
            ) {
                data.isSelected = false;
                //this.mapsService.selectedMarker(0);
                selectId = 0;
            } else if (
                data.latitude == cluster.latitude &&
                data.longitude == cluster.longitude
            ) {
                if (!data.detailedInfo) {
                    data.isSelected = !data.isSelected;
                }

                if (data.isSelected && !data.detailedInfo) {
                    this.markerSelected = true;
                } else if (data.detailedInfo && !callFromMapList) {
                    data.detailedInfo = false;
                    this.clusterDetailedInfo = false;
                    selectId = 0;
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

        if (!callFromMapList) this.mapsService.selectedMarker(selectId);

        this.ref.detectChanges();
    }

    clusterHover(cluster, hover) {
        cluster.markerHover = hover;
        this.ref.detectChanges();
    }

    getRepairShop(id, index, callFromMapList?) {
        this.repairShopService
            .getRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    var newData = { ...res };
                    newData.shopRaiting = {
                        hasLiked: res.currentCompanyUserRating === 1,
                        hasDislike: res.currentCompanyUserRating === -1,
                        likeCount: res?.upCount ? res.upCount : '0',
                        dislikeCount: res?.downCount ? res.downCount : '0',
                    };

                    newData.favourite =
                        newData.pinned != null ? newData.pinned : false;

                    if (index > -1) {
                        this.viewData[index] = {
                            ...this.viewData[index],
                            ...newData,
                        };
                    }

                    this.mapsService.markerUpdate(newData);

                    if (
                        this.clusterDetailedInfo &&
                        this.clusterDetailedInfo.id == id
                    ) {
                        this.clusterMarkers.map((cluster) => {
                            if (
                                cluster.detailedInfo &&
                                cluster.detailedInfo.id == id
                            ) {
                                cluster.detailedInfo = newData;
                                this.clusterDetailedInfo = newData;
                                this.mapsService.selectedMarker(newData.id);
                            }
                        });
                    }

                    setTimeout(() => {
                        if (index > -1) {
                            if (
                                !(
                                    callFromMapList &&
                                    this.mapsService.selectedMarkerId !=
                                        this.viewData[index].id
                                )
                            ) {
                                this.viewData[index].isSelected = true;
                                this.mapsService.selectedMarker(id);
                            }
                        }

                        this.ref.detectChanges();
                    }, 200);
                },
                error: () => {},
            });
    }

    getShipper(id, index, callFromMapList?) {
        this.shipperService
            .getShipperById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    var newData = { ...res };
                    newData.raiting = {
                        hasLiked: res.currentCompanyUserRating === 1,
                        hasDislike: res.currentCompanyUserRating === -1,
                        likeCount: res?.upCount ? res.upCount : '0',
                        dislikeCount: res?.downCount ? res.downCount : '0',
                    };

                    if (index > -1) {
                        this.viewData[index] = {
                            ...this.viewData[index],
                            ...newData,
                        };
                    }

                    this.mapsService.markerUpdate(newData);

                    if (
                        this.clusterDetailedInfo &&
                        this.clusterDetailedInfo.id == id
                    ) {
                        this.clusterMarkers.map((cluster) => {
                            if (
                                cluster.detailedInfo &&
                                cluster.detailedInfo.id == id
                            ) {
                                cluster.detailedInfo = newData;
                                this.clusterDetailedInfo = newData;
                                this.mapsService.selectedMarker(newData.id);
                            }
                        });
                    }

                    setTimeout(() => {
                        if (index > -1) {
                            if (
                                !(
                                    callFromMapList &&
                                    this.mapsService.selectedMarkerId !=
                                        this.viewData[index].id
                                )
                            ) {
                                this.viewData[index].isSelected = true;
                                this.mapsService.selectedMarker(id);
                            }
                        }

                        this.ref.detectChanges();
                    }, 200);
                },
                error: () => {},
            });
    }

    getFuelStop(id, index, callFromMapList?) {
        this.fuelStopService
            .getFuelStopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    var newData = { ...res };

                    if (index > -1) {
                        this.viewData[index] = {
                            ...this.viewData[index],
                            ...newData,
                        };
                    }

                    this.mapsService.markerUpdate(newData);

                    if (
                        this.clusterDetailedInfo &&
                        this.clusterDetailedInfo.id == id
                    ) {
                        this.clusterMarkers.map((cluster) => {
                            if (
                                cluster.detailedInfo &&
                                cluster.detailedInfo.id == id
                            ) {
                                cluster.detailedInfo = newData;
                                this.clusterDetailedInfo = newData;
                                this.mapsService.selectedMarker(newData.id);
                            }
                        });
                    }

                    setTimeout(() => {
                        if (index > -1) {
                            if (
                                !(
                                    callFromMapList &&
                                    this.mapsService.selectedMarkerId !=
                                        this.viewData[index].id
                                )
                            ) {
                                this.viewData[index].isSelected = true;
                                this.mapsService.selectedMarker(id);
                            }
                        }

                        this.ref.detectChanges();
                    }, 200);
                },
                error: () => {},
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
                        cluster.isSelected = true;
                        cluster.detailedInfo = res;

                        cluster.detailedInfo.shopRaiting = {
                            hasLiked: res.currentCompanyUserRating === 1,
                            hasDislike: res.currentCompanyUserRating === -1,
                            likeCount: res?.upCount ? res.upCount : '0',
                            dislikeCount: res?.downCount ? res.downCount : '0',
                        };

                        cluster.detailedInfo.favourite =
                            cluster.detailedInfo.pinned != null
                                ? cluster.detailedInfo.pinned
                                : false;

                        this.clusterDetailedInfo = cluster.detailedInfo;
                        this.mapsService.selectedMarker(
                            cluster.detailedInfo.id
                        );

                        this.ref.detectChanges();
                    },
                    error: () => {},
                });
        } else if (this.mapType == 'shipper') {
            this.shipperService
                .getShipperById(item.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        cluster.isSelected = true;
                        cluster.detailedInfo = res;

                        cluster.detailedInfo.raiting = {
                            hasLiked: res.currentCompanyUserRating === 1,
                            hasDislike: res.currentCompanyUserRating === -1,
                            likeCount: res?.upCount ? res.upCount : '0',
                            dislikeCount: res?.downCount ? res.downCount : '0',
                        };

                        this.clusterDetailedInfo = cluster.detailedInfo;
                        this.mapsService.selectedMarker(
                            cluster.detailedInfo.id
                        );

                        this.ref.detectChanges();
                    },
                    error: () => {},
                });
        } else if (this.mapType == 'fuelStop') {
            this.fuelStopService
                .getFuelStopById(item.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        cluster.isSelected = true;
                        cluster.detailedInfo = res;

                        this.clusterDetailedInfo = res;
                        this.mapsService.selectedMarker(
                            cluster.detailedInfo.id
                        );

                        this.ref.detectChanges();
                    },
                    error: () => {},
                });
        }
    }

    getClusters(changedSearchOrSort?, moveMap?) {
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

        this.lastClusterCoordinates = clustersObject;

        this.callClusters(clustersObject, changedSearchOrSort, false, moveMap);
    }

    showMoreData(item) {
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

        if (item.count / item.pagination.pageIndex > 25) {
            item.pagination.pageIndex++;
            this.callClusters(clustersObject, false, item);
        }
    }

    showMoreMapListData(data) {
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

        if (data.length / this.mapListPagination.pageIndex >= 25) {
            this.mapListPagination.pageIndex++;
            this.callClusters(clustersObject, false);
        }
    }

    decodeRouteShape(route) {
        this.routingService
            .decodeRouteShape(route.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    addDeleteListener() {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation | any) => {
                    switch (res.type) {
                        case 'delete': {
                            if (
                                res.template === 'shipper' ||
                                res.template === 'repair shop'
                            ) {
                                var resType =
                                    res.template === 'repair shop'
                                        ? 'delete-repair'
                                        : res.type;
                                var deleteResponse = { ...res, type: resType };

                                this.callDropDownAction.emit(deleteResponse);

                                var cluster = this.clusterMarkers.find(
                                    (item) => item.detailedInfo?.id == res.id
                                );

                                if (cluster) {
                                    cluster.detailedInfo = false;
                                    this.getClusters(true, true);
                                    this.ref.detectChanges();
                                }
                            }
                            break;
                        }
                        case 'activate': {
                            if (
                                res.template === 'repair shop' ||
                                res.template === 'Repair Shop'
                            ) {
                                this.repairShopService.changeShopStatus(
                                    res?.id
                                );
                            }
                            break;
                        }
                        case 'deactivate': {
                            if (
                                res.template === 'repair shop' ||
                                res.template === 'Repair Shop'
                            ) {
                                this.repairShopService.changeShopStatus(
                                    res?.id
                                );
                            }
                            break;
                        }
                        case 'info': {
                            if (res.subType === 'favorite') {
                                if (
                                    res.subTypeStatus === 'move' ||
                                    res.subTypeStatus === 'remove'
                                ) {
                                    this.repairShopService.changePinnedStatus(
                                        res?.id
                                    );
                                }
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
    }

    zoomToObject(obj) {
        var bounds = new google.maps.LatLngBounds();
        var points = obj.getPath().getArray();
        for (var n = 0; n < points.length; n++) {
            bounds.extend(points[n]);
        }
        this.agmMap.fitBounds(bounds);
    }

    public identity(index: number, _: any): number {
        return index;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
