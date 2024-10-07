import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
import { TaUploadFileComponent } from '@shared/components/ta-upload-files/components/ta-upload-file/ta-upload-file.component';

// services
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';

// bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { ConfirmationModalTextPipe } from '@shared/components/ta-shared-modals/confirmation-modal/pipes/confirmation-modal-text.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

// routes
import { ConfirmationModalSvgRoutes } from '@shared/components/ta-shared-modals/confirmation-modal/utils/confirmation-modal-svg-routes';

// models
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';

// pdf-viewer
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
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
        TaUploadFileComponent,

        // pipes
        FormatDatePipe,
        ConfirmationModalTextPipe,
        ThousandSeparatorPipe,

        // pdf viewer
        PdfViewerModule,
    ],
})
export class ConfirmationModalComponent implements OnInit {
    @Input() editData: Confirmation;

    public cdlForm: UntypedFormGroup;
    public selectedCdl: any;
    public confirmationImageRoutes = ConfirmationModalSvgRoutes;

    constructor(
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
