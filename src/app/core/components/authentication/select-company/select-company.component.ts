import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Router } from '@angular/router';

import { AuthStoreService } from '../state/auth.service';
import { SelectCompanyResponse } from '../../../../../../appcoretruckassist/model/selectCompanyResponse';
import { SignInResponse } from '../../../../../../appcoretruckassist/model/signInResponse';
@Component({
    selector: 'app-select-company',
    templateUrl: './select-company.component.html',
    styleUrls: ['./select-company.component.scss'],
})
export class SelectCompanyComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    customOptions: any;
    selectedCompanyID: any;

    width: 2;
    @Input() userData: SignInResponse;
    @Input() lastLoginInCompany: any;

    @Output() goBackToLogin = new EventEmitter<boolean>();
    private destroy$ = new Subject<void>();

    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private router: Router,
        private accountStoreService: AuthStoreService
    ) {}

    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem('user'));

        // @ts-ignore
        this.customOptions = {
            loop: false,
            autoplay: false,
            center: true,
            dots: true,
            startPosition: 0,
            autoWidth: false,
            items: 5,
            margin: 12,
            navText: ['', ''],
            responsive: {
                // 0: {
                //     items:
                //         this.userData.companies.lenght < 5
                //             ? this.userData.companies.lenght
                //             : 5,
                // },
                0: {
                    items: 1,
                },
                150: {
                    items: 2,
                },
            },
            nav: true,
        };
        setInterval(() => {
            const center: any = this.document.querySelectorAll('.center');
            this.selectedCompanyID = center[0]?.firstChild?.id;
        }, 400);
    }
    goToLogin() {
        this.goBackToLogin.emit(false);
        this.router.navigate(['/auth/login']);
    }
    ngAfterViewInit() {
        const center: any = this.document.querySelectorAll('.center');
        this.selectedCompanyID = center[0]?.firstChild?.id;
    }

    onCompanySelect() {
        this.accountStoreService
            .selectCompanyAccount({
                companyId: parseInt(this.selectedCompanyID),
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
