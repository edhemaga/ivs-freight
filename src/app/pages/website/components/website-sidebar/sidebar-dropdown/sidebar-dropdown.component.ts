import { Component, Input } from '@angular/core';

// Animations
import { trigger, transition, style, animate } from '@angular/animations';

// services
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

@Component({
    selector: 'app-sidebar-dropdown',
    templateUrl: './sidebar-dropdown.component.html',
    styleUrls: ['./sidebar-dropdown.component.scss'],
    animations: [
        trigger('fadeAnimation', [
          transition(':enter', [
            style({ opacity: 0 }),
            animate('500ms', style({ opacity: 1 }))
          ]),
          transition(':leave', [
            animate('500ms', style({ opacity: 0 }))
          ])
        ])
      ]
})
export class SidebarDropdownComponent {
    @Input() displayResendConfirmationBtn: boolean = true;
    @Input() displayResetPasswordBtn: boolean = true;

    public openHavingTroubleContent: boolean = false;

    constructor(private websiteActionsService: WebsiteActionsService) {}

    public onHavingTroubleClick(): void {
        this.openHavingTroubleContent = !this.openHavingTroubleContent;
    }

    public onGetBtnClickValue(
        event: { notDisabledClick: boolean },
        type?: string
    ): void {
        if (event.notDisabledClick) {
            if (type === WebsiteStringEnum.RESET_PASSWORD_BTN)
                this.websiteActionsService.setSidebarContentType(
                    WebsiteStringEnum.RESET_PASSWORD
                );

            if (type === WebsiteStringEnum.RESEND_CONFIRMATION_BTN)
                this.websiteActionsService.setSidebarContentType(
                    WebsiteStringEnum.RESEND_CONFIRMATION
                );
        }
    }
}
