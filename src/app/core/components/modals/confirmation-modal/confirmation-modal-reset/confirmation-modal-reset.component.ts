import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';

// services
import { ConfirmationResetService } from '../state/state/services/confirmation-reset.service';

// enums
import { ConstantStringEnum } from '../state/enums/confirmation-modal.enum';

// models
import { ConfirmationReset } from '../state/models/confirmation-reset.model';

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
        private confirmationResetService: ConfirmationResetService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    public onModalAction(data: ConfirmationReset) {
        if (data.type === ConstantStringEnum.RESET)
            this.confirmationResetService.setConfirmationResetData(true);

        this.ngbActiveModal.close();
    }
}
