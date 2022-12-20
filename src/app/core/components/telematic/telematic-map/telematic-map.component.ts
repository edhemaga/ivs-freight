import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as AppConst from '../../../../const';
import { SignalRService } from './../../../services/dispatchboard/app-signalr.service';
import { MapsService } from '../../../services/shared/maps.service';
import { TelematicStateService } from '../state/telematic-state.service';
import { GpsServiceService } from '../../../../global/services/gps-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TruckTService } from '../../truck/state/truck.service';
import { TruckListResponse } from 'appcoretruckassist';

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
    selectedTruckUnit: any = {};

    constructor(
        private signalRService: SignalRService,
        private mapsService: MapsService,
        private telematicService: TelematicStateService,
        private gpsService: GpsServiceService,
        private formBuilder: FormBuilder,
        private truckService: TruckTService
    ) {}

    ngOnInit(): void {
        this.telematicService.startGpsConnection();
        this.gpsService.gpsStatusChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                let driverIndex = this.driverLocations.findIndex(
                    (device) => device.deviceId === data.deviceId
                );

                if (driverIndex == -1) {
                    this.driverLocations.push(data);
                } else {
                    this.driverLocations[driverIndex] = data;
                    console.log(
                        'update device',
                        this.driverLocations[driverIndex]
                    );
                }
            });

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

    markerClick(index) {
        this.driverLocations.map((location, i) => {
            if (i == index) {
                location.isFocused = !location.isFocused;
            } else {
                location.isFocused = false;
            }
        });
    }

    getGpsData() {
        this.telematicService
            .getAllGpsData({})
            .pipe(takeUntil(this.destroy$))
            .subscribe((gpsData: any) => {
                console.log('getGpsData', gpsData);
                this.gpsAssignedData = gpsData.data;
                this.driverLocations = [
                    ...this.driverLocations,
                    ...gpsData.data,
                ];
                console.log('driverLocations', this.driverLocations);
            });
    }

    getUnassignedGpsData() {
        this.telematicService
            .getUnassignedGpsData({})
            .pipe(takeUntil(this.destroy$))
            .subscribe((gpsData: any) => {
                console.log('getUnassignedGpsData', gpsData);
                this.gpsUnassignedData = gpsData.data;
                this.driverLocations = [
                    ...this.driverLocations,
                    ...gpsData.data,
                ];
                console.log('driverLocations', this.driverLocations);
                // var deviceIds = { ids: [1275164307,
                //     1275164387,
                //     1275164311] };
                // // deviceIds.ids = this.gpsUnassignedData.map((device) => {
                // //     return parseInt(device.deviceId);
                // // });
                // console.log('deviceIds', deviceIds);
                // this.assignDevicesToCompany(deviceIds);
                // this.assignDeviceToTruck(this.gpsUnassignedData[0].deviceId, 1);
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
        });

        this.searchForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                console.log('search input changes', changes);
                if (changes.search) {
                } else if (changes.searchUnassigned) {
                    this.searchUnassignedText = changes.searchUnassigned;
                } else if (changes.truckUnit) {
                    console.log('truckUnit changes', changes.truckUnit);
                }
            });
    }

    assignDeviceToTruck(deviceId, truckId) {
        console.log('assignDeviceToTruck', deviceId, truckId);
        this.telematicService
            .assignDeviceToTruck({ deviceId: deviceId, truckId: truckId })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                console.log('assignDeviceToTruck res', res);
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
        console.log('onToolBarAction event', event);
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

    clearSearchInput() {
        this.searchForm.get('searchUnassigned').patchValue('');
        this.searchUnassignedText = '';
        //this.mapsService.searchTextChanged('');
    }
    
    handleInputSelect(event, item) {
        console.log('handleInputSelect', event, item);
        this.selectedTruckUnit = event;
    }

    saveTruckSelection(event, item) {
        console.log('saveTruckSelection', event, item);
        if ( event.action === 'cancel' ) {
            this.selectedTruckUnit = {};
            this.searchForm.get('truckUnit').patchValue(null);
        } else {
            this.assignDeviceToTruck(item.deviceId, event.data.id);
        }
        item.addTruckShown = false;
        //this.selectedTruckUnit = event;
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
                        logoName: 'ic_truck',
                        folder: 'common',
                        subFolder: 'violation-details',
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

    ngOnDestroy(): void {
        this.telematicService.stopGpsConnection();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
