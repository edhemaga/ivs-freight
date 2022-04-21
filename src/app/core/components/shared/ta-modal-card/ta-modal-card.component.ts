import { Component, EventEmitter, Input, Output } from '@angular/core';


import { card_modal_animation } from '../animations/card-modal.animation';

@Component({
  selector: 'app-ta-modal-card',
  templateUrl: './ta-modal-card.component.html',
  styleUrls: ['./ta-modal-card.component.scss'],
  animations: [card_modal_animation('showHideCardBody')]
})
export class TaModalCardComponent {

  @Input() hasCounter: number;
  @Input() hasArrow: boolean = true;
  @Input() hasAdd: boolean = false;
  @Input() cardSvg: string = null;
  @Input() cardName: string = null;
  @Input() isCardOpen: boolean = false;  // if has data, set on true

  @Output() onAddEvent: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  public onAdd(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.onAddEvent.emit(true);
  }

}
