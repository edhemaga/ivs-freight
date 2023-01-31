/* eslint-disable no-unused-vars */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { WebsiteAuthStoreService } from './../../../../../state/service/website-auth-store.service';
import { WebsiteActionsService } from '../../../../../state/service/website-actions.service';

import {
    addressUnitValidation,
    addressValidation,
    einNumberRegex,
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    phoneFaxRegex,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';

import { AddressEntity, SignUpCompanyCommand } from 'appcoretruckassist';
import { ConstantString } from '../../../../../state/enum/const-string.enum';

@Component({
    selector: 'app-register-company',
    templateUrl: './register-company.component.html',
    styleUrls: ['./register-company.component.scss'],
})
export class RegisterCompanyComponent implements OnInit, OnDestroy {
    @ViewChild('inputAddress', { static: false }) public inputAddress: any;

    private destroy$ = new Subject<void>();

    public registerCompanyForm: FormGroup;

    public selectedAddress: AddressEntity = null;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private websiteAuthStoreService: WebsiteAuthStoreService,
        private websiteActionsService: WebsiteActionsService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.passwordsNotSame();
    }

    private createForm(): void {
        this.registerCompanyForm = this.formBuilder.group({
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            companyName: [null, Validators.required],
            ein: [null, [Validators.required, einNumberRegex]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            email: [null, [Validators.required]],
            password: [null, [Validators.required, ...passwordValidation]],
            confirmPassword: [
                null,
                [Validators.required, ...passwordValidation],
            ],
        });

        this.inputService.customInputValidator(
            this.registerCompanyForm.get(ConstantString.EMAIL),
            ConstantString.EMAIL,
            this.destroy$
        );
    }

    public handleAddressChange(event: {
        address: any;
        longLat: any;
        valid: boolean;
    }): void {
        this.selectedAddress = event.address;

        if (!event.valid) {
            this.registerCompanyForm
                .get(ConstantString.ADDRESS)
                .setErrors({ invalid: true });
        }
    }

    private passwordsNotSame(): void {
        this.registerCompanyForm
            .get(ConstantString.CONFIRM_PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value?.toLowerCase() ===
                    this.registerCompanyForm
                        .get(ConstantString.PASSWORD)
                        .value?.toLowerCase()
                ) {
                    this.registerCompanyForm
                        .get(ConstantString.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.registerCompanyForm
                        .get(ConstantString.CONFIRM_PASSWORD)
                        .setErrors({
                            invalid: true,
                        });
                }
            });
    }

    public onKeyDown(event: { keyCode: number }): void {
        if (event.keyCode === 13) {
            this.registerCompany();
        }
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) {
            this.registerCompany();
        }
    }

    private registerCompany(): void {
        if (
            this.inputAddress?.inputDropdown?.inputRef?.focusInput &&
            this.inputAddress?.addresList?.length
        ) {
            return;
        }

        if (this.registerCompanyForm.invalid) {
            this.inputService.markInvalid(this.registerCompanyForm);

            return;
        }

        const {
            address,
            addressUnit,
            confirmPassword,
            ...registerCompanyForm
        } = this.registerCompanyForm.value;

        this.selectedAddress.addressUnit = this.registerCompanyForm.get(
            ConstantString.ADDRESS_UNIT
        ).value;

        const saveData: SignUpCompanyCommand = {
            ...registerCompanyForm,
            address: this.selectedAddress,
        };

        this.websiteAuthStoreService
            .registerCompany(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.websiteActionsService.setSidebarContentType(
                        ConstantString.START_TRIAL_CONFIRMATION
                    );

                    localStorage.setItem(
                        ConstantString.CONFIRMATION_EMAIL,
                        JSON.stringify(
                            this.registerCompanyForm.get(ConstantString.EMAIL)
                                .value
                        )
                    );
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
