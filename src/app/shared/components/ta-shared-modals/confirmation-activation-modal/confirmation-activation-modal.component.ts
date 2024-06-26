import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';

// Services
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// Models
import { ConfirmationActivation } from '@shared/components/ta-shared-modals/confirmation-activation-modal/models/confirmation-activation.model';
import { ConfirmationActivationModalSvgRoutes } from './utils/confirmation-activation-modal-svg-routes';

// Pipes
import { ConfirmationModalTitlePipe } from '@shared/components/ta-shared-modals/confirmation-activation-modal/pipes/confirmation-modal-title.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

@Component({
    selector: 'app-confirmation-activation-modal',
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        AngularSvgIconModule,

        // Components
        TaModalComponent,

        // Pipes
        ConfirmationModalTitlePipe,
        FormatDatePipe,
    ],
    templateUrl: './confirmation-activation-modal.component.html',
    styleUrls: ['./confirmation-activation-modal.component.scss'],
})
export class ConfirmationActivationModalComponent {
    @Input() editData: ConfirmationActivation;

    public confirmationImageRoutes = ConfirmationActivationModalSvgRoutes;

    constructor(
        private ngbActiveModal: NgbActiveModal,

        // services
        private confirmationActivationService: ConfirmationActivationService,
    ) { }

    public onModalAction(data: ConfirmationActivation): void {
        this.confirmationActivationService.setConfirmationActivationData(data);

        this.ngbActiveModal.close();
    }
}
