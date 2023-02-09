import {
    Component,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewEncapsulation,
} from '@angular/core';

import { Offcanvas } from 'bootstrap';

import { Subject, takeUntil } from 'rxjs';

import { WebsiteActionsService } from '../../state/service/website-actions.service';

import { ConstantString } from '../../state/enum/const-string.enum';

import { fadeInAnimation } from '../../state/utils/animation';

@Component({
    selector: 'app-website-sidebar',
    templateUrl: './website-sidebar.component.html',
    styleUrls: ['./website-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [fadeInAnimation()],
})
export class WebsiteSidebarComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedContentType: string = null;
    public selectedContentWidth: number = null;

    constructor(
        private websiteActionsService: WebsiteActionsService,
        private renderer2: Renderer2
    ) {}

    ngOnInit(): void {
        this.getSidebarContentType();

        this.listenForSidebarHideEvent();

        this.showSidebar();
    }

    private getSidebarContentType(): void {
        this.websiteActionsService.getSidebarContentType$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.selectedContentType = res;

                    if (
                        this.selectedContentType ===
                            ConstantString.START_TRIAL_CONFIRMATION ||
                        this.selectedContentType ===
                            ConstantString.START_TRIAL_WELCOME ||
                        this.selectedContentType === ConstantString.LOGIN ||
                        this.selectedContentType ===
                            ConstantString.RESET_PASSWORD_REQUESTED ||
                        this.selectedContentType ===
                            ConstantString.PASSWORD_UPDATED ||
                        this.selectedContentType ===
                            ConstantString.REGISTER_USER_CONFIRMATION ||
                        this.selectedContentType ===
                            ConstantString.REGISTER_USER_WELCOME
                    ) {
                        this.selectedContentWidth = 480;
                    }

                    if (
                        this.selectedContentType ===
                            ConstantString.RESET_PASSWORD ||
                        this.selectedContentType ===
                            ConstantString.CREATE_NEW_PASSWORD ||
                        this.selectedContentType ===
                            ConstantString.RESEND_CONFIRMATION
                    ) {
                        this.selectedContentWidth = 580;
                    }

                    if (
                        this.selectedContentType ===
                            ConstantString.START_TRIAL ||
                        this.selectedContentType ===
                            ConstantString.REGISTER_USER
                    ) {
                        this.selectedContentWidth = 680;
                    }

                    if (this.selectedContentType) {
                        this.websiteActionsService.setSidebarContentWidth(
                            this.selectedContentWidth - 200
                        );
                    }
                }
            });
    }

    private listenForSidebarHideEvent(): void {
        this.renderer2.listen('document', 'hidden.bs.offcanvas', (event) => {
            console.log('event', event);
            /*   if (this.selectedContentType === ConstantString.LOGIN) {
                this.websiteActionsService.setSidebarContentType(
                    ConstantString.START_TRIAL
                );
            }

            if (this.selectedContentType === ConstantString.START_TRIAL) {
                this.websiteActionsService.setSidebarContentType(
                    ConstantString.LOGIN
                );
            } */

            /*    this.websiteActionsService.getIsClickedSubject$
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    console.log('REEES', res);
                    if (res) {
                       if (res.isClicked) {
                        if (res.type === 'login')
                       }

                        new Offcanvas(ConstantString.SIDEBAR).toggle();
                    }
                }); */

            /*             new Offcanvas(ConstantString.SIDEBAR).toggle(); */
            /*   this.selectedContentType = null;

            this.websiteActionsService.setSidebarContentType(
                this.selectedContentType
            ); */
        });
    }

    private showSidebar(): void {
        this.websiteActionsService.getOpenSidebarSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    new Offcanvas(ConstantString.SIDEBAR).toggle();

                    this.websiteActionsService.setOpenSidebarSubject(false);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
