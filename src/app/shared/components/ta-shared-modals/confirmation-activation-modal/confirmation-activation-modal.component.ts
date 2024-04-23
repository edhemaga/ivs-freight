import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';

// services
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// enums
import { ConfirmationResetStringEnum } from '@shared/components/ta-shared-modals/confirmation-reset-modal/enums/confirmation-reset-string.enum';

// models
import { ConfirmationReset } from '@shared/components/ta-shared-modals/confirmation-reset-modal/models/confirmation-reset.model';

@Component({
    selector: 'app-confirmation-activation-modal',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaModalComponent,
    ],
    templateUrl: './confirmation-activation-modal.component.html',
    styleUrls: ['./confirmation-activation-modal.component.scss'],
})
export class ConfirmationActivationModalComponent {
    @Input() editData: ConfirmationReset;

    constructor(
        private confirmationResetService: ConfirmationResetService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    public onModalAction(data: ConfirmationReset) {
        if (data.type === ConfirmationResetStringEnum.RESET)
            this.confirmationResetService.setConfirmationResetData(true);

        this.ngbActiveModal.close();
    }
}
