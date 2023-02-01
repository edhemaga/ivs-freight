import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';

import { WebsiteActionsService } from 'src/app/core/components/website/state/service/website-actions.service';

@Component({
    selector: 'app-register-user-helper',
    templateUrl: './register-user-helper.component.html',
    styleUrls: ['./register-user-helper.component.scss'],
})
export class RegisterUserHelperComponent implements OnInit {
    private registerUserInfo /* : SignUpUserInfo */ = null;

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
            if (!params[ConstantString.FIRST_NAME]) {
                this.router.navigate([ConstantString.WEBSITE]);

                isValid = false;

                return;
            }

            this.registerUserInfo = {
                firstName: params[ConstantString.FIRST_NAME],
                lastName: params[ConstantString.LAST_NAME],
                email: params[ConstantString.EMAIL],
                code: params[ConstantString.CODE].split(' ').join('+'),
            };

            isValid = true;
        });

        if (isValid) {
            this.router.navigate([ConstantString.WEBSITE]);

            this.websiteActionsService.setRegisterUserInfoSubject(
                this.registerUserInfo
            );

            this.websiteActionsService.setOpenSidebarSubject(true);

            this.websiteActionsService.setSidebarContentType(
                ConstantString.REGISTER_USER
            );
        }
    }
}
