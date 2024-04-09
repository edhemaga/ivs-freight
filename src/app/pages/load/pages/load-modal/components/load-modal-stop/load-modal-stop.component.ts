import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

// modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAppTooltipV2Component } from 'src/app/shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// animations
import { collapseAnimation } from '../../utils/animations/collapse.animation';

// constants
import { LoadStatusStringEnum } from './enums/load-status-string.enum';
import { LoadModalConstants } from '../../utils/constants/load-modal.constants';

@Component({
    selector: 'app-load-modal-stop',
    templateUrl: './load-modal-stop.component.html',
    styleUrls: ['./load-modal-stop.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSvgIconModule,

        // component
        TaAppTooltipV2Component,
    ],
    animations: [collapseAnimation],
})
export class LoadModalStopComponent {
    @Input() firstOrLast: boolean = false;
    @Input() isDelivery: boolean = false;
    @Input() stopNumber: number;
    @Input() shipper: string;
    @Input() shipperAddress: string;
    @Input() dateRange: string;
    @Input() timeRange: string;
    @Input() legMile: string;
    @Input() isEmptyLoad: boolean;
    @Input() disabledCard: boolean;
    @Input() shipperContact: {
        fullName: string;
        avatar: string;
    };
    @Input() isCardOpen: boolean;
    @Input() state: LoadStatusStringEnum.VALID | LoadStatusStringEnum.INVALID;
    @Input() animationMarginParams = LoadModalConstants.ANIMATION_MARGIN_PARAMS;

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
