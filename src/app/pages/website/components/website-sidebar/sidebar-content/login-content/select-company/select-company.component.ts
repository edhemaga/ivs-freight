import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// moment
import moment from 'moment';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// services
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';

// models
import { SelectCompanyResponse, SignInResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-select-company',
    templateUrl: './select-company.component.html',
    styleUrls: ['./select-company.component.scss'],
})
export class SelectCompanyComponent
    implements OnInit, OnDestroy, AfterViewInit {
    private destroy$ = new Subject<void>();

    public saveCompany: UntypedFormGroup;
    public hasCarouselDots: boolean;
    public dates: string[] = [];
    public userData: SignInResponse;
    public newUser: SignInResponse;
    public selectedCompanyId: number | null = null;
    public selectedCompanyIndex: number | null = null;
    public lastActiveCompanyId: number | null = null;
    public lastLoginInCompany: number | null = null;

    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private router: Router,
        private websiteAuthService: WebsiteAuthService,
        private formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit() {
        this.setUserData(JSON.parse(localStorage.getItem('user')));

        this.createForm();
    }

    ngAfterViewInit(): void {
        this.setStartingScrollPosition();
        this.carouselArrowEvents();
    }

    public setUserData(data: SignInResponse): void {
        this.userData = data;

        const companiesData = this.userData.companies.map((company) => {
            this.lastLoginInCompany = this.calculateDiff(
                MethodsCalculationsHelper.convertTimeFromBackend(company.lastLogin)
            );
            this.dates.push(
                moment.utc(company.lastLogin).local().format('MM/DD/YY HH:mm:ss')
            );

            return {
                ...company,
                lastLogin: moment
                    .utc(company.lastLogin)
                    .local()
                    .format('MM/DD/YY HH:mm:ss'),
            }
        });

        this.newUser = {
            ...this.userData,
            companies: [...companiesData],
        };

        this.newUser.companies.forEach((item, index) => {
            if (item.lastLogin === this.getNewerDate(this.dates)) {
                this.lastActiveCompanyId = item.id;
                this.selectedCompanyId = item.id;
                this.selectedCompanyIndex = index;
            }
        });

        this.hasCarouselDots = this.newUser.companies.length > 5;
    }

    public getNewerDate(dates: string[]) {
        let newestDate = moment.utc(dates[0], 'MM/DD/YY HH:mm:ss');

        dates.forEach((date) => {
            const currentDate = moment.utc(date, 'MM/DD/YY HH:mm:ss');

            if (currentDate.isAfter(newestDate)) {
                newestDate = currentDate;
            }
        });

        return newestDate.format('MM/DD/YY HH:mm:ss');
    }

    //Calculate last login in company to display
    public calculateDiff(dateSent: Date) {
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
        this.saveCompany = this.formBuilder.group({
            savedCompany: true,
        });
    }

    public goToLogin(): void {
        this.websiteAuthService.accountLogout();
    }

    public onCompanySelect(): void {
        this.websiteAuthService
            .selectCompanyAccount({
                companyId: this.selectedCompanyId,
            })
            .pipe(
                takeUntil(this.destroy$),
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

                    if (!res.areSettingsUpdated) {
                        this.router.navigate(['/company/settings']);
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                })
            )
            .subscribe();
    }

    public carouselArrowEvents(): void {
        document
            .querySelector('#myCarousel .carousel-control-next')
            .addEventListener('click', () => {
                if (
                    this.selectedCompanyIndex <
                    this.newUser.companies.length - 1
                ) {
                    this.selectedCompanyIndex += 1;

                    this.scrollToCompanyIndex(this.selectedCompanyIndex);
                }
            });

        document
            .querySelector('#myCarousel .carousel-control-prev')
            .addEventListener('click', () => {
                if (this.selectedCompanyIndex > 0) {
                    this.selectedCompanyIndex -= 1;

                    this.scrollToCompanyIndex(this.selectedCompanyIndex);
                }
            });
    }

    public setStartingScrollPosition(): void {
        const lastCompanyIndex = this.newUser.companies.findIndex(
            (company) => this.lastActiveCompanyId === company.id
        );
        this.scrollToCompanyIndex(lastCompanyIndex);
    }

    public scrollToCompanyIndex(selectedIndex: number): void {
        const carouselItemWidth = (document.querySelector('.carousel-item') as HTMLElement).offsetWidth + 12; // Carousel item width + margin width
        const scrollPosition = carouselItemWidth * selectedIndex;

        document.querySelectorAll('.carousel-item').forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('active');
                this.selectedCompanyId = parseInt(item.id);
                this.selectedCompanyIndex = index;
            } else item.classList.remove('active');
        });

        document.querySelector('#myCarousel .carousel-inner').scroll({
            left: scrollPosition,
            behavior: 'smooth',
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
