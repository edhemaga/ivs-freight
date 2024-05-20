import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';

// services
import { ImageBase64Service } from '@shared/services/image-base64.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';

// bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// models
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';
import { ConfirmationModalSvgRoutes } from './utils/confirmation-modal-svg-routes';

@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // components
        TaModalComponent,
        TaInputDropdownComponent,
        TaProfileImagesComponent,

        // pipes
        FormatDatePipe,
    ],
})
export class ConfirmationModalComponent implements OnInit {
    @Input() editData: Confirmation;
    public cdlForm: UntypedFormGroup;
    selectedCdl: any;
    public confirmationImageRoutes = ConfirmationModalSvgRoutes;
    constructor(
        public imageBase64Service: ImageBase64Service,
        private ngbActiveModal: NgbActiveModal,
        private confirmationDataSubject: ConfirmationService,
        private formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit() {
        this.cdlForm = this.formBuilder.group({
            cdlId: [null],
        });
    }

    public onModalAction(data: any) {
        // Multiple Delete
        if (this.editData.type === 'multiple delete') {
            this.confirmationDataSubject.sendConfirmationData({
                ...data,
                array: data.array.map((item) => item.id),
            });
        } else {
            if (!this.selectedCdl) {
                this.confirmationDataSubject.sendConfirmationData(data);
            } else {
                data['data']['newCdlID'] = this.selectedCdl.id;
                this.confirmationDataSubject.sendConfirmationData(data);
            }
        }

        this.ngbActiveModal.close();
    }

    public onSelectDropdown(event: any, action: string) {
        if (action === 'cdl') {
            this.selectedCdl = event;
        }
    }

    public formatDate(mod) {
        return MethodsCalculationsHelper.convertDateFromBackend(mod);
    }

    public trackByIdentity = (index: number, _: any): number => index;
}
