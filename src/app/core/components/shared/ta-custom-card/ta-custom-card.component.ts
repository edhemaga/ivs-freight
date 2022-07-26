import { FormControl } from '@angular/forms';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { card_modal_animation } from '../animations/card-modal.animation';
import { TaUploadFileService } from '../ta-upload-files/ta-upload-file.service';

@Component({
  selector: 'app-ta-custom-card',
  templateUrl: './ta-custom-card.component.html',
  styleUrls: ['./ta-custom-card.component.scss'],
  animations: [card_modal_animation('showHideCardBody')],
  encapsulation: ViewEncapsulation.None,
})
export class TaCustomCardComponent {
  @Input() animationsDisabled = true;
  @Input() bodyTemplate: string = 'modal'; //  'modal' | 'card'
  @Input() cardName: string = null;
  @Input() hasCounter: number;
  @Input() hasArrow: boolean = true;
  @Input() headerSvgEnabled: boolean = false;
  @Input() hasHeaderSvg: string = null;
  @Input() hasActionSvg: string = null;
  @Input() isCardOpen: boolean = false; // if has data, set on true
  @Input() hasDivider: boolean = true;
  @Input() hasLikeDislike: boolean = false;
  @Input() hasScrollBody: boolean = false;
  @Input() hasBodyData: boolean = true;
  @Input() isCommentData: boolean = false;
  @Input() hasCheckbox: boolean = false;
  @Input() tooltipName: string = '';
  @Input() hasPlusHeader: boolean = false;
  @Input() textBottomPossiton: string;
  @Input() hasWeeklyStatus: string = null;
  @Input() controlName: FormControl;
  @Input() stayOpen: boolean = false;
  @Input() disabledCard: boolean = false;
  @Input() customClassHeaderSvg: boolean = false;
  @Output() onActionEvent: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  @Output() onOpenCard: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  public zoneTriger: boolean = false;
  public isHeaderHover: boolean = false;

  constructor(private uploadFileService: TaUploadFileService) {}

  public isCardOpenEvent(event: any) {
    if (!this.disabledCard) {
      event.preventDefault();
      event.stopPropagation();
      if (this.hasBodyData) {
        this.isCardOpen = !this.isCardOpen;
      }
      this.zoneTriger = !this.zoneTriger;
      this.uploadFileService.visibilityDropZone(this.zoneTriger);
      this.onOpenCard.emit(this.isCardOpen);
    }
  }

  public onAdd(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.onActionEvent.emit(true);
  }
}
