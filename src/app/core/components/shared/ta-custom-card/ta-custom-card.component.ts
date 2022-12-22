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
    @Input() customClassHeaderSvg: boolean = false;
    @Input() capsulaText: string = null;
    @Input() hasCounter: number = -1;
    @Input() hasArrow: boolean = true;
    @Input() headerSvgEnabled: boolean = false;
    @Input() hasHeaderSvg: string = null;
    @Input() hasActionSvg: string = null;
    @Input() actionText: string = null;
    @Input() hasDivider: boolean = true;
    @Input() hasLikeDislike: boolean = false;
    @Input() hasScrollBody: boolean = false;
    @Input() hasBodyData: boolean = true;
    @Input() hasCheckbox: boolean = false;
    @Input() hasPlusHeader: boolean = false;
    @Input() hasWeeklyStatus: string = null;
    @Input() hasDownload: string = null;
    @Input() customTextAction: string = null;
    @Input() hasDeleteAction: boolean;
    @Input() hasPayrollStatus: boolean;

    @Input() controlName: FormControl;

    @Input() tooltipName: string = '';

    _isCardOpen: any = 'null';
    noActive: string;

    @Input() set isCardOpen(value: boolean) {
        this.noActive = value ? 'active' : 'innactive';
        this._isCardOpen = value;
    }

    @Input() isCommentData: boolean = false;
    @Input() textBottomPossiton: string;

    @Input() stayOpen: boolean = false;
    @Input() disabledCard: boolean = false;

    @Input() disableMultipleReviews: boolean = false;

    @Input() animationMarginParams = {
        marginTop: '12px',
        marginBottom: '12px',
    };

    @Input() has24Hours: boolean = false;

    @Input() disableAnimation: boolean = false; // forward true for disable

    @Output() onActionEvent: EventEmitter<{ check: boolean; action: string }> =
        new EventEmitter<{ check: boolean; action: string }>(null);

    @Output() onOpenCard: EventEmitter<boolean> = new EventEmitter<boolean>(
        false
    );

    public zoneTriger: boolean = false;
    public isHeaderHover: boolean = false;

    public is24Hours: boolean = false;

    constructor(private uploadFileService: TaUploadFileService) {}

    public isCardOpenEvent(event: any) {
        if (!this.disabledCard) {
            event.preventDefault();
            event.stopPropagation();

            const oldNoActive = this.noActive;
            this.noActive = '';
            this._isCardOpen =
                oldNoActive == 'innactive' ? true : !this._isCardOpen;
            this.zoneTriger = !this.zoneTriger;
            this.uploadFileService.visibilityDropZone(this.zoneTriger);
            this.onOpenCard.emit(this._isCardOpen);
        }
    }

    public onAction(
        event: any,
        action: string,
        customTextAction?: string
    ): void {
        event.preventDefault();
        event.stopPropagation();
        switch (action) {
            case 'add': {
                this.onActionEvent.emit({ check: true, action: 'add' });
                break;
            }
            case 'download': {
                this.onActionEvent.emit({ check: true, action: 'download' });
                break;
            }
            case 'custom': {
                this.onActionEvent.emit({
                    check: true,
                    action: customTextAction,
                });
                break;
            }
            case 'delete': {
                this.onActionEvent.emit({ check: true, action: 'delete' });
                break;
            }
            case 'hours-24': {
                this.is24Hours = !this.is24Hours;
                this.onActionEvent.emit({
                    check: this.is24Hours,
                    action: 'hours-24',
                });
                break;
            }
            default: {
                break;
            }
        }
    }
}
