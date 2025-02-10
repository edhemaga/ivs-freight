import {
    Component,
    OnInit,
    OnDestroy,
    ViewEncapsulation,
    SecurityContext,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { Subject, takeUntil } from 'rxjs';

// constants
import { MapConstants } from '@shared/utils/constants/map.constants';

// services
import { TruckService } from '@shared/services/truck.service';
import { TrailerService } from '@shared/services/trailer.service';
import { TelematicStateService } from '@pages/telematic/services/telematic-state.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { MapsService } from '@shared/services/maps.service';
import { GpsService } from '@pages/telematic/services/gps-service.service';
import { CompanyOfficeService } from '@shared/services/company-office.service';

// models
import { TruckListResponse, TrailerListResponse } from 'appcoretruckassist';

// store
import { TelematicStateQuery } from '@pages/telematic/state/telematic-state.query';
import { TelematicStateStore } from '@pages/telematic/state/telematic-state.store';

// enums
import { EGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-telematic-map',
    templateUrl: './telematic-map.component.html',
    styleUrls: [
        './telematic-map.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class TelematicMapComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @ViewChild('op2') columnsMenuPopover: any;

    agmMap: any;
    styles: any = MapConstants.GOOGLE_MAP_STYLES;
    mapRestrictions = {
        latLngBounds: MapConstants.NORTH_AMERICA_BOUNDS,
        strictBounds: true,
    };
    mapLatitude: number = 41.860119;
    mapLongitude: number = -87.660156;
    mapZoom: number = 1;
    mapHover: boolean = false;

    driverLocations: any[] = [];
    driverDestinations: any[] = [];

    gpsAssignedData: any[] = [];
    gpsUnassignedData: any[] = [];

    routeLineOptions: any = {};

    legendExpanded: boolean = true;
    legendActive: boolean = false;

    searchForm!: UntypedFormGroup;

    selectedTab: string = 'live';

    tableData: any[] = [
        {
            title: 'Live Tracking',
            field: 'live',
            length: 0,
            gridNameTitle: 'Telematics',
        },
        {
            title: 'History Log',
            field: 'history',
            length: 0,
            gridNameTitle: 'Telematics',
        },
    ];

    tableOptions: any = {
        disabledMutedStyle: null,
        toolbarActions: {
            hideLocationFilter: false,
            hideViewMode: true,
            showMapView: false,
            hideStopPicker: true,
            hideRouteCompare: true,
            hideKeyboardControls: true,
            hideMapLayers: true,
            hideRouteSettings: true,
            hideAddRouteButton: true,
        },
        config: {
            showSort: true,
            sortBy: '',
            sortDirection: '',
            disabledColumns: [0],
            minWidth: 60,
        },
    };

    unassignedDevicesActive: boolean = false;

    searchUnassignedText: string = '';

    truckUnits: any[] = [];
    allTruckUnits: any[] = [];
    trailerUnits: any[] = [];
    allTrailerUnits: any[] = [];
    selectedTruckUnit: any = {};
    selectedTrailerUnit: any = {};
    sortColumn: any = {};
    sortDirection: any = 'asc';

    columns: any[] = [
        {
            title: 'Truck',
            name: 'truck',
            width: 68,
            marginRight: 22,
            value: 'truckNumber',
            replacementColumnIndex: 2,
            showMotionIcon: true,
            boldText: true,
            placeholderText: ' ',
            manageWidth: 53,
            manageMarginRight: 9,
            manageDevicePlaceholder: 'No Truck',
            menuTitle: 'Truck Unit',
            alwaysShown: true,
            showInMenu: true,
            showInRegularView: true,
            showInManage: true,
            showInExpand: true,
        },
        {
            title: 'Device Id',
            name: 'truckDeviceId',
            width: 124,
            marginRight: 22,
            showDeviceDropdown: true,
            hidden: true,
            placeholderText: ' ',
            showInManage: true,
        },
        {
            title: 'Trailer',
            name: 'trailer',
            width: 66,
            marginRight: 22,
            value: 'trailerNumber',
            boldText: true,
            manageWidth: 53,
            manageMarginRight: 9,
            placeholderText: ' ',
            manageDevicePlaceholder: 'No Trailer',
            menuTitle: 'Trailer Name',
            hidden: true,
            showInMenu: true,
            showInManage: true,
            showInExpand: true,
        },
        {
            title: 'Device Id',
            name: 'trailerDeviceId',
            width: 142,
            marginRight: 22,
            showDeviceDropdown: true,
            hidden: true,
            placeholderText: ' ',
            showInManage: true,
        },
        {
            title: 'Driver',
            name: 'driver',
            width: 138,
            marginRight: 26,
            expandedWidth: 130,
            expandedMarginRight: 22,
            value: 'driver',
            placeholderText: ' ',
            manageWidth: 130,
            manageMarginRight: 22,
            manageDevicePlaceholder: 'No Driver',
            menuTitle: 'Drivers Name',
            showInMenu: true,
            showInRegularView: true,
            showInManage: true,
            showInExpand: true,
        },
        {
            title: 'Speed',
            name: 'speed',
            width: 50,
            marginRight: 22,
            value: 'speed',
            valueAddText: 'mph',
            menuTitle: 'Speed/Ignition',
            hidden: true,
            showInMenu: true,
            showInExpand: true,
            expandedMenuTitle: 'Speed',
        },
        {
            title: null,
            name: 'ignition',
            width: 24,
            marginRight: 22,
            iconInsteadOfText: true,
            iconUrl: 'assets/svg/common/telematics/ic_ignition.svg',
            value: 'ignition',
            placeholderText: ' ',
            menuTitle: 'Ignition',
            hidden: true,
            showInExpand: true,
            showInExpandedMenu: true,
            expandedMenuTitle: 'Ignition',
        },
        {
            title: 'Location',
            name: 'location',
            width: 140,
            marginRight: 22,
            value: 'location',
            manageMarginRight: 12,
            manageDevicePlaceholder: 'No Address',
            menuTitle: 'Location',
            hidden: true,
            showInMenu: true,
            showInManage: true,
            showInExpand: true,
        },
        {
            title: 'Destination',
            name: 'destination',
            width: 140,
            marginRight: 22,
            value: 'destination',
            menuTitle: 'Destination',
            hidden: true,
            showInMenu: true,
            showInExpand: true,
        },
        {
            title: 'Status',
            name: 'status',
            width: 92,
            marginRight: 22,
            value: 'dispatchStatus',
            placeholderText: ' ',
            boldText: true,
            menuTitle: 'Dispatch Status',
            hidden: true,
            showInMenu: true,
            showInExpand: true,
        },
        {
            title: 'Progress',
            name: 'progress',
            width: 195,
            marginRight: 17,
            progressComponent: true,
            menuTitle: 'Progress',
            hidden: true,
            showInMenu: true,
            showInExpand: true,
        },
        {
            title: null,
            name: 'hidden',
            width: 14,
            marginRight: 8,
            iconInsteadOfText: true,
            iconUrl: 'assets/svg/common/telematics/ic_eye-open.svg',
            value: 'hidden',
            iconInsteadOfValue: true,
            activeValueIconUrl: 'assets/svg/common/ic_eye-visible.svg',
            inactiveValueIconUrl:
                'assets/svg/common/telematics/ic_eye-open.svg',
            alwaysShown: true,
            showInRegularView: true,
            showInExpand: true,
        },
    ];

    showExpandedView: boolean = false;
    expandFinished: boolean = false;
    showManageDevice: boolean = false;
    gpsDevicesList: any[] = [];
    trailerDevicesList: any[] = [];
    selectedDeviceUnit: any = {};

    deviceInputs: UntypedFormArray = this.formBuilder.array([]);
    filteredAssignedDevices: any[] = [];
    filteredUnassignedDevices: any[] = [];
    searchAssignedText: string = '';
    searchIsActive: boolean = false;
    searchUnassignedIsActive: boolean = false;

    columnsMenuOpen: boolean = false;
    columnsDropdownShown: boolean = false;
    columnCheckboxes: UntypedFormArray = this.formBuilder.array([]);

    focusedDeviceId: number = 0;
    regularViewColumnIndex: number = null;

    mapZoomTime: number = 0;
    clustersTimeout: any;

    companyOffices: any = [];
    hasTrailerDevices: boolean = false;

    constructor(
        // Services
        private mapsService: MapsService,
        private telematicService: TelematicStateService,
        private gpsService: GpsService,
        private truckService: TruckService,
        private trailerService: TrailerService,
        private companyOfficeService: CompanyOfficeService,
        private detailsDataService: DetailsDataService,

        // Form
        private formBuilder: UntypedFormBuilder,

        // Sanitizer
        private sanitizer: DomSanitizer,

        // Ref
        private ref: ChangeDetectorRef,

        // Store
        private telematicQuery: TelematicStateQuery,
        private telematicStore: TelematicStateStore
    ) {}

    ngOnInit(): void {
        this.telematicService.startGpsConnection();
        this.addGpsListener();

        this.getStoreData();

        this.createSearchForm();
        this.initColumnsForm();
    }

    zoomChange(event) {
        this.mapZoom = event;
    }

    getMapInstance(map) {
        this.agmMap = map;

        // var lineSymbol = {
        //     path: google.maps.SymbolPath.CIRCLE,
        //     fillOpacity: 1,
        //     scale: 3,
        // };

        // this.routeLineOptions = new google.maps.Polyline({
        //     strokeColor: '#6C6C6C',
        //     strokeOpacity: 0,
        //     icons: [
        //         {
        //             icon: lineSymbol,
        //             offset: '0',
        //             repeat: '12px',
        //         },
        //     ],
        // });

        map.addListener('idle', () => {
            // update the coordinates here

            clearTimeout(this.clustersTimeout);

            this.clustersTimeout = setTimeout(() => {
                this.getUnassignedClusters();
            }, 500);
        });
    }

    markerClick(device) {
        if (this.focusedDeviceId != device.deviceId) {
            this.focusedDeviceId = device.deviceId;

            this.mapLatitude = device.latitude;
            this.mapLongitude = device.longitude;
        } else {
            this.focusedDeviceId = 0;
        }
    }

    getGpsData() {
        this.telematicService
            .getAllGpsData()
            .pipe(takeUntil(this.destroy$))
            .subscribe((gpsData: any) => {
                gpsData.data.map((data, index) => {
                    data.speed = Math.round(data.speed);
                    data.motionStatus =
                        data.motionStatus === 1
                            ? 'MOTION'
                            : data.motionStatus === 2
                              ? 'SHORT_STOP'
                              : data.motionStatus === 3
                                ? 'EXTENDED_STOP'
                                : data.motionStatus === 4 ||
                                    data.motionStatus === 5 // 5 == offline
                                  ? 'PARKING'
                                  : data.motionStatus;

                    if (data.coordinates) {
                        data.coordinates = data.coordinates.replace('-', '');
                    }

                    if (index > 0) {
                        this.calculateDistanceBetweenDevices(
                            gpsData.data[index - 1],
                            data
                        );
                    }
                });

                this.gpsAssignedData = gpsData.data;
                this.driverLocations = [
                    ...this.driverLocations,
                    ...gpsData.data,
                ];

                this.tableData[0].length = this.driverLocations.length;

                this.initDeviceFields();
                this.filterAssignedDevices();
                this.getTrucks();
                this.getTrailers();
                this.findLinkedDevices();
            });
    }

    getUnassignedGpsData() {
        this.telematicService
            .getCompanyUnassignedGpsData({})
            .pipe(takeUntil(this.destroy$))
            .subscribe((gpsData: any) => {
                gpsData.data.map((data) => {
                    data.speed = Math.round(data.speed);
                    data.motionStatus =
                        data.motionStatus === 1
                            ? 'MOTION'
                            : data.motionStatus === 2
                              ? 'SHORT_STOP'
                              : data.motionStatus === 3
                                ? 'EXTENDED_STOP'
                                : data.motionStatus === 4 ||
                                    data.motionStatus === 5 // 5 == offline
                                  ? 'PARKING'
                                  : data.motionStatus;

                    if (data.coordinates) {
                        data.coordinates = data.coordinates.replace('-', '');
                    }
                });

                this.gpsUnassignedData = gpsData.data;
                this.driverLocations = [
                    ...this.driverLocations,
                    ...gpsData.data,
                ];

                this.tableData[0].length = this.driverLocations.length;

                var devicesArr = this.gpsUnassignedData.map((device) => {
                    return {
                        id: device.deviceId,
                        name: device.deviceId,
                        unitType: device.unitType,
                    };
                });

                var trailerArr = devicesArr.filter(
                    (device) => device.unitType === 2
                );

                var truckArr = devicesArr.filter(
                    (device) => !device.unitType || device.unitType === 1
                );

                this.trailerDevicesList = [
                    ...this.trailerDevicesList,
                    ...trailerArr,
                ];
                this.gpsDevicesList = [...this.gpsDevicesList, ...truckArr];

                this.hasTrailerDevices =
                    this.trailerDevicesList.length > 0 ? true : false;

                this.filterUnassignedDevices();
                this.findLinkedDevices();
            });
    }

    getDataByDeviceId(deviceId, assignedDevice?) {
        this.telematicService
            .getDeviceData(deviceId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((deviceData: any) => {
                deviceData.transform =
                    'translate(-3309.177px, 10942px) rotate(' +
                    deviceData.heading +
                    'deg)';
                deviceData.motionStatus =
                    deviceData.motionStatus === 1
                        ? 'MOTION'
                        : deviceData.motionStatus === 2
                          ? 'SHORT_STOP'
                          : deviceData.motionStatus === 3
                            ? 'EXTENDED_STOP'
                            : deviceData.motionStatus === 4 ||
                                deviceData.motionStatus === 5 // 5 == offline
                              ? 'PARKING'
                              : deviceData.motionStatus;

                let driverIndex = this.driverLocations.findIndex(
                    (device) => device.deviceId === deviceId
                );

                if (driverIndex == -1) {
                    this.driverLocations.push(deviceData);
                    this.tableData[0].length = this.driverLocations.length;
                } else {
                    this.driverLocations[driverIndex] = deviceData;
                }

                this.mapsService.markerUpdate(deviceData);

                if (assignedDevice) {
                    let gpsAssignedIndex = this.gpsAssignedData.findIndex(
                        (device) => device.deviceId === deviceId
                    );

                    if (gpsAssignedIndex > -1) {
                        this.gpsAssignedData[gpsAssignedIndex] = {
                            ...this.gpsAssignedData[gpsAssignedIndex],
                            ...deviceData,
                        };
                    } else {
                        this.gpsAssignedData.push(deviceData);
                    }

                    let filterAssignedIndex =
                        this.filteredAssignedDevices.findIndex(
                            (device) => device.deviceId === deviceId
                        );

                    if (filterAssignedIndex > -1) {
                        this.filteredAssignedDevices[filterAssignedIndex] = {
                            ...this.filteredAssignedDevices[
                                filterAssignedIndex
                            ],
                            ...deviceData,
                        };
                    } else {
                        this.filteredAssignedDevices.push(deviceData);
                    }

                    let gpsUnassignedIndex = this.gpsUnassignedData.findIndex(
                        (device) => device.deviceId === deviceId
                    );

                    if (gpsUnassignedIndex > -1) {
                        this.gpsUnassignedData.splice(gpsUnassignedIndex, 1);
                    }

                    let filterUnassignedIndex =
                        this.filteredUnassignedDevices.findIndex(
                            (device) => device.deviceId === deviceId
                        );

                    if (filterUnassignedIndex > -1) {
                        this.filteredUnassignedDevices.splice(
                            filterUnassignedIndex,
                            1
                        );
                    }
                } else {
                    let gpsUnassignedIndex = this.gpsUnassignedData.findIndex(
                        (device) => device.deviceId === deviceId
                    );

                    if (gpsUnassignedIndex > -1) {
                        this.gpsUnassignedData[gpsUnassignedIndex] = {
                            ...this.gpsUnassignedData[gpsUnassignedIndex],
                            ...deviceData,
                        };
                    } else {
                        this.gpsUnassignedData.push(deviceData);
                    }

                    let filterUnassignedIndex =
                        this.filteredUnassignedDevices.findIndex(
                            (device) => device.deviceId === deviceId
                        );

                    if (filterUnassignedIndex > -1) {
                        this.filteredUnassignedDevices.splice(
                            filterUnassignedIndex,
                            1
                        );
                        this.filteredUnassignedDevices[filterUnassignedIndex] =
                            {
                                ...this.filteredUnassignedDevices[
                                    filterUnassignedIndex
                                ],
                                ...deviceData,
                            };
                    } else {
                        this.filteredUnassignedDevices.push(deviceData);
                    }

                    let gpsAssignedIndex = this.gpsAssignedData.findIndex(
                        (device) => device.deviceId === deviceId
                    );

                    if (gpsAssignedIndex > -1) {
                        this.gpsAssignedData.splice(gpsAssignedIndex, 1);
                    }

                    let filterAssignedIndex =
                        this.filteredAssignedDevices.findIndex(
                            (device) => device.deviceId === deviceId
                        );

                    if (filterAssignedIndex > -1) {
                        this.filteredAssignedDevices.splice(
                            filterAssignedIndex,
                            1
                        );
                    }
                }

                let trailerDevice = this.gpsUnassignedData.findIndex(
                    (device) => device.unitType === 2
                );

                this.hasTrailerDevices = trailerDevice > -1 ? true : false;

                this.getTrucks();
                this.getTrailers();
                this.findLinkedDevices();
            });
    }

    resizeLegend() {
        this.legendExpanded = !this.legendExpanded;
    }

    showHideLegend(hide?) {
        this.legendActive = hide != null ? hide : !this.legendActive;
        this.unassignedDevicesActive = false;
    }

    createSearchForm() {
        this.searchForm = this.formBuilder.group({
            search: '',
            searchUnassigned: '',
            truckUnit: null,
            trailerUnit: null,
            truckDeviceId: null,
            trailerDeviceId: null,
        });

        this.searchForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (changes.search) {
                    this.searchAssignedText = changes.search;

                    this.onSearchAssigned();
                } else if (changes.searchUnassigned) {
                    this.searchUnassignedText = changes.searchUnassigned;

                    this.onSearchUnassigned();
                } else if (changes.truckUnit) {
                    this.detailsDataService.setUnitValue(changes.truckUnit);
                } else if (changes.trailerUnit) {
                    this.detailsDataService.setUnitValue(changes.trailerUnit);
                }
            });
    }

    assignDeviceToTruck(deviceId, truckId) {
        this.telematicService
            .assignDeviceToTruck({ deviceId: deviceId, truckId: truckId })
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.getDataByDeviceId(deviceId, true);
            });
    }

    assignDeviceToTrailer(deviceId, trailerId) {
        this.telematicService
            .assignDeviceToTrailer({ deviceId: deviceId, trailerId: trailerId })
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.getDataByDeviceId(deviceId, true);
            });
    }

    assignDevicesToCompany(devices) {
        this.telematicService
            .assignDevicesToCompany(devices)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {});
    }

    onToolBarAction(event: any) {
        if (event.action == 'show-hide-unassigned') {
            this.showHideUnassigned();
        } else if (event.action == 'open-route-info') {
            this.showHideLegend();
        }
    }

    showHideUnassigned(hide?) {
        this.unassignedDevicesActive =
            hide != null ? hide : !this.unassignedDevicesActive;
        this.legendActive = false;
    }

    clearUnassignedSearchInput() {
        this.searchForm.get('searchUnassigned').patchValue('');
        this.searchUnassignedText = '';

        this.filterUnassignedDevices();
        this.highlightSearchedText();
    }

    clearAssignedSearchInput() {
        this.searchForm.get('search').patchValue('');
        this.searchAssignedText = '';

        this.filterAssignedDevices();
        this.highlightSearchedText(true);
    }

    handleInputSelect(event, type): void {
        if (type !== 'TRUCK') {
            this.selectedTrailerUnit = event;
            return;
        }
        this.selectedTruckUnit = event;
    }

    saveTruckSelection(event, item): void {
        if (event.action === EGeneralActions.CANCEL) {
            this.selectedTruckUnit = {};
            this.searchForm.get('truckUnit').patchValue(null);
        } else {
            this.assignDeviceToTruck(item.deviceId, event.data.id);
            this.selectedTruckUnit = {};
            this.searchForm.get('truckUnit').patchValue(null);
        }
        item.addTruckShown = false;
    }

    saveTrailerSelection(event, item) {
        if (event.action === EGeneralActions.CANCEL) {
            this.selectedTrailerUnit = {};
            this.searchForm.get('trailerUnit').patchValue(null);
        } else {
            this.assignDeviceToTrailer(item.deviceId, event.data.id);

            this.selectedTrailerUnit = {};
            this.searchForm.get('trailerUnit').patchValue(null);
        }
        item.addTruckShown = false;
    }

    getTrucks() {
        this.truckService
            .getTruckList(1, null, 1, 25)
            .pipe(takeUntil(this.destroy$))
            .subscribe((trucks: TruckListResponse) => {
                var unassignedTrucks = [];
                var allTrucks = [];
                trucks.pagination.data.map((truck) => {
                    let assignedTruck = this.gpsAssignedData.find(
                        (gpsData) =>
                            truck.truckNumber === gpsData.truckNumber &&
                            gpsData.unitType != 2
                    );

                    if (!assignedTruck) {
                        unassignedTrucks.push({
                            id: truck.id,
                            name: truck.truckNumber,
                            logoName: truck.truckType.logoName,
                            folder: 'common',
                            subFolder: 'trucks',
                        });
                    }

                    allTrucks.push({
                        id: truck.id,
                        name: truck.truckNumber,
                        logoName: truck.truckType.logoName,
                        folder: 'common',
                        subFolder: 'trucks',
                    });
                });

                this.truckUnits = unassignedTrucks;
                this.allTruckUnits = allTrucks;
            });
    }

    getTrailers() {
        this.trailerService
            .getTrailers(1, null, 1, 25)
            .pipe(takeUntil(this.destroy$))
            .subscribe((trailers: TrailerListResponse) => {
                var unassignedTrailers = [];
                var allTrailers = [];
                trailers.pagination.data.map((trailer) => {
                    let assignedTruck = this.gpsAssignedData.find(
                        (gpsData) =>
                            trailer.trailerNumber === gpsData.trailerNumber &&
                            gpsData.unitType == 2
                    );

                    if (!assignedTruck) {
                        unassignedTrailers.push({
                            id: trailer.id,
                            name: trailer.trailerNumber,
                            logoName: trailer.trailerType.logoName,
                            folder: 'common',
                            subFolder: 'trailers',
                        });
                    }

                    allTrailers.push({
                        id: trailer.id,
                        name: trailer.trailerNumber,
                        logoName: trailer.trailerType.logoName,
                        folder: 'common',
                        subFolder: 'trailers',
                    });
                });

                this.trailerUnits = unassignedTrailers;
                this.allTrailerUnits = allTrailers;
            });
    }

    showTruckDropdown(item) {
        this.gpsUnassignedData.map((data) => {
            data.addTruckShown = false;
        });

        item.addTruckShown = true;
    }

    toggleExpandedView() {
        this.showExpandedView = !this.showExpandedView;
        this.showHideColumns();

        setTimeout(() => {
            this.expandFinished = !this.expandFinished;
        }, 200);
    }

    mapClick() {
        this.driverLocations.map((location) => {
            location.isFocused = false;
        });

        this.gpsAssignedData.map((location) => {
            location.isFocused = false;
        });

        this.gpsUnassignedData.map((location) => {
            location.isFocused = false;
        });

        this.focusedDeviceId = 0;
    }

    manageDeviceToggle() {
        this.showManageDevice = !this.showManageDevice;

        this.showHideColumns();
    }

    showDeviceDropdown(event, location, column) {
        event.preventDefault();
        event.stopPropagation();

        this.gpsUnassignedData.map((data) => {
            data.truckDeviceDropdown = false;
            data.trailerDeviceDropdown = false;
        });

        if (column.name == 'truckDeviceId') {
            location.truckDeviceDropdown = true;
        } else {
            location.trailerDeviceDropdown = true;
        }
    }

    handleDeviceInputSelect(event, type, location) {
        if (type == 'truckDeviceId') {
            let truck = this.allTruckUnits.find(
                (truck) => truck.name === location.truckNumber
            );

            this.selectedDeviceUnit = event;

            if (this.selectedDeviceUnit && truck)
                this.assignDeviceToTruck(
                    this.selectedDeviceUnit.name,
                    truck.id
                );
        } else {
            let trailer = this.allTrailerUnits.find(
                (trailer) => trailer.name === location.trailerNumber
            );

            this.selectedTrailerUnit = event;

            if (this.selectedTrailerUnit && trailer)
                this.assignDeviceToTrailer(
                    this.selectedTrailerUnit.name,
                    trailer.id
                );
        }
    }

    initDeviceFields() {
        this.gpsAssignedData.map((data) => {
            data.truckDeviceDropdown = data.truckNumber ? true : false;
            data.trailerDeviceDropdown = data.trailerNumber ? true : false;

            this.deviceInputs.push(
                this.formBuilder.group({
                    truckDeviceId: data.truckNumber ? data.deviceId : null,
                    trailerDeviceId: data.trailerNumber ? data.deviceId : null,
                })
            );
        });
    }

    get addressFields() {
        return this.deviceInputs;
    }

    filterAssignedDevices() {
        this.filteredAssignedDevices = this.gpsAssignedData.filter(
            (item) =>
                item?.deviceId?.includes(this.searchAssignedText) ||
                item?.driver?.toLowerCase().includes(this.searchAssignedText) ||
                item?.location
                    ?.toLowerCase()
                    .includes(this.searchAssignedText.toLowerCase()) ||
                item?.trailerNumber?.includes(this.searchAssignedText) ||
                item?.truckNumber?.includes(this.searchAssignedText)
        );
    }

    filterUnassignedDevices() {
        this.filteredUnassignedDevices = this.gpsUnassignedData.filter((item) =>
            item?.deviceId?.includes(this.searchUnassignedText)
        );
    }

    onSearchAssigned() {
        if (this.searchAssignedText?.length >= 3) {
            this.searchIsActive = true;

            this.filterAssignedDevices();
            this.highlightSearchedText(true);
        } else if (this.searchIsActive && this.searchAssignedText?.length < 3) {
            this.searchIsActive = false;
            this.searchAssignedText = '';

            this.filterAssignedDevices();
            this.highlightSearchedText(true);
        }
    }

    onSearchUnassigned() {
        if (this.searchUnassignedText?.length >= 3) {
            this.searchUnassignedIsActive = true;

            this.filterUnassignedDevices();
            this.highlightSearchedText();
        } else if (
            this.searchUnassignedIsActive &&
            this.searchUnassignedText?.length < 3
        ) {
            this.searchUnassignedIsActive = false;
            this.searchUnassignedText = '';

            this.filterUnassignedDevices();
            this.highlightSearchedText();
        }
    }

    highlightSearchedText(searchAssigned?) {
        var classSelector = searchAssigned
            ? '.column-text .marker-like-text'
            : '.device-id-text';
        var searchText = searchAssigned
            ? this.searchAssignedText
            : this.searchUnassignedText;

        document
            .querySelectorAll<HTMLElement>(classSelector)
            .forEach((title: HTMLElement) => {
                var text = title.textContent;

                const regex = new RegExp(searchText, 'gi');
                const newText = text.replace(regex, (match: string) => {
                    if (match.length >= 3) {
                        return `<mark class='highlighted-text'>${match}</mark>`;
                    } else {
                        return match;
                    }
                });
                const sanitzed = this.sanitizer.sanitize(
                    SecurityContext.HTML,
                    newText
                );

                title.innerHTML = sanitzed;
            });
    }

    onShowColumsMenuPopover(columnsPopup: any) {
        this.columnsMenuPopover = columnsPopup;

        if (columnsPopup.isOpen()) {
            columnsPopup.close();
        } else {
            columnsPopup.open({});
        }

        this.columnsMenuOpen = columnsPopup.isOpen();
        this.columnsDropdownShown = false;
    }

    selectColumnsToShow(column, index) {
        if (!column.alwaysShown) {
            this.columns.map((item) => {
                if (!item.alwaysShown) {
                    item.showInRegularView = false;
                }

                if (
                    column.menuTitle == 'Speed/Ignition' &&
                    item.name == 'ignition'
                ) {
                    item.showInRegularView = true;
                }
            });

            column.showInRegularView = true;
            this.regularViewColumnIndex = index;

            this.showHideColumns();
        }

        this.columnsMenuPopover.close();
    }

    showHideColumns() {
        this.columns.map((column) => {
            if (this.showManageDevice) {
                if (column.showInManage && !column.disabled) {
                    column.hidden = false;
                } else {
                    column.hidden = true;
                }
            } else if (this.showExpandedView) {
                if (column.showInExpand && !column.disabled) {
                    column.hidden = false;
                } else {
                    column.hidden = true;
                }
            } else {
                if (column.showInRegularView && !column.disabled) {
                    column.hidden = false;
                } else {
                    column.hidden = true;
                }
            }
        });

        setTimeout(() => {
            this.ref.detectChanges();
        }, 200);
    }

    initColumnsForm() {
        this.columns.map(() => {
            this.columnCheckboxes.push(
                this.formBuilder.group({
                    columnActive: true,
                })
            );
        });

        this.columnCheckboxes.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                changes.map((change, index) => {
                    this.columns[index].disabled = !change.columnActive;
                });

                this.showHideColumns();
            });
    }

    clickOnDrop(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    addGpsListener() {
        this.gpsService.gpsStatusChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                data.speed = Math.round(data.speed);
                data.motionStatus =
                    data.motionStatus === 1
                        ? 'MOTION'
                        : data.motionStatus === 2
                          ? 'SHORT_STOP'
                          : data.motionStatus === 3
                            ? 'EXTENDED_STOP'
                            : data.motionStatus === 4 || data.motionStatus === 5 // 5 == offline
                              ? 'PARKING'
                              : data.motionStatus;

                let driverIndex = this.driverLocations.findIndex(
                    (device) => device.deviceId === data.deviceId
                );

                if (driverIndex == -1) {
                    this.driverLocations.push(data);
                } else {
                    var previousMotionStatus =
                        this.driverLocations[driverIndex].motionStatus;
                    this.driverLocations[driverIndex] = {
                        ...this.driverLocations[driverIndex],
                        ...data,
                    };
                    if (!this.driverLocations[driverIndex].motionStatus)
                        this.driverLocations[driverIndex].motionStatus =
                            previousMotionStatus;
                }

                this.tableData[0].length = this.driverLocations.length;

                let gpsAssignedIndex = this.gpsAssignedData.findIndex(
                    (device) => device.deviceId === data.deviceId
                );

                if (gpsAssignedIndex > -1) {
                    var previousMotionStatus =
                        this.gpsAssignedData[gpsAssignedIndex].motionStatus;
                    this.gpsAssignedData[gpsAssignedIndex] = {
                        ...this.gpsAssignedData[gpsAssignedIndex],
                        ...data,
                    };
                    if (!this.gpsAssignedData[gpsAssignedIndex].motionStatus)
                        this.gpsAssignedData[gpsAssignedIndex].motionStatus =
                            previousMotionStatus;
                }

                let filterAssignedIndex =
                    this.filteredAssignedDevices.findIndex(
                        (device) => device.deviceId === data.deviceId
                    );

                if (filterAssignedIndex > -1) {
                    var previousMotionStatus =
                        this.filteredAssignedDevices[filterAssignedIndex]
                            .motionStatus;
                    this.filteredAssignedDevices[filterAssignedIndex] = {
                        ...this.filteredAssignedDevices[filterAssignedIndex],
                        ...data,
                    };
                    if (
                        !this.filteredAssignedDevices[filterAssignedIndex]
                            .motionStatus
                    )
                        this.filteredAssignedDevices[
                            filterAssignedIndex
                        ].motionStatus = previousMotionStatus;
                }

                let gpsUnassignedIndex = this.gpsUnassignedData.findIndex(
                    (device) => device.deviceId === data.deviceId
                );

                if (gpsUnassignedIndex > -1) {
                    var previousMotionStatus =
                        this.gpsUnassignedData[gpsUnassignedIndex].motionStatus;
                    this.gpsUnassignedData[gpsUnassignedIndex] = {
                        ...this.gpsUnassignedData[gpsUnassignedIndex],
                        ...data,
                    };
                    if (
                        !this.gpsUnassignedData[gpsUnassignedIndex].motionStatus
                    )
                        this.gpsUnassignedData[
                            gpsUnassignedIndex
                        ].motionStatus = previousMotionStatus;
                }

                let filterUnassignedIndex =
                    this.filteredUnassignedDevices.findIndex(
                        (device) => device.deviceId === data.deviceId
                    );

                if (filterUnassignedIndex > -1) {
                    var previousMotionStatus =
                        this.filteredUnassignedDevices[filterUnassignedIndex]
                            .motionStatus;
                    this.filteredUnassignedDevices[filterUnassignedIndex] = {
                        ...this.filteredUnassignedDevices[
                            filterUnassignedIndex
                        ],
                        ...data,
                    };
                    if (
                        !this.filteredUnassignedDevices[filterUnassignedIndex]
                            .motionStatus
                    )
                        this.filteredUnassignedDevices[
                            filterUnassignedIndex
                        ].motionStatus = previousMotionStatus;
                }
            });
    }

    getGpsHistory(deviceId, date?) {
        this.telematicService
            .getDeviceHistory(deviceId, date)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {});
    }

    showHideDevice(event, device) {
        event.preventDefault();
        event.stopPropagation();

        var showHide = !device.hidden;

        if (showHide && device.deviceId == this.focusedDeviceId)
            this.focusedDeviceId = 0;

        this.driverLocations.map((item) => {
            if (item.deviceId == device.deviceId) {
                item.hidden = showHide;
            }
        });

        this.gpsAssignedData.map((item) => {
            if (item.deviceId == device.deviceId) {
                item.hidden = showHide;
            }
        });

        this.filteredAssignedDevices.map((item) => {
            if (item.deviceId == device.deviceId) {
                item.hidden = showHide;
            }
        });

        const shownDevicesCount = this.filteredAssignedDevices.filter(
            (device) => !device.hidden
        ).length;
        const column = this.columns.find((col) => col.name == 'hidden');
        column.iconUrl =
            shownDevicesCount == 0
                ? column.activeValueIconUrl
                : column.inactiveValueIconUrl;
    }

    showHideUnassignedDevice(event, device) {
        event.preventDefault();
        event.stopPropagation();

        var showHide = !device.hidden;

        if (showHide && device.deviceId == this.focusedDeviceId)
            this.focusedDeviceId = 0;

        this.driverLocations.map((item) => {
            if (item.deviceId == device.deviceId) {
                item.hidden = showHide;
            }
        });

        this.gpsUnassignedData.map((item) => {
            if (item.deviceId == device.deviceId) {
                item.hidden = showHide;
            }
        });

        this.filteredUnassignedDevices.map((item) => {
            if (item.deviceId == device.deviceId) {
                item.hidden = showHide;
            }
        });

        const shownDevicesCount = this.filteredUnassignedDevices.filter(
            (device) => !device.hidden
        ).length;
        const column = this.columns.find((col) => col.name == 'hidden');
        column.iconUrl =
            shownDevicesCount == 0
                ? column.activeValueIconUrl
                : column.inactiveValueIconUrl;
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

    getUnassignedClusters() {
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

        // this.telematicService.getUnassignedClusters(
        //     clustersObject.northEastLatitude,
        //     clustersObject.northEastLongitude,
        //     clustersObject.southWestLatitude,
        //     clustersObject.southWestLongitude,
        //     clustersObject.zoomLevel,
        //     null,
        //     null,
        //     null,
        //     null,
        //     null,
        //     null,
        //     null
        // )
        // .pipe(takeUntil(this.destroy$))
        // .subscribe((clustersResponse: any) => {
        // });

        this.companyOfficeService
            .getOfficeClusters(
                clustersObject.northEastLatitude,
                clustersObject.northEastLongitude,
                clustersObject.southWestLatitude,
                clustersObject.southWestLongitude
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

    calculateDistanceBetweenDevices(device1, device2) {
        // const firstAddress = new google.maps.LatLng(
        //     device1.latitude,
        //     device1.longitude
        // );
        // const secondAddress = new google.maps.LatLng(
        //     device2.latitude,
        //     device2.longitude
        // );

        // let distance = google.maps.geometry.spherical.computeDistanceBetween(
        //     firstAddress,
        //     secondAddress
        // );

        // // moving - distance = 5km, stopped - distance = 50m

        // return distance;

        return 0;
    }

    showHideAllDevices() {
        const shownDevicesCount =
            this.filteredAssignedDevices.filter((device) => !device.hidden)
                .length +
            this.filteredUnassignedDevices.filter((device) => !device.hidden)
                .length;
        const hideDevices = shownDevicesCount > 0 ? true : false;

        this.filteredAssignedDevices.map((item) => {
            item.hidden = hideDevices;

            if (hideDevices && item.deviceId == this.focusedDeviceId)
                this.focusedDeviceId = 0;

            let item2 = this.gpsAssignedData.find(
                (gpsData) => item.deviceId == gpsData.deviceId
            );
            if (item2) item2.hidden = hideDevices;

            let item3 = this.driverLocations.find(
                (data) => item.deviceId == data.deviceId
            );
            if (item3) item3.hidden = hideDevices;
        });

        this.filteredUnassignedDevices.map((item) => {
            item.hidden = hideDevices;

            if (hideDevices && item.deviceId == this.focusedDeviceId)
                this.focusedDeviceId = 0;

            let item2 = this.gpsUnassignedData.find(
                (gpsData) => item.deviceId == gpsData.deviceId
            );
            if (item2) item2.hidden = hideDevices;

            let item3 = this.driverLocations.find(
                (data) => item.deviceId == data.deviceId
            );
            if (item3) item3.hidden = hideDevices;
        });

        const column = this.columns.find((col) => col.name == 'hidden');
        column.iconUrl = hideDevices
            ? column.activeValueIconUrl
            : column.inactiveValueIconUrl;
    }

    assignUnitFromMarker(item) {
        this.showHideUnassigned(true);
        this.showTruckDropdown(item);
    }

    sortByColumn(column) {
        this.sortColumn = column;
        this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';
        this.filteredAssignedDevices.sort((a, b) => {
            if (this.sortDirection == 'asc') {
                if (a[column.value] < b[column.value]) {
                    return 1;
                }
                if (a[column.value] > b[column.value]) {
                    return -1;
                }
                return 0;
            } else {
                if (a[column.value] < b[column.value]) {
                    return -1;
                }
                if (a[column.value] > b[column.value]) {
                    return 1;
                }
                return 0;
            }
        });
    }

    findLinkedDevices() {
        if (
            !this.filteredAssignedDevices.length ||
            !this.filteredUnassignedDevices.length
        )
            return;

        this.filteredAssignedDevices.map((device) => {
            let linkedDevice = this.filteredAssignedDevices.find(
                (device2) =>
                    device.truckNumber === device2.truckNumber &&
                    device.trailerNumber === device2.trailerNumber &&
                    device.deviceId != device2.deviceId
            );

            if (linkedDevice) {
                if (device.unitType == 1) {
                    device.linkedDevice = true;
                    device.trailerDeviceId = linkedDevice.deviceId;

                    const distance = this.calculateDistanceBetweenDevices(
                        device,
                        linkedDevice
                    );

                    const hideMarker =
                        (device.motionStatus == 'MOTION' && distance <= 5000) ||
                        (device.motionStatus !== 'MOTION' && distance <= 50);

                    linkedDevice.linkedDevice = true;
                    linkedDevice.hideLinkedDevice = true;
                    linkedDevice.truckDeviceId = device.deviceId;

                    let marker1 = this.driverLocations.find(
                        (marker) => device.deviceId == marker.deviceId
                    );

                    let marker2 = this.driverLocations.find(
                        (marker2) => linkedDevice.deviceId == marker2.deviceId
                    );

                    marker1.linkedDevice = true;
                    marker1.trailerDeviceId = marker2.deviceId;
                    marker2.linkedDevice = true;
                    marker2.truckDeviceId = marker1.deviceId;

                    if (hideMarker) {
                        marker2.hideLinkedDevice = true;
                    }

                    let gpsAssignedIndex = this.gpsAssignedData.findIndex(
                        (device3) => device3.deviceId === device.deviceId
                    );

                    if (gpsAssignedIndex > -1) {
                        this.gpsAssignedData[gpsAssignedIndex].linkedDevice =
                            true;
                        this.gpsAssignedData[gpsAssignedIndex].trailerDeviceId =
                            marker2.deviceId;
                    }

                    let gpsAssignedIndex2 = this.gpsAssignedData.findIndex(
                        (device4) => device4.deviceId === linkedDevice.deviceId
                    );

                    if (gpsAssignedIndex2 > -1) {
                        this.gpsAssignedData[gpsAssignedIndex2].linkedDevice =
                            true;
                        this.gpsAssignedData[
                            gpsAssignedIndex2
                        ].hideLinkedDevice = true;
                        this.gpsAssignedData[gpsAssignedIndex].truckDeviceId =
                            marker1.deviceId;
                    }

                    this.mapsService.markerUpdate(device);
                    this.mapsService.markerUpdate(linkedDevice);
                }
            }
        });
    }

    getStoreData() {
        const stateData: any = this.telematicQuery.getAll();
        const gpsData: any = JSON.parse(JSON.stringify(stateData[0]));
        const gpsUnassignedData: any = JSON.parse(JSON.stringify(stateData[1]));

        gpsData.data.map((data) => {
            data.speed = Math.round(data.speed);
            data.motionStatus =
                data.motionStatus === 1
                    ? 'MOTION'
                    : data.motionStatus === 2
                      ? 'SHORT_STOP'
                      : data.motionStatus === 3
                        ? 'EXTENDED_STOP'
                        : data.motionStatus === 4 || data.motionStatus === 5 // 5 == offline
                          ? 'PARKING'
                          : data.motionStatus;

            if (data.coordinates) {
                data.coordinates = data.coordinates.replace('-', '');
            }
        });

        this.gpsAssignedData = gpsData.data;

        gpsUnassignedData.data.map((data) => {
            data.speed = Math.round(data.speed);
            data.motionStatus =
                data.motionStatus === 1
                    ? 'MOTION'
                    : data.motionStatus === 2
                      ? 'SHORT_STOP'
                      : data.motionStatus === 3
                        ? 'EXTENDED_STOP'
                        : data.motionStatus === 4 || data.motionStatus === 5 // 5 == offline
                          ? 'PARKING'
                          : data.motionStatus;

            if (data.coordinates) {
                data.coordinates = data.coordinates.replace('-', '');
            }
        });

        this.gpsUnassignedData = gpsUnassignedData.data;

        var devicesArr = this.gpsUnassignedData.map((device) => {
            return {
                id: device.deviceId,
                name: device.deviceId,
                unitType: device.unitType,
            };
        });

        var trailerArr = devicesArr.filter((device) => device.unitType === 2);

        var truckArr = devicesArr.filter(
            (device) => !device.unitType || device.unitType === 1
        );

        this.trailerDevicesList = [...this.trailerDevicesList, ...trailerArr];
        this.gpsDevicesList = [...this.gpsDevicesList, ...truckArr];

        this.hasTrailerDevices =
            this.trailerDevicesList.length > 0 ? true : false;

        this.driverLocations = [
            ...this.driverLocations,
            ...gpsData.data,
            ...gpsUnassignedData.data,
        ];

        this.tableData[0].length = this.driverLocations.length;

        this.initDeviceFields();
        this.filterAssignedDevices();
        this.filterUnassignedDevices();
        this.getTrucks();
        this.getTrailers();
        this.findLinkedDevices();
    }

    ngOnDestroy(): void {
        this.telematicService.stopGpsConnection();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
