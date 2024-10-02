import { Component, Input, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';

// Services
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// Models
import { ConfirmationActivation } from '@shared/components/ta-shared-modals/confirmation-activation-modal/models/confirmation-activation.model';
import { ConfirmationActivationModalSvgRoutes } from './utils/confirmation-activation-modal-svg-routes';
import { AddressResponse } from 'appcoretruckassist';

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
        FormsModule,
        ReactiveFormsModule,
        // Components
        TaModalComponent,
        LoadStatusStringComponent,
        TaInputAddressDropdownComponent,
        // Pipes
        ConfirmationModalTitlePipe,
        FormatDatePipe,
    ],
    templateUrl: './confirmation-activation-modal.component.html',
    styleUrls: ['./confirmation-activation-modal.component.scss'],
})
export class ConfirmationActivationModalComponent implements OnInit {
    @Input() editData: ConfirmationActivation;
    public selectedAddress: AddressResponse;
    public locationForm!: UntypedFormGroup;

    public confirmationImageRoutes = ConfirmationActivationModalSvgRoutes;
    public isFormDirty: boolean = false;

    constructor(
        private ngbActiveModal: NgbActiveModal,
        private formBuilder: UntypedFormBuilder,

        // services
        private confirmationActivationService: ConfirmationActivationService
    ) {}
    ngOnInit(): void {
        if (
            this.editData.type === 'status' ||
            this.editData.data?.nameFront !== 'Unassigned'
        ) {
            this.locationFormBuild();
        }
    }

    public locationFormBuild(): void {
        this.locationForm = this.formBuilder.group({
            origin: [null, [Validators.required]],
        });
    }

    public handleLocationSelect(event): void {
        this.isFormDirty = event.valid;

        if (event?.address) this.selectedAddress = event;
    }

    public onModalAction(data: ConfirmationActivation): void {
        let confirmationData = { ...data };

        if (this.selectedAddress)
            confirmationData = { ...data, newLocation: this.selectedAddress };

        this.confirmationActivationService.setConfirmationActivationData(
            confirmationData
        );

        this.ngbActiveModal.close();
    }
}
