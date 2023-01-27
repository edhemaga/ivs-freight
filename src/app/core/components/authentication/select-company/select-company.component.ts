import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Router } from '@angular/router';

import { AuthStoreService } from '../state/auth.service';
import { SelectCompanyResponse } from '../../../../../../appcoretruckassist/model/selectCompanyResponse';
import { SignInResponse } from '../../../../../../appcoretruckassist/model/signInResponse';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'app-select-company',
    templateUrl: './select-company.component.html',
    styleUrls: ['./select-company.component.scss'],
})
export class SelectCompanyComponent
    implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
    customOptions: any;
    selectedCompanyID: any;

    @Input() userData: SignInResponse;
    @Input() lastLoginInCompany: number = 0;
    // userData: SignInResponse;
    setWidth: number;
    test: number = 190;
    @Output() goBackToLogin = new EventEmitter<boolean>();
    private destroy$ = new Subject<void>();

    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private router: Router,
        private accountStoreService: AuthStoreService,
        private _sanitizer: DomSanitizer,
        private el: ElementRef
    ) {}
    ngOnChanges() {
        console.log(this.lastLoginInCompany);
    }
    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem('user'));

        // this.userData = {
        //     firstName: 'vladimir',
        //     companies: [
        //         {
        //             id: 1,
        //             companyName: 'Test',
        //             logo: null,
        //             isActive: true,
        //         },
        //         {
        //             id: 2,
        //             companyName: 'Test23s',
        //             logo: null,
        //             isActive: false,
        //         },
        //         {
        //             id: 3,
        //             companyName: 'agw',
        //             logo: null,
        //             isActive: false,
        //         },
        //         {
        //             id: 4,
        //             companyName: 'aerhrnaer',
        //             logo: null,
        //             isActive: false,
        //         },
        //         {
        //             id: 5,
        //             companyName: 'arhehr',
        //             logo: null,
        //             isActive: false,
        //         },
        //         // {
        //         //     id: 6,
        //         //     companyName: 'sdg',
        //         //     logo: null,
        //         //     isActive: false,
        //         // },
        //         // {
        //         //     id: 7,
        //         //     companyName: '13245',
        //         //     logo: null,
        //         //     isActive: false,
        //         // },
        //         // {
        //         //     id: 8,
        //         //     companyName: 'T1233s',
        //         //     logo: null,
        //         //     isActive: false,
        //         // },
        //     ],
        // };

        // @ts-ignore
        this.customOptions = {
            loop: false,
            autoplay: false,
            center: true,
            dots: true,
            startPosition: 1,
            autoWidth: false,
            items: this.userData.companies.length,
            // margin: 12,
            navText: ['', ''],
            // responsive: {
            //     // 0: {
            //     //     items:
            //     //         this.userData.companies.length < 5
            //     //             ? this.userData.companies.length
            //     //             : 5,
            //     // },
            // },
            nav: true,
        };
        setInterval(() => {
            const center: any = this.document.querySelectorAll('.center');
            this.selectedCompanyID = center[0]?.firstChild?.id;
        }, 400);
    }

    goToLogin() {
        this.goBackToLogin.emit(false);
        localStorage.removeItem('user');
        this.router.navigate(['/auth/login']);
    }
    ngAfterViewInit() {
        this.calculateWidth(this.userData.companies.length);
        const center: any = this.document.querySelectorAll('.center');
        this.selectedCompanyID = center[0]?.firstChild?.id;
    }
    calculateWidth(lenght) {
        const owlItems = document.querySelectorAll('.owl-item');
        Array.from(owlItems).forEach((item) => {
            (item as HTMLElement).style.width = '190px';
        });
        let calculateElementsWidth = lenght * 190 + 300 - 190;
        this.setWidth = calculateElementsWidth;
        console.log(this.el.nativeElement.querySelector(`.owl-stage`));
        (document.querySelector('.owl-stage') as HTMLElement).style.width =
            calculateElementsWidth.toString().concat('px');
        setTimeout(() => {}, 400);
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
