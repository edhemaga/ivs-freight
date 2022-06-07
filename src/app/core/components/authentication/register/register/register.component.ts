import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/* import { AuthService } from '../../../../services/auth/auth.service'; */
import { AuthStoreService } from '../../state/auth.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { SpinnerService } from '../../../../services/spinner/spinner.service';
import { NotificationService } from '../../../../services/notification/notification.service';

import moment from 'moment';

import { AddressEntity } from 'appcoretruckassist';

import {
    einNumberRegex,
    emailRegex,
    phoneRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
    @ViewChild('addressInput') addressInput!: ElementRef;

    public registerForm!: FormGroup;

    public hidePassword = true;
    public regPass: any;
    public passwordStrength: any;

    copyrightYear!: number;

    public selectedAddress: AddressEntity = null;

    constructor(
        private formBuilder: FormBuilder,
        private shared: SharedService,
        private router: Router,
        private spinner: SpinnerService,
        private notification: NotificationService,
        /*         private authService: AuthService */
        private authStoreService: AuthStoreService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.passwordsNotSame();

        setTimeout(() => {
            this.transformInputData();
        });

        this.copyrightYear = moment().year();
    }

    private createForm() {
        this.registerForm = this.formBuilder.group(
            {
                firstName: [null, Validators.required],
                lastName: [null, Validators.required],
                companyName: [null, Validators.required],
                taxNumber: [null, [Validators.required, einNumberRegex]],
                address: [null, Validators.required],
                addressUnit: [null, Validators.maxLength(6)],
                phone: [null, [Validators.required, phoneRegex]],
                email: [null, [Validators.required, emailRegex]],
                password: [null, Validators.required],
                confirmPassword: [null, Validators.required],
            },
            { validators: this.checkPasswords }
        );
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case 'ADDRESS':
                if (event.valid) {
                    this.selectedAddress = event.address;
                }

                break;

            default:
                break;
        }
    }

    public passwordsNotSame() {
        this.registerForm
            .get('confirmPassword')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe(value => {
                if (
                    value?.toLowerCase() ===
                    this.registerForm.get('password').value?.toLowerCase()
                ) {
                    this.registerForm.get('confirmPassword').setErrors(null);
                } else {
                    this.registerForm.get('confirmPassword').setErrors({
                        invalid: true,
                    });
                }
            });
    }

    public registerUser() {
        /*  if (!this.shared.markInvalid(this.registerForm)) {
            return false;
        }
        if (!this.isValidAddress) {
            this.notification.warning('Address needs to be valid.', 'Warning:');
            this.addressInput.nativeElement.focus();
        } */

        const userData = this.registerForm.getRawValue();

        const addressUnit = this.registerForm.get('addressUnit').value;
        this.selectedAddress.addressUnit = addressUnit;

        console.log(addressUnit);

        const saveData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            companyName: userData.companyName,
            taxNumber: userData.taxNumber,
            address: this.selectedAddress,
            phone: userData.phone,
            email: userData.email,
            password: userData.password,
        };

        this.authStoreService
            .signUpCompany(saveData)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: res => {
                    this.notification.success(
                        'Registration is successful',
                        'Success'
                    );

                    localStorage.setItem('token', res.token);

                    setTimeout(() => {
                        this.router.navigate(['/register/thanks']);
                    }, 1000);
                },
                error: err => {
                    this.notification.success(err, 'Error');
                },
            });

        // const saveData = {
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //     email: user.email,
        //     password: user.password,
        //     phone: user.phone,
        //     taxNumber: user.taxNumber,
        //     addressUnit: user.addressUnit,
        //     companyName: user.companyName,
        //     doc: {
        //         additional: {
        //             mcNumber: null,
        //             usDotNumber: null,
        //             phone: null,
        //             payPeriod: null,
        //             endingIn: null,
        //             email: '',
        //             /*    address: this.address, */
        //             addressUnit: user.addressUnit,
        //             irpNumber: null,
        //             iftaNumber: null,
        //             scacNumber: null,
        //             ipassEzpass: null,
        //             fax: null,
        //             timeZone: null,
        //             webUrl: '',
        //             currency: null,
        //             note: '',
        //             accountNumber: null,
        //             routingNumber: null,
        //             bankData: null,
        //             phoneDispatch: null,
        //             emailDispatch: '',
        //             phoneAccounting: null,
        //             emailAccounting: null,
        //             phoneSafety: null,
        //             emailSafety: '',
        //         },
        //         offices: [],
        //         factoringCompany: [],
        //     },
        // };
        /* 
        this.authService.registerUser(saveData).subscribe(
            (res: any) => {
                if (res) {
                    this.notification.success(
                        'Registration is successful',
                        'Success:'
                    );
                    localStorage.setItem('thankYouEmail', saveData.email);
                    setTimeout(() => {
                        this.router.navigate(['/register/thanks']);
                    }, 1000);
                }
            },
            (error: any) => {
                error ? this.shared.handleServerError() : null;
            }
        ); */
    }

    public randomPassword(length: number = 18) {
        const chars =
            '+_)(*&^%$#@!=-0987654321}{POIUYTREWQ|":LKIJUHGFDSA?><MNBVCXZ][poiuytrewq\';lkjhgfdsa/.,mnbvcxz';
        this.regPass = '';
        for (let x = 0; x < length; x++) {
            const i = Math.floor(Math.random() * chars.length);
            this.regPass += chars.charAt(i);
        }
        this.hidePassword = false;
        this.passwordStrength = 'excellent';
        return this.regPass;
    }

    public onStrengthChanged(strength: number) {
        switch (strength) {
            case 20:
                this.passwordStrength = 'very weak';
                break;
            case 40:
                this.passwordStrength = 'weak';
                break;
            case 60:
                this.passwordStrength = 'good';
                break;
            case 80:
                this.passwordStrength = 'secure';
                break;
            case 100:
                this.passwordStrength = 'excellent';
                break;
        }
    }

    public keyDownFunction(event: any) {
        if (
            event.keyCode === 13 &&
            event.target.localName !== 'textarea' &&
            event.path !== undefined &&
            event.path !== null &&
            event.path[3].className !== 'ng-select-container ng-has-value'
        ) {
            this.registerUser();
        }
    }

    checkPasswords(registerForm: FormGroup) {
        // here we have the 'passwords' group
        const password = registerForm.get('password')!.value;
        const confirmPassword = registerForm.get('confirmPassword')!.value;
        return password === confirmPassword ? false : { notSame: true };
    }

    returnRegisterValue() {
        console.log('not same', this.registerForm.errors);
        // this.sameLength();
        return this.registerForm.errors;
    }

    sameLength() {
        console.log(
            this.registerForm.get('password')!.value.length ===
                this.registerForm.get('confirmPassword')!.value.length
        );
        return (
            this.registerForm.get('password')!.value.length ===
            this.registerForm.get('confirmPassword')!.value.length
        );
    }

    private transformInputData() {
        const data = {
            companyName: 'upper',
            firstName: 'capitalize',
            lastName: 'capitalize',
            email: 'lower',
            addressUnit: 'upper',
        };

        this.shared.handleInputValues(this.registerForm, data);
    }

    ngOnDestroy(): void {}
}
