import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// bootstrap
import { Offcanvas } from 'bootstrap';

// services
import { WebsiteActionsService } from '../../services/website-actions.service';

// animations
import { websiteFadeInAnimation } from '../../animations/website-fade-in.animation';

// enums
import { WebsiteStringEnum } from '../../enums/website-string.enum';

@Component({
    selector: 'app-website-sidebar',
    templateUrl: './website-sidebar.component.html',
    styleUrls: ['./website-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [websiteFadeInAnimation()],
})
export class WebsiteSidebarComponent implements OnInit, OnDestroy {
    @ViewChild('hideSidebarBtn') hideSidebarBtn: ElementRef<HTMLElement>;

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

        this.showOrHideSidebar();
    }

    private getSidebarContentType(): void {
        this.websiteActionsService.getSidebarContentType$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.selectedContentType = res;

                    const WIDTH_ONE_ARR: string[] = [
                        WebsiteStringEnum.START_TRIAL_CONFIRMATION,
                        WebsiteStringEnum.START_TRIAL_WELCOME,
                        WebsiteStringEnum.LOGIN,
                        WebsiteStringEnum.RESET_PASSWORD_REQUESTED,
                        WebsiteStringEnum.PASSWORD_UPDATED,
                        WebsiteStringEnum.REGISTER_USER_CONFIRMATION,
                        WebsiteStringEnum.REGISTER_USER_WELCOME,
                    ];

                    const WIDTH_TWO_ARR: string[] = [
                        WebsiteStringEnum.RESET_PASSWORD,
                        WebsiteStringEnum.CREATE_NEW_PASSWORD,
                        WebsiteStringEnum.RESEND_CONFIRMATION,
                    ];

                    const WIDTH_THREE_ARR: string[] = [
                        WebsiteStringEnum.START_TRIAL,
                        WebsiteStringEnum.REGISTER_USER,
                    ];

                    if (WIDTH_ONE_ARR.includes(this.selectedContentType))
                        this.selectedContentWidth = 480;

                    if (WIDTH_TWO_ARR.includes(this.selectedContentType))
                        this.selectedContentWidth = 580;

                    if (WIDTH_THREE_ARR.includes(this.selectedContentType))
                        this.selectedContentWidth = 680;

                    if (this.selectedContentType)
                        this.websiteActionsService.setSidebarContentWidth(
                            this.selectedContentWidth - 200
                        );
                }
            });
    }

    private listenForSidebarHideEvent(): void {
        this.renderer2.listen('document', 'hidden.bs.offcanvas', (_) => {
            this.selectedContentType = null;

            this.websiteActionsService.setSidebarContentType(
                this.selectedContentType
            );
        });
    }

    private showOrHideSidebar(): void {
        this.websiteActionsService.getOpenSidebarSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    new Offcanvas(WebsiteStringEnum.SIDEBAR).toggle();

                    this.websiteActionsService.setOpenSidebarSubject(false);
                } else {
                    if (this.hideSidebarBtn) {
                        const hideSidebarBtn: HTMLElement =
                            this.hideSidebarBtn.nativeElement;

                        hideSidebarBtn.click();
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
