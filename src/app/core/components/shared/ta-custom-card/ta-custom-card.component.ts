import { UntypedFormControl, FormsModule } from '@angular/forms';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// animations
import { card_modal_animation } from '../animations/card-modal.animation';

// services
import { TaUploadFileService } from '../ta-upload-files/ta-upload-file.service';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaCheckboxComponent } from '../ta-checkbox/ta-checkbox.component';
import { TaCounterComponent } from '../ta-counter/ta-counter.component';
import { PayrollStatusesComponent } from '../payroll-statuses/payroll-statuses.component';
import { TaLikeDislikeComponent } from '../ta-like-dislike/ta-like-dislike.component';
import { TaNoteContainerComponent } from '../ta-note/ta-note-container/ta-note-container.component';

@Component({
    selector: 'app-ta-custom-card',
    templateUrl: './ta-custom-card.component.html',
    styleUrls: ['./ta-custom-card.component.scss'],
    animations: [card_modal_animation('showHideCardBody')],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaCheckboxComponent,
        TaCounterComponent,
        PayrollStatusesComponent,
        TaLikeDislikeComponent,
        TaNoteContainerComponent,
    ],
})
export class TaCustomCardComponent {
    @ViewChild('noteContainer') noteContainer: any;

    @Input() animationsDisabled = true;
    @Input() bodyTemplate: string = 'modal'; //  'modal' | 'card'
    @Input() cardName: string = null;
    @Input() customClassHeaderSvg: boolean = false;
    @Input() capsulaText: string = null;
    @Input() hasCounter: number = -1;
    @Input() hasLeftCounter: number = -1;
    @Input() hasArrow: boolean = true;
    @Input() headerSvgEnabled: boolean = false;
    @Input() hasHeaderSvg: string = null;
    @Input() hasActionSvg: string = null;
    @Input() actionText: string = null;
    @Input() hasDivider: boolean = true;
    @Input() hasLikeDislike: boolean = false;
    @Input() hasScrollBody: boolean = false;
    @Input() hasScrollBodyXAxis: boolean = false;
    @Input() hasBodyData: boolean = true;
    @Input() hasCheckbox: boolean = false;
    @Input() hasPlusHeader: boolean = false;
    @Input() hasWeeklyStatus: string = null;
    @Input() hasDownload: string = null;
    @Input() customTextAction: string = null;
    @Input() hasDeleteAction: boolean = false;
    @Input() hasPayrollStatus: boolean = false;
    @Input() customClass: string;
    @Input() hasFormatTextActionButtons: boolean = false;

    @Input() controlName: UntypedFormControl;

    @Input() tooltipName: string = '';
    @Input() textBottomPossiton: string;
    @Input() stayOpen: boolean = false;
    @Input() disabledCard: boolean = false;
    @Input() disableMultipleReviews: boolean = false;
    @Input() animationMarginParams = {
        marginTop: '12px',
        marginBottom: '12px',
    };
    @Input() has24Hours: boolean = false;
    @Input() is24Hours: boolean = false;
    @Input() disableAnimation: boolean = false;
    @Input() set isCardOpen(value: boolean) {
        this.noActive = value ? 'active' : 'innactive';
        this._isCardOpen = value;
    }

    @Output() onActionEvent: EventEmitter<{ check: boolean; action: string }> =
        new EventEmitter<{ check: boolean; action: string }>(null);
    @Output() onOpenCard: EventEmitter<boolean> = new EventEmitter<boolean>(
        false
    );

    public zoneTriger: boolean = false;
    public isHeaderHover: boolean = false;
    public noActive: string = 'innactive';
    public _isCardOpen: string | boolean = 'null';

    constructor(private uploadFileService: TaUploadFileService) {}

    public isCardOpenEvent(event: any) {
        if (!this.disabledCard) {
            event.preventDefault();
            event.stopPropagation();

            if (this.noActive === 'innactive') {
                this.noActive = 'active';

                this._isCardOpen = true;
            } else {
                this.noActive = 'innactive';

                this._isCardOpen = false;
            }

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
            case 'add':
                this.onActionEvent.emit({ check: true, action: 'add' });

                break;
            case 'download':
                this.onActionEvent.emit({ check: true, action: 'download' });

                break;
            case 'custom':
                this.onActionEvent.emit({
                    check: true,
                    action: customTextAction,
                });

                break;
            case 'delete':
                this.onActionEvent.emit({ check: true, action: 'delete' });

                break;
            case 'hours-24':
                this.is24Hours = !this.is24Hours;
                this.onActionEvent.emit({
                    check: this.is24Hours,
                    action: 'hours-24',
                });

                break;
            default:
                break;
        }
    }
}
