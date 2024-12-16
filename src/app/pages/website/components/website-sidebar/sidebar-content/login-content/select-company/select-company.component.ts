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
import { UntypedFormBuilder } from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// moment
import moment from 'moment';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// services
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';

// models
import { SelectCompanyResponse, SignInResponse } from 'appcoretruckassist';
import { Carousel } from 'bootstrap';

@Component({
    selector: 'app-select-company',
    templateUrl: './select-company.component.html',
    styleUrls: ['./select-company.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SelectCompanyComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    private destroy$ = new Subject<void>();

    public saveCompany: any;
    public dotsTrue: boolean;
    public slideConfig: any;
    public userData: SignInResponse;
    public lastLoginInCompany: any;
    public dates: any = [];
    public newUser: any;
    public id: any;
    public startingScrollPosition: number = 0;
    public selectedCompanyId: number = 0;
    public selectedCompanyIndex: number = 0;

    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private router: Router,
        private websiteAuthService: WebsiteAuthService,
        private formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit() {
        this.user(JSON.parse(localStorage.getItem('user')));

        this.createForm();

        this.userData.companies.length < 5
            ? (this.dotsTrue = false)
            : (this.dotsTrue = true);
    }

    ngAfterViewInit(): void {
        // this.setStartingScrollPosition();
        // setTimeout(() => this.carouselSlide(), 1000);
    }

    public user(data): void {
        this.userData = data;

        data.companies.forEach((res) => {
            this.lastLoginInCompany = this.calculateDiff(
                MethodsCalculationsHelper.convertTimeFromBackend(res.lastLogin)
            );
            this.dates.push(
                moment.utc(res.lastLogin).local().format('MM/DD/YY HH:mm:ss')
            );
        });

        let createNewObject = {
            ...this.userData,
            companies: this.userData.companies.map((item) => {
                return {
                    ...item,
                    lastLogin: moment
                        .utc(item.lastLogin)
                        .local()
                        .format('MM/DD/YY HH:mm:ss'),
                };
            }),
        };

        this.newUser = {
            ...createNewObject,
            companies: createNewObject.companies.map((item) => {
                return {
                    ...item,
                    LastActiveCompany:
                        item.lastLogin == this.getNewerDate(this.dates)
                            ? (this.id = item.id)
                            : null,
                };
            }),
        };

        console.log('newUser', this.newUser);

        //Slick Carousel Config
        this.slideConfig = {
            infinite: false,
            slidesToScroll: 1,
            dots: this.dotsTrue,
            arrows: true,
            variableWidth: true,
            focusOnSelect: true,
            centerMode: true,
            initialSlide: this.newUser.companies.findIndex(
                (x) => x.id === this.id
            ),
        };
    }

    public getNewerDate(dates: string[]) {
        let newestDate = moment.utc(dates[0], 'MM/DD/YY HH:mm:ss');

        for (let i = 1; i < dates.length; i++) {
            const currentDate = moment.utc(dates[i], 'MM/DD/YY HH:mm:ss');

            if (currentDate.isAfter(newestDate)) {
                newestDate = currentDate;
            }
        }

        return newestDate.format('MM/DD/YY HH:mm:ss');
    }

    //Calculate last login in company to display
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
        this.saveCompany = this.formBuilder.group({
            savedCompany: true,
        });
    }

    public goToLogin(): void {
        this.websiteAuthService.accountLogout();
    }

    public onCompanySelect(id): void {
        // const selectedCompany = this.document.querySelector('.active');
        // let id = selectedCompany?.id;

        this.websiteAuthService
            .selectCompanyAccount({
                companyId: parseInt(id),
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

    public carouselSlide(): void {
        let multipleCardCarousel = document.querySelector(
            '#carouselExampleControls'
        );

        let carousel = new Carousel(multipleCardCarousel, {
            interval: false, // Disable automatic sliding
            wrap: false, // Prevent wrapping at the end
        });

        let carouselWidth =
            document.querySelector('.carousel-inner').scrollWidth;
        let cardWidth = (
            document.querySelector('.carousel-item') as HTMLElement
        ).offsetWidth;
        let scrollPosition = this.startingScrollPosition;

        console.log('carouselWidth', carouselWidth);
        console.log('cardWidth', cardWidth);

        document
            .querySelector('#carouselExampleControls .carousel-control-next')
            .addEventListener('click', function () {
                console.log('next click', scrollPosition);
                if (scrollPosition < carouselWidth - cardWidth * 4) {
                    scrollPosition += cardWidth;

                    const selectedIndex = Math.floor(
                        scrollPosition / cardWidth
                    );

                    document
                        .querySelectorAll('.carousel-item')
                        .forEach((item, index) => {
                            if (index === selectedIndex) {
                                item.classList.add('active');
                                this.selectedCompanyId = item.id;
                            } else item.classList.remove('active');
                        });

                    console.log(
                        'selectedElement',
                        document.querySelectorAll('.carousel-item')[
                            selectedIndex
                        ]
                    );
                    console.log('selectedCompanyId', this.selectedCompanyId);

                    document
                        .querySelector(
                            '#carouselExampleControls .carousel-inner'
                        )
                        .scroll({
                            left: scrollPosition,
                            behavior: 'smooth',
                        });
                }
            });

        document
            .querySelector('#carouselExampleControls .carousel-control-prev')
            .addEventListener('click', function () {
                console.log('previous click', scrollPosition);
                if (scrollPosition >= cardWidth) {
                    scrollPosition -= cardWidth;

                    const selectedIndex = Math.floor(
                        scrollPosition / cardWidth
                    );

                    document
                        .querySelectorAll('.carousel-item')
                        .forEach((item, index) => {
                            if (index === selectedIndex) {
                                item.classList.add('active');
                                this.selectedCompanyId = item.id;
                            } else item.classList.remove('active');
                        });

                    console.log(
                        'selectedElement',
                        document.querySelectorAll('.carousel-item')[
                            selectedIndex
                        ]
                    );
                    console.log('selectedCompanyId', this.selectedCompanyId);

                    document
                        .querySelector(
                            '#carouselExampleControls .carousel-inner'
                        )
                        .scroll({
                            left: scrollPosition,
                            behavior: 'smooth',
                        });
                }
            });
    }

    public setStartingScrollPosition(): void {
        let cardWidth = (
            document.querySelector('.carousel-item') as HTMLElement
        ).offsetWidth;
        let scrollPosition = 0;

        this.newUser.companies.forEach((company, index) => {
            if (company.LastActiveCompany) {
                scrollPosition = cardWidth * index + 1;
                this.selectedCompanyId = company.id;
                this.selectedCompanyIndex = index;
            }
        });

        this.startingScrollPosition = scrollPosition;

        document
            .querySelector('#carouselExampleControls .carousel-inner')
            .scroll({
                left: scrollPosition,
                behavior: 'smooth',
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
