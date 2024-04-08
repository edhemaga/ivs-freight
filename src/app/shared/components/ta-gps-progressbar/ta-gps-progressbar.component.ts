import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaMapsComponent } from '../ta-maps/ta-maps.component';

@Component({
    selector: 'app-ta-gps-progressbar',
    templateUrl: './ta-gps-progressbar.component.html',
    styleUrls: ['./ta-gps-progressbar.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        ReactiveFormsModule,
        NgbModule,
        TaMapsComponent,
    ],
})
export class TaGpsProgressbarComponent implements OnInit {
    constructor() {}
    @Input() isDropdown: boolean = false;

    currentPosition: number = 30;
    mileageInfo: string = '226.3 mi';
    currentStop: any = {
        type: 'currentStop',
        position: 30,
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
            time: '05/09/21 04:00 PM',
        },
        {
            type: 'pickup',
            position: 40,
            location: 'Chicago, IL',
            mileage: '225.6 mi ago',
            time: '05/09/21 07:00 PM',
        },
        {
            type: 'delivery',
            position: 100,
            location: 'Los Angeles, CA',
            mileage: '50.7 mi ago',
            time: '05/09/21 11:00 PM',
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

    showDropdown(t2: any) {
        t2.open();
    }
}
