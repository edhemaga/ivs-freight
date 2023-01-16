import { Component, Input, Output, EventEmitter } from '@angular/core';
import { card_modal_animation } from '../../../shared/animations/card-modal.animation';

@Component({
    selector: 'app-load-stop',
    templateUrl: './load-stop.component.html',
    styleUrls: ['./load-stop.component.scss'],
    animations: [card_modal_animation('showHideCardBody')],
})
export class LoadStopComponent {
    @Input() firstOrLast: boolean = false;
    @Input() isDelivery: boolean = false;
    @Input() stopNumber: number;
    @Input() shipper: string;
    @Input() shipperAddress: string;
    @Input() dateRange: any;
    @Input() timeRange: any;
    @Input() legMile: string;
    @Input() isEmptyLoad: boolean;
    @Input() disabledCard: boolean;
    @Input() shipperContact: {
        fullName: string;
        avatar: string;
    };

    @Input() animationMarginParams = {
        marginTop: '32px',
        marginBottom: '22px',
    };

    _isCardOpen: any = 'null';
    noActive: string;
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('isOpen') set isCardOpen(value: boolean) {
        this.noActive = value ? 'active' : 'innactive';
        this._isCardOpen = value;
    }

    @Output('toggle') toggleEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    @Output('delete') deleteEvent: EventEmitter<void> =
        new EventEmitter<void>();

    public toggleStop() {
        if (!this.disabledCard) {
            const oldNoActive = this.noActive;
            this.noActive = '';
            this._isCardOpen =
                oldNoActive == 'innactive' ? true : !this._isCardOpen;
            this.toggleEvent.emit(this._isCardOpen);
        }
    }

    public deleteStop() {
        this.deleteEvent.emit();
    }
}
