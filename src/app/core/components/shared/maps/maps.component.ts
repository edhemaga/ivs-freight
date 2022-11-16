import {
    Component,
    OnInit,
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
import { UpdatedData } from '../model/shared/enums';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: [
        './maps.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MapsComponent implements OnInit {
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
    public sortBy: any;
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

    constructor(
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private mapsService: MapsService
    ) {}

    ngOnInit(): void {
        this.showHideMarkers();
        this.markersDropAnimation();
    }

    public getMapInstance(map) {
        this.agmMap = map;
    }

    clickedMarker(id) {
        this.viewData.map((data: any, index) => {
            if (data.isExpanded) {
                data.isExpanded = false;
            }

            if (data.isSelected && data.id != id) {
                data.isSelected = false;
            } else if (data.id == id) {
                data.isSelected = !data.isSelected;

                if (data.isSelected) {
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
    }

    mapClick(event) {
        this.viewData.map((data: any, index) => {
            if (data.isSelected) {
                data.isSelected = false;
                data.isExpanded = false;
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
}
