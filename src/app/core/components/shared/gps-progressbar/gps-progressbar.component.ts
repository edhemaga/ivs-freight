import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-gps-progressbar',
    templateUrl: './gps-progressbar.component.html',
    styleUrls: ['./gps-progressbar.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, AngularSvgIconModule, ReactiveFormsModule],
})
export class GpsProgressbarComponent implements OnInit {
    constructor() {}

    currentPosition: number = 50;

    gpsProgress: any = [
        {
            type: 'start',
            position: 0,
        },
        {
            type: 'pickup',
            position: 10,
        },
        {
            type: 'pickup',
            position: 40,
        },
        {
            type: 'delivery',
            position: 60,
        },
        {
            type: 'delivery',
            position: 100,
        },
    ];

    ngOnInit(): void {}
}
