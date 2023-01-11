import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-gps-progressbar',
    templateUrl: './gps-progressbar.component.html',
    styleUrls: ['./gps-progressbar.component.scss'],
})
export class GpsProgressbarComponent implements OnInit {
    constructor() {}
    @Input() isDropdown: boolean = false;

    currentPosition: number = 50;
    mileageInfo: string = '226.3 mi';
    currentStop: any = {
        type: 'currentStop',
        position: 50,
        location: 'Philadelphia, PA',
        mileage: '',
    };
    gpsTitle: string = '128.4 mi';
    hoveredGpsIcon: boolean = false;
    gpsProgress: any = [
        {
            type: 'start',
            position: 0,
            location: 'Overland Park, KS',
            mileage: '305.7 mi ago',
        },
        {
            type: 'pickup',
            position: 10,
            location: 'Chicago, IL',
            mileage: '225.6 mi ago',
        },
        {
            type: 'pickup',
            position: 40,
            location: 'Los Angeles, CA',
            mileage: '50.7 mi ago',
        },
        {
            type: 'delivery',
            position: 60,
            location: 'New York, NY',
            mileage: 'in 20.8 mi',
        },
        {
            type: 'delivery',
            position: 100,
            location: 'Miami, FL',
            mileage: 'in 202.4 mi',
        },
    ];

    ngOnInit(): void {}

    hoverStop(stop: any) {
        this.gpsTitle = stop.location;
        this.mileageInfo = stop.mileage;
    }

    leaveStop() {
        this.gpsTitle = '128.4 mi';
        this.mileageInfo = '226.3 mi';
    }
}
