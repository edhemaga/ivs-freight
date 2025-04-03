import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { CaTabSwitchComponent } from 'ca-components';

// icon
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
        TaAppTooltipV2Component,
        CaTabSwitchComponent,
        AngularSvgIconModule,
        NgbModule,
    ],
})
export class TaPickupDeliveryComponent implements OnInit {
    @Input() customWidth: number = 340;
    showDetails: boolean = false;
    currentLoad: any;

    loadInfo = [
        {
            number: 107,
            name: 'KSKA FREIGHT, INCOMING',
            pickup: {
                count: 2,
                address: 'Phoenix, AZ',
                time: '05/09/23 05:30 PM',
            },
            delivery: {
                count: 3,
                address: 'Chicago, IL',
                time: '05/11/23 06:30 PM',
            },
            ref: 3578895,
            ammount: '$1,235.00',
            miles: '568.3 mi',
            contacts: [
                {
                    type: 'Broker',
                    name: 'RIM MOLDING',
                    phone: '77-55-888',
                    email: 'rim@gmail.com',
                },
                {
                    type: 'Contact',
                    name: 'Angelo Trotter',
                    phone: '76-55-688',
                    email: 'ang@gmail.com',
                },
            ],
            container: {
                name: 'Dry Goods',
                weight: '64,500 lbs',
            },
            message:
                'Lorem ipsum dolor sit amet, consetetur sadipscing elit ipsum dolor sit amet, conetur ipsum dolor sit amet, consetetur sadipscing elit sadipscing elit.',
        },
        {
            number: 108,
            name: 'KSKA FREIGHT, INCOMING',
            pickup: {
                count: 1,
                address: 'Chicago, IL',
                time: '05/12/23 05:30 PM',
            },
            delivery: {
                count: 4,
                address: 'Miami, FL',
                time: '05/14/23 09:30 PM',
            },
            ref: 1572896,
            ammount: '$2,235.00',
            miles: '782.3 mi',
            contacts: [
                {
                    type: 'Broker',
                    name: 'RIM MOLDING',
                    phone: '77-55-888',
                    email: 'rim@gmail.com',
                },
                {
                    type: 'Contact',
                    name: 'Angelo Trotter',
                    phone: '76-55-688',
                    email: 'ang@gmail.com',
                },
            ],
            container: {
                name: 'Dry Goods',
                weight: '64,500 lbs',
            },
            message: 'Test driver message',
        },
    ];

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

    changeTabs(_: any) {
        this.showDetails = false;
    }

    extendLoadInfo(load) {
        this.currentLoad = load;
        this.showDetails = true;
    }

    hideLoadInfo() {
        this.showDetails = false;
    }
}
