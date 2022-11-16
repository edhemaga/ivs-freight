import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-repair-card',
    templateUrl: './repair-card.component.html',
    styleUrls: ['./repair-card.component.scss'],
})
export class RepairCardComponent implements OnInit {
    repairCard: any[] = [
        {
            unit: '#74958',
            shop: 'NEXTRAN TRUCK CENTERS',
            date: '04/02/22',
            cost: 2480.0,
        },
        {
            unit: '#49641',
            shop: 'IVS Truck Repair Inc',
            date: '08/01/22',
            cost: 12723.1,
        },
        {
            unit: '#34952',
            shop: 'ARMEN’S TIRE AND SERVICE',
            date: '08/09/22',
            cost: 1181.41,
            finish: true,
        },
        {
            unit: '#74958',
            shop: 'NEXTRAN TRUCK CENTERS',
            date: '04/02/22',
            cost: 2480.0,
        },
        {
            unit: '#74958',
            shop: 'NEXTRAN TRUCK CENTERS',
            date: '04/02/22',
            cost: 2480.0,
        },
        {
            unit: '#74958',
            shop: 'NEXTRAN TRUCK CENTERS',
            date: '04/02/22',
            cost: 2480.0,
        },
        {
            unit: '#74958',
            shop: 'NEXTRAN TRUCK CENTERS',
            date: '04/02/22',
            cost: 2480.0,
            finish: true,
        },
        {
            unit: '#74958',
            shop: 'NEXTRAN TRUCK CENTERS',
            date: '04/02/22',
            cost: 2480.0,
        },
        {
            unit: '#74958',
            shop: 'NEXTRAN TRUCK CENTERS',
            date: '04/02/22',
            cost: 2480.0,
        },
    ];

    constructor() {}

    ngOnInit(): void {}

    changeChatBox(e, indx) {
        this.repairCard[indx].checked = e.target.checked;
    }
}
