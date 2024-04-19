import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

// rxjs
import { Observable, Subject, takeUntil } from 'rxjs';

// services
import { TaInputService } from '@shared/services/ta-input.service';

// validations
import { passwordValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

// store
import { Store, select } from '@ngrx/store';

// actions
import { authLogin } from '@pages/website/state/actions/login/auth.actions';

// selectors
import {
    selectAuthLoginError,
    selectAuthLoginLoading,
} from '@pages/website/state/auth.selector';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    displaySpinner$: Observable<boolean>;

    public loginForm: UntypedFormGroup;

    constructor(
        // form
        private formBuilder: UntypedFormBuilder,

        // services
        private inputService: TaInputService,
        // store
        private store: Store
    ) {}

    ngOnInit(): void {
        this.subscribeToStoreSelectors();
        this.createForm();
    }

    private subscribeToStoreSelectors(): void {
        this.store
            .select(selectAuthLoginError)
            .pipe(takeUntil(this.destroy$))
            .subscribe((error) => {
                if (!error) return;
                this.loginForm.get(error.type).setErrors(error.error);
            });

        this.displaySpinner$ = this.store.pipe(select(selectAuthLoginLoading));
    }

    private createForm(): void {
        this.loginForm = this.formBuilder.group({
            email: [null, [Validators.required]],
            password: [null, [Validators.required, ...passwordValidation]],
            stayLoggedIn: [false],
        });

        this.inputService.customInputValidator(
            this.loginForm.get(WebsiteStringEnum.EMAIL_ADDRESS),
            WebsiteStringEnum.EMAIL_ADDRESS,
            this.destroy$
        );
    }

    public onKeyDown(event: { keyCode: number }): void {
        if (event.keyCode === 13) this.userLogin();
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) this.userLogin();
    }

    private userLogin(): void {
        if (this.loginForm.invalid) {
            this.inputService.markInvalid(this.loginForm);

            return;
        }

        this.store.dispatch(authLogin(this.loginForm.value));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
