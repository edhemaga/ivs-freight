import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaModalComponent } from '../../../../shared/components/ta-modal/ta-modal.component';

// services
import { ConfirmationResetService } from './services/confirmation-reset.service';

// enums
import { ConfirmationResetStringEnum } from './enums/confirmation-reset-string.enum';

// models
import { ConfirmationReset } from './models/confirmation-reset.model';

@Component({
    selector: 'app-confirmation-reset',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaModalComponent,
    ],
    templateUrl: './confirmation-reset.component.html',
    styleUrls: ['./confirmation-reset.component.scss'],
})
export class ConfirmationModalResetComponent {
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
