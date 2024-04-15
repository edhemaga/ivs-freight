import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// utils
import { WebsiteConstants } from '@pages/website/utils/constants/website.constants';

// services
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

// models
import { NavigationModel } from '@pages/website/models/navigation.model';

@Component({
    selector: 'app-website-navbar',
    templateUrl: './website-navbar.component.html',
    styleUrls: ['./website-navbar.component.scss'],
})
export class WebsiteNavbarComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public navbarMenuItems: NavigationModel[] =
        WebsiteConstants.NAVBAR_MENU_ITEMS;

    public isSidebarOpen: boolean = true;
    public isEmailRoute: boolean = false;

    public sidebarContentWidth: number = null;

    constructor(
        private router: Router,
        private websiteActionsService: WebsiteActionsService
    ) {}

    ngOnInit(): void {
        this.checkIsSidebarOpen();

        this.getSidebarContentWidth();

        this.checkIsEmailRoute();
    }

    public trackByIdentity = (index: number, _: any): number => index;

    private checkIsEmailRoute(): void {
        this.websiteActionsService.getIsEmailRouteSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
                this.isEmailRoute = res;

                if (res) {
                    this.isSidebarOpen = true;
                } else {
                    this.isSidebarOpen = false;
                }
            });
    }

    public handleNavbarBtnClick(navPosition: string, type: string): void {
        if (navPosition === WebsiteStringEnum.LEFT) {
            this.router.navigate([type]);
        } else {
            if (this.isSidebarOpen) {
                this.isSidebarOpen = false;
            } else {
                const selectedType = type.toLowerCase();

                this.isSidebarOpen = true;

                this.websiteActionsService.setSidebarContentType(selectedType);
            }
        }
    }

    private checkIsSidebarOpen(): void {
        this.websiteActionsService.getSidebarContentType$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: string) => {
                if (!res) this.isSidebarOpen = false;
            });
    }

    private getSidebarContentWidth(): void {
        this.websiteActionsService.getSidebarContentWidth$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: number) => {
                this.sidebarContentWidth = res;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
