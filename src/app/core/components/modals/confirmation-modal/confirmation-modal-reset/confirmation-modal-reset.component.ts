import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';

// models
import { ConfirmationReset } from '../state/models/confirmation-reset.model';

// services
import { ConfirmationService } from '../state/state/services/confirmation.service';

@Component({
    selector: 'app-confirmation-modal-reset',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaModalComponent,
    ],
    templateUrl: './confirmation-modal-reset.component.html',
    styleUrls: ['./confirmation-modal-reset.component.scss'],
})
export class ConfirmationModalResetComponent {
    @Input() editData: ConfirmationReset;

    constructor(
        private confirmationService: ConfirmationService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    public onModalAction(data: ConfirmationReset) {
        this.confirmationService.sendConfirmationData(data);

        this.ngbActiveModal.close();
    }
}
