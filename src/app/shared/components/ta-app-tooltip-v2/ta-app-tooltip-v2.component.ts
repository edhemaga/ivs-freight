import { CommonModule } from '@angular/common';
import {
    Component,
    Host,
    ViewChild,
    TemplateRef,
    AfterViewInit,
    Input,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'mainTooltip, [mainTooltip]',
    templateUrl: './ta-app-tooltip-v2.component.html',
    styleUrls: ['./ta-app-tooltip-v2.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TaAppTooltipV2Component implements AfterViewInit {
    @Input() mainTooltip: string = '';
    @Input() position: string = '';
    @Input() openTooltipDelay: number = 300;
    @Input() tooltipBackground: string = 'rgb(40, 82, 159)';
    @Input() tooltipColor: string = '#fff';
    @Input() tooltipTextAlign: string = 'left';
    @Input() tooltipMarginTop: string;
    @Input() tooltipMarginBottom: string;
    @Input() tooltipMarginLeft: string;
    
    @ViewChild(TemplateRef, { static: false }) template: TemplateRef<void>;

    ngAfterViewInit() {
        this.bindTemplete();
    }
    bindTemplete() {
        if (this.ngbTooltop) {
            this.ngbTooltop.tooltipClass = 'app-main-tooltip';
            this.ngbTooltop.placement = this.position;
            this.ngbTooltop.ngbTooltip = this.template;
            this.ngbTooltop.openDelay = this.openTooltipDelay;
        }
    }
    constructor(@Host() private ngbTooltop: NgbTooltip) {
        this.ngbTooltop.container = 'body';
    }
}
