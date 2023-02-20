import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-ta-pickup-delivery',
    templateUrl: './ta-pickup-delivery.component.html',
    styleUrls: ['./ta-pickup-delivery.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppTooltipComponent,
        TaTabSwitchComponent,
        AngularSvgIconModule
    ],
})
export class TaPickupDeliveryComponent implements OnInit {
    @Input() customWidth: number = 340;
    showDetails: boolean = false;

    pickupDeliveryTabs = [
        {
            name: 'Closed',
            counter: 5,
        },
        {
            name: 'Active',
            checked: true,
        },
        {
            name: 'Pending',
        },
    ];

    constructor() {}

    ngOnInit(): void {}

    changeTabs(ev: any) {
        console.log('tab switch');
    }

    extendLoadInfo() {
        this.showDetails = true;
    }

    hideLoadInfo() {
        this.showDetails = false;
    }
}
