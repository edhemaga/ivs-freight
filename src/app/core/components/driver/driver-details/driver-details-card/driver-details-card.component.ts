import { Component, Input, OnInit } from '@angular/core';
import { settings_card_animation } from './settings-card.animation';

@Component({
  selector: 'app-driver-details-card',
  templateUrl: './driver-details-card.component.html',
  styleUrls: ['./driver-details-card.component.scss'],
  animations: [settings_card_animation('openCloseBodyCard')]
})
export class DriverDetailsCardComponent implements OnInit {

  @Input() cardTemplate: string = null;
  @Input() cardName: string = null;
  @Input() cardCount: string = null;
  @Input() cardImg: boolean = false;
  @Input() data: any = null;
  @Input() hasLine: boolean = true; 

  public isCardOpen: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  public onCardOpen() {
    this.isCardOpen = !this.isCardOpen;
  }

}
