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
import { Subject, tap } from 'rxjs';
import { Router } from '@angular/router';

import { AuthStoreService } from '../state/auth.service';
import { SelectCompanyResponse } from '../../../../../../appcoretruckassist/model/selectCompanyResponse';
import { SignInResponse } from '../../../../../../appcoretruckassist/model/signInResponse';
import { UntypedFormBuilder } from '@angular/forms';
@Component({
    selector: 'app-select-company',
    templateUrl: './select-company.component.html',
    styleUrls: ['./select-company.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SelectCompanyComponent implements OnInit, OnDestroy {
    public saveCompany;
    public dotsTrue: boolean;
    private destroy$ = new Subject<void>();
    public slideConfig: any;
    @Input() userData: SignInResponse;
    @Input() lastLoginInCompany: number;
    @Output() goBackToLogin = new EventEmitter<boolean>();
    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private router: Router,
        private accountStoreService: AuthStoreService,
        private formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem('user'));
        this.createForm();
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
    goToLogin() {
        this.goBackToLogin.emit(false);
        localStorage.removeItem('user');
        this.router.navigate(['/auth/login']);
    }

    onCompanySelect() {
        const center: any = this.document.querySelectorAll('.slick-center');
        let id = center[0]?.firstChild?.id;
        this.accountStoreService
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
