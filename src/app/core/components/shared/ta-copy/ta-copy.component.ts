import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HideAccountPipe } from 'src/app/core/pipes/driver-hide-account.pipe';
@Component({
    selector: 'app-ta-copy',
    templateUrl: './ta-copy.component.html',
    styleUrls: ['./ta-copy.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, AppTooltipComponent, NgbModule, AngularSvgIconModule, HideAccountPipe],
})
export class TaCopyComponent implements OnInit {
    @Input() copyValue: string;
    @Input() textFontSize: string = '14px';
    @Input() textColor: string = '#6c6c6c';
    @Input() textFontWeight: string = '400';
    @Input() hasEye: boolean = false;
    // @Input() marginCopyIcons: string = '6px';
    @Input() accountCompany: boolean;
    @Output() showHideEye = new EventEmitter<any>();
    public textCopied: boolean;
    public isVisible: boolean;
    constructor(private clipboar: Clipboard) {}

    ngOnInit(): void {}

    /* To copy any Text */
    public copyText(val: any) {
        this.textCopied = true;
        this.clipboar.copy(val);
    }

    /**Show hide eye function */
    public showHide(event: any) {
        this.showHideEye.emit(event);
    }
}
