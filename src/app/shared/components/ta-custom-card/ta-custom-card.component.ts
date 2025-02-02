import { UntypedFormControl, FormsModule } from '@angular/forms';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// animations
import { cardModalAnimation } from '@shared/animations/card-modal.animation';

// services
import { TaUploadFileService } from '@shared/components/ta-upload-files/services/ta-upload-file.service';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Enums
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaPayrollStatusesComponent } from '@shared/components/ta-payroll-statuses/ta-payroll-statuses.component';
import { TaLikeDislikeComponent } from '@shared/components/ta-like-dislike/ta-like-dislike.component';
import { TaNoteContainerComponent } from '@shared/components/ta-note-container/ta-note-container.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-ta-custom-card',
    templateUrl: './ta-custom-card.component.html',
    styleUrls: ['./ta-custom-card.component.scss'],
    animations: [cardModalAnimation('showHideCardBody')],
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
        TaPayrollStatusesComponent,
        TaLikeDislikeComponent,
        TaNoteContainerComponent,
        TaAppTooltipV2Component,
    ],
})
export class TaCustomCardComponent implements OnInit {
    @ViewChild('noteContainer') noteContainer: any;
    @Input() cardHeight!: number;

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
    @Input() subText: string = null;
    @Input() subTextClass: string = null;
    @Input() hasDivider: boolean = true;
    @Input() hasDarkDivider: boolean = false;
    @Input() hasSmallDivider: boolean = false;
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
    @Input() isDropdownCard: boolean = false;
    @Input() isDropdownModalCard: boolean = false;
    @Input() isExtraLargeLayout: boolean = false;
    @Input() isDepartmentContactsCard: boolean = false;
    @Input() isContactsCard: boolean = false;

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
    @Input() reorderingSaveError: boolean = false;
    @Input() set isCardOpen(value: boolean) {
        this.noActive = value ? 'active' : 'innactive';
        this._isCardOpen = value;
    }
    @Input() hasHistoryButton: boolean = false;
    @Input() isFinishReorderingButtonVisible: boolean = false;
    @Input() isReorderingButtonVisible: boolean = false;
    @Input() hasXAxisBottomPadding: boolean = false;
    @Input() isInheritingParentSize: boolean = false;
    @Input() isGreyTextWhenDisabled: boolean = false;
    @Input() headerLightColor = false;
    @Input() isActionDisabled = false;

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

    ngOnInit(): void {
        if (this.isDropdownModalCard)
            this.animationMarginParams = {
                marginTop: '4px',
                marginBottom: '4px',
            };
    }

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
            case LoadModalStringEnum.REORDERING:
                this.onActionEvent.emit({
                    check: true,
                    action,
                });

                break;
            case LoadModalStringEnum.START_REORDER:
                this.onActionEvent.emit({
                    check: true,
                    action,
                });

                break;

            default:
                break;
        }
    }
}
