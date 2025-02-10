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
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// animations
import { collapseAnimation } from '@pages/load/pages/load-modal/utils/animations/collapse.animation';

// constants
import { LoadStatusStringEnum } from '@pages/load/pages/load-modal/components/load-modal-stop/enums/load-status-string.enum';
import { LoadModalConstants } from '@pages/load/pages/load-modal/utils/constants';

// SVG Routes
import { LoadModalSvgRoutes } from '@pages/load/pages/load-modal/utils/svg-routes/load-modal-svg-routes';

// enums
import { EGeneralActions } from '@shared/enums';
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
    @Input() state:
        | LoadStatusStringEnum.VALID
        | LoadStatusStringEnum.INVALID
        | LoadStatusStringEnum.STEP_INVALID_STATUS;
    @Input() animationMarginParams = LoadModalConstants.ANIMATION_MARGIN_PARAMS;
    @Input() isDestinationTab = false;
    @Input() isDragAndDropActive = false;
    @Input() stopFinished = false;
    @Input() appointment = false;
    @Input() legHours: string;
    @Input() legMinutes: string;
    @Input() waitTime: string;
    @Input() preventOpening: boolean;
    public loadModalSvgRoutes = LoadModalSvgRoutes;
    @Output('toggle') toggleEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    @Output('delete') deleteEvent: EventEmitter<void> =
        new EventEmitter<void>();

    public toggleStop(event: Event): void {
        if (!this.disabledCard && !this.preventOpening) {
            event.preventDefault();
            event.stopPropagation();
            this.toggleEvent.emit(this.isCardOpen);
        }
    }

    public deleteStop(): void {
        this.deleteEvent.emit();
    }

    public get legTime(): string {
        const prefix = !this.stopFinished ? '≈' : '';
        if (!this.legHours) {
            return ` | ${prefix} ${this.legMinutes}m`;
        }

        return ` | ${prefix} ${this.legHours}h ${this.legMinutes}m`;
    }
}
