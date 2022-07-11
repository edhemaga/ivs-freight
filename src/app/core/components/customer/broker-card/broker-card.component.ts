import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-broker-card',
  templateUrl: './broker-card.component.html',
  styleUrls: ['./broker-card.component.scss'],
})
export class BrokerCardComponent implements OnInit {
  brokerCard: any[] = [
    {
      title: 'IVS FREIGHT INC',
      phone: '(123) 456-7890',
      boxFirst: 16,
      boxSecond: 4,
      invoice: 'Invoice Ageing',
      price: 32946.0,
      checked: true,
    },
    {
      title: 'COMAX TRADE',
      phone: '(123) 456-7890',
      boxFirst: 35,
      boxSecond: 2,
      invoice: 'Invoice Ageing',
      price: 154364.74,
    },
    {
      title: 'WATCO SUPPLY CHAINGER',
      phone: '(123) 456-7890',
      boxFirst: 0,
      boxSecond: 14,
      invoice: 'Invoice Ageing',
      price: 541431.76,
    },
    {
      title: 'R2 LOGISTICS',
      phone: '(123) 456-7890',
      boxFirst: 45,
      boxSecond: 8,
      invoice: 'Invoice Ageing',
      price: 87618.73,
    },
    {
      title: 'BECKER LOGISTICS',
      phone: '(123) 456-7890',
      boxFirst: 45,
      boxSecond: 8,
      invoice: 'Invoice Ageing',
      price: 512614.0,
    },
    {
      title: 'EVERYONE ON TIME HAVE',
      phone: '(123) 456-7890',
      boxFirst: 0,
      boxSecond: 0,
      invoice: 'Invoice Ageing',
      price: 0,
      inactive: true,
      iban: true,
    },
    {
      title: 'IVS FREIGHT INC',
      phone: '(123) 456-7890',
      boxFirst: 16,
      boxSecond: 4,
      invoice: 'Invoice Ageing',
      price: 32946.0,
    },
    {
      title: 'COMAX TRADE',
      phone: '(123) 456-7890',
      boxFirst: 35,
      boxSecond: 2,
      invoice: 'Invoice Ageing',
      price: 154364.74,
    },
    {
      title: 'WATCO SUPPLY CHAINGER',
      phone: '(123) 456-7890',
      boxFirst: 0,
      boxSecond: 14,
      invoice: 'Invoice Ageing',
      price: 541431.76,
    },
    {
      title: 'R2 LOGISTICS',
      phone: '(123) 456-7890',
      boxFirst: 45,
      boxSecond: 8,
      invoice: 'Invoice Ageing',
      price: 87618.73,
    },
    {
      title: 'BECKER LOGISTICS',
      phone: '(123) 456-7890',
      boxFirst: 45,
      boxSecond: 8,
      invoice: 'Invoice Ageing',
      price: 512614.0,
      ban: true,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  changeChatBox(e, indx) {
    this.brokerCard[indx].checked = e.target.checked;
  }
}
