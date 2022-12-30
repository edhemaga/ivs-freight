import {
    Component,
    OnInit,
    OnDestroy,
    ViewEncapsulation,
    SecurityContext,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as AppConst from '../../../../const';
import { SignalRService } from './../../../services/dispatchboard/app-signalr.service';
import { MapsService } from '../../../services/shared/maps.service';
import { TelematicStateService } from '../state/telematic-state.service';
import { GpsServiceService } from '../../../../global/services/gps-service.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TruckTService } from '../../truck/state/truck.service';
import { TrailerTService } from '../../trailer/state/trailer.service';
import { TruckListResponse, TrailerListResponse } from 'appcoretruckassist';
import { DomSanitizer } from '@angular/platform-browser';

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
    styles = AppConst.GOOGLE_MAP_STYLES;
    mapRestrictions = {
        latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
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

    searchForm!: FormGroup;

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
    trailerUnits: any[] = [];
    selectedTruckUnit: any = {};
    selectedTrailerUnit: any = {};

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
            showMotionIcon: true,
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
            width: 124,
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
            placeholderText: 'ON',
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
            placeholderText: 'LOADED',
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
            inactiveValueIconUrl: 'assets/svg/common/telematics/ic_eye-open.svg',
            alwaysShown: true,
            showInRegularView: true,
            showInExpand: true,
        },
    ];

    showExpandedView: boolean = false;
    expandFinished: boolean = false;
    showManageDevice: boolean = false;
    gpsDevicesList: any[] = [];
    selectedDeviceUnit: any = {};

    deviceInputs: FormArray = this.formBuilder.array([]);
    filteredAssignedDevices: any[] = [];
    filteredUnassignedDevices: any[] = [];
    searchAssignedText: string = '';
    searchIsActive: boolean = false;
    searchUnassignedIsActive: boolean = false;

    columnsMenuOpen: boolean = false;
    columnsDropdownShown: boolean = false;
    columnCheckboxes: FormArray = this.formBuilder.array([]);

    focusedDeviceId: number = 0;
    regularViewColumnIndex: number = null;

    constructor(
        private signalRService: SignalRService,
        private mapsService: MapsService,
        private telematicService: TelematicStateService,
        private gpsService: GpsServiceService,
        private formBuilder: FormBuilder,
        private truckService: TruckTService,
        private trailerService: TrailerTService,
        private sanitizer: DomSanitizer,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.telematicService.startGpsConnection();
        this.addGpsListener();

        // this.driverLocations = [
        //     {
        //         latitude: 40.037375,
        //         longitude: -95.284267,
        //         heading: 45,
        //         deviceId: 1211211211,
        //         speed: 0,
        //         unitType: 'Truck',
        //         driver: 'Aleksandar Mitrovic',
        //         unitNumber: 115452,
        //         motionStatus: 'MOTION',
        //         headingString: 'WE',
        //         dispatchStatus: 'loaded',
        //         ignition: 'OFF',
        //         location: 'Lincoln County, Nevada USA',
        //         coordinates: '32° 18’ 23.1” N 122° 36’ 52.5” W'
        //     },
        //     {
        //         latitude: 29.108181,
        //         longitude: -104.738062,
        //         heading: 125,
        //         deviceId: 1221221221,
        //         speed: 73.68,
        //         unitType: 'Truck',
        //         driver: 'Luka Jovic',
        //         unitNumber: 115452,
        //         motionStatus: 'PARKING',
        //         headingString: 'SE',
        //         dispatchStatus: null,
        //         ignition: 'ON',
        //         location: 'Lincoln County, Nevada USA',
        //         coordinates: '32° 18’ 23.1” N 122° 36’ 52.5” W'
        //     },
        //     {
        //         latitude: 37.747531,
        //         longitude: -111.942789,
        //         heading: 277,
        //         deviceId: 1231231231,
        //         speed: 72.25,
        //         unitType: 'Trailer',
        //         unitNumber: 115452,
        //         motionStatus: 'SHORT_STOP',
        //         headingString: 'S',
        //         dispatchStatus: 'loaded',
        //         ignition: 'ON',
        //         location: 'Lincoln County, Nevada USA',
        //         coordinates: '32° 18’ 23.1” N 122° 36’ 52.5” W'
        //     },
        // ];
        // this.gpsAssignedData = this.driverLocations;

        // this.driverDestinations = [
        //     {
        //         latitude: 42.037375,
        //         longitude: -88.284267,
        //     },
        //     {
        //         latitude: 31.108181,
        //         longitude: -97.738062,
        //     },
        //     {
        //         latitude: 39.747531,
        //         longitude: -104.942789,
        //     },
        // ];

        this.getGpsData();
        this.getUnassignedGpsData();

        this.createSearchForm();
        this.getTrucks();
        this.getTrailers();
        this.initColumnsForm();
    }

    zoomChange(event) {
        this.mapZoom = event;
    }

    getMapInstance(map) {
        this.agmMap = map;

        var lineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            scale: 3,
        };

        this.routeLineOptions = new google.maps.Polyline({
            strokeColor: '#6C6C6C',
            strokeOpacity: 0,
            icons: [
                {
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '12px',
                },
            ],
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
            .getAllGpsData({})
            .pipe(takeUntil(this.destroy$))
            .subscribe((gpsData: any) => {
                console.log('getGpsData', gpsData);
                gpsData.data.map((data) => {
                    data.speed = Math.round(data.speed);
                });

                this.gpsAssignedData = gpsData.data;
                this.driverLocations = [
                    ...this.driverLocations,
                    ...gpsData.data,
                ];

                var devicesArr = this.gpsUnassignedData.map((device) => {
                    return { id: device.deviceId, name: device.deviceId };
                });

                this.gpsDevicesList = [...this.gpsDevicesList, ...devicesArr];

                this.initDeviceFields();
                this.filterAssignedDevices();
            });
    }

    getUnassignedGpsData() {
        this.telematicService
            .getUnassignedGpsData({})
            .pipe(takeUntil(this.destroy$))
            .subscribe((gpsData: any) => {
                console.log('getUnassignedGpsData', gpsData);
                gpsData.data.map((data) => {
                    data.speed = Math.round(data.speed);
                });

                this.gpsUnassignedData = gpsData.data;
                this.driverLocations = [
                    ...this.driverLocations,
                    ...gpsData.data,
                ];

                var devicesArr = this.gpsUnassignedData.map((device) => {
                    return { id: device.deviceId, name: device.deviceId };
                });

                this.gpsDevicesList = [...this.gpsDevicesList, ...devicesArr];

                this.filterUnassignedDevices();
            });
    }

    getDataByDeviceId(deviceId) {
        this.telematicService
            .getDeviceData(deviceId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((deviceData: any) => {
                console.log('getDataByDeviceId deviceData', deviceData);
                deviceData.transform =
                    'translate(-3309.177px, 10942px) rotate(' +
                    deviceData.heading +
                    'deg)';

                let driverIndex = this.driverLocations.findIndex(
                    (device) => device.deviceId === deviceId
                );

                if (driverIndex == -1) {
                    this.driverLocations.push(deviceData);
                } else {
                    this.driverLocations[driverIndex] = deviceData;
                }
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
                    console.log('truckUnit changes', changes.truckUnit);
                } else if (changes.trailerUnit) {
                    console.log('trailerUnit changes', changes.trailerUnit);
                } else if (changes.truckDeviceId) {
                    console.log('truckDeviceId changes', changes.truckDeviceId);
                } else if (changes.trailerDeviceId) {
                    console.log(
                        'trailerDeviceId changes',
                        changes.trailerDeviceId
                    );
                }
            });
    }

    assignDeviceToTruck(deviceId, truckId) {
        this.telematicService
            .assignDeviceToTruck({ deviceId: deviceId, truckId: truckId })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                console.log('assignDeviceToTruck res', res);
                this.getGpsData();
                this.getUnassignedGpsData();
            });
    }

    assignDeviceToTrailer(deviceId, trailerId) {
        this.telematicService
            .assignDeviceToTrailer({ deviceId: deviceId, trailerId: trailerId })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                console.log('assignDeviceToTrailer res', res);
                this.getGpsData();
                this.getUnassignedGpsData();
            });
    }

    assignDevicesToCompany(devices) {
        this.telematicService
            .assignDevicesToCompany(devices)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                console.log('assignDevicesToCompany res', res);
            });
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
        //this.mapsService.searchTextChanged('');
    }

    clearAssignedSearchInput() {
        this.searchForm.get('search').patchValue('');
        this.searchAssignedText = '';

        this.filterAssignedDevices();
    }

    handleInputSelect(event, type) {
        if (type == 'TRUCK') {
            this.selectedTruckUnit = event;
        } else {
            this.selectedTrailerUnit = event;
        }
    }

    saveTruckSelection(event, item) {
        if (event.action === 'cancel') {
            this.selectedTruckUnit = {};
            this.searchForm.get('truckUnit').patchValue(null);
        } else {
            this.assignDeviceToTruck(item.deviceId, event.data.id);
        }
        item.addTruckShown = false;
        //this.selectedTruckUnit = event;
    }

    saveTrailerSelection(event, item) {
        if (event.action === 'cancel') {
            this.selectedTrailerUnit = {};
            this.searchForm.get('trailerUnit').patchValue(null);
        } else {
            this.assignDeviceToTrailer(item.deviceId, event.data.id);
        }
    }

    getTrucks() {
        this.truckService
            .getTruckList(1, 1, 25)
            .pipe(takeUntil(this.destroy$))
            .subscribe((trucks: TruckListResponse) => {
                console.log('getTrucks', trucks);
                this.truckUnits = trucks.pagination.data.map((truck) => {
                    return {
                        id: truck.id,
                        name: truck.truckNumber,
                        logoName: truck.truckType.logoName,
                        folder: 'common',
                        subFolder: 'trucks',
                    };
                });
            });
    }

    getTrailers() {
        this.trailerService
            .getTrailers(1, 1, 25)
            .pipe(takeUntil(this.destroy$))
            .subscribe((trailers: TrailerListResponse) => {
                console.log('getTrailers', trailers);
                this.trailerUnits = trailers.pagination.data.map((trailer) => {
                    return {
                        id: trailer.id,
                        name: trailer.trailerNumber,
                        logoName: trailer.trailerType.logoName,
                        folder: 'common',
                        subFolder: 'trailers',
                    };
                });
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
        this.selectedDeviceUnit = event;

        if (type == 'truckDeviceId') {
            let truck = this.truckUnits.find(
                (truck) => truck.name === location.truckNumber
            );

            this.assignDeviceToTruck(this.selectedDeviceUnit.name, truck.id);
        } else {
            this.selectedTrailerUnit = event;
        }
    }

    saveDeviceSelection(event, location, column) {
        console.log('saveDeviceSelection event', event);
        console.log('saveDeviceSelection location', location);
        console.log('saveDeviceSelection column', column);
        // if (event.action === 'cancel') {
        //     this.selectedDeviceUnit = {};
        //     this.searchForm.get('truckUnit').patchValue(null);
        // } else {
        //     this.assignDeviceToTruck(item.deviceId, event.data.id);
        // }
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
                item?.driver?.includes(this.searchAssignedText) ||
                item?.location?.includes(this.searchAssignedText) ||
                item?.trailerNumber?.includes(this.searchAssignedText) ||
                item?.truckNumber?.includes(this.searchAssignedText)
        );

        console.log('filteredAssignedDevices', this.filteredAssignedDevices);
    }

    filterUnassignedDevices() {
        this.filteredUnassignedDevices = this.gpsUnassignedData.filter((item) =>
            item?.deviceId?.includes(this.searchUnassignedText)
        );

        console.log(
            'filteredUnassignedDevices',
            this.filteredUnassignedDevices
        );
    }

    onSearchAssigned() {
        if (this.searchAssignedText?.length >= 3) {
            this.searchIsActive = true;

            this.filterAssignedDevices();
            //this.highlightSearchedText();
        } else if (this.searchIsActive && this.searchAssignedText?.length < 3) {
            this.searchIsActive = false;
            this.searchAssignedText = '';

            this.filterAssignedDevices();
            //this.highlightSearchedText();
        }
    }

    onSearchUnassigned() {
        if (this.searchUnassignedText?.length >= 3) {
            this.searchUnassignedIsActive = true;

            this.filterUnassignedDevices();
            //this.highlightSearchedText();
        } else if (
            this.searchUnassignedIsActive &&
            this.searchUnassignedText?.length < 3
        ) {
            this.searchUnassignedIsActive = false;
            this.searchUnassignedText = '';

            this.filterUnassignedDevices();
            //this.highlightSearchedText();
        }
    }

    highlightSearchedText() {
        document
            .querySelectorAll<HTMLElement>('.column-text')
            .forEach((title: HTMLElement) => {
                var text = title.textContent;
                console.log('textContent', text);

                const regex = new RegExp(this.searchAssignedText, 'gi');
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
            .subscribe((gpsData: any) => {
                console.log('getGpsHistory gpsData', gpsData);
            });
    }

    showHideDevice(event, device) {
        event.preventDefault();
        event.stopPropagation();

        var showHide = !device.hidden;

        this.driverLocations.map((item) => {
            if ( item.deviceId == device.deviceId ) {
                item.hidden = showHide;
            }
        });

        this.gpsAssignedData.map((item) => {
            if ( item.deviceId == device.deviceId ) {
                item.hidden = showHide;
            }
        });

        this.filteredAssignedDevices.map((item) => {
            if ( item.deviceId == device.deviceId ) {
                item.hidden = showHide;
            }
        });
    }

    ngOnDestroy(): void {
        this.telematicService.stopGpsConnection();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
