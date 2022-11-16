import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import * as AppConst from 'src/app/const';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from '../../../services/shared/shared.service';
import { AppDispatchSignalrService } from '../../../services/dispatchboard/app-dispatchSignalr.service';

@Component({
    selector: 'app-dispatcher-gps-table',
    templateUrl: './dispatcher-gps-table.component.html',
    styleUrls: ['./dispatcher-gps-table.component.scss'],
    animations: [
        trigger('mapAnimation', [
            transition(':enter', [
                style({ height: 50 }),
                animate('200ms', style({ height: '*' })),
            ]),
            transition(':leave', [animate('250ms', style({ height: 0 }))]),
        ]),
    ],
})
export class DispatcherGpsTableComponent implements OnInit, OnDestroy {
    @Input() gpsFlag: any;
    @Input() gps: any;
    @Input() rowIndex: any;
    @Input() gps_expanded: any;
    @Input() truckId: any;
    @Output() setResizeGps = new EventEmitter();
    showMap = false;
    public styles = AppConst.GOOGLE_MAP_STYLES;
    mapRestrictions = {
        latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
        strictBounds: true,
    };
    mapPoints: any = [
        {
            Id: 544,
            PointType: 'pickup',
            PointOrder: 1,
            ShipperId: 26,
            ShipperName: 'SHIPER123',
            PointZip: '',
            PointCity: 'New York',
            PointAddress: 'New York, NY, USA',
            PointState: 'NY',
            PointCountry: 'US',
            PointDateTime: '2021-06-14T22:00:00',
            PointMileage: 360,
            PointMileageTotal: 360,
        },
        {
            Id: 545,
            PointType: 'delivery',
            PointOrder: 1,
            ShipperId: 47,
            ShipperName: 'LONG ITEM',
            PointZip: '32034',
            PointCity: 'Fernandina Beach',
            PointAddress:
                '94016 Woodbrier Cir, Fernandina Beach, FL 32034, USA',
            PointState: 'FL',
            PointCountry: 'US',
            PointDateTime: '2021-06-21T22:00:00',
            PointMileage: 150,
            PointMileageTotal: 510,
        },
        {
            Id: 546,
            PointType: 'pickup',
            PointOrder: 2,
            ShipperId: 27,
            ShipperName: 'SHIPP456',
            PointZip: '',
            PointCity: 'Chicago',
            PointAddress: 'Chicago, IL, USA',
            PointState: 'IL',
            PointCountry: 'US',
            PointDateTime: '2021-06-15T22:00:00',
            PointMileage: 250,
            PointMileageTotal: 760,
        },
        {
            Id: 547,
            PointType: 'delivery',
            PointOrder: 2,
            ShipperId: 55,
            ShipperName: 'STREETSHIPPER',
            PointZip: '',
            PointCity: 'Washington',
            PointAddress: '14th St NW, Washington, DC, USA',
            PointState: 'DC',
            PointCountry: 'US',
            PointDateTime: '2021-06-28T22:00:00',
            PointMileage: 300,
            PointMileageTotal: 1060,
        },
    ];
    agmMap: any;
    gpsData: any;
    private destroy$ = new Subject<void>();

    constructor(
        private sharedService: SharedService,
        private gpsDataService: AppDispatchSignalrService
    ) {}

    ngOnInit(): void {
        this.sharedService.emitOpenNote
            .pipe(takeUntil(this.destroy$))
            .subscribe((index) => {
                if (index == this.rowIndex) {
                    this.setResizeGpsMain(this.rowIndex);
                }
            });

        this.gpsDataService.currentgpsData
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
                data.filter((d) => {
                    if (d.truckId === this.truckId) {
                        this.gpsData = d;
                    }
                });
            });

        this.gpsDataService.currentgpsDataSingleItem
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
                if (data.truckId === this.truckId) {
                    this.gpsData = data;
                }
            });
    }

    public getMapInstance(map) {
        this.agmMap = map;
    }

    public setResizeGpsMain(indx: number): void {
        this.showMap = false;
        setTimeout(() => {
            this.setResizeGps.emit(indx);
        }, 400);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
