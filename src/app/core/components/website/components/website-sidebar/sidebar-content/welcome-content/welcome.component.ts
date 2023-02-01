import { Component, Input, OnInit } from '@angular/core';

import { WebsiteActionsService } from 'src/app/core/components/website/state/service/website-actions.service';

import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
    @Input() registerUserWelcome: boolean = false;

    public userInfo: { companyName: string; name: string; email: string } = {
        companyName: 'ivs freight inc.',
        name: 'Aleksandar Djordjevic',
        email: 'aleksandar@gmail.com',
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
