import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-gps-progressbar',
    templateUrl: './gps-progressbar.component.html',
    styleUrls: ['./gps-progressbar.component.scss'],
})
export class GpsProgressbarComponent implements OnInit {
    constructor() {}

    currentPosition: number = 50;
    currentStopHovered: boolean = false;
    currentStop: any = {
        type: 'currentStop',
        position: 50,
        location: 'Philadelphia, PA'
    };
    gpsTitle: string = '128.4 mi';

    gpsProgress: any = [
        {
            type: 'start',
            position: 0,
            location: 'Overland Park, KS',
        },
        {
            type: 'pickup',
            position: 10,
            location: 'Chicago, IL',
        },
        {
            type: 'pickup',
            position: 40,
            location: 'Los Angeles, CA',
        },
        {
            type: 'delivery',
            position: 60,
            location: 'New York, NY',
        },
        {
            type: 'delivery',
            position: 100,
            location: 'Miami, FL',
        },
    ];

    ngOnInit(): void {}

    hoverStop(stop: any) {
        this.gpsTitle = stop.location;
        this.currentStopHovered = stop.type == 'currentStop' ? true : false;
    }

    leaveStop() {
        this.gpsTitle = '128.4 mi';
        this.currentStopHovered = false;
    }
}
