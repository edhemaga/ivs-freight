import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { NAVBAR_MENU_ITEMS } from '../../state/utils/static';

import { WebsiteActionsService } from '../../state/service/website-actions.service';

import { NavigationModel } from '../../state/model/navigation.model';

@Component({
    selector: 'app-website-navbar',
    templateUrl: './website-navbar.component.html',
    styleUrls: ['./website-navbar.component.scss'],
})
export class WebsiteNavbarComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public navbarMenuItems: NavigationModel[] = null;

    public isSidebarOpen: boolean = true;

    public sidebarContentWidth: number = null;

    public isEmailRoute: boolean = false;

    constructor(private websiteActionsService: WebsiteActionsService) {}

    ngOnInit(): void {
        this.navbarMenuItems = NAVBAR_MENU_ITEMS;

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

    public handleNavbarBtnClick(type: string): void {
        if (this.isSidebarOpen) {
            this.isSidebarOpen = false;
        } else {
            const selectedType = type.toLowerCase();

            this.isSidebarOpen = true;

            this.websiteActionsService.setSidebarContentType(selectedType);
        }
    }

    private checkIsSidebarOpen(): void {
        this.websiteActionsService.getSidebarContentType$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: string) => {
                if (!res) {
                    this.isSidebarOpen = false;
                }
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
