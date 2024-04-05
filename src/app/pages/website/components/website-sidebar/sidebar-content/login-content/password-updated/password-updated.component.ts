import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// services
import { WebsiteActionsService } from 'src/app/pages/website/services/website-actions.service';
import { ImageBase64Service } from 'src/app/shared/services/image-base64.service';

// enums
import { WebsiteStringEnum } from 'src/app/pages/website/enums/website-string.enum';

// models
import { UserInfoModel } from '../../../../../models/user-info.model';

@Component({
    selector: 'app-password-updated',
    templateUrl: './password-updated.component.html',
    styleUrls: ['./password-updated.component.scss'],
})
export class PasswordUpdatedComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public userInfo: UserInfoModel = null;
    public userAvatar: any = null;

    constructor(
        private websiteActionsService: WebsiteActionsService,
        private imageBase64Service: ImageBase64Service
    ) {}

    ngOnInit(): void {
        this.getUserInfo();
    }

    private getUserInfo(): void {
        this.websiteActionsService.getCreatePasswordSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: UserInfoModel) => {
                this.userInfo = {
                    firstName: res.firstName,
                    lastName: res.lastName,
                    email: res.email,
                };
            });

        this.websiteActionsService.getAvatarImageSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: string) => {
                if (res) {
                    this.userAvatar = this.imageBase64Service.sanitizer(res);
                }
            });
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick)
            this.websiteActionsService.setSidebarContentType(
                WebsiteStringEnum.LOGIN
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
