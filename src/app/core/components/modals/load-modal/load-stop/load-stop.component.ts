import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTooltipComponent } from '../../../standalone-components/app-tooltip/app-tooltip.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-load-stop',
    templateUrl: './load-stop.component.html',
    styleUrls: ['./load-stop.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSvgIconModule,

        // Component
        AppTooltipComponent,
    ],
    animations: [
        trigger('collapse', [
            state(
                'true',
                style({
                    height: '*',
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
        marginTop: '12px',
        marginBottom: '4px',
    };

    @Input() isCardOpen: boolean;

    @Output('toggle') toggleEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    @Output('delete') deleteEvent: EventEmitter<void> =
        new EventEmitter<void>();

    public toggleStop(event: Event): void {
        if (!this.disabledCard) {
            event.preventDefault();
            event.stopPropagation();

            this.isCardOpen = !this.isCardOpen;

            this.toggleEvent.emit(this.isCardOpen);
        }
    }

    public deleteStop(): void {
        this.deleteEvent.emit();
    }
}
