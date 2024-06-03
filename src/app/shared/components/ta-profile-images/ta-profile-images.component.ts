import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//  bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//  pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

//  components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-ta-profile-images',
    templateUrl: './ta-profile-images.component.html',
    styleUrls: ['./ta-profile-images.component.scss'],
    providers: [NameInitialsPipe],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaAppTooltipV2Component,
        NgbModule,
        NameInitialsPipe,
        ReactiveFormsModule,
    ],
})
export class TaProfileImagesComponent implements OnInit {
    textColors: string[] = [
        '#6D82C7',
        '#4DB6A2',
        '#E57373',
        '#E3B00F',
        '#BA68C8',
        '#BEAB80',
        '#81C784',
        '#FF8A65',
        '#64B5F6',
        '#F26EC2',
        '#A1887F',
        '#919191',
    ];

    imageColor: string[] = [
        '#2724D666',
        '#1AB5E666',
        '#259F9466',
        '#50AC2566',
        '#DF3C3C66',
        '#FF704366',
        '#9E47EC66',
        '#DF3D8566',
        '#F89B2E66',
        '#CF961D66',
        '#865E3A66',
        '#91919166',
    ];

    backgroundColors: string[] = [
        '#B7B6F1',
        '#B2E6F7',
        '#B6DFDB',
        '#C5E3B6',
        '#F4BEBE',
        '#FFCFC0',
        '#DFC2F9',
        '#F4BED6',
        '#FDDEB9',
        '#EFDCB4',
        '#D6C9BD',
        '#DADADA',
    ];

    @Input() indx: number;
    @Input() size: string;
    @Input() name: any;
    @Input() type: string = 'driver';
    @Input() showHoverAnimation: boolean = true;
    @Input() withTooltip: boolean = false;

    constructor() {}

    ngOnInit(): void {}
}
