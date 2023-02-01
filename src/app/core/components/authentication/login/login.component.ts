import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';

import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { AuthStoreService } from './../state/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AuthSecurityService } from '../state/auth-security.service';

import moment from 'moment';

import { Subject, takeUntil } from 'rxjs';
import { passwordValidation } from '../../shared/ta-input/ta-input.regex-validations';
import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';

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
    public showHideIfMoreThenOneCompany: boolean = false;
    public userData: any;
    public lastLoginInCompany: number;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private authStoreService: AuthStoreService,
        private notification: NotificationService,
        private inputService: TaInputService,
        private authSecurityService: AuthSecurityService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.authStoreService.userHasMultipleCompaniesObservable.subscribe(
            (res) => {
                this.userData = res;
                this.lastLoginInCompany = this.calculateDiff(
                    convertDateFromBackend(res.companies.lastLogin)
                );
                this.cdRef.detectChanges();

                console.log(this.lastLoginInCompany);
                this.showHideIfMoreThenOneCompany = true;
            }
        );
        this.createForm();

        this.copyrightYear = moment().year();
        this.resetSubject();
    }
    goBackToLogin(event) {
        this.showHideIfMoreThenOneCompany = event;
    }
    public calculateDiff(dateSent) {
        let currentDate = new Date();
        dateSent = new Date(dateSent);

        return Math.floor(
            (Date.UTC(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate()
            ) -
                Date.UTC(
                    dateSent.getFullYear(),
                    dateSent.getMonth(),
                    dateSent.getDate()
                )) /
                (1000 * 60 * 60 * 24)
        );
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
