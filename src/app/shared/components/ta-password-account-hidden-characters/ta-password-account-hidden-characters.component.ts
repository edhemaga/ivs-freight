import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// enums
import { PasswordAccountHiddenCharactersStringEnum } from '@shared/components/ta-password-account-hidden-characters/enums/password-account-hidden-characters-string.enum';
import { eStringPlaceholder } from '@shared/enums';

// constants
import { PasswordAccountHiddenCharactersSvgRoutes } from '@shared/components/ta-password-account-hidden-characters/utils/svg-routes/password-account-hidden-characters-svg-routes';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-ta-password-account-hidden-characters',
    templateUrl: './ta-password-account-hidden-characters.component.html',
    styleUrls: ['./ta-password-account-hidden-characters.component.scss'],
    standalone: true,
    imports: [CommonModule, NgbModule, AngularSvgIconModule],
})
export class TaPasswordAccountHiddenCharactersComponent implements OnInit {
    @Input() isDividerVisible: boolean = false;
    @Input() isEyeIconVisible: boolean = false;
    @Input() isPassword: boolean = false;
    @Input() isRightSideIcon: boolean = false;
    @Input() numberOfCharactersToHide: number = 4;
    @Input() passwordOrAccount: string;

    public eStringPlaceholder = eStringPlaceholder;
    public hiddenPart: string;
    public isHovered: boolean = false;
    public isShowing: boolean = false;
    public passwordAccountHiddenCharactersSvgRoutes =
        PasswordAccountHiddenCharactersSvgRoutes;
    public visiblePart: string;

    constructor() {}

    ngOnInit(): void {
        this.createHiddenCharacters();
    }

    public createHiddenCharacters(): void {
        const length = this.passwordOrAccount?.length;

        if (this.isPassword) {
            this.hiddenPart =
                PasswordAccountHiddenCharactersStringEnum.CIRCLE.repeat(length);
            this.visiblePart = '';
        } else {
            const hiddenPart = this.passwordOrAccount
                ?.slice(0, length - this.numberOfCharactersToHide)
                .replace(
                    /./g,
                    PasswordAccountHiddenCharactersStringEnum.CIRCLE
                );

            const visiblePart = this.passwordOrAccount?.slice(
                -this.numberOfCharactersToHide
            );

            this.hiddenPart = hiddenPart;
            this.visiblePart = visiblePart;
        }

        if (this.isEyeIconVisible) this.isHovered = true;
    }

    public handleHover(isHovering: boolean): void {
        if (this.isEyeIconVisible) return;
        this.isHovered = isHovering;
    }

    public handleShowClick(): void {
        this.isShowing = !this.isShowing;
    }
}
