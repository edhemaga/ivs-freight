import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { card_modal_animation } from '../animations/card-modal.animation';

@Component({
  selector: 'app-ta-custom-card',
  templateUrl: './ta-custom-card.component.html',
  styleUrls: ['./ta-custom-card.component.scss'],
  animations: [card_modal_animation('showHideCardBody')],
  encapsulation: ViewEncapsulation.None,
})
export class TaCustomCardComponent {

  @Input() cardName: string = null;
  @Input() hasCounter: number;
  @Input() hasArrow: boolean = true;
  @Input() hasHeaderSvg: string = null;
  @Input() hasActionSvg: string = null;
  @Input() isCardOpen: boolean = false;  // if has data, set on true
  @Input() hasDivider: boolean = true;
  @Input() hasLikeDislike: boolean = false;
  @Input() hasScrollBody: boolean = false;
  @Input() tooltipName:string='';

  @Output() onActionEvent: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  public isCardOpenEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isCardOpen = !this.isCardOpen;
  }

  public onAdd(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.onActionEvent.emit(true);
  }
}
