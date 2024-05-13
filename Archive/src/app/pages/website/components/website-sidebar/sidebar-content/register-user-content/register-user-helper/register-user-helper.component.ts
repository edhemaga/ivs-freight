import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// services
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

// models
import { UserInfoModel } from '@pages/website/models/user-info.model';

@Component({
    selector: 'app-register-user-helper',
    templateUrl: './register-user-helper.component.html',
    styleUrls: ['./register-user-helper.component.scss'],
})
export class RegisterUserHelperComponent implements OnInit {
    private registerUserInfo: UserInfoModel = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private websiteActionsService: WebsiteActionsService,
        private websiteAuthService: WebsiteAuthService
    ) {}

    ngOnInit(): void {
        this.checkIsValidInit();
    }

    private checkIsValidInit(): void {
        let isValid: boolean;

        this.route.queryParams.subscribe((params) => {
            if (!params[WebsiteStringEnum.FIRST_NAME]) {
                this.router.navigate([WebsiteStringEnum.WEBSITE]);

                isValid = false;

                return;
            }

            this.registerUserInfo = {
                firstName: params[WebsiteStringEnum.FIRST_NAME],
                lastName: params[WebsiteStringEnum.LAST_NAME],
                email: params[WebsiteStringEnum.EMAIL],
                department: params[WebsiteStringEnum.DEPARTMENT],
                companyName: params[WebsiteStringEnum.COMPANY_NAME],
                code: params[WebsiteStringEnum.CODE].split(' ').join('+'),
            };

            isValid = true;
        });

        if (isValid) {
            this.websiteActionsService.setRegisterUserInfoSubject(
                this.registerUserInfo
            );

            this.websiteActionsService.setOpenSidebarSubject(true);

            this.websiteActionsService.setSidebarContentType(
                WebsiteStringEnum.REGISTER_USER
            );

            this.websiteActionsService.setIsEmailRouteSubject(true);

            this.websiteAuthService.accountLogout(true);
        }
    }
}
