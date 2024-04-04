import {
    firstNameValidation,
    lastNameValidation,
    phoneFaxRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { ApplicantService } from 'src/app/shared/services/applicant.service';
import { FormService } from '../../../../shared/services/form.service';
import { ApplicantAdminResponse } from '../../../../../../appcoretruckassist';
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';

@Component({
    selector: 'app-applicant-modal',
    templateUrl: './applicant-modal.component.html',
    styleUrls: ['./applicant-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Component
        TaModalComponent,
        TaInputComponent,
        TaInputNoteComponent,
    ],
})
export class ApplicantModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public applicantForm: UntypedFormGroup;

    private addNewApplicant: boolean = false;
    public applicantFullName: string = null;

    public isFormDirty: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private applicantService: ApplicantService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();

        if (this.editData?.type === 'edit') {
            this.editApplicant(this.editData.id);
        }
    }

    private createForm() {
        this.applicantForm = this.formBuilder.group({
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            email: [null, Validators.required],
            note: [null],
        });

        this.inputService.customInputValidator(
            this.applicantForm.get('email'),
            'email',
            this.destroy$
        );

        this.formService.checkFormChange(this.applicantForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'resend email': {
                this.resendApplicationEmail(this.editData.id);
                this.modalService.setModalSpinner({
                    action: 'resend email',
                    status: true,
                    close: false,
                });
                break;
            }
            case 'save and add new': {
                if (this.applicantForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.applicantForm);
                    return;
                }
                this.addNewApplicant = true;
                this.addApplicant();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                break;
            }
            case 'save': {
                if (this.applicantForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.applicantForm);
                    return;
                }

                if (this.editData?.type === 'edit') {
                    this.updateApplicant(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addApplicant();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    private resendApplicationEmail(id: number) {
        this.applicantService
            .resendApplicantInviteAdmin({ id })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private updateApplicant(id: number) {
        this.applicantService
            .updateApplicantAdmin({
                ...this.applicantForm.value,
                id,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private addApplicant() {
        this.applicantService
            .addApplicantAdmin(this.applicantForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.addNewApplicant) {
                        this.addNewApplicant = false;
                        this.formService.resetForm(this.applicantForm);

                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
                        });
                    }
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private editApplicant(id: number) {
        this.applicantService
            .getApplicantByIdAdmin(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: ApplicantAdminResponse) => {
                    this.applicantForm.patchValue({
                        firstName: res.firstName,
                        lastName: res.lastName,
                        phone: res.phone,
                        email: res.email,
                        note: res.note,
                    });
                    this.applicantFullName = res.firstName.concat(
                        ' ',
                        res.lastName
                    );
                },
                error: () => {},
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
