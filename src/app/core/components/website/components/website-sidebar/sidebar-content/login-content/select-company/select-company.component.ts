import { DOCUMENT } from '@angular/common';

import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';

import { Subject, tap } from 'rxjs';

import { WebsiteAuthService } from 'src/app/core/components/website/state/service/website-auth.service';

import { SelectCompanyResponse, SignInResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-select-company',
    templateUrl: './select-company.component.html',
    styleUrls: ['./select-company.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SelectCompanyComponent implements OnInit, OnDestroy {
    @Input() userData: SignInResponse;
    @Input() lastLoginInCompany: number;
    
    @Output() goBackToLogin = new EventEmitter<boolean>();

    private destroy$ = new Subject<void>();

    public saveCompany;
    public dotsTrue: boolean;
    public slideConfig: any;

    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private websiteAuthService: WebsiteAuthService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.userData = JSON.parse(localStorage.getItem('user'));

        this.userData.companies.length < 5
            ? (this.dotsTrue = false)
            : (this.dotsTrue = true);

        this.slideConfig = {
            centerMode: true,
            infinite: false,
            slidesToScroll: 1,
            dots: this.dotsTrue,
            arrows: true,
            variableWidth: true,
        };
    }

    private createForm(): void {
        this.saveCompany = this.formBuilder.group({
            savedCompany: true,
        });
    }

    public goToLogin(): void {
        this.goBackToLogin.emit(false);

        localStorage.removeItem('user');

        this.router.navigate(['/auth/login']);
    }

    public onCompanySelect(): void {
        const center: any = this.document.querySelectorAll('.slick-center');

        let id = center[0]?.firstChild?.id;

        this.websiteAuthService
            .selectCompanyAccount({
                companyId: parseInt(id),
            })
            .pipe(
                tap((res: SelectCompanyResponse) => {
                    this.userData = {
                        ...res,
                        companies: this.userData.companies.map((item) => {
                            return {
                                ...item,
                                isActive: item.companyName === res.companyName,
                            };
                        }),
                    };

                    localStorage.removeItem('user');
                    localStorage.setItem('user', JSON.stringify(this.userData));

                    this.router.navigate(['/dashboard']);
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
