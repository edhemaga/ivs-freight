import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// services
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

@Component({
    selector: 'app-register-user-have-account-helper',
    templateUrl: './register-user-have-account-helper.component.html',
    styleUrls: ['./register-user-have-account-helper.component.scss'],
})
export class RegisterUserHaveAccountHelperComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private websiteActionsService: WebsiteActionsService
    ) {}

    ngOnInit(): void {
        this.checkIsValidInit();
    }

    private checkIsValidInit(): void {
        let isValid: boolean;

        this.route.queryParams.subscribe((params) => {
            if (!params[WebsiteStringEnum.EMAIL]) {
                this.router.navigate([WebsiteStringEnum.WEBSITE]);

                isValid = false;

                return;
            }

            isValid = true;
        });

        if (isValid) {
            const userAlreadyLoggedIn = localStorage.getItem(
                WebsiteStringEnum.USER
            );

            if (userAlreadyLoggedIn) {
                this.router.navigate([
                    WebsiteStringEnum.WEBSITE_SELECT_COMPANY,
                ]);
            } else {
                this.router.navigate([WebsiteStringEnum.WEBSITE]);

                this.websiteActionsService.setOpenSidebarSubject(true);

                this.websiteActionsService.setSidebarContentType(
                    WebsiteStringEnum.LOGIN
                );

                this.websiteActionsService.setIsEmailRouteSubject(true);
            }
        }
    }
}
