import { DOCUMENT, formatDate } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
//import {SelectCompany} from '../../model/select-company';
import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';
import { SelectCompanyResponse } from 'appcoretruckassist';
import { AuthStoreService } from '../state/auth.service';
import { SignInResponse } from '../../../../../../appcoretruckassist/model/signInResponse';
@Component({
    selector: 'app-select-company',
    templateUrl: './select-company.component.html',
    styleUrls: ['./select-company.component.scss'],
})
export class SelectCompanyComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    //apiData: SelectCompany[];
    customOptions: any;
    selectedCompanyID: any;
    apiData: any;
    width: 2;
    @Input() userData: any;
    @Input() lastLoginInCompany: any;

    @Output() goBackToLogin = new EventEmitter<boolean>();
    private destroy$ = new Subject<void>();

    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private router: Router,
        private accountStoreService: AuthStoreService
    ) {}

    ngOnInit(): void {
        this.apiData = [
            {
                companyId: 1,
                companyName: 'test',
                companyLogo: null,
            },
            {
                companyId: 2,
                companyName: 'test123',
                companyLogo: null,
            },
            {
                companyId: 3,
                companyName: 'test234',
                companyLogo: null,
            },
            {
                companyId: 4,
                companyName: '32434',
                companyLogo: null,
            },
            {
                companyId: 5,
                companyName: '4545',
                companyLogo: null,
            },
            {
                companyId: 6,
                companyName: 'te5656st234',
                companyLogo: null,
            },
        ];

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
                0: {
                    items:
                        this.userData.companies.lenght < 5
                            ? this.userData.companies.lenght
                            : 5,
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
        // let test = this.userData.companies;
        // test.map((res) => {
        //     if ((res.id = this.selectedCompanyID)) {
        //         res.isActive = true;
        //         console.log(res);
        //     } else {
        //         res.isActive = false;
        //     }
        // });
        // console.log();
        // localStorage.setItem('user', JSON.stringify(this.userData));
        // window.location.reload();
        // this.accountStoreService
        //     .selectCompanyAccount({
        //         companyId: parseInt(this.selectedCompanyID),
        //     })
        //     .subscribe({
        //         next: (res: SelectCompanyResponse) => {
        //             console.log(res);
        //             let user: SignInResponse = JSON.parse(
        //                 localStorage.getItem('user')
        //             );
        // user = {
        //     ...user,
        //     avatar: res.avatar,
        //     companyName: res.companyName,
        //     companyUserId: res.companyUserId,
        //     driverId: res.driverId,
        //     firstName: res.firstName,
        //     lastName: res.lastName,
        //     token: res.token,
        //     refreshToken: res.refreshToken,
        //     userId: res.userId,
        //     companies: user.companies.map((item) => {
        //         return {
        //             ...item,
        //             isActive: item.companyName === res.companyName,
        //         };
        //     }),
        // };
        //             localStorage.setItem('user', JSON.stringify(user));
        //             window.location.reload();
        //         },
        //         error: () => {},
        //     });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
