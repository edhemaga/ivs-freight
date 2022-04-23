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
  @Input() cardName: string = null;
  @Input() hasArrow: boolean = true;
  
  @Input() headerSvg: string = null;
  @Input() actionSvg: string = null;
  @Input() isCardOpen: boolean = false;  // if has data, set on true

  @Output() onActionEvent: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  public onAdd(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.onActionEvent.emit(true);
  }

}
