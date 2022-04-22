import { settings_card_animation } from './../../../settings/settings-shared/settings-animation/settings-card.animation';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-truck-details-card',
  templateUrl: './truck-details-card.component.html',
  styleUrls: ['./truck-details-card.component.scss'],
  animations:[settings_card_animation('openCloseBodyCard')]
})
export class TruckDetailsCardComponent implements OnInit {
  @Input() cardTemplate: string = null;
  @Input() cardName: string = null;
  @Input() cardCount: string = null;
  @Input() cardImg: boolean = false;
  @Input() data: any = null;
  @Input() hasLine: boolean = true; 

  public isCardOpen: boolean = true;

  public accountText: string = null;
  constructor() { }

  ngOnInit(): void {
  }

  public onCardOpen() {
    this.isCardOpen = !this.isCardOpen;
  }

}
