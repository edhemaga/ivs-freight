import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { card_modal_animation } from '../../../shared/animations/card-modal.animation';

export interface IBilling {
    baseRate: number;
    adjusted: number;
    advance: number;
    layover: number;
    lumper: number;
    fuelSurcharge: number;
    escort: number;
    detention: number;
}

export interface IPayment {
    advance: number;
    paidInFull: number;
    shortPaid: [
        {
            id: number;
            value: number;
        }
    ];
}

@Component({
    selector: 'app-load-financial',
    templateUrl: './load-financial.component.html',
    styleUrls: ['./load-financial.component.scss'],
    animations: [card_modal_animation('showHideCardBody')],
    encapsulation: ViewEncapsulation.None,
})
export class LoadFinancialComponent {
    @Input() firstHeaderTitle: string;
    @Input() secondHeaderTitle: string;
    @Input() thirdHeaderTitle: string;
    @Input() billing: number;
    @Input() adjusted: number;
    @Input() payment: IPayment;
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
