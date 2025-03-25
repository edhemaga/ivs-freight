import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// constants
import { PasswordAccountHiddenCharactersSvgRoutes } from '@shared/components/ta-password-account-hidden-characters/utils/svg-routes/password-account-hidden-characters-svg-routes';

// enums
import { PasswordAccountHiddenCharactersStringEnum } from '@shared/components/ta-password-account-hidden-characters/enums/password-account-hidden-characters-string.enum';
import { eStringPlaceholder } from '@shared/enums';

@Component({
    selector: 'app-ta-password-account-hidden-characters',
    templateUrl: './ta-password-account-hidden-characters.component.html',
    styleUrls: ['./ta-password-account-hidden-characters.component.scss'],
    standalone: true,
    imports: [CommonModule, NgbModule, AngularSvgIconModule],
})
export class TaPasswordAccountHiddenCharactersComponent implements OnInit {
    @Input() passwordOrAccount: string;
    @Input() numberOfCharactersToHide: number = 4;
    @Input() isRightSideIcon: boolean = false;
    @Input() isEyeIconVisible: boolean = false;
    @Input() isDividerVisible: boolean = false;

    public isShowing: boolean = false;
    public isHovered: boolean = false;

    public hiddenPart: string;
    public visiblePart: string;

    public eStringPlaceholder = eStringPlaceholder;

    public passwordAccountHiddenCharactersSvgRoutes =
        PasswordAccountHiddenCharactersSvgRoutes;

    constructor() {}

    ngOnInit(): void {
        this.createHiddenCharacters();
    }

    public handleShowClick(): void {
        this.isShowing = !this.isShowing;
    }

    public handleHover(isHovering: boolean): void {
        if (this.isEyeIconVisible) return;
        this.isHovered = isHovering;
    }

    public createHiddenCharacters(): void {
        const length = this.passwordOrAccount?.length;

        const hiddenPart = this.passwordOrAccount
            ?.slice(0, length - this.numberOfCharactersToHide)
            .replace(/./g, PasswordAccountHiddenCharactersStringEnum.CIRCLE);

        const visiblePart = this.passwordOrAccount?.slice(
            -this.numberOfCharactersToHide
        );

        this.hiddenPart = hiddenPart;
        this.visiblePart = visiblePart;

        if (this.isEyeIconVisible) this.isHovered = true;
    }
}
