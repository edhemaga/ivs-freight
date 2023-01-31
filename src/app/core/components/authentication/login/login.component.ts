import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthStoreService } from './../state/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AuthSecurityService } from '../state/auth-security.service';

import moment from 'moment';

import { Subject, takeUntil } from 'rxjs';
import { passwordValidation } from '../../shared/ta-input/ta-input.regex-validations';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public loginForm: UntypedFormGroup;

    public copyrightYear!: number;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private authStoreService: AuthStoreService,
        private notification: NotificationService,
        private inputService: TaInputService,
        private authSecurityService: AuthSecurityService
    ) {}

    ngOnInit() {
        this.createForm();

        this.copyrightYear = moment().year();

        this.resetSubject();
    }

    private createForm(): void {
        this.loginForm = this.formBuilder.group({
            email: [null, [Validators.required]],
            password: [null, [Validators.required, ...passwordValidation]],
            staySignedIn: [false],
        });

        this.inputService.customInputValidator(
            this.loginForm.get('email'),
            'email',
            this.destroy$
        );
    }

    public userLogin() {
        if (this.loginForm.invalid) {
            this.inputService.markInvalid(this.loginForm);
            return false;
        }

        this.authStoreService
            .accountLogin(this.loginForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.notification.success('Login is success', 'Success');
                },
                error: () => {
                    console.log('AGAIN ERROR ON AUTH SERVICE');
                    // this.notification.error(
                    //   'Something went wrong. Please try again.',
                    //   'Error:'
                    // );
                },
            });
    }

    public onKeyDown(event: any): void {
        if (event.keyCode === 13) {
            this.userLogin();
        }
    }

    public resetSubject(): void {
        this.authSecurityService.updateAccountActivatedSubject(false);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
