import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TaUploadFileService } from '../ta-upload-files/ta-upload-file.service';
import { card_component_animation } from '../animations/card-component.animations';

@Component({
  selector: 'app-ta-custom-card-v2',
  templateUrl: './ta-custom-card-v2.component.html',
  styleUrls: ['./ta-custom-card-v2.component.scss'],
  animations: [card_component_animation('showHideCardBody')],
  encapsulation: ViewEncapsulation.None,
})
export class TaCustomCardV2Component {
  @Input() animationsDisabled = true;
  @Input() bodyTemplate: string = 'modal'; //  'modal' | 'card'
  @Input() cardName: string = null;
  @Input() customClassHeaderSvg: boolean = false;
  @Input() hasCounter: number;
  @Input() hasArrow: boolean = true;
  @Input() headerSvgEnabled: boolean = false;
  @Input() headerSvgLike: string = null;
  @Input() hasDivider: boolean = true;
  @Input() hasScrollBody: boolean = false;
  @Input() hasBodyData: boolean = true;
  @Input() tooltipName: string = '';
  @Input() isCardOpen: boolean = false; // if has data, set on true
  @Input() stayOpen: boolean = false;
  @Input() disabledCard: boolean = false;
  @Input() counterBackgroundColor: string = '#4DB6A2';
  @Input() counterColor: string = '#FFFFFF';
  @Input() arrowIconSvg: string = 'assets/svg/common/ic_arrow_down_updated.svg';
  @Input() colorCardName: string = '#6C6C6C';
  @Input() fontSizeCardName: string = '18px';
  @Input() fontWeightName: string = '600';
  @Input() totalMiles: boolean;
  @Input() haveTimeDateLoad: boolean;
  @Input() departCounter: boolean;
  @Input() departBacgroudColor: string = '#E0F2E9';
  @Input() departColor: string = '#4DB6A2';
  @Input() totalMilesValue: number;
  @Input() totalMilesTime: any;
  @Input() totalWait: boolean;
  @Input() totalWaitTime: any;
  @Input() textBottomPossiton: string = '-1px';
  @Output() onActionEvent: EventEmitter<{ check: boolean; action: string }> =
    new EventEmitter<{ check: boolean; action: string }>(null);

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
}
