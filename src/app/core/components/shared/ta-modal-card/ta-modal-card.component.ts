import { Component, Input, OnInit } from '@angular/core';

import { card_modal_animation } from '../animations/card-modal.animation';

@Component({
  selector: 'app-ta-modal-card',
  templateUrl: './ta-modal-card.component.html',
  styleUrls: ['./ta-modal-card.component.scss'],
  animations: [card_modal_animation('showHideCardBody')]
})
export class TaModalCardComponent implements OnInit {

  @Input() hasCounter: boolean = false;
  @Input() hasArrow: boolean = true;
  @Input() cardSvg: string = null;
  @Input() cardName: string = null;
  
  public isCardOpen: boolean = false;

  constructor() { }

  ngOnInit() {}
}
