import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-load-card',
    templateUrl: './load-card.component.html',
    styleUrls: ['./load-card.component.scss'],
})
export class LoadCardComponent implements OnInit {
    card: any = [
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
            checked: true,
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
        {
            title: 'Mark Template',
            name: 'Walmart DC-13',
            miles: 329.5,
            pickup: 'Morton, MS',
            delivery: 'Decatur, GA',
        },
    ];

    constructor() {}

    ngOnInit(): void {}

    changeChatBox(e, indx) {
        this.card[indx].checked = e.target.checked;
    }
}
