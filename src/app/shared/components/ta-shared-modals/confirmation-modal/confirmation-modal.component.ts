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
import { PayrollDeductionService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-deduction-modal/services/payroll-deduction.service';
import { PayrollBonusService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-bonus-modal/services/payroll-bonus.service';
import { PayrollCreditService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-credit-bonus/services/payroll-credit.service';
import { FuelService } from '@shared/services/fuel.service';

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

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

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
        private formBuilder: UntypedFormBuilder,
        private payrollDeductionService: PayrollDeductionService,
        private payrolCreditService: PayrollCreditService,
        private payrollBonusService: PayrollBonusService,
        private fuelService: FuelService
    ) {}

    ngOnInit() {
        this.cdlForm = this.formBuilder.group({
            cdlId: [null],
        });
    }

    public onModalAction(data: Confirmation) {
        console.log(data);
        if (
            this.editData.extras &&
            data.type === TableStringEnum.DELETE &&
            data.subType !== TableStringEnum.FUEL_1
        ) {
            this.deletePayroll(data.extras.id, data.template);
            this.confirmationDataSubject.sendConfirmationData(data);
            return;
        } else if (this.editData.type === 'multiple delete') {
            this.confirmationDataSubject.sendConfirmationData({
                ...data,
                array: data?.array?.map((item) => item.id),
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

    private deletePayroll(id: number, template: string) {
        if (template === TableStringEnum.DEDUCTION) {
            this.payrollDeductionService
                .deletePayrollDeductionById(id)
                .subscribe((response) => this.ngbActiveModal.close());
        } else if (template === TableStringEnum.CREDIT) {
            this.payrolCreditService
                .deletePayrollCreditById(id)
                .subscribe((response) => this.ngbActiveModal.close());
        } else if (template === TableStringEnum.BONUS) {
            this.payrollBonusService
                .deletePayrollBonusById(id)
                .subscribe((response) => this.ngbActiveModal.close());
        } else if (template === TableStringEnum.FUEL_TRANSACTION) {
            this.fuelService
                .deleteFuelTransactionsList([id])
                .subscribe((response) => this.ngbActiveModal.close());
        }
    }

    public trackByIdentity = (index: number, _: any): number => index;
}
