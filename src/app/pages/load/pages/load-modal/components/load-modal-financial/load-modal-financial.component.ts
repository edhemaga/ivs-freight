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
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';

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
        TaCounterComponent
    ],
})
export class LoadModalFinancialComponent implements OnChanges {
    @Input() firstHeaderTitle: string;
    @Input() billingCount: number;
    @Input() secondHeaderTitle: string;
    @Input() paymentCount: number;
    @Input() thirdHeaderTitle: string;
    @Input() billing: string;
    @Input() set adjusted (value: number) {
        this._adjusted = value;
    };
    @Input() payment: string;
    @Input() tonu: number;
    @Input() baseRate: number;
    @Input() revised: number;
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
    public _adjusted: number;

    public paymentDifference: number = 0;
    public revisedDifference: number = 0;

    ngOnChanges(changes: SimpleChanges): void {
        const pay = MethodsCalculationsHelper.convertThousanSepInNumber(
            this.payment?.substring(1)
        );

        const bill = MethodsCalculationsHelper.convertThousanSepInNumber(
            this.billing?.substring(1)
        );
        if (this.tonu) {
            this.paymentDifference = pay - this.tonu;
        } else {
            this.paymentDifference = pay - bill;
        }

        if (this.revised) {
            this.revisedDifference =
                this.toNumber(bill) -
                this.toNumber(this.baseRate) +
                this.toNumber(this.revised);
            this.paymentDifference = pay - this.revisedDifference;
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
