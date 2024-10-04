import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

// rxjs
import { Observable, Subject, takeUntil } from 'rxjs';

// services
import { AuthFacadeService } from '@pages/website/state/services/auth.service';
import { TaInputService } from '@shared/services/ta-input.service';

// validations
import { passwordValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public displaySpinner$: Observable<boolean>;

    public loginForm: UntypedFormGroup;

    constructor(
        // form
        private formBuilder: UntypedFormBuilder,

        // services
        private inputService: TaInputService,
        private authFacadeService: AuthFacadeService
    ) {}

    ngOnInit(): void {
        this.subscribeToStoreSelectors();
        this.createForm();
    }

    private subscribeToStoreSelectors(): void {
        this.authFacadeService.loginError$
            .pipe(takeUntil(this.destroy$))
            .subscribe((error) => {
                if (!error) return;
                this.loginForm.get(error.type).setErrors(error.error);
            });

        this.displaySpinner$ = this.authFacadeService.showSpinner$;
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

        this.authFacadeService.logIn(this.loginForm.value);
    }

    public toggleLoggedIn(): void {
        const stayLoggedIn = this.loginForm.get(WebsiteStringEnum.STAY_LOGGED_IN);
        stayLoggedIn.patchValue(!stayLoggedIn.value);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
