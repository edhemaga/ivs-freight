import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

// Enums
import { eSharedString } from '@shared/enums';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { SvgIconComponent } from 'angular-svg-icon';

// Shared routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Constants
import { UnitConstants } from '@shared/components/ca-unit-info-box/constants';
import { CaProfileImageComponent } from 'ca-components';

// Pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

@Component({
    selector: 'app-ca-unit-info-box',
    standalone: true,
    imports: [
        CommonModule,
        NgbModule,

        // Components
        TaAppTooltipV2Component,
        SvgIconComponent,
        CaProfileImageComponent,

        // Pipes
        NameInitialsPipe,
    ],
    templateUrl: './ca-unit-info-box.component.html',
    styleUrls: ['./ca-unit-info-box.component.scss'],
})
export class CaUnitInfoBoxComponent {
    @Input() id!: string;
    @Input() label!: string;
    @Input() isUnitAssigned!: boolean;
    @Input()
    set type(value: eSharedString) {
        this._type = value;
        this.updateIconPathAndText();
    }

    @Input() iconPath: string;
    @Input() isSvgIcon: boolean;
    @Input() isImage: boolean;
    @Input() imagePath: boolean;

    public noItemText: string;
    public sharedIcons = SharedSvgRoutes;

    private _type: eSharedString;
    private unitConfig = UnitConstants.configuration;

    constructor(private router: Router) {}

    public handleViewDetailsClick(type: eSharedString, id: number): void {
        if (type === eSharedString.TRUCK) {
            this.router.navigate([`/list/truck/${id}/details`]);
        } else if (type === eSharedString.TRAILER) {
            this.router.navigate([`/list/trailer/${id}/details`]);
        } else {
            this.router.navigate([`/list/driver/${id}/details`]);
        }
    }

    private updateIconPathAndText(): void {
        const config = this.unitConfig[this.type.toLowerCase()];
        if (config) {
            this.iconPath = config.iconPathPrefix + this.iconPath;
            this.noItemText = config.noItemText;
        }
    }
}
