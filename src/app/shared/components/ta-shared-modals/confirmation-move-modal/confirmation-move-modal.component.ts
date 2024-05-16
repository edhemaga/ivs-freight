import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';

// Services
import { ConfirmationMoveService } from '@shared/components/ta-shared-modals/confirmation-move-modal/services/confirmation-move.service';

// Models
import { ConfirmationMove } from '@shared/components/ta-shared-modals/confirmation-move-modal/models/confirmation-move.model';

// Pipes
import { ConfirmationMoveModalTitlePipe } from '@shared/components/ta-shared-modals/confirmation-move-modal/pipes/confirmation-move-modal-title.pipe';
import { ConfirmationMoveModalTextPipe } from '@shared/components/ta-shared-modals/confirmation-move-modal/pipes/confirmation-move-modal-text.pipe';

@Component({
    selector: 'app-confirmation-move-modal',
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        AngularSvgIconModule,

        // Components
        TaModalComponent,

        // Pipes
        ConfirmationMoveModalTitlePipe,
        ConfirmationMoveModalTextPipe,
    ],
    templateUrl: './confirmation-move-modal.component.html',
    styleUrls: ['./confirmation-move-modal.component.scss'],
})
export class ConfirmationMoveModalComponent {
    @Input() editData: ConfirmationMove;

    constructor(
        private confirmationMoveService: ConfirmationMoveService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    public onModalAction(data: ConfirmationMove): void {
        this.confirmationMoveService.setConfirmationMoveData(data);

        this.ngbActiveModal.close();
    }
}
