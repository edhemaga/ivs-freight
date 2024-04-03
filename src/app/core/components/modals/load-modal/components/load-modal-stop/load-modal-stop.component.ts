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
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';

// animations
import { collapseAnimation } from '../../state/utils/animations/collapse.animation';

// constants
import { ConstantStringEnum } from '../../state/enums/load-modal-stop.enum';
import { LoadModalConstants } from '../../state/utils/constants/load-modal.constants';

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
        AppTooltipComponent,
    ],
    animations: [collapseAnimation],
})
export class LoadStopComponent {
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
    @Input() state: ConstantStringEnum.VALID | ConstantStringEnum.INVALID;
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
