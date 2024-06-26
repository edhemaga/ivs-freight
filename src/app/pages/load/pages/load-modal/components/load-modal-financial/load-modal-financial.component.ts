import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Animations
import { cardModalAnimation } from '@shared/animations/card-modal.animation';

//Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { LoadModalHelper } from '../../utils/helpers/load-modal.helper';

//Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

//Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-load-modal-financial',
    templateUrl: './load-modal-financial.component.html',
    styleUrls: ['./load-modal-financial.component.scss'],
    animations: [cardModalAnimation('showHideCardBody')],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,
    ],
})
export class LoadModalFinancialComponent implements OnChanges {
    @Input() firstHeaderTitle: string;
    @Input() secondHeaderTitle: string;
    @Input() thirdHeaderTitle: string;
    @Input() billing: string;
    @Input() adjusted: number;
    @Input() payment: string;
    @Input() tonu: string;
    @Input() baseRate: string;
    @Input() revised: string;
    @Input() disableBillAction: boolean = false;
    @Input() disablePaymentAction: boolean = false;
    @Input() set isCardOpen(value: boolean) {
        this.noActive = value ? 'active' : 'innactive';
        this._isCardOpen = value;
    }
    @Input() disableAnimation: boolean = false;
    @Input() animationMarginParams = {
        marginTop: '12px',
        marginBottom: '12px',
    };
    @Input() hasScrollBody: boolean = false;
    @Input() hasDivider: boolean = true;

    @Output('action') onActionEvent: EventEmitter<{
        type: string;
        action: boolean;
    }> = new EventEmitter<{ type: string; action: boolean }>();

    public _isCardOpen: any = 'null';
    public noActive: string;
    public zoneTriger: boolean = false;

    public paymentDifference: number = 0;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.payment?.currentValue !== changes.payment?.previousValue) {
            const pay = MethodsCalculationsHelper.convertThousanSepInNumber(
                changes.payment?.currentValue.substring(1)
            );

            const bill = MethodsCalculationsHelper.convertThousanSepInNumber(
                this.billing.substring(1)
            );

            this.paymentDifference = pay - bill;
        }
    }

    public onAction(event: any, action: string) {
        switch (action) {
            case 'first-header-action': {
                this.onActionEvent.emit({ type: 'billing', action: true });
                break;
            }
            case 'second-header-action': {
                this.onActionEvent.emit({ type: 'payment', action: true });
                break;
            }
            case 'third-header-action': {
                event.preventDefault();
                event.stopPropagation();

                const oldNoActive = this.noActive;
                this.noActive = '';
                this._isCardOpen =
                    oldNoActive == 'innactive' ? true : !this._isCardOpen;
                this.zoneTriger = !this.zoneTriger;
                break;
            }
            default: {
                break;
            }
        }
    }

    public toNumber(value: string | number): number {
        return LoadModalHelper.toNumber(value);
    }
}
