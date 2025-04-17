import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {
    AbstractControl,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Components
import {
    CaInputAddressDropdownComponent,
    CaLoadStatusComponent,
    CaModalComponent,
} from 'ca-components';

// Mixings
import { AddressMixin } from '@shared/mixins';

// Services
import { AddressService } from '@shared/services/address.service';

// Enums
import { LoadStatusEnum } from '@shared/enums';

// Models
import { AddressEntity, AddressResponse } from 'appcoretruckassist';
import { IModalData } from 'ca-components';

// Pipes
import { LoadStatusBackgroundColorPipe } from 'ca-components';

// Config
import { ChangeStatusModalConfig } from '@shared/components/ta-shared-modals/ca-change-status-modal/utils/change-status-modal.config';

@Component({
    selector: 'app-ca-change-status-modal',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        ReactiveFormsModule,

        // Components
        CaModalComponent,
        CaInputAddressDropdownComponent,
        CaLoadStatusComponent,

        // Pipes
        LoadStatusBackgroundColorPipe,
    ],
    templateUrl: './ca-change-status-modal.component.html',
    styleUrl: './ca-change-status-modal.component.scss',
})
export class CaChangeStatusModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit
{
    @Input() modalData!: IModalData;
    @Input() template!: TemplateRef<null>;

    public locationForm!: UntypedFormGroup;
    public selectedAddress: AddressResponse;
    public isFormValid!: boolean;

    public sharedSvgRoutes = SharedSvgRoutes;
    public changeStatusModalConfig = ChangeStatusModalConfig;

    constructor(
        // Modal
        private ngbActiveModal: NgbActiveModal,

        // Form
        private formBuilder: UntypedFormBuilder,

        // Services
        public addressService: AddressService
    ) {
        super();
    }

    public get locationFormControl(): AbstractControl {
        return this.locationForm.get('location');
    }

    public get isStatusUnassigned(): boolean {
        return (
            this.modalData.status?.statusValue?.id === LoadStatusEnum.Unassigned
        );
    }

    ngOnInit(): void {
        if (!this.isStatusUnassigned) this.initLocationForm();
    }

    public initLocationForm(): void {
        this.locationForm = this.formBuilder.group({
            location: [null, [Validators.required]],
        });
    }

    public onModalAction(isDoAction?: boolean): void {
        if (this.isStatusUnassigned) this.ngbActiveModal.close(isDoAction);
        else if (isDoAction) this.ngbActiveModal.close(this.selectedAddress);
        else this.ngbActiveModal.close(isDoAction);
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        this.isFormValid = event.valid;

        if (event.valid) this.selectedAddress = event;
    }
}
