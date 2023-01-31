import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
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
export class SelectCompanyComponent
    implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
    customOptions: any;
    selectedCompanyID: any;
    saveCompany;
    dotsTrue: boolean;
    @Input() lastLoginInCompany: number = 1;
    @Input() userData: SignInResponse;
    // userData: SignInResponse;
    setWidth: number;
    @Output() goBackToLogin = new EventEmitter<boolean>();
    private destroy$ = new Subject<void>();
    slideConfig: any;
    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private router: Router,
        private accountStoreService: AuthStoreService,
        private formBuilder: UntypedFormBuilder
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }
    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem('user'));
        this.createForm();
        this.userData.companies.length < 5
            ? (this.dotsTrue = false)
            : (this.dotsTrue = true);

        if (this.saveCompany == true) {
            console.log(this.selectedCompanyID);
        }
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
    ngAfterViewInit() {
        const center: any = this.document.querySelectorAll('.slick-center');
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
    // slides = [
    //     {
    //         logo: null,
    //         companyName: 'test',
    //         id: 1,
    //         lastLoginInCompany: 1,
    //         isActive: true,
    //     },
    //     {
    //         logo: null,
    //         companyName: 'test123',
    //         id: 1,
    //         lastLoginInCompany: 1,
    //         isActive: false,
    //     },
    //     {
    //         logo: null,
    //         companyName: 'test235',
    //         id: 1,
    //         lastLoginInCompany: 1,
    //         isActive: false,
    //     },
    //     {
    //         logo: null,
    //         companyName: 'tessgdt',
    //         id: 1,
    //         lastLoginInCompany: 1,
    //         isActive: false,
    //     },
    //     {
    //         logo: null,
    //         companyName: 'tesrbnst',
    //         id: 1,
    //         lastLoginInCompany: 1,
    //         isActive: false,
    //     },
    //     {
    //         logo: null,
    //         companyName: 'tesnhrdnt',
    //         id: 1,
    //         lastLoginInCompany: 1,
    //         isActive: false,
    //     },
    // ];

    // slickInit(e) {
    //     console.log('slick initialized');
    // }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
