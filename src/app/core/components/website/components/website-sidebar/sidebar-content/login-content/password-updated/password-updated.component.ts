import { Component, OnInit } from '@angular/core';

import { WebsiteActionsService } from 'src/app/core/components/website/state/service/website-actions.service';

import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';

@Component({
    selector: 'app-password-updated',
    templateUrl: './password-updated.component.html',
    styleUrls: ['./password-updated.component.scss'],
})
export class PasswordUpdatedComponent implements OnInit {
    public userInfo: { name: string; email: string; imgSrc: string } = {
        name: 'Aleksandar Djordjevic',
        email: 'aleksandar@gmail.com',
        imgSrc: null,
    };

    constructor(private websiteActionsService: WebsiteActionsService) {}

    ngOnInit(): void {}

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) {
            this.websiteActionsService.setSidebarContentType(
                ConstantString.LOGIN
            );
        }
    }
}
