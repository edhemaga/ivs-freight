import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

@Component({
    selector: 'app-load-stop',
    templateUrl: './load-stop.component.html',
    styleUrls: ['./load-stop.component.scss'],
    animations: [
        trigger('collapse', [
            state(
                'true',
                style({
                    height: '*',
                    overflow: 'visible',
                    opacity: '1',
                    'margin-top': '{{marginTop}}',
                    'margin-bottom': '{{marginBottom}}',
                }),
                {
                    params: {
                        marginTop: '{{marginTop}}',
                        marginBottom: '{{marginBottom}}',
                    },
                }
            ),
            state(
                'false',
                style({
                    height: '0px',
                    overflow: 'hidden',
                    opacity: '0',
                    'margin-top': '0px',
                    'margin-bottom': '0px',
                })
            ),
            transition('true <=> false', animate('.3s ease-in-out')),
        ]),
    ],
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
    @Input() state: 'valid' | 'invalid';

    @Input() animationMarginParams = {
        marginTop: '32px',
        marginBottom: '22px',
    };

    @Input() isCardOpen: boolean;

    @Output('toggle') toggleEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    @Output('delete') deleteEvent: EventEmitter<void> =
        new EventEmitter<void>();

    public toggleStop(event: any) {
        if (!this.disabledCard) {
            event.preventDefault();
            event.stopPropagation();

            this.isCardOpen = !this.isCardOpen;

            this.toggleEvent.emit(this.isCardOpen);
        }
    }

    public deleteStop() {
        this.deleteEvent.emit();
    }
}
