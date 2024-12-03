import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaAppTooltipComponent } from '@shared/components/ta-app-tooltip/ta-app-tooltip.component';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// pipes
import { DriverHideAccountPipe } from '@shared/components/ta-copy/pipes/driver-hide-account.pipe';
import { HidePasswordPipe } from '@shared/pipes/hide-password.pipe';
import { HighlightSearchPipe } from '@shared/pipes';

@Component({
    selector: 'app-ta-copy',
    templateUrl: './ta-copy.component.html',
    styleUrls: ['./ta-copy.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaAppTooltipComponent,
        NgbModule,
        AngularSvgIconModule,
        DriverHideAccountPipe,

        // pipes
        HidePasswordPipe,
        HighlightSearchPipe,
    ],
})
export class TaCopyComponent {
    @Input() copyValue: string;
    @Input() textFontSize: string = '14px';
    @Input() textColor: string = '#6c6c6c';
    @Input() textFontWeight: string = '400';
    @Input() hasEye: boolean = false;
    @Input() leftSideIcon: boolean = false;
    // @Input() marginCopyIcons: string = '6px';
    @Input() arrayText: boolean = false;
    @Input() boldText: boolean = false;
    @Input() accountCompany: boolean;
    @Input() maxWidth: string;
    @Input() type: string;
    @Input() public searchValue?: string;

    @Output() showHideEye = new EventEmitter<any>();

    public textCopied: boolean;
    public isVisible: boolean;

    constructor(private clipboar: Clipboard) {}

    /* To copy any Text */
    public copyText(event: Event, val: string) {
        event.stopPropagation();
        event.preventDefault();

        this.textCopied = true;
        if (this.arrayText) {
            val = this.copyValue[0] + this.copyValue[1];
        }
        this.clipboar.copy(val);
    }

    /**Show hide eye function */
    public showHide(event: any) {
        this.showHideEye.emit(event);
    }
}
