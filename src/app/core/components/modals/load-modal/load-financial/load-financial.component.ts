import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { card_modal_animation } from '../../../shared/animations/card-modal.animation';
import { convertThousanSepInNumber } from '../../../../utils/methods.calculations';

export interface IBilling {
    baseRate: number;
    layover: number;
    lumper: number;
    fuelSurcharge: number;
    escort: number;
    detention: number;
}

export interface IPayment {
    advance: number;
    paidInFull?: number;
    shortPaid?: [];
}

@Component({
    selector: 'app-load-financial',
    templateUrl: './load-financial.component.html',
    styleUrls: ['./load-financial.component.scss'],
    animations: [card_modal_animation('showHideCardBody')],
    encapsulation: ViewEncapsulation.None,
})
export class LoadFinancialComponent implements OnChanges {
    @Input() firstHeaderTitle: string;
    @Input() secondHeaderTitle: string;
    @Input() thirdHeaderTitle: string;
    @Input() billing: string;
    @Input() adjusted: number;
    @Input() payment: string;
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
            const pay = convertThousanSepInNumber(
                changes.payment?.currentValue.substring(1)
            );

            const bill = convertThousanSepInNumber(this.billing.substring(1));

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
}
