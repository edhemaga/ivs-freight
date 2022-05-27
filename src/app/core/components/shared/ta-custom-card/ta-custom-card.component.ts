import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { card_modal_animation } from '../animations/card-modal.animation';
import { ModalService } from '../ta-modal/modal.service';

@Component({
  selector: 'app-ta-custom-card',
  templateUrl: './ta-custom-card.component.html',
  styleUrls: ['./ta-custom-card.component.scss'],
  animations: [card_modal_animation('showHideCardBody')],
  encapsulation: ViewEncapsulation.None,
})
export class TaCustomCardComponent {
  @Input()
  public animationsDisabled = true;

  @Input() bodyTemplate: string = 'modal'; //  'modal' | 'card'
  @Input() cardName: string = null;
  @Input() hasCounter: number;
  @Input() hasArrow: boolean = true;
  @Input() hasHeaderSvg: string = null;
  @Input() hasActionSvg: string = null;
  @Input() isCardOpen: boolean = false; // if has data, set on true
  @Input() hasDivider: boolean = true;
  @Input() hasLikeDislike: boolean = false;
  @Input() hasScrollBody: boolean = false;
  @Input() hasBodyData: boolean = true;
  @Input() isCommentData: boolean = false;
  @Input() tooltipName: string = '';
  @Input() hasPlusHeader:boolean=false;
  @Input() textBottomPossiton:string;
  @Input() hasWeeklyStatus:string=null;
  @Output() onActionEvent: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  public isHeaderHover: boolean = false;

  constructor(private modalService: ModalService){}



  public isCardOpenEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.hasBodyData) {
      this.isCardOpen = !this.isCardOpen;
    }
    this.modalService.documentsDropZoneSubject$.next(this.isCardOpen);
  }

  public onAdd(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.onActionEvent.emit(true);
  }
}
